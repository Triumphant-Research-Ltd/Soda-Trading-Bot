<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Radio from "~/components/base/Radio.vue";
import Input from "~/components/base/Input.vue";
import Checkbox from "~/components/base/Checkbox.vue";
import {TaskStyleSettings} from "~/models/TaskStyleSettings";
import {SwitchState, TradeProperty} from "~/utils/constant";

interface TradeStyleProps {
  taskStyle: TaskStyleSettings,
  errorType: TradeProperty,
  errorText: string
}

const emit = defineEmits(['change']);
const props = defineProps<TradeStyleProps>();
const store = useAppStore();
const autoBuy = ref<SwitchState>(SwitchState.off);
const secureBuy = ref<SwitchState>(SwitchState.off);
const autoSellMode = ref<SwitchState>(SwitchState.off);
const customSellMode = ref<SwitchState>(SwitchState.off);
const allSellMode = ref<SwitchState>(SwitchState.off);
const sellRationFollow = ref<SwitchState>(SwitchState.off);
const followAmount = ref<SwitchState>(SwitchState.off);
const duplicateBuyLimit = ref<SwitchState>(SwitchState.off);
const buyFreqLimitHour = ref<SwitchState>(SwitchState.off);
const buyLimit = ref<string>('');
const buyLimitError = ref('');

const autoBuyChange = (state: SwitchState) => {
  autoBuy.value = state;
  if (state === SwitchState.on) {
    secureBuy.value = SwitchState.off;
  } else {
    secureBuy.value = SwitchState.on;
  }
  emit('change', TradeProperty.buyMode, state);
}
const secureBuyChange = (state: SwitchState) => {
  secureBuy.value = state;
  if (state === SwitchState.on) {
    autoBuy.value = SwitchState.off;
  } else {
    autoBuy.value = SwitchState.on;
  }
  emit('change', TradeProperty.secureBuyMode, state);
}
const autoSellModeChange = (state: SwitchState) => {
  autoSellMode.value = state;
  if (state === SwitchState.on) {
    customSellMode.value = SwitchState.off;
    allSellMode.value = SwitchState.off;
  }
  emit('change', TradeProperty.sellMode, state);
}
const sellRatioFollowChange = (state: SwitchState) => {
  sellRationFollow.value = state;
  emit('change', TradeProperty.sellRatioFollow, state);
}
const customSellModeChange = (state: SwitchState) => {
  customSellMode.value = state;
  if (state === SwitchState.on) {
    autoSellMode.value = SwitchState.off;
    allSellMode.value = SwitchState.off;
  }
  emit('change', TradeProperty.customSellMode, state);
}
const allSellModeChange = (state: SwitchState) => {

  allSellMode.value = state;
  if (state === SwitchState.on) {
    autoSellMode.value = SwitchState.on;
    customSellMode.value = SwitchState.on;
  } else {
    autoSellMode.value = SwitchState.on;
    customSellMode.value = SwitchState.off;
  }
  emit('change', TradeProperty.allSellMode, state);
}
const followAmountChange = (state: SwitchState) => {
  followAmount.value = state;
  emit('change', TradeProperty.followAmount, state);
}
const duplicateBuyLimitChange = (state: SwitchState) => {
  duplicateBuyLimit.value = state;
  emit('change', TradeProperty.duplicateBuyLimit, state);
}
const buyFreqLimitHourChange = (state: SwitchState) => {
  buyFreqLimitHour.value = state;
  emit('change', TradeProperty.buyFreqLimitHour, state);
}
const onBuyLimitChange = (text: string) => {
  buyLimit.value = text;
  emit('change', TradeProperty.buyLimit, text);
}
const updateValue = (val: TaskStyleSettings | undefined) => {
  if (val == undefined) {
    return;
  }
  autoBuy.value = val.buyMode == "1" ? SwitchState.on : SwitchState.off;
  secureBuy.value = val.buyMode == "0" ? SwitchState.on : SwitchState.off;
  autoSellMode.value = val.sellMode == "1" ? SwitchState.on : SwitchState.off;
  customSellMode.value = val.customSell == "1" ? SwitchState.on : SwitchState.off;
  allSellMode.value = val.customSell == "1" && val.sellMode == "1" ? SwitchState.on : SwitchState.off;
  buyLimit.value = val.buyLimit;
  followAmount.value = val.followAmount == "1" ? SwitchState.on : SwitchState.off;
  duplicateBuyLimit.value = val.duplicateBuyLimit == "1" ? SwitchState.on : SwitchState.off;
  buyFreqLimitHour.value = val.buyFreqLimitHour == "1" ? SwitchState.on : SwitchState.off;
  sellRationFollow.value = val.sellRatioFollow == "1" ? SwitchState.on : SwitchState.off;
}
const updateError = (val: TradeProperty) => {
  if (val == TradeProperty.buyLimit) {
    buyLimitError.value = props.errorText;
  } else {
    buyLimitError.value = '';
  }
}
watch(() => props.taskStyle, (val: TaskStyleSettings) => {
  updateValue(val);
}, {deep: true});


watch(() => props.errorType, (val) => {
  updateError(val);
})

</script>

<template>
  <div class="trade-style">
    <div class="row gap-8 flex-start">
      <Image icon="icon-trade-style" :width="28" :height="28"></Image>
      <span class="title">{{ $t("Name096") }}</span>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Sniper003') }}</div>
      <div class="row-tail">
        <Radio :state="autoBuy" :text="$t('Trade038')" :tooltip="$t('TaskTooltip001')" @change="autoBuyChange"></Radio>
        <Radio :state="secureBuy" :text="$t('Trade039')" :tooltip="$t('TaskTooltip002')"
               @change="secureBuyChange"></Radio>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head red">{{ $t("Name038") }}*</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="buyLimit"
               type="text"
               :width="215"
               :height="40"
               :error="buyLimitError"
               text-align="right"
               placeholder=""
               @change="onBuyLimitChange"
               :suffix="nativeToken(store.chainId)"></Input>
        <Checkbox :state="followAmount" :text="$t('Trade047')" :tooltip="$t('TaskTooltip017')"
                  @change="followAmountChange"></Checkbox>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head"></div>
      <div class="row-tail">
        <Checkbox :state="duplicateBuyLimit" :text="$t('Trade048')" :tooltip="$t('TaskTooltip018')"
                  @change="duplicateBuyLimitChange"></Checkbox>
        <Checkbox :state="buyFreqLimitHour" :text="$t('Trade049')" :tooltip="$t('TaskTooltip019')"
                  @change="buyFreqLimitHourChange"></Checkbox>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Name105') }}</div>
      <div class="row-tail">
        <div class="column align-items-left gap-16">
          <div class="row flex-start gap-16">
            <Radio :state="autoSellMode" :text="$t('Trade040')" :tooltip="$t('TaskTooltip003')"
                   @change="autoSellModeChange"></Radio>
            <Radio :state="customSellMode" :text="$t('Trade041')" :tooltip="$t('TaskTooltip004')"
                   @change="customSellModeChange"></Radio>
            <Checkbox :state="allSellMode" :text="$t('Trade087')" :tooltip="$t('TaskTooltip016')"
                      @change="allSellModeChange"></Checkbox>
          </div>
<!--          <div class="row flex-start gap-16">-->
<!--            <Checkbox :state="sellRationFollow" :text="$t('Trade091')" :tooltip="$t('TaskTooltip025')"-->
<!--                      @change="sellRatioFollowChange"></Checkbox>-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-style {
  @include box($justify: stretch, $align: flex-start, $gap: 24px, $padding: 24px, $height: $cardHeight);
  width: 642px;
  flex-direction: column;
  border: $border1;
  border-radius: 2px;
}

.title {
  @include font($fontSize: 18px, $fontWeight: 500);
  color: $textColor1;
}

.row-head {
  @include box($justify: flex-start, $gap: 8px, $width: 130px, $height: 40px);
  color: $textColor1;

  &.red {
    color: $red1;
  }
}

.row-tail {
  @include box($justify: flex-start, $gap: 16px);
  flex: 1;
}

.input-field {
  background-color: $backgroundColor3;
  border-radius: 2px;
}
</style>
