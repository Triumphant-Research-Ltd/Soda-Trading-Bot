<script setup lang="ts">

import TokenAddress from "~/components/base/TokenAddress.vue";
import Image from "~/components/base/Image.vue";
import {formatAmountValue, nativeToken} from "~/utils/util";
import type {Result} from "~/models/Result";
import BigNumber from "bignumber.js";

const {$api, $bus} = useNuxtApp();
const store = useAppStore();
const balance = ref<string>('-');

const allow = () => {
  return store.isLogin && store.hasWallet;
}
const loadAccountBalance = async () => {
  try {
    if (!allow()) {
      balance.value = "-";
      return;
    }
    let result: Result = await $api.accountBalance();
    let n = BigNumber(result.data);
    if (n.isNegative() || n.isNegative() || !n.isFinite()) {
      balance.value = '-';
    } else {
      balance.value = n.toString();
      store.updateBalance(n.toString());
    }
  } catch (e: any) {
  }
}


const openWalletDialog = () => {
  if (!allow()) {
    return;
  }
  store.showUserWallet(true);
}

const openQRCodeDialog = () => {
  if (!allow()) {
    return;
  }
  store.showWalletQrCode(true);
}

watch(allow, (val) => {
  if (val) {
    loadAccountBalance();
  } else {
    balance.value = '-';
  }
});


onMounted(() => {
  $bus.on(AppEvent.RefreshBalance, loadAccountBalance);
  loadAccountBalance();
});

onUnmounted(() => {
  $bus.off(AppEvent.RefreshBalance, loadAccountBalance);
});
</script>

<template>
  <div class="row flex-end auto account-balance">
    <div class="row gap-24 auto">
      <div class="row auto gap-4">
        <Image :chain="store.chainId" :width="24" :height="24" :disabled="true"></Image>
        <div class="balance-text">{{ formatAmountValue(balance, 6, '', true) }}&nbsp;&nbsp;{{
            nativeToken(store.chainId)
          }}
        </div>
      </div>
      <div class="row auto flex-start gap-4">
        <Image :chain="store.chainId" :width="24" :height="24" :disabled="true"></Image>
        <TokenAddress :address="store.walletAddress"
                      :chain-id="store.chainId"
                      address-type="wallet"
                      :copyable="true"
                      :show-icon="false"
                      :address-highlight="true"
                      :button="true"
                      @click="openWalletDialog"

        ></TokenAddress>
      </div>
    </div>
    <div class="deposit-button" @click="openQRCodeDialog">{{ $t("ActionTitle002") }}</div>
  </div>

</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.account-balance {
  gap: 48px !important;
  height: 36px;
}

.balance-text {
  @include box($width: auto);
  @include font(16px, 600);
  color: $textColor1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.deposit-button {
  @include box($width: 101px, $height: 36px);
  color: $textColor1;
  background-color: $blue1;
  border-radius: 2px;
  cursor: pointer;
}

</style>
