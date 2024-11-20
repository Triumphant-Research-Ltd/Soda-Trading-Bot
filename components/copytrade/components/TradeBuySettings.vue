<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import Checkbox from "~/components/base/Checkbox.vue";
import BigNumber from "bignumber.js";
import {TaskBuySettings} from "~/models/TaskBuySettings";
import {SwitchState, TradeProperty} from "~/utils/constant";

interface TradeBuySettingsProps {
  buySettings: TaskBuySettings
  errorType: TradeProperty,
  errorText: string
}

const emit = defineEmits(['change']);
const props = defineProps<TradeBuySettingsProps>();
const store = useAppStore();
const buyRate = ref<string>('');
const sellRate = ref<string>('');
const liquidity = ref<string>('');
const buySlippage = ref<string>('');
const buyLimitMin = ref<string>('');
const buyLimitMax = ref<string>('');
const buyLimitMinValue = ref<string>('');
const buyLimitMaxValue = ref<string>('');

const buyRateError = ref<string>('');
const sellRateError = ref<string>('');
const liquidityError = ref<string>('');
const buySlippageError = ref<string>('');
const buyLimitMinError = ref<string>('');
const buyLimitMaxError = ref<string>('');

const highSpeedBuy = ref<SwitchState>(SwitchState.off);
const buyTxProtect = ref<SwitchState>(SwitchState.off);
const clearError = () => {
  buyRateError.value = '';
  sellRateError.value = '';
  liquidityError.value = '';
  buySlippageError.value = '';
  buyLimitMinError.value = '';
  buyLimitMaxError.value = '';
}
const showError = (prop: TradeProperty, val: string) => {
  switch (prop) {
    case TradeProperty.buyRate:
      buyRateError.value = val;
      break;
    case TradeProperty.sellRate:
      sellRateError.value = val;
      break;
    case TradeProperty.liquidity:
      liquidityError.value = val;
      break;
    case TradeProperty.buySlippage:
      buySlippageError.value = val;
      break;
    case TradeProperty.buyLimitMin:
      buyLimitMinError.value = val;
      break;
    case TradeProperty.buyLimitMax:
      buyLimitMaxError.value = val;
      break;
    default:
      clearError();

  }
}
const onBuyRateChange = (text: string) => {
  buyRate.value = text;
  buyRateError.value = "";
  emit('change', TradeProperty.buyRate, text);
}
const onSellRateChange = (text: string) => {
  sellRate.value = text;
  sellRateError.value = "";
  clearError();
  emit('change', TradeProperty.sellRate, text);
}
const onLiquidityChange = (text: string) => {
  liquidity.value = text;
  liquidityError.value = "";
  emit('change', TradeProperty.liquidity, text);
}
const onBuySlippageChange = (text: string) => {
  buySlippage.value = text;
  buySlippageError.value = "";
  emit('change', TradeProperty.buySlippage, text);
}
const updateBuyLimitMinValue = (text: string) => {
  let n1 = BigNumber(text);
  let n2 = BigNumber(store.nativeTokenPrice);
  let c = n1.multipliedBy(n2);
  if (c.isNaN()) {
    buyLimitMinValue.value = '';
  } else {
    buyLimitMinValue.value = '$' + c.toFixed(2);
  }
}
const onBuyLimitMinChange = (text: string) => {
  buyLimitMinError.value = "";
  buyLimitMin.value = text;
  updateBuyLimitMinValue(text);
  emit('change', TradeProperty.buyLimitMin, text);
}
const updateBuyLimitMaxValue = (text: string) => {
  let n1 = BigNumber(text);
  let n2 = BigNumber(store.nativeTokenPrice);
  let c = n1.multipliedBy(n2);
  if (c.isNaN()) {
    buyLimitMaxValue.value = '';
  } else {
    buyLimitMaxValue.value = '$' + c.toFixed(2);
  }
}
const onBuyLimitMaxChange = (text: string) => {
  buyLimitMaxError.value = "";
  buyLimitMax.value = text;
  updateBuyLimitMaxValue(text);
  emit('change', TradeProperty.buyLimitMax, text);
}
const onHighSpeedBuyChange = (state: SwitchState) => {
  highSpeedBuy.value = state;
  emit('change', TradeProperty.highSpeedBuy, state);
}
const onBuyTxProtectChange = (state: SwitchState) => {
  buyTxProtect.value = state;
  emit('change', TradeProperty.buyTxProtect, state);
}
const updateValue = (val: TaskBuySettings | undefined) => {
  if (val == undefined) {
    return;
  }
  buyRate.value = val.buyRate;
  sellRate.value = val.sellRate;
  liquidity.value = val.liquidity;
  buySlippage.value = val.buySlippage;
  buyLimitMin.value = val.buyLimitMin;
  updateBuyLimitMinValue(val.buyLimitMin);
  updateBuyLimitMaxValue(val.buyLimitMax);
  highSpeedBuy.value = val.highSpeedBuy == "1" ? SwitchState.on : SwitchState.off;
  buyTxProtect.value = val.buyTxProtect == "1" ? SwitchState.on : SwitchState.off;
}
watch(() => props.errorType, (val) => {
  showError(val, props.errorText);
})
watch(() => props.buySettings, (val) => {
  updateValue(val);
}, {deep: true})
</script>

<template>
  <div class="trade-buy-style">
    <div class="row gap-8 flex-start">
      <Image icon="icon-buy-settings" :width="28" :height="28"></Image>
      <span class="title">{{ $t('Name097') }}</span>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Name098') }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="buyRate"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Trade042')"
               :prefix-tip="$t('TaskTooltip008')"
               suffix="%"
               text-align="right"
               :error="buyRateError"
               @change="onBuyRateChange"
        ></Input>
        <Input class="input-field"
               :text="sellRate"
               type="text"
               :width="215"
               :height="40"
               :prefix-tip="$t('TaskTooltip009')"
               :prefix="$t('Trade052')"
               suffix="%"
               text-align="right"
               :error="sellRateError"
               @change="onSellRateChange"
        ></Input>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Name099') }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="liquidity"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name073')"
               :prefix-tip="$t('TaskTooltip010')"
               suffix="USD"
               text-align="right"
               :error="liquidityError"
               @change="onLiquidityChange"
        ></Input>
        <div class="blank">
          <Image icon="icon-info" :tooltip="$t('TaskTooltip010')"></Image>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head col">
        <span class="row-head-title">{{ $t("Name100") }}</span>
        <div class="usd" v-if="buyLimitMaxValue || buyLimitMinValue"></div>
      </div>
      <div class="row-tail stretch">
        <div class="column gap-8 flex-start" style="height: 100%">
          <Input class="input-field"
                 :text="buyLimitMin"
                 type="text"
                 :width="215"
                 :height="40"
                 placeholder=""
                 :prefix="$t('Name102')"
                 :prefix-tip="$t('TaskTooltip021')"
                 text-align="right"
                 :error="buyLimitMinError"
                 :suffix="nativeToken(store.chainId)"
                 @change="onBuyLimitMinChange"
          ></Input>
          <div class="row flex-start" v-if="buyLimitMinValue">
            <span class="usd large-width">≈{{ buyLimitMinValue }}</span>
          </div>
        </div>
        <div class="column gap-8 flex-start" style="height: 100%">
          <Input class="input-field"
                 :text="buyLimitMax"
                 type="text"
                 :width="215"
                 :height="40"
                 :prefix="$t('Name103')"
                 text-align="right"
                 :error="buyLimitMaxError"
                 :suffix="nativeToken(store.chainId)"
                 @change="onBuyLimitMaxChange"
          ></Input>
          <div class="row flex-start" v-if="buyLimitMaxValue">
            <span class="usd large-width">≈{{ buyLimitMaxValue }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t('Name101') }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="buySlippage"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name104')"
               :prefix-tip="$t('TaskTooltip011')"
               suffix="%"
               text-align="right"
               :error="buySlippageError"
               @change="onBuySlippageChange"
        ></Input>
        <div class="blank">
          <div class="row gap-4">
            <div class="row flex-start">
              <Checkbox :state="highSpeedBuy" :text="$t('Trade045')" :tooltip="$t('TaskTooltip015')"
                        @change="onHighSpeedBuyChange"></Checkbox>
            </div>
            <div class="row flex-start">
              <Checkbox :state="buyTxProtect" :text="$t('Trade046')" :tooltip="$t('TaskTooltip022')"
                        @change="onBuyTxProtectChange"></Checkbox>
            </div>
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

.trade-buy-style {
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
    @include box($align: flex-start);
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
