<template>
  <el-dialog :width="705"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="opDialogOpened"
  >

    <div class="user-wallet">
      <div class="row">
        <span class="title-text">{{ $t("Home006") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="address">
        <div class="row auto gap-8 flex-start">
          <TokenAddress :address="store.walletAddress" :chain-id="store.chainId" :copyable="true"
                        :no-reduce="true"></TokenAddress>
          <Image icon="icon-wallet-qrcode" :width="20" :height="20" :button="true" @click="openQRCode"></Image>
        </div>
      </div>
      <div class="column">
        <div class="table">
          <div class="table-header">
            <div class="table-th table-column-1">{{ $t("Trade009") }}</div>
            <div class="table-th table-column-2">{{ $t("Name015") }}</div>
            <div class="table-th table-column-3">
              {{ $t("Trade010") }}
            </div>
            <div class="table-th expanded">{{ $t("Trade026") }}</div>
          </div>
          <div class="column" v-if="loading">
            <Loading></Loading>
          </div>
          <EmptyData v-else-if="total == 0"></EmptyData>
          <div class="table-body" v-else>
            <div class="table-row hover-effect" v-for="(order,index) in dataList" :key="order.id">
              <div class="table-td table-column-1">
                <div class="row auto flex-start gap-8">
                  <Image :token="order.tokenAddress" :chain="store.chainId" :width="16" :height="16"
                         :disabled="true"></Image>
                  <span class="token-symbol">{{ order.tokenSymbol }}</span>
                </div>
              </div>
              <div class="table-td table-column-2">
                <TokenAddress :address="order.tokenAddress" :chain-id="store.chainId" :copyable="true"></TokenAddress>
              </div>
              <div class="table-td table-column-3">
                {{ order.tokenQuantity }}
              </div>
              <div class="table-td expanded">
                <div class="row auto gap-8">
                  <div class="transfer-button" @click="()=>transfer(order)">{{ $t("Name076") }}</div>
                  <div :class="sellButtonClass(order)" @click="()=>sell(order)">{{ $t("Name077") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Pagination :total="total" :page="page" :page-size="PageSize" @change="onPageChange"></Pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">

import {useAppStore} from "~/stores/appstore";
import TokenAddress from "~/components/base/TokenAddress.vue";
import Image from "~/components/base/Image.vue";
import {PageSize} from "~/utils/common";
import {isAddress, routeSource} from "~/utils/util";
import Pagination from "~/components/base/Pagination.vue";
import {Token} from "~/models/Token";
import Loading from "~/components/base/Loading.vue";
import EmptyData from "~/components/base/EmptyData.vue";
import type {Result} from "~/models/Result";
import {sortTokenList} from "~/utils/sort";

const route = useRoute();
const routePath = route.path
const pageSource = route.query.t;
let source = "";
if (pageSource == "flash") {
  source = "flash";
} else if (pageSource == "sniper") {
  source = "sniper";
} else {
  source = routeSource(routePath);
}


const store = useAppStore();
const {$api} = useNuxtApp();
const open = ref<boolean>(false);
const page = ref(1);
const total = ref(0);
const loading = ref(true);
let tokenList: Array<Token> = [];
const dataList = ref<Token[]>([]);
const sortField = ref<SortField>(SortField.tokenQuantity)
const sortDirection = ref<SortDirection>(SortDirection.Desc)

const parseTokenList = (result: any) => {
  let data = result.data;
  let list = data.tokenList;
  if (Array.isArray(list)) {
    tokenList.length = 0;
    for (let item of list) {
      let token = new Token();
      token.valueOf(item);
      if (isAddress(token.tokenAddress)) {
        tokenList.push(token);
      }
    }
  }
  tokenList = sortTokenList(tokenList, sortField.value, sortDirection.value)
  total.value = tokenList.length;
  dataList.value = pageableList(tokenList, page.value, PageSize);
}
const sellButtonClass = (token: Token) => {
  let nativeToken = token.tokenAddress == defaultToken || token.tokenAddress == defaultSolToken;
  return {
    "sell-button": true,
    disabled: nativeToken
  }
}
const opDialogOpened = () => {
  loadTokenList();
}
const loadTokenList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result: Result = await $api.tokenList();
      parseTokenList(result);
    } catch (e: any) {
    } finally {
      loading.value = false
    }
  }, 500)

}


const onClose = () => {
  tokenList.length = 0;
  dataList.value = [];
  store.showUserWallet(false);
}
const openQRCode = () => {
  store.showWalletQrCode(true);
}

const onPageChange = (p: number, ps: number) => {
  dataList.value = pageableList(tokenList, p, ps);
}
const sell = (order: Token) => {
  store.showTransferDialog("sell", order.tokenAddress, order.tokenSymbol, source);
}
const transfer = (order: Token) => {
  store.showTransferDialog("transfer", order.tokenAddress, order.tokenSymbol, source);
}
watch(() => store.userWallet, (val) => {
  open.value = val;
});

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.user-wallet {
  @include box($direction: column, $gap: 16px);


}

.address {
  @include box($justify: flex-start, $padding: 16px 24px);
  background-color: rgba($blue2, 0.2);
  border-radius: 2px;
}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}

.token-symbol {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  color: $textColor1;
}

.table-column-1 {
  width: 110px !important;
}

.table-column-2 {
  width: 130px !important;
}

.table-column-3 {
  width: 200px !important;
}

.transfer-button {
  @include box($width: 70px, $height: 28px);
  color: $textColor1;
  background-color: $blue1;
  cursor: pointer;
}

.sell-button {
  @include box($width: 70px, $height: 28px);
  color: $textColor1;
  border: $border1;
  cursor: pointer;

  &.disabled {
    color: $textColor2;
    background-color: $backgroundColor3;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
