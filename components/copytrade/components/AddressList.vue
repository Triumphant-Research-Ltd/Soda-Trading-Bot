<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import SelectionTabBar from "~/components/copytrade/components/SelectionTabBar.vue";
import {PageSize, times} from "~/utils/common";
import {SortDirection, SortField} from '~/utils/constant';
import {fillNumber, formatHoldTime, formatNumber, formatPercent, pageableList} from "~/utils/util";
import Pagination from "~/components/base/Pagination.vue";
import EmptyData from "~/components/base/EmptyData.vue";
import Loading from "~/components/base/Loading.vue";
import {SmartMoneyEntity} from "~/models/SmartMoney";
import BigNumber from "bignumber.js";
import TokenAddress from "~/components/base/TokenAddress.vue";
import {parseSmartMoneyList} from "~/server/utils/result";
import type {Result} from "~/models/Result";

const {$bus, $api} = useNuxtApp();
const store = useAppStore();
const emit = defineEmits(['copyTrade']);
let addressList: Array<SmartMoneyEntity> = [];
const dataList = ref<Array<SmartMoneyEntity>>([]);
const sortField = ref<SortField>(SortField.unknown);
const sortDirection = ref<SortDirection>(SortDirection.None);
const total = ref<number>(0);
const page = ref<number>(1);
const loading = ref<boolean>(true);
const selectedTime = ref<string>('7');
const parseApiResult = (result: any) => {
  addressList.length = 0;
  let list = parseSmartMoneyList(result);
  addressList.push(...list);
  sort(sortField.value);
  reloadData(1, PageSize);
}
const loadAddressList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let time = selectedTime.value + 'day';
      let result: Result = await $api.smartMoneyList(store.chainId, time);
      parseApiResult(result);
    } catch (e: any) {
    } finally {
      loading.value = false;
    }
  }, 500)
}

const sort = (field: SortField) => {
  let items = addressList.sort((a: SmartMoneyEntity, b: SmartMoneyEntity) => {
    try {
      let a1 = Reflect.get(a, field);
      let a2 = Reflect.get(b, field);
      let n1 = BigNumber(a1).abs();
      let n2 = BigNumber(a2).abs();
      if (sortDirection.value == SortDirection.Desc) {
        return n2.comparedTo(n1);
      } else {
        return n1.comparedTo(n2)
      }
    } catch (e: any) {
      return 0;
    }

  })
  
  for (let index = 0; index < items.length; index++) {
    let item = items[index];
    item.index = index + 1;
  }
  return items;
}
const reloadData = (page: number, pageSize: number) => {
  total.value = addressList.length;
  dataList.value = pageableList(addressList, page, pageSize);
}
const onSelectedTimeChange = (time: string) => {
  selectedTime.value = time;
  loadAddressList();
}

const tableSortImage = (field: SortField) => {
  let ok = field == sortField.value;
  if (!ok) {
    return "icon-sort-none";
  }
  if (sortDirection.value == SortDirection.None) {
    return "icon-sort-none";
  } else if (sortDirection.value == SortDirection.Asc) {
    return "icon-sort-asc";
  }
  return "icon-sort-desc";
}

const tableSort = (field: SortField) => {
  sortField.value = field;
  if (field == sortField.value) {
    if (sortDirection.value == SortDirection.None) {
      sortDirection.value = SortDirection.Desc;
    } else if (sortDirection.value == SortDirection.Desc) {
      sortDirection.value = SortDirection.Asc;
    } else {
      sortDirection.value = SortDirection.Desc;
    }
  } else {
    sortDirection.value = SortDirection.Desc;
  }
  let items = sort(field);
  dataList.value = pageableList(items, page.value, PageSize);
}

const onPageChange = (p: number, ps: number) => {
  reloadData(p, ps);
  page.value = p;
}
const showDetail = (order: SmartMoneyEntity) => {
  let url = new URL(window.location.href);
  url.pathname = `/smartmoney/${order.address}`;
  url.searchParams.set("t", selectedTime.value)
  window.open(url.href, "_blank");
}
const copyTrade = (address: string) => {
  emit('copyTrade', address);
}
const openSmartMoney = () => {
  let url = new URL(window.location.href);
  url.pathname = `/smartmoney`;
  window.open(url.href, "_blank");
}


const onChainChange = () => {
  loadAddressList();
}
onMounted(() => {
  $bus.on(AppEvent.ChainChange, onChainChange);
  loadAddressList();
});
onUnmounted(() => {
  $bus.off(AppEvent.ChainChange, onChainChange);
});
</script>

<template>
  <div class="column address-list">
    <div class="address-list-tabs">
      <div class="row flex-justify gap-4">
        <div class="row gap-4 auto">
          <Image icon="icon-fire"></Image>
          <div class="title">{{ $t("CopyTrade006") }}</div>
        </div>
        <div class="row gap-16 auto">
          <div class="link" @click="openSmartMoney">{{ $t("CopyTrade007") }}</div>
          <SelectionTabBar :tabs="times" :default-tab="selectedTime" @change="onSelectedTimeChange"></SelectionTabBar>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="table-header">
        <div class="table-th table-column-1">#</div>
        <div class="table-th table-column-2">{{ $t("Name015") }}</div>
        <div class="table-th button table-column-3" @click="()=>tableSort(SortField.profit)">
          {{ $t("Name016") }}
          <Image :icon="tableSortImage(SortField.profit)" :width="12" :height="12" :disabled="true"></Image>
        </div>
        <div class="table-th button table-column-4" @click="()=>tableSort(SortField.tokenAmount)">
          {{ $t("Name017") }}
          <Image :icon="tableSortImage(SortField.tokenAmount)" :width="12" :height="12" :disabled="true"></Image>
        </div>
        <div class="table-th button table-column-5" @click="()=>tableSort(SortField.winningRate)">
          {{ $t("Name018") }}
          <Image :icon="tableSortImage(SortField.winningRate)" :width="12" :height="12" :disabled="true"></Image>
        </div>
        <div class="table-th button table-column-6" @click="()=>tableSort(SortField.tradeProfitRate)">
          {{ $t("Name019") }}
          <Image :icon="tableSortImage(SortField.tradeProfitRate)" :width="12" :height="12"
                 :disabled="true"></Image>
        </div>
        <div class="table-th button table-column-7" @click="()=>tableSort(SortField.averageHoldTime)">
          {{ $t("Name020") }}
          <Image :icon="tableSortImage(SortField.averageHoldTime)" :width="12" :height="12"
                 :disabled="true"></Image>
        </div>
        <div class="table-th expanded flex-end">{{ $t("Trade026") }}</div>
      </div>
      <div class="column" v-if="loading">
        <Loading></Loading>
      </div>
      <EmptyData v-else-if="total == 0"></EmptyData>
      <div class="table-body" v-else>
        <div class="table-row hover-effect" v-for="order in dataList" :key="order.id">
          <div class="table-td table-column-1">
            {{ fillNumber(order.index, 2) }}
          </div>
          <div class="table-td table-column-2">
            <TokenAddress :address="order.address" :chain-id="store.chainId" :copyable="true"></TokenAddress>
          </div>
          <div class="table-td table-column-3">
            {{ formatNumber(order.profit, '$', 1) }}
          </div>
          <div class="table-td table-column-4">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="column auto">
                  <div class="row auto flex-start">{{ $t("Name017") }}:&nbsp;{{ order.tokenAmount }}</div>
                  <div class="row auto flex-start">{{ $t("Name021") }}:&nbsp;{{ order.positiveProfit }}</div>
                  <div class="row auto flex-start">{{ $t("Name022") }}:&nbsp;{{ order.negativeProfit }}</div>
                </div>
              </template>
              <span>{{ formatNumber(order.tokenAmount) }}</span>
            </el-tooltip>
          </div>
          <div class="table-td table-column-5">
            {{ formatPercent(order.winningRate) }}
          </div>
          <div class="table-td table-column-6">
            {{ formatPercent(order.tradeProfitRate) }}
          </div>
          <div class="table-td table-column-7">
            {{ formatHoldTime(order.averageHoldTime) }}
          </div>
          <div class="table-td expanded flex-end">
            <div class="row auto gap-8">
              <div class="detail-button" @click="()=>showDetail(order)">{{ $t("CopyTrade008") }}</div>
              <div class="copytrade-button" @click="()=>copyTrade(order.address)">{{ $t("Home002") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination v-if="total>0 && !loading" :total="total" :page="page" :page-size="PageSize"
                @change="onPageChange"></Pagination>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.address-list {
  gap: 20px !important;
}

.address-list-tabs {
  @include box($justify: space-between);
}

.title {
  color: $textColor2;
}

.link {
  color: $blue2;
  cursor: pointer;
  text-decoration: underline;
}

.table-column-1 {
  width: 68px !important;
}

.table-column-2 {
  width: 155px !important;
}

.table-column-3 {
  width: 159px !important;
}

.table-column-4 {
  width: 164px !important;
}

.table-column-5 {
  width: 162px !important;
}

.table-column-6 {
  width: 161px !important;
}

.table-column-7 {
  width: 171px !important;
}

.detail-button {
  @include box($width: 67px, $height: 28px);
  border: $border1;
  cursor: pointer;
}

.copytrade-button {
  @include box($width: 108px, $height: 28px);
  border: 1px solid rgba($yellow1, 0.2);
  cursor: pointer;
  color: $yellow1;
}

</style>
