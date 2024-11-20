<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import SelectionTabBar from "~/components/copytrade/components/SelectionTabBar.vue";
import {PageSize} from "~/utils/common";
import Loading from "~/components/base/Loading.vue";
import Pagination from "~/components/base/Pagination.vue";
import EmptyData from "~/components/base/EmptyData.vue";
import TradeDirection from "~/components/base/TradeDirection.vue";
import {OrderDetail} from "~/models/OrderDetail";
import TokenAddress from "~/components/base/TokenAddress.vue";
import {OrderDirection as OrderDirection, TradeErrorCode} from "~/utils/constant"
import {formatAmountValue, nativeToken, pageableList, tradeErrorTipValue} from "~/utils/util";
import {tradeStatusIcon} from "~/utils/resource";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";
import {Order} from "~/models/Order";
import {OrderDetailInfo} from "~/models/OrderDetailInfo";

interface TradeDetailProps {
  type: "copytrade" | "snipertrade"
}

const {$api} = useNuxtApp();
const {t} = useI18n({useScope: 'global'});
const store = useAppStore();
const props = defineProps<TradeDetailProps>();
const searchTerm = ref('');
const selectedTime = ref('7');
const selectedStatus = ref('1');
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const orderList: OrderDetail[] = [];
const dataList = ref<OrderDetail>([]);
const taskStatusList: { label: string, value: string }[] = [
  {label: 'State003', value: "1", i18n: true},
  {label: 'State004', value: "2", i18n: true},
  {label: 'State005', value: "all", i18n: true}
];
const timeList: { label: string, value: string, i18n?: boolean }[] = [
  {label: '7D', value: '7'},
  {label: '30D', value: '30'},
  {label: '90D', value: '90'},
  {label: 'State005', value: 'all', i18n: true}
];
const parseOrderList = (result: Result) => {
  let data = result.data;
  if (data != null) {
    let orders = data.orders;
    if (Array.isArray(orders)) {
      let array = orders as Array<any>;
      let trades = array.map((item, index) => {
        let trade = new OrderDetail();
        trade.valueOf(item);
        return trade;
      });
      orderList.length = 0;
      orderList.push(...trades);
      reloadData(1, PageSize);
    }
  }
}

const demo = () => {}
const loadOrders = () => {
  loading.value = true;
  let ts = selectedTime.value;
  if (ts != "all") {
    ts = ts + "day"
  }
  setTimeout(() => {
    $api.userOrderDetailList(ts, selectedStatus.value).then(r => {
      if (r.code == 0) {
        parseOrderList(r);
      }
    }).catch((e) => {
    }).finally(() => {
      loading.value = false;
    })
  }, 500)
}
const loadSnipList = () => {
  loading.value = true;
  setTimeout(() => {
    let ts = selectedTime.value;
    if (ts != "all") {
      ts = ts + "day"
    }
    $api.userSnipOrderDetailList(ts, selectedStatus.value).then(r => {
      if (r.code == 0) {
        parseOrderList(r);
      }
    }).catch((e) => {
    }).finally(() => {
      loading.value = false;
    })
  }, 500)
}
const reloadData = (page: number, pageSize: number) => {
  let items: any[];
  let term = '';
  if (store.chainId == 'soalna') {
    term = searchTerm.value.trim();
  } else {
    term = searchTerm.value.trim().toLowerCase();
  }
  if (term.length > 0) {
    items = orderList.filter((item, index) => {
      return item.trackWallet.includes(term) || item.name.includes(term);
    });
  } else {
    items = orderList;
  }
  total.value = items.length;
  dataList.value = pageableList(items, page, pageSize);
}
const tableRowClass = (order: OrderDetail) => {
  return order.direction == OrderDirection.Buy ? {
    'table-row': true,
    'hover-effect': true,
    'buy': true
  } : {
    'table-row': true,
    'hover-effect': true,
    'sell': true
  };
}
const scrollerStyle = () => {
  return {
    pointerEvents: loading.value || total.value == 0 ? 'none' : 'auto',
    width: "100%"
  }
}
const orderSymbolInfo = (order: OrderDetail, type: "smartmoney" | "user", side: "left" | "right") => {
  let symbol0 = order.smartMoney.symbol0;
  let symbol1 = order.smartMoney.symbol1;

  let userSymbol0 = order.user.symbol0;
  let userSymbol1 = order.user.symbol1;
  let value = "";
  if (side == "left") {
    if (type == "smartmoney") {
      value = symbol0;
    } else {
      value = userSymbol0;
    }
  } else {
    if (type == "smartmoney") {
      value = symbol1;
    } else {
      value = userSymbol1;
    }
  }
  return value;
}
const orderAmountInfo = (order: OrderDetail, type: "smartmoney" | "user", side: "left" | "right") => {
  let flag: string;
  let amount0 = order.smartMoney.amount0;
  let amount1 = order.smartMoney.amount1;

  let userAmount0 = order.user.amount0;
  let userAmount1 = order.user.amount1;
  let value: string;
  if (side == "left") {
    if (type == "smartmoney") {
      value = amount0;
    } else {
      value = userAmount0;
    }
  } else {
    if (type == "smartmoney") {
      value = amount1;
    } else {
      value = userAmount1;
    }
  }

  if (order.direction == OrderDirection.Buy) {
    if (side == "left") {
      flag = "+";
    } else {
      flag = "-";
    }
  } else {
    if (side == "left") {
      flag = "-";
    } else {
      flag = "+";
    }
  }
  let newValue = formatAmountValue(value);
  return flag + newValue;

}

const tradeErrorMessage = (chainId: string, param1: string, param2: string, statusMessage: string) => {
  let values: any = {
    param1: tradeErrorTipValue(statusMessage, param1),
    param2: tradeErrorTipValue(statusMessage, param2),
    token: nativeToken(chainId)
  }
  let messageKey = tradeError(statusMessage)
  if (messageKey.length == 0) {
    return "";
  }
  return t(messageKey, values);
}

const tradeErrorTipMessage = (chainId: string, param1: string, param2: string, statusMessage: string) => {
  let values: any = {
    param1: tradeErrorTipValue(statusMessage, param1),
    param2: tradeErrorTipValue(statusMessage, param2),
    token: nativeToken(chainId)
  }
  let messageKey = tradeErrorTip(statusMessage)
  if (messageKey === "") {
    return "";
  }
  return t(messageKey, values);
}

const tradeErrorColor = (status: string) => status == TradeErrorCode.TxSendSuccess ? "green" : "red";

const tableHeaderStyle = () => {
  return loading.value || total.value == 0 ? {borderBottom: 'none', gap: 0} : {gap: 0};
}
const onSelectedTimeChange = (value: string) => {
  selectedTime.value = value;
}
const onSelectedTaskStatusChange = (value: string) => {
  selectedStatus.value = value;
}
const onTextChange = (text: string) => {
  searchTerm.value = text;
}
const onPageChange = (p: number, ps: number) => {
  reloadData(p, ps);
}
const onBack = () => {
  window.location.href = '/';
}
const orderTooltipMessage = (order) => tradeErrorTipMessage(store.chainId, order.param1, order.param2, order.statusMessage);
const orderTooltipStatus = (order: Order) => {
  let text = tradeErrorTipMessage(store.chainId, order.param1, order.param2, order.statusMessage);
  return text == null || text.length == 0;
}
const orderStatusTip = (order: Order) => {
  let text = orderTooltipMessage(order);
  return text.length == 0;
}
const isBlankValue = (detail: OrderDetailInfo) => {
  return isPositiveNumber(detail.amount0) && isPositiveNumber(detail.amount1);
}
const onSubmit = () => {

}
watch(() => selectedTime.value, () => {
  if (props.type == "copytrade") {
    loadOrders();
  } else {
    loadSnipList();
  }
})
watch(() => selectedStatus.value, () => {
  if (props.type == "copytrade") {
    loadOrders();
  } else {
    loadSnipList();
  }
})
onMounted(() => {
  if (props.type == "copytrade") {
    loadOrders();
  } else {
    loadSnipList();
  }
})
</script>

<template>
  <div class="column trade-detail">
    <div class="decorate">
      <div class="title">{{ $t('TradeDetail001') }}</div>
      <div class="sub-title">{{ $t('TradeDetail002') }}</div>
      <div class="title-gap"></div>
      <div class="search-field">
        <Input ref="inputField"
               :max-length="64"
               :text="searchTerm"
               :height="48"
               type="text"
               width="100%"
               :placeholder="$t('TradeDetail003')"
               @change="onTextChange"
               @submit="onSubmit"></Input>
        <Image icon="icon-search" :button="true" @click="onSubmit"/>
      </div>
    </div>
    <div class="column gap-24">
      <div class="title-bar">
        <div class="row gap-8 auto back-button" @click="onBack">
          <Image icon="icon-smartmoney-back" :disabled="true"></Image>
          <span class="back-button-text">{{ $t('CopyTrade004') }}</span>
        </div>
        <div class="row gap-8 auto">
          <SelectionTabBar :tabs="taskStatusList" :default-tab="selectedStatus"
                           @change="onSelectedTaskStatusChange"></SelectionTabBar>
          <SelectionTabBar :tabs="timeList" :default-tab="selectedTime"
                           @change="onSelectedTimeChange"></SelectionTabBar>
        </div>
      </div>
      <div class="column">
        <div class="row border">
          <el-scrollbar :noresize="true" :style="scrollerStyle()">
            <div class="table borderless">
              <div class="table-header" :style="tableHeaderStyle()">
                <div class="table-th table-column-1">{{ $t("Name078") }}</div>
                <div class="table-th table-column-2">{{ $t("Name079") }}</div>
                <div class="table-th  table-column-3">
                  {{ $t("Name015") }}
                </div>
                <div class="table-th  table-column-4">
                  {{ $t("Name003") }}
                </div>
                <div class="table-th  table-column-5">
                  {{ $t("Name065") }}
                </div>
                <div class="table-th  table-column-6">
                  {{ $t("Name080") }}
                </div>
                <div class="table-th  table-column-7">
                  {{ $t("Name081") }}
                </div>
                <div class="table-th flex-end expanded">
                  {{ $t("Trade013") }}
                </div>
              </div>
              <div class="table-body" v-if="!loading">
                <div :class="tableRowClass(order)" style="height: auto;gap:0;" v-for="(order,index) in dataList"
                     :key="order.id">
                  <div class="table-td table-column-1">
                    <div class="row gap-8 auto">
                      <TradeDirection :direction="order.direction"></TradeDirection>
                      <span class="order-name text-brake">{{ order.name }}</span>
                    </div>
                  </div>
                  <div class="table-td table-column-2">
                    <div class="grid">
                      <div class="grid-item">
                        <Image icon="icon-details-smartmoney" :disabled="true"></Image>
                        <span class="defaultText">{{ $t('Home003') }}</span>
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        <Image icon="icon-details-user" :disabled="true"></Image>
                        <span class="defaultText">{{ $t('Name082') }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="table-td table-column-3">
                    <div class="grid">
                      <div class="grid-item">
                        <TokenAddress :address="order.trackWallet" :chain-id="store.chainId"
                                      :copyable="true"></TokenAddress>
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        <TokenAddress :address="order.proxyWallet" :chain-id="store.chainId"
                                      :copyable="true"></TokenAddress>
                      </div>
                    </div>
                  </div>
                  <div class="table-td table-column-4">
                    <div class="grid">
                      <div class="grid-item">
                        <TokenAddress :address="order.smartMoney.hash" :chain-id="store.chainId" :copyable="true"
                                      address-type="hash" v-if="order.smartMoney.hash"></TokenAddress>
                        <span class="defaultText" v-else>-</span>
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        <TokenAddress :address="order.user.hash" :chain-id="store.chainId" :copyable="true"
                                      address-type="hash" v-if="order.user.hash"></TokenAddress>
                        <span class="defaultText" v-else>-</span>
                      </div>
                    </div>
                  </div>
                  <div class="table-td table-column-5">
                    <div class="grid">
                      <div class="grid-item">
                        {{ formatTaskTime(order.smartMoney.timestamp) }}
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        {{ formatTaskTime(order.user.timestamp) }}
                      </div>
                    </div>
                  </div>
                  <div class="table-td table-column-6">
                    <div class="grid">
                      <div class="grid-item">
                        <div class="row auto gap-4"
                             v-if="order.direction==OrderDirection.Authorize || order.direction==OrderDirection.Withdraw">
                          <span class="defaultText"> - </span>
                        </div>
                        <div class="row auto gap-4" v-else>
                          <div class="row auto gap-4" v-if="isBlankValue(order.smartMoney)">
                            <div class="column auto gap-4">
                              <span class="defaultText">{{ orderAmountInfo(order, "smartmoney", "left") }}</span>
                              <span class="defaultText">{{ orderSymbolInfo(order, "smartmoney", "left") }}</span>
                            </div>
                            <span class="defaultText">/</span>
                            <div class="column auto gap-4">
                              <span class="defaultText">{{ orderAmountInfo(order, "smartmoney", "right") }}</span>
                              <span class="defaultText">{{ orderSymbolInfo(order, "smartmoney", "right") }}</span>
                            </div>
                          </div>
                          <div class="row auto gap-4" v-else>
                            <span class="defaultText">-</span>
                          </div>
                        </div>
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        <div class="row auto gap-4"
                             v-if="order.direction==OrderDirection.Authorize || order.direction==OrderDirection.Withdraw">
                          <span class="defaultText"> - </span>
                        </div>
                        <div class="row auto gap-4" v-else>
                          <div class="row auto gap-4" v-if="isBlankValue(order.user)">
                            <div class="column auto gap-4">
                              <span class="defaultText">{{ orderAmountInfo(order, "user", "left") }}</span>
                              <span class="defaultText">{{ orderSymbolInfo(order, "user", "left") }}</span>
                            </div>
                            <span class="defaultText">/</span>
                            <div class="column auto gap-4">
                              <span class="defaultText">{{ orderAmountInfo(order, "user", "right") }}</span>
                              <span class="defaultText">{{ orderSymbolInfo(order, "user", "right") }}</span>
                            </div>
                          </div>
                          <div class="row auto gap-4" v-else>
                            <span class="defaultText">-</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="table-td table-column-7">
                    <div class="grid">
                      <div class="grid-item">
                        {{ formatAmountValue(order.smartMoney.price, 6, "", true) }}
                      </div>
                      <div class="line"></div>
                      <div class="grid-item">
                        {{ formatAmountValue(order.user.price, 6, "", true) }}
                      </div>
                    </div>
                  </div>
                  <div class="table-td expanded status-padding">
                    <div class="row auto gap-8" v-if="orderStatusTip(order)">
                      <Image :icon="tradeStatusIcon(order.status)" :width="20" :height="20"></Image>
                      <span :class="tradeStatusClass(order.status)">{{ $t(tradeTaskStatusText(order.status)) }}</span>
                    </div>
                    <div class="row auto gap-8" v-else>
                      <el-tooltip trigger="hover"
                                  effect="dark"
                                  :content="orderTooltipMessage(order)"
                                  :disabled="orderTooltipStatus(order)"
                                  placement="top">
                        <div class="row auto flex-start gap-8">
                          <Image :icon="tradeStatusIcon(order.status)" :width="20" :height="20"></Image>
                          <span :class="tradeErrorColor(order.statusMessage)">{{
                              tradeErrorMessage(store.chainId, order.param1, order.param2, order.statusMessage)
                            }}</span>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="row empty-state-border" v-if="loading">
          <Loading></Loading>
        </div>
        <div class="row empty-state-border" v-else-if="total == 0">
          <EmptyData></EmptyData>
        </div>
      </div>
      <Pagination :total="total" :page="page" :page-size="PageSize" @change="onPageChange"></Pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-detail {
  padding: 42px 86px !important;
  gap: 50px;
}

.decorate {
  @include box($direction: column, $gap: 12px);
  background-image: url(imageUrl('icon-smartmoney-bg'));
  background-repeat: no-repeat;
  background-position: center top;
  width: 651px !important;
}

.status-padding {
  padding-left: 24px !important;
}

.title {
  @include box();
  @include font(40px, 600);
  color: $textColor1;
}

.sub-title {
  @include box();
  text-align: center;
  @include font(14px, 600);
  color: $textColor1;
}

.title-bar {
  @include box($justify: space-between, $height: 40px);
}

.title-gap {
  height: 28px;
  width: 100%;
}

.search-field {
  @include box($gap: 8px, $width: 450px, $padding: 0 24px);
  border-radius: 1000px;
  border: $border1 !important;
  height: 48px;
}

.back-button {
  cursor: pointer;
}

.back-button-text {
  @include font(24px, 500);
  color: $textColor1;

}

.empty-state-border {
  border-left: $border1;
  border-right: $border1;
  border-bottom: $border1;
}

.table-column-1 {
  width: 190px !important;
}

.table-column-2 {
  width: 150px !important;
}

.table-column-3 {
  width: 130px !important;
}

.table-column-4 {
  width: 130px !important;
}

.table-column-5 {
  width: 200px !important;
}

.table-column-6 {
  width: 200px !important;
}

.table-column-7 {
  width: 130px !important;
}

.order-name {
  @include font(16px, 500);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $textColor2;
}

.sell {
  background-color: rgba($red1, 0.2);
}

.buy {
  background-color: rgba($green1, 0.2);
}

.grid {
  @include box($direction: column);
  height: 140px;

  .line {
    width: 100%;
    height: 1px;
    background-color: $line1;
  }

  .grid-item {
    @include box($height: 70px, $justify: flex-start, $gap: 4px);
    color: $textColor1
  }
}

</style>
