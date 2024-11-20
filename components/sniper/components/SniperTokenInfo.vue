<script setup lang="ts">
import {SwitchState} from "~/utils/constant";
import SniperInfoBar from "~/components/sniper/components/SniperInfoBar.vue";

import TokenAddress from "~/components/base/TokenAddress.vue";
import type {Token} from "~/models/Token";

interface SniperTokenInfoProps {
  text: string
  buyTxProtect: SwitchState
  advanceSettings: SwitchState
  customSell: SwitchState
  limitPrice: SwitchState
  token: Token
}

const emit = defineEmits(['change', 'buyTxProtectChange']);
const props = defineProps<SniperTokenInfoProps>();
const store = useAppStore();
const advanceSettings = ref<SwitchState>(props.advanceSettings)
const customSell = ref<SwitchState>(props.customSell);
const limitPrice = ref<SwitchState>(props.limitPrice);
const buyTxProtect = ref<SwitchState>(props.buyTxProtect);
const onChange = (type: number, state: SwitchState) => {
  emit('change', type, state);
}
const onBuyTxProtectChange = (state: SwitchState) => {
  buyTxProtect.value = state;
  emit('buyTxProtectChange', state);
}
watch(() => props.limitPrice, (val) => {
  limitPrice.value = val;
});
watch(() => props.advanceSettings, (val) => {
  advanceSettings.value = val;
});
watch(() => props.customSell, (val) => {
  customSell.value = val;
})
watch(() => props.buyTxProtect, (val) => {
  buyTxProtect.value = val;
})
onMounted(() => {
  limitPrice.value = props.limitPrice;
  advanceSettings.value = props.advanceSettings;
  customSell.value = props.customSell;
})
</script>

<template>
  <div class="sniper-pair-info">
    <SniperInfoBar :text="props.text"
                   :buyTxProtect="buyTxProtect"
                   :advance-settings="advanceSettings"
                   :limit-price="limitPrice"
                   :custom-sell="customSell"
                   @buy-tx-protect-change="onBuyTxProtectChange"
                   @change="onChange"
    ></SniperInfoBar>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name015") }}</div>
      <div class="row-tail">
        <TokenAddress :address="props.token.tokenAddress" :chain-id="store.chainId" :copyable="true"
                      :linkable="true"></TokenAddress>
      </div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name032") }}</div>
      <div class="row-tail">{{ props.token.tokenName }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name033") }}</div>
      <div class="row-tail">{{ props.token.tokenSymbol }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name034") }}</div>
      <div class="row-tail">{{ props.token.tokenDecimals }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.sniper-pair-info {
  @include box($justify: flex-start, $padding: 24px, $gap: 24px, $height: 50%, $direction: column);
  flex-direction: column;
  border: $border1;
  max-width: 642px;
  min-height: 358px;
}

.row-head {
  @include box($width: 100px, $justify: flex-start);
  color: $textColor2;
}

.row-tail {
  @include box($width: auto, $justify: flex-start);
  color: $textColor1;
  flex: 1;
}

</style>
