<script setup lang="ts">
import SniperInfoBar from "~/components/sniper/components/SniperInfoBar.vue";
import {SwitchState} from "~/utils/constant";
import TokenAddress from "~/components/base/TokenAddress.vue";
import {formatAmountValue, formatPercent} from "~/utils/util";
import type {Pair} from "~/models/Pair";

interface SniperPairInfoProps {
  text: string
  buyTxProtect: SwitchState
  advanceSettings: SwitchState
  customSell: SwitchState
  limitPrice: SwitchState
  pair: Pair,
}

const {t} = useI18n({useScope: 'global'});
const store = useAppStore();
const emit = defineEmits(['change', 'buyTxProtectChange']);
const props = defineProps<SniperPairInfoProps>();
const advanceSettings = ref<SwitchState>()
const customSell = ref<SwitchState>();
const limitPrice = ref<SwitchState>();
const buyTxProtect = ref<SwitchState>(props.buyTxProtect);

const onChange = (type: number, state: SwitchState) => {
  emit('change', type, state);
}
const onBuyTxProtectChange = (state: SwitchState) => {
  buyTxProtect.value = state;
  emit('buyTxProtectChange', state);
}
const honeypotColor = () => {
  if (props.pair.honeypot == "true") {
    return {'honeypot-red': true};
  } else if (props.pair.honeypot == "false") {
    return {'honeypot-green': true};
  } else {
    return {'honeypot-gray': true};
  }
}
const honeypot = () => {
  if (props.pair.honeypot == "true") {
    return t("Name031");
  } else if (props.pair.honeypot == "false") {
    return t("Sniper004");
  } else {
    return t("Sniper005");
  }
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
                   :buy-tx-protect="buyTxProtect"
                   :advance-settings="advanceSettings"
                   :limit-price="limitPrice"
                   :custom-sell="customSell"
                   @buy-tx-protect-change="onBuyTxProtectChange"
                   @change="onChange"
    ></SniperInfoBar>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name015") }}</div>
      <div class="row-tail">
        <TokenAddress :address="props.pair.address" :chain-id="store.chainId" :copyable="true"
                      :linkable="true"></TokenAddress>
      </div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name027") }}</div>
      <div class="row-tail">{{ props.pair.name }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name028") }}</div>
      <div class="row-tail">{{ formatAmountValue(props.pair.liquidity, 2, "$", true) }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name029") }}</div>
      <div class="row-tail">{{ formatPercent(props.pair.buyRate, false) }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name030") }}</div>
      <div class="row-tail">{{ formatPercent(props.pair.sellRate, false) }}</div>
    </div>
    <div class="row flex-start gap-24">
      <div class="row-head">{{ $t("Name031") }}</div>
      <div class="row-tail">
        <span :class="honeypotColor()">{{ honeypot() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.sniper-pair-info {
  @include box($justify: flex-start, $padding: 24px, $gap: 24px, $height: 50%, $direction: column);
  border: $border1;
  width: 642px;
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

.honeypot-red {
  color: $red1;
}

.honeypot-green {
  color: $green1;
}

.honeypot-gray {
  color: $textColor2;
}
</style>
