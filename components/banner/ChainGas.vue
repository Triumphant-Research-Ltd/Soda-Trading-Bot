<template>
  <div class="chain-gas">
    <div class="title">{{ nativeToken(store.chainId) }}:</div>
    <div class="value" @click="openPriceLink()">{{ priceValue() }}</div>
    <div class="title" v-if="isEvm()">{{ store.chainId == "solana" ? "MC" : "Gas" }}:</div>
    <div class="value" @click="openGasLink()"  v-if="isEvm()">{{ gasValue() }}{{ store.chainId == "solana" ? "" : "Gwei" }}</div>
  </div>
</template>
<script setup lang="ts">
import {formatAmountValue, gasLink, nativeToken, priceLink} from "@/utils/util";
import BigNumber from "bignumber.js";
import type {Result} from "~/models/Result";

const {$api, $bus} = useNuxtApp();
const store = useAppStore();
const price = ref<string>("-");
const gas = ref<string>("-");
const timer = ref<number>(0);
const isEvm=()=>{
  return store.chainId!='solana'
}
const gasValue = () => {
  let value: string = "-";
  let n = BigNumber(gas.value);
  if (n.isNaN()) {
    return "-"
  } else if (n.lt(1)) {
    let places = 2;
    if (store.chainId == "0x2105") {
      places = 3;
    }
    value = n.toFixed(places);
  } else {
    if (store.chainId == "solana") {
      value = formatNumber(n.toString(), "$", 2, false)
    } else {
      value = n.integerValue(BigNumber.ROUND_DOWN).toString(10)
    }

  }
  return value;
}
const priceValue = () => formatAmountValue(price.value, 2, "$", true);


const updateGas = (result: Result) => {
  let data = result.data;
  if (data) {
    price.value = data.gasPrice || "";
    gas.value = data.gasOracle || "";
    store.updateNativeTokenPrice(price.value);
  }

}
const loadGas = async () => {
  try {
    let result: Result = await $api.chainGas(store.chainId);
    updateGas(result);
  } catch (e) {

  }

}
const openGasLink = () => {
  let url = gasLink(store.chainId)
  window.open(url, "_blank");
}

const openPriceLink = () => {
  let url = priceLink(store.chainId);
  window.open(url, "_blank");
}

const onChainChange = () => {
  loadGas();
}
onMounted(() => {
  $bus.on(AppEvent.RefreshBalance, onChainChange)
  $bus.on(AppEvent.ChainChange, onChainChange)
  setTimeout(() => {
    loadGas();
  }, 500);

  timer.value = window.setInterval(() => {
    loadGas();
  }, 40000);
})
onUnmounted(() => {
  $bus.off(AppEvent.RefreshBalance, onChainChange)
  $bus.off(AppEvent.ChainChange, onChainChange)
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>
<style scoped lang="scss">
@use "assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.chain-gas {
  @include box($width: auto, $gap: 8px);

  .sep {
    min-width: 20px;
  }

  .title {
    color: $textColor1;
  }

  .value {
    color: $orange1;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
