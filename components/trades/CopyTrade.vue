<script setup lang="ts">

import Switch from "@/components/base/Switch.vue";
import Loading from "@/components/base/Loading.vue";
import {tradeStatusIcon} from "@/utils/resource"
import {OrderDirection, SwitchState, TradeErrorCode} from "@/utils/constant";
import Pagination from "@/components/base/Pagination.vue";
import {PageSize} from "@/utils/common";
import {
  dexLink,
  formatAmountValue,
  formatTime,
  formatTokenAmount,
  nativeToken,
  pageableList, routeSource,
  tradeErrorTipValue,
  tradeStatusClass
} from "@/utils/util";
import Image from "@/components/base/Image.vue";
import {Order} from "@/models/Order";
import TradeDirection from "@/components/base/TradeDirection.vue";
import BigNumber from "bignumber.js";
import {timeUnitKeys, tradeTaskStatusText} from "@/utils/i18n";
import EmptyData from "@/components/base/EmptyData.vue";
import TradeMenu from "~/components/trades/TradeMenu.vue";
import TradeAnalyze from "~/components/trades/TradeAnalyze.vue";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";
import {sort} from "~/utils/util"

interface CopyTradeProps {
  type: OrderDetailType
}

const route = useRoute();
const routePath = route.path
let source = routeSource(routePath);

const props = defineProps<CopyTradeProps>()
let airdropTokens: Record<string, string> = {};

let orderList: Array<Order> = [];
const {$api, $bus} = useNuxtApp();
const {t} = useI18n({useScope: 'global'})
const store = useAppStore();
const page = ref<number>(1);
const total = ref<number>(0);


const loading = ref<boolean>(true);

const hideCompleted = ref<SwitchState>(SwitchState.off);

const dataList = ref<Order[]>([]);


const term = ref('');
const tradeDetailVisible = ref(false);
const tradeDetailPair = ref('');
const sortTradeDetail = (a: Order, b: Order) => {
  return sort(a.timestamp, b.timestamp, SortDirection.Desc);
}
const parseOrderList = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (data) {
      let orders = data.orders;
      let airdrop = data.airdrop;
      if (Array.isArray(airdrop)) {
        airdropTokens = {};
        for (let token of airdrop) {
          airdropTokens[token] = token;
        }
      }
      if (Array.isArray(orders)) {
        orderList.length = 0;
        for (let orderInfo of orders) {
          let order = new Order();
          order.valueOf(orderInfo);
          orderList.push(order);
        }
        page.value = 1;
        reloadData(term.value, 1, PageSize, hideCompleted.value);
      }

    }
  } else {
    airdropTokens = {};
    orderList.length = 0;
    dataList.value = [];
    total.value = 0;
    page.value = 1;
  }
}
const forceDemo = () => {}
const loadOrderList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result: Result = await $api.orderList();
      parseOrderList(result);
    } catch (e: any) {
    } finally {
      loading.value = false;
    }
  }, 500);

}
const getFilterData = (orderList: Array<Order>, term: string, filterComplete: SwitchState) => {
  return orderList.filter((item) => {
    let ok1 = item.name.toLowerCase().includes(term.toLowerCase());
    let ok2 = item.token0.includes(term);
    let ok3 = item.token1.includes(term);
    let ok4 = true;
    if (filterComplete == SwitchState.on) {
      ok4 = airdropTokens[item.token0] == null;
    }
    return (ok1 || ok2 || ok3) && ok4;
  });
}
const reloadData = (term: string, page: number, pageSize: number, filterComplete: SwitchState) => {
  let searchTerm = term.trim();
  if (searchTerm.length > 0) {
    if (store.chainId != "solana") {
      searchTerm = searchTerm.toLowerCase();
    }
  }
  let items = getFilterData(orderList, searchTerm, filterComplete);
  items.sort(sortTradeDetail)
  total.value = items.length;
  dataList.value = pageableList(items, page, pageSize);
}

const onSwitchChange = (current: SwitchState) => {
  hideCompleted.value = current;
}

const onPageChange = (p: number, ps: number) => {
  reloadData(term.value, p, ps, hideCompleted.value);
  page.value = p;
}

const isValidAmount = (amount: string) => {
  return isPositiveNumber(amount) || isScientificNotation(amount)
}

const tokenUsd = (amount: string, price: string) => {
  let n1 = BigNumber(amount);
  let n2 = BigNumber(price);
  if (n1.isNaN() || n2.isNaN()) {
    return "-";
  }
  let value = n1.multipliedBy(n2);
  let text = formatAmountValue(value.toFixed(), 2, "$", true);
  return `(${text})`
}

const openTaskName = (address: string) => {
  let url = new URL(window.location.href)
  url.pathname = `trades`
  url.searchParams.set("t", "1")
  url.hash = address.replace("0x", "");
  window.open(url.href, "_self")
}
const orderTradeShareDisabledState = (order: Order) => {
  return order.hash.length == 0 || order.direction != OrderDirection.Sell;
}
const getMenuState = (order: Order) => {
  return {
    [TradeMenuKeys.Details]: false,
    [TradeMenuKeys.Wallet]: false,
    [TradeMenuKeys.Tx]: order.hash == null || order.hash.length == 0,
    [TradeMenuKeys.Pool]: false,
    [TradeMenuKeys.PoolSmartMoney]: false,
    [TradeMenuKeys.Share]: orderTradeShareDisabledState(order),
    [TradeMenuKeys.ProfitImage2]: orderTradeShareDisabledState(order)
  }
}


const isTaskTime = (timestamp: string) => {
  return isPositiveInteger(timestamp)
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

const openOrderStatistics = (order: Order) => {
  tradeDetailPair.value = order.pair
  tradeDetailVisible.value = true;
}

const onOrderMenu = (key: TradeMenuKeys, order: Order) => {
  if (key == TradeMenuKeys.Details) {
    let url = new URL(window.location.href)
    if (props.type == OrderDetailType.Following) {
      url.pathname = `/copytrade/orders`
    } else {
      url.pathname = `/sniper/orders`
    }
    window.location.href = url.href;
  } else if (key == TradeMenuKeys.Wallet) {
    let url = addressLink(store.chainId, store.walletAddress)
    window.open(url, "_blank")
  } else if (key == TradeMenuKeys.Tx) {
    if (!order.hash) {
      return;
    }
    let url = hashLink(store.chainId, order.hash);
    window.open(url, "_blank")
  } else if (key == TradeMenuKeys.Pool) {
    let url = dexLink(store.chainId, order.pair, store.walletAddress);
    window.open(url, "_blank")
  } else if (key == TradeMenuKeys.PoolSmartMoney) {
    let url = dexLink(store.chainId, order.pair, order.trackWallet);
    window.open(url, "_blank")
  } else if (key == TradeMenuKeys.Share) {
    store.showProfitImage(order.hash, "0");
  } else if (key == TradeMenuKeys.ProfitImage2) {
    store.showProfitImage(order.hash, "1");
  }
}


const openOrderTokenSell = (order: Order) => {
  store.showTransferDialog("sell", order.token0, order.symbol0,source);
}
const closeTradeDetail = () => {
  tradeDetailVisible.value = false;
  tradeDetailPair.value = "";
}
const onTokenSearch = (searchTerm: string) => {
  term.value = searchTerm;
  reloadData(searchTerm, 1, PageSize, hideCompleted.value);
  page.value = 1;
}
const onChainChange = () => {
  loadOrderList();
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

const onLogin = () => {
  loadOrderList();
}
const onLogout = () => {
  orderList.length = 0;
  reloadData(term.value, 1, PageSize, hideCompleted.value);
}
watch(() => hideCompleted.value, (newVal) => {
  reloadData(term.value, 1, PageSize, newVal);
  page.value = 1;
});

onMounted(() => {
  let ok = store.isLogin && store.hasWallet;
  if (!ok) {
    loading.value = false;
  }
  $bus.on(AppEvent.Login, onLogin);
  $bus.on(AppEvent.Logout, onLogout);
  $bus.on(AppEvent.TokenSearch, onTokenSearch);
  $bus.on(AppEvent.ChainChange, onChainChange);
  loadOrderList();
})
onUnmounted(() => {
  $bus.off(AppEvent.Login, onLogin);
  $bus.off(AppEvent.Logout, onLogout);
  $bus.off(AppEvent.TokenSearch, onTokenSearch);
  $bus.off(AppEvent.ChainChange, onChainChange);
})

</script>

<template>
  <div class="column gap-24">
    <div class="row flex-start" v-if="!loading">
      <Switch :state="hideCompleted" :text="$t('Trades001',{name:$t('Trades002')})"
              @change="onSwitchChange"></Switch>
    </div>
    <div class="table">
      <div class="table-header">
        <div class="table-th table-column-1">{{ $t("Trade008") }}</div>
        <div class="table-th table-column-2">{{ $t("Trade009") }}</div>
        <div class="table-th table-column-3">
          <Image :chain="store.chainId" :width="20" :height="20" :disabled="true"/>
          <span>{{ nativeToken(store.chainId) }}</span>
        </div>
        <div class="table-th table-column-4">{{ $t("Trade010") }}</div>
        <div class="table-th table-column-5">{{ $t("Trade011") }}</div>
        <div class="table-th table-column-6">{{ $t("Trade012") }}</div>
        <div class="table-th table-column-7">{{ $t("Trade013") }}</div>
        <div class="table-th expanded"></div>
      </div>
      <div class="column" v-if="loading">
        <Loading></Loading>
      </div>
      <EmptyData v-else-if="total == 0"></EmptyData>
      <div class="table-body" v-else>
        <div class="table-row hover-effect" v-for="order in dataList" :key="order.id">
          <div class="table-td  table-column-1">
            <TradeDirection :direction="order.direction"></TradeDirection>
          </div>
          <div class="table-td table-column-2">
            <div class="row gap-8 auto flex-start">
              <Image :token="order.token0" :chain="store.chainId" :width="20" :height="20"></Image>
              <div class="defaultText" v-if="order.symbol0.length>0">{{ order.symbol0 }}</div>
              <div class="defaultText" v-else>{{ order.symbol0 }}</div>
            </div>
          </div>
          <div class="table-td table-column-3">
            <div class="row auto flex-start gap-4">
              <div class="token-price" v-if="isValidAmount(order.amount1)&&isValidAmount(order.price)">
                {{ formatTokenAmount(order.amount1, true) }}
                {{ tokenUsd(order.amount1, order.price) }}
              </div>
              <div class="defaultText" v-if="isValidAmount(order.amount1)">
                {{ formatTokenAmount(order.amount1, true) }}
              </div>
              <div class="defaultText" v-else>-</div>
            </div>
          </div>
          <div class="table-td table-column-4">
            <div class="row auto defaultText">
              {{ formatTokenAmount(order.amount0, true) }}
            </div>
          </div>
          <div class="table-td table-column-5">
            <div class="row auto defaultText button" @click="()=>{openTaskName(order.trackWallet)}">
              {{ order.name }}
            </div>
          </div>
          <div class="table-td table-column-6">
            <div class="row auto defaultText " v-if="isTaskTime(order.timestamp)">
              <el-tooltip trigger="hover" effect="dark" :content="timestamp(order.timestamp)" placement="top">{{
                  $t("TimeUnit000", {time: formatTime(order.timestamp, timeUnits())})
                }}
              </el-tooltip>
            </div>
          </div>
          <div class="table-td table-column-7">
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
          <div class="table-td expanded">
            <div class="row gap-8 flex-end">
              <Image icon="icon-order-statistics" :width="20" :height="20" :button="true"
                     @click="()=>{openOrderStatistics(order)}"></Image>
              <el-tooltip effect="dark" trigger="hover" :content="$t('Trade014')" placement="top">
                <Image icon="icon-order-sell" :width="20" :height="20" :button="true"
                       @click="()=>{openOrderTokenSell(order)}"></Image>
              </el-tooltip>
              <el-popover placement="top" trigger="click" :width="224" :show-arrow="false" effect="dark"
                          popper-class="popover">
                <template #reference>
                  <Image icon="icon-order-menu" :width="20" :height="20" :button="true"></Image>
                </template>
                <TradeMenu :state="getMenuState(order)"
                           @select="(key:TradeMenuKeys)=>onOrderMenu(key,order)"></TradeMenu>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination v-if="total>0" :total="total" :page-size="PageSize" :page="page" @change="onPageChange"></Pagination>
  </div>
  <TradeAnalyze :visible="tradeDetailVisible" :pair="tradeDetailPair" @close="closeTradeDetail"></TradeAnalyze>
</template>


<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.table-column-1 {
  width: 104px !important;
}

.table-column-2 {
  width: 164px !important;
}

.table-column-3 {
  width: 140px !important;
}

.table-column-4 {
  width: 92px !important;
}

.table-column-5 {
  width: 121px !important;
}

.table-column-6 {
  width: 164px !important;
}

.table-column-7 {
  width: 343px !important;
}

.button {
  cursor: pointer;
}

.token-price {
  color: $textColor2;
}


</style>
