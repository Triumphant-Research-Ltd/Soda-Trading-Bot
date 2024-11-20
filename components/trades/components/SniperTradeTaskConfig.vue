<template>
  <div class="task-config">
    <div class="row">
      <div class="task-config-row-header">{{ $t("Trade023") }}:</div>
      <div class="task-config-row-tail">
        <TokenAddress :address="props.order.address" :chain-id="store.chainId" no-reduce copyable></TokenAddress>
        <div class="analyze-button" @click="()=>analyze(props.order.address)">{{ $t("Trade036") }}</div>
        <div class="flex"></div>
        <div class="edit-task-button" @click="()=>edit(props.order)">{{ $t("Trade037") }}</div>

      </div>
    </div>
    <div class="row">
      <div class="task-config-row-header">{{ $t("Trade024") }}:</div>
      <div class="task-config-row-tail">
        <span class="defaultText">{{ taskMode(props.order) }}</span>
      </div>
    </div>
    <div class="row">
      <div class="task-config-row-header">{{ $t("Trade031") }}:</div>
      <div class="task-config-row-tail">
        <div class="column gap-16">
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade044") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.buySlippage, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade046") }}</div>
            <div class="task-config-row-tail-content">{{
                props.order.buyTxProtect == "1" ? $t("State001") : $t("State002")
              }}
            </div>
          </div>
          <div class="row" v-if="props.order.creator==3">
            <div class="task-config-row-tail-title">{{ $t("Trade089") }}</div>
            <div class="task-config-row-tail-content">{{
                priceText(props.order.limitPriceAmount)
              }}
            </div>
          </div>
          <div class="row" v-if="props.order.creator==3">
            <div class="task-config-row-tail-title">{{ $t("Trade092") }}</div>
            <div class="task-config-row-tail-content">{{
                priceText(props.order.limitPriceBasePrice)
              }}
            </div>
          </div>
          <div class="row" v-if="props.order.creator==3">
            <div class="task-config-row-tail-title">{{ $t("Trade090") }}</div>
            <div class="task-config-row-tail-content">{{
                formatTaskTime(props.order.limitPriceExpire)
              }}
            </div>
          </div>
          <div class="row" v-if="store.chainId=='solana'">
            <div class="task-config-row-tail-title">{{ $t("Name106") }}</div>
            <div class="task-config-row-tail-content">{{ props.order.priorityFee }}SOL</div>
          </div>
          <div class="column align-items-left gap-16" v-else>
            <div class="row">
              <div class="task-config-row-tail-title">{{ $t("Trade061") }}</div>
              <div class="task-config-row-tail-content">{{ props.order.gasLimit }}</div>
            </div>
            <div class="row">
              <div class="task-config-row-tail-title">{{ $t("Trade062") }}</div>
              <div class="task-config-row-tail-content">{{ props.order.gasPriceLimit }}Gwei</div>
            </div>
            <div class="row">
              <div class="task-config-row-tail-title">{{ $t("Trade063") }}</div>
              <div class="task-config-row-tail-content">{{ props.order.gasOverflow }}Gwei</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="task-config-row-header">{{ $t("Trade033") }}:</div>
      <div class="task-config-row-tail">
        <div class="column  gap-16">
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade053") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinRate, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade054") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinExtent, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade055") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinRate2, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade056") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinExtent2, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade057") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinRate3, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade058") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellWinExtent3, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade059") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellLossRate, false) }}</div>
          </div>
          <div class="row">
            <div class="task-config-row-tail-title">{{ $t("Trade060") }}</div>
            <div class="task-config-row-tail-content">{{ formatPercent(props.order.sellLossExtent, false) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="task-config-row-header">{{ $t("Trade035") }}:</div>
      <div class="task-config-row-tail">
        <div class="column gap-32">
          <div class="table">
            <div class="table-header borderless order-table-header table-gap">
              <div class="table-th table-column-1">{{ $t("Trade008") }}</div>
              <div class="table-th table-column-2">{{ $t("Trade012") }}</div>
              <div class="table-th table-column-3">
                <Image :chain="store.chainId" :width="20" :height="20" :disabled="true"/>
                <span>{{ nativeToken(store.chainId) }}</span>
              </div>
              <div class="table-th table-column-4">{{ $t("Name002") }}</div>
              <div class="table-th table-column-5">
                {{ $t("Name003") }}
              </div>
              <div class="table-th flex-end expanded"></div>
            </div>
            <div class="column" v-if="loading">
              <Loading></Loading>
            </div>
            <EmptyData v-else-if="total==0"></EmptyData>
            <div class="table-body" v-else>
              <div class="table-row hover-effect borderless table-gap" v-for="order in dataList" :key="order.id">
                <div class="table-td table-column-1">
                  <div class="row auto flex-start">
                    <TradeDirection :direction="order.direction"></TradeDirection>
                  </div>
                </div>
                <div class="table-td table-column-2">
                  <div class="row auto token-amount" v-if="isPositiveInteger(order.timestamp)">
                    <el-tooltip trigger="hover" effect="dark" :content="timestamp(order.timestamp)"
                                placement="top">{{
                        $t("TimeUnit000", {time: formatTime(order.timestamp, timeUnits())})
                      }}
                    </el-tooltip>
                  </div>
                </div>
                <div class="table-td table-column-3">
                  <div class="row auto token-amount">
                    {{ formatTokenAmount(order.user.amount1, true) }}
                  </div>
                </div>
                <div class="table-td table-column-4">
                  <div class="row auto token-amount gap-8">
                    <Image :token="order.user.token0" :chain="store.chainId" :width="20" :height="20"
                           :disabled="true"></Image>
                    <span class="text-ellipse">{{ order.user.symbol0 }}</span>
                    <Image :token="order.user.token1" :chain="store.chainId" :width="20" :height="20"
                           :disabled="true"></Image>
                    <span class="text-ellipse">{{ order.user.symbol1 }}</span>
                    <Image icon="icon-menu-pool" :width="20" :height="20" :button="true"
                           @click="()=>openAddressLink(order)"></Image>
                  </div>
                </div>
                <div class="table-td table-column-5">
                  <div class="row auto token-amount">
                    <TokenAddress :address="order.hash" address-type="hash" :chain-id="store.chainId"
                                  linkable></TokenAddress>
                  </div>
                </div>
                <div class="table-td flex-end expanded">
                  <div class="row detail-button" @click="viewDetail">{{ $t("Trade065") }}</div>
                </div>
              </div>
            </div>
          </div>
          <Pagination v-if="total > 0" :total="total" :page-size="PageSize" :page="page"
                      @change="onPageChange"></Pagination>
        </div>
      </div>
    </div>
  </div>
  <SniperTaskEdit :order="editableTask" :visible="showTaskEdit" @submit="onTaskEditSubmit"></SniperTaskEdit>
</template>
<script setup lang="ts">

import TokenAddress from "~/components/base/TokenAddress.vue";
import {
  formatPercent,
  formatTime,
  formatTokenAmount,
  isPositiveInteger, isPositiveNumber,
  nativeToken,
  pageableList,
  pairLink
} from "~/utils/util";
import {OrderDetail} from "~/models/OrderDetail";
import Image from "~/components/base/Image.vue";
import {PageSize} from "~/utils/common";
import Pagination from "~/components/base/Pagination.vue";
import TradeDirection from "~/components/base/TradeDirection.vue";
import {timeUnitKeys} from "~/utils/i18n";
import {SniperFollowOrder} from "~/models/SniperFollowOrder";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";
import Loading from "~/components/base/Loading.vue";
import EmptyData from "~/components/base/EmptyData.vue";
import SniperTaskEdit from "~/components/trades/components/SniperTaskEdit.vue";
import {SniperTaskSettings} from "~/models/SniperTaskSettings";

interface TaskConfigProps {
  order: SniperFollowOrder;
}


let orderList: Array<OrderDetail> = [];
const emit = defineEmits(['edit']);
const {t} = useI18n({useScope: 'global'});
const store = useAppStore();
const props = defineProps<TaskConfigProps>();
const dataList = ref<Array<OrderDetail>>([]);
const total = ref<number>(0);
const page = ref<number>(1);
const {$api} = useNuxtApp();
const loading = ref(true);
const showTaskEdit = ref(false);
const editableTask = ref<SniperFollowOrder>();

const priceText=(price:string)=>{
  if(isPositiveNumber(price)){
    return price;
  }
  return "-"
}
const reloadData = (page: number, pageSize: number) => {
  total.value = orderList.length;
  dataList.value = pageableList(orderList, page, pageSize);
}
const parseOrderList = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (Array.isArray(data)) {
      orderList.length = 0;
      for (let info of data) {
        let detail = new OrderDetail();
        detail.valueOf(info);
        orderList.push(detail);
      }
      reloadData(1, PageSize);
    }
  }
}
const loadOrderList = () => {
  try {
    loading.value = true;
    setTimeout(async () => {
      let result = await $api.snipOrderDetailList(props.order.address);
      parseOrderList(result);
      // demo();
    }, 500);

  } catch (e: any) {

  } finally {
    loading.value = false;
  }

}
const onTaskEditSubmit = (task: SniperTaskSettings | undefined) => {
  showTaskEdit.value = false;
  if (task == undefined) {//just close dialog
    return;
  }
  emit('edit', task);
}

const onPageChange = (p: number, ps: number) => {
  page.value = p;
  reloadData(p, ps);
}
const taskMode = (order: SniperFollowOrder) => {
  let array = [];
  let modeBuy = "";
  if (order.highSpeedBuy == "1") {
    modeBuy = t("Trade079")
  } else {
    modeBuy = t("Trade080")
  }
  array.push(modeBuy);
  let modeSell = "";
  if (order.customSell == "1") {
    modeSell = t("Trade081");
  }
  array.push(modeSell)
  if (array.length > 1) {
    return array.join(",")
  }
  return array.join("");

}

const analyze = (address: string) => {
  let href = new URL(window.location.href);
  href.pathname = `/smartmoney/${address}`;
  href.searchParams.set('t', '30');
  window.open(href.href, "_blank");
}

const edit = (order: SniperFollowOrder) => {
  editableTask.value = order;
  showTaskEdit.value = true;
}
const viewDetail = () => {
  let href = new URL(window.location.href);
  href.pathname = "/sniper/orders"
  window.open(href.href, "_blank");
}
const openAddressLink = (order: OrderDetail) => {
  if (!isAddress(order.pair) || !isAddress(store.walletAddress)) {
    return;
  }
  let url = pairLink(store.chainId, order.pair, store.walletAddress)
  window.open(url, "_blank")
}
const timeUnits = () => {
  let i18nKeys = timeUnitKeys();
  return {
    seconds: t(i18nKeys.seconds),
    minutes: t(i18nKeys.minutes),
    hours: t(i18nKeys.hours),
    days: t(i18nKeys.days),
    second: t(i18nKeys.second),
    minute: t(i18nKeys.minute),
    hour: t(i18nKeys.hour),
    day: t(i18nKeys.day),
  }
}
const timestamp = (timestamp: string) => {
  return formatTaskTime(timestamp)
}

onMounted(() => {
  loadOrderList();
})

</script>

<style scoped lang="scss">
@use "@/assets/scss/base.scss" as *;
@use "@/assets/scss/global.variable" as *;

.task-config {
  @include box($padding: 24px, $gap: 36px, $direction: column);
  background-color: $backgroundColor2;
}

.task-config-row-header {
  @include box($justify: flex-start, $width: 208px, $height: 28px);
  @include font(14px, 500);
  color: $textColor1;
}

.task-config-row-tail {
  @include box($justify: flex-start, $gap: 8px);
  flex: 1;
}

.analyze-button {
  @include box($width: 67px, $height: 27px);
  border-radius: 2px;
  border: 1px solid $blue1;
  color: $blue1;
  cursor: pointer;

}

.edit-task-button {
  @include box($width: 137px, $height: 28px, $padding: 0 10px);
  border: $border1;
  border-radius: 2px;
  cursor: pointer;
  color: $textColor1;

}

.task-config-row-tail-title {
  @include box($justify: flex-start, $width: 178px);
  color: $textColor2;
}

.task-config-row-tail-content {
  @include box($justify: flex-start);
  flex: 1;
  color: $textColor1
}

.order-table-header {
  height: 40px !important;

}

.table-column-1 {
  width: 104px !important;
}

.table-column-2 {
  width: 124px !important;
}

.table-column-3 {
  width: 124px !important;
}

.table-column-4 {
  width: 180px !important;
}

.table-column-5 {
  width: 80px !important;
}

.table-gap {
  gap: 60px !important;
}

.token-amount {
  color: $textColor1;
}

.detail-button {
  width: 67px;
  height: 28px;
  color: $green1;
  cursor: pointer;
  border-radius: 2px;
  border: 1px solid rgba($green1, 0.2);
}

.text-ellipse {
  @include ellipse();
}
</style>
