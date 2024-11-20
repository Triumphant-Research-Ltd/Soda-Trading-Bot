<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {TaskGasSettings} from "~/models/TaskGasSettings";
import {TradeProperty} from "~/utils/constant";

interface TradeGasSettingsProps {
  title: string,
  gasSettings: TaskGasSettings,
  errorType: TradeProperty
  errorText: string
}

const emit = defineEmits(['change']);
const store = useAppStore();
const props = defineProps<TradeGasSettingsProps>();
const gasPriceLimit = ref<string>('');
const gasLimit = ref<string>('');
const gasOverflow = ref<string>('');
const sellGasOverflow = ref<string>('');

const gasPriceLimitError = ref<string>('');
const gasLimitError = ref<string>('');
const gasOverflowError = ref<string>('');
const sellGasOverflowError = ref<string>('');

const clearError = () => {
  gasPriceLimitError.value = "";
  gasLimitError.value = "";
  gasOverflowError.value = "";
  sellGasOverflowError.value = "";
}
const showError = (prop: TradeProperty, val: string) => {
  switch (prop) {
    case TradeProperty.gasPriceLimit:
      gasPriceLimitError.value = val;
      break;
    case TradeProperty.gasLimit:
      gasLimitError.value = val;
      break;
    case TradeProperty.gasOverflow:
      gasOverflowError.value = val;
      break;
    case TradeProperty.sellGasOverflow:
      sellGasOverflowError.value = val;
      break;
    default:
      clearError();
  }
}
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
const onSellGasOverflowChange = (text: string) => {
  sellGasOverflow.value = text;
  sellGasOverflowError.value = "";
  emit('change', TradeProperty.sellGasOverflow, text);
}
const updateValue = (val: TaskGasSettings | undefined) => {
  if (val == undefined) {
    return;
  }
  gasLimit.value = val.gasLimit;
  gasOverflow.value = val.gasOverflow;
  gasPriceLimit.value = val.gasPriceLimit;
  sellGasOverflow.value = val.sellGasOverflow;
}
watch(() => props.errorType, (val) => {
  showError(val, props.errorText);
})
watch(() => props.gasSettings, (val) => {
  updateValue(val);
}, {deep: true})

</script>

<template>
  <div class="trade-gas-style">
    <div class="row gap-8 flex-start">
      <Image icon="icon-gas-settings" :width="28" :height="28"></Image>
      <span class="title">{{ props.title }}</span>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Trade062') }}</div>
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
          <Image icon="icon-info" :tooltip="$t('TaskTooltip005',{value: defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasPriceLimit)})"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Trade063') }}</div>
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
          <Image icon="icon-info" :tooltip="$t('TaskTooltip006',{value: defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasOverflow)})"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Trade064') }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="sellGasOverflow"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               suffix="Gwei"
               text-align="right"
               :error="sellGasOverflowError"
               @change="onSellGasOverflowChange"
        ></Input>
<div class="blank">
          <Image icon="icon-info" :tooltip="$t('TaskTooltip006',{value: defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellGasOverflow)})"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Trade061') }}</div>
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
          <Image icon="icon-info" :tooltip="$t('TaskTooltip007',{value: defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasLimit)})"></Image>
        </div>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-gas-style {
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
