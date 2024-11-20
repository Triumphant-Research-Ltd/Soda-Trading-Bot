<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {TradeProperty} from "~/utils/constant";
import {SniperTaskGasSettings} from "~/models/SniperTaskGasSettings";
import BigNumber from "bignumber.js";

interface TradeGasSettingsProps {
  title: string
  errorType: TradeProperty
  errorText: string,
  gas: SniperTaskGasSettings
}

const emit = defineEmits(['change']);
const store = useAppStore();
const props = defineProps<TradeGasSettingsProps>();
const priorityFee = ref<string>('');
const slippage = ref<string>('');
const priorityFeeError = ref('');
const slippageError = ref('');
const usdBalance = ref('');

const updateUsdBalance = () => {
  let price = BigNumber(store.nativeTokenPrice);
  if (!price.isFinite()) {
    usdBalance.value = "";
    return;
  }
  let n = BigNumber(priorityFee.value);
  if (n.isNaN()) {
    usdBalance.value = "";
    return;
  }
  let c = price.multipliedBy(n);
  if (!c.isFinite()) {
    usdBalance.value = "";
    return;
  }
  usdBalance.value = `≈$${c.toFixed(2)}`;
}

const onPriorityFeeChange = (text: string) => {
  priorityFee.value = text;
  priorityFeeError.value = "";
  updateUsdBalance();
  emit('change', TradeProperty.priorityFee, text);
}

const onSlippageChange = (text: string) => {
  slippage.value = text;
  slippageError.value = "";
  emit('change', TradeProperty.gasSlippage, text);
}
const showError = (prop: TradeProperty) => {
  if (prop == TradeProperty.priorityFee) {
    priorityFeeError.value = rops.errorText || '';
  } else if (prop == TradeProperty.slippage) {
    slippageError.value = rops.errorText
  }
}

watch(() => props.errorType, (val) => {
  showError(val);
})
watch(() => props.gas, (val) => {
  slippage.value = val.slippage
  priorityFee.value = val.priorityFee

}, {deep: true});
onMounted(() => {
  if (props.gas) {
    slippage.value = props.gas.slippage
    priorityFee.value = props.gas.priorityFee
    updateUsdBalance();
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
      <div class="row-head">{{ $t("Name104") }}</div>
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
      <div class="row-head">{{ $t("Name106") }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="priorityFee"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix-tip="$t('TaskTooltip024')"
               suffix="SOL"
               :error="priorityFeeError"
               text-align="right"
               @change="onPriorityFeeChange"
        ></Input>
        <div class="blank">
          <div class="row auto flex-start gap-16">
            <span class="defaultText">{{ usdBalance }}</span>
          </div>
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
