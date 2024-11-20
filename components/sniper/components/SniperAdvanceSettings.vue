<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {TradeProperty} from "~/utils/constant";
import {SniperTaskGasSettings} from "~/models/SniperTaskGasSettings";

interface TradeGasSettingsProps {
  title: string
  errorType: TradeProperty
  errorText: string
  gas: SniperTaskGasSettings
}

const emit = defineEmits(['change']);
const store = useAppStore();
const props = defineProps<TradeGasSettingsProps>();
const gasPriceLimit = ref<string>('');
const gasLimit = ref<string>('');
const gasOverflow = ref<string>('');
const slippage = ref<string>('');

const gasPriceLimitError = ref<string>('');
const gasLimitError = ref<string>('');
const gasOverflowError = ref<string>('');
const slippageError = ref<string>('');


const onGasPriceLimitChange = (text: string) => {
  gasPriceLimit.value = text;
  gasPriceLimitError.value = "";
  emit('change', TradeProperty.gasPriceLimit, text);
}
const onGasLimitChange = (text: string) => {
  gasLimit.value = text;
  gasLimitError.value = "";
  emit('change', TradeProperty.gasLimit, text);
}
const onGasOverflowChange = (text: string) => {
  gasOverflow.value = text;
  gasOverflowError.value = "";
  emit('change', TradeProperty.gasOverflow, text);
}
const onSlippageChange = (text: string) => {
  slippage.value = text;
  slippageError.value = "";
  emit('change', TradeProperty.gasSlippage, text);
}
const showError = (prop: TradeProperty) => {
  if (prop == TradeProperty.slippage) {
    slippageError.value = props.errorText;
  } else if (prop == TradeProperty.gasLimit) {
    gasLimitError.value = props.errorText;
  } else if (prop == TradeProperty.gasPriceLimit) {
    gasPriceLimitError.value = props.errorText;
  } else if (prop == TradeProperty.gasOverflow) {
    gasOverflowError.value = props.errorText;
  }
}
watch(() => props.errorType, (val) => {
  showError(val);
})
watch(() => props.gas, (val) => {
  gasPriceLimit.value = val.gasPriceLimit
  gasLimit.value = val.gasLimit;
  gasOverflow.value = val.gasOverflow;
  slippage.value = val.slippage;
}, {deep: true})
onMounted(() => {
  if (props.gas) {
    gasPriceLimit.value = props.gas.gasPriceLimit
    gasLimit.value = props.gas.gasLimit;
    gasOverflow.value = props.gas.gasOverflow;
    slippage.value = props.gas.slippage;
  }

})
</script>

<template>
  <div class="trade-advance-settings">
    <div class="row gap-8 flex-start">
      <Image icon="icon-gas-settings" :width="28" :height="28"></Image>
      <span class="title">{{ props.title }}</span>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">Slippage</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="slippage"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               suffix="%"
               text-align="right"
               :error="slippageError"
               @change="onSlippageChange"
        ></Input>
        <div class="blank"></div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">Gas Price Limit</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="gasPriceLimit"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               suffix="Gwei"
               text-align="right"
               :error="gasPriceLimitError"
               @change="onGasPriceLimitChange"
        ></Input>
        <div class="blank">
          <Image icon="icon-info"
                 :tooltip="$t('TaskTooltip005', {value: defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasPriceLimit)})"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">Buy Gas Premium</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="gasOverflow"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               suffix="Gwei"
               text-align="right"
               :error="gasOverflowError"
               @change="onGasOverflowChange"
        ></Input>
        <div class="blank">
          <Image icon="icon-info"
                 :tooltip="$t('TaskTooltip006', {value: defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasOverflow)})"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">Gas Fee Limit</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="gasLimit"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               text-align="right"
               :error="gasLimitError"
               @change="onGasLimitChange"
        ></Input>
        <div class="blank">
          <Image icon="icon-info"
                 :tooltip="$t('TaskTooltip007', {value: defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasLimit)})"></Image>
        </div>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-advance-settings {
  @include box($justify: flex-start, $align: flex-start, $gap: 24px, $padding: 24px, $height: $cardHeight);
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

  &.col {
    flex-direction: column !important;
    height: 100%;
  }

  .row-head-title {
    @include box();
    flex-direction: column;
    height: 40px;
  }
}

.row-tail {
  @include box($justify: flex-start, $gap: 16px);
  flex: 1;

  &.stretch {
    align-items: stretch;
  }

}

.input-field {
  background-color: $backgroundColor3;
  border-radius: 2px;
}

.blank {
  @include box($justify: flex-start, $width: 215px, $height: 40px);
}

.usd {
  @include box($justify: flex-start);
  color: $textColor1;
  white-space: nowrap;
  overflow: hidden;
  word-break: manual;
  text-overflow: ellipsis;
  height: 24px;

  &.large-width {
    width: 215px !important;
  }
}
</style>
