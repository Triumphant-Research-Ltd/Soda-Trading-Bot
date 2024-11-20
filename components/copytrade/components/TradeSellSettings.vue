<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import type {TaskSellSettings} from "~/models/TaskSellSettings";

interface TradeSellSettingsProps {
  sellSettings: TaskSellSettings
  errorType: TradeProperty
  errorText: string
}

const emit = defineEmits(['change']);
const props = defineProps<TradeSellSettingsProps>();
const store = useAppStore();
const winRate = ref<string>('');
const winOffset = ref<string>('');
const winRate2 = ref<string>('');
const winOffset2 = ref<string>('');
const winRate3 = ref<string>('');
const winOffset3 = ref<string>('');
const lossRate = ref<string>('');
const lossOffset = ref<string>('');

const winRateError = ref<string>('');
const winOffsetError = ref<string>('');
const winRate2Error = ref<string>('');
const winOffset2Error = ref<string>('');
const winRate3Error = ref<string>('');
const winOffset3Error = ref<string>('');
const lossRateError = ref<string>('');
const lossOffsetError = ref<string>('');

const clearError = () => {
  winRateError.value = "";
  winOffsetError.value = "";
  winRate2Error.value = "";
  winOffset2Error.value = "";
  winRate3Error.value = "";
  winOffset3Error.value = "";
  lossRateError.value = "";
  lossOffsetError.value = "";
}
const showError = (prop: TradeProperty, val: string) => {
  switch (prop) {
    case TradeProperty.sellWinRate:
      winRateError.value = val;
      break;
    case TradeProperty.sellWinExtent:
      winOffsetError.value = val;
      break;
    case TradeProperty.sellWinRate2:
      winRate2Error.value = val;
      break;
    case TradeProperty.sellWinExtent2:
      winOffset2Error.value = val;
      break;
    case TradeProperty.sellWinRate3:
      winRate3Error.value = val;
      break;
    case TradeProperty.sellWinExtent3:
      winOffset3Error.value = val;
      break;
    case TradeProperty.sellLossRate:
      lossRateError.value = val;
      break;
    case TradeProperty.sellLossExtent:
      lossOffsetError.value = val;
      break;
    default:
      clearError();
  }
}
const onWinRateChange = (text: string) => {
  winRate.value = text;
  winRateError.value = "";
  emit('change', TradeProperty.sellWinRate, text);
}
const onWinOffsetChange = (text: string) => {
  winOffset.value = text;
  winOffsetError.value = "";
  winOffset2Error.value = "";
  winOffset3Error.value = "";
  emit('change', TradeProperty.sellWinExtent, text);
}
const onWinRateChange2 = (text: string) => {
  winRate2.value = text;
  winRate2Error.value = "";
  emit('change', TradeProperty.sellWinRate2, text);
}
const onWinOffsetChange2 = (text: string) => {
  winOffset2.value = text;
  winOffsetError.value = "";
  winOffset2Error.value = "";
  winOffset3Error.value = "";
  emit('change', TradeProperty.sellWinExtent2, text);
}
const onWinRateChange3 = (text: string) => {
  winRate3.value = text;
  winRate3Error.value = "";
  emit('change', TradeProperty.sellWinRate3, text);
}
const onWinOffsetChange3 = (text: string) => {
  winOffset3.value = text;
  winOffsetError.value = "";
  winOffset2Error.value = "";
  winOffset3Error.value = "";
  emit('change', TradeProperty.sellWinExtent3, text);
}

const onLossRateChange = (text: string) => {
  lossRate.value = text;
  lossRateError.value = "";
  emit('change', TradeProperty.sellLossRate, text);
}
const onLossOffsetChange = (text: string) => {
  lossOffset.value = text;
  lossOffsetError.value = "";
  emit('change', TradeProperty.sellLossExtent, text);
}
const updateValue = (val: TaskSellSettings | undefined) => {
  if (val == undefined) {
    return;
  }
  winRate.value = val.sellWinRate;
  winOffset.value = val.sellWinExtent
  winRate2.value = val.sellWinRate2;
  winOffset2.value = val.sellWinExtent2;
  winRate3.value = val.sellWinRate3;
  winOffset3.value = val.sellWinExtent3;
  lossRate.value = val.sellLossRate;
  lossOffset.value = val.sellLossExtent;

}
watch(() => props.errorType, (val) => {
  showError(val, props.errorText);
})
watch(() => props.sellSettings, (val) => {
  updateValue(val);
})
onMounted(() => {
  updateValue(props.sellSettings);
})
</script>

<template>
  <div class="trade-sell-style">
    <div class="row gap-8 flex-start">
      <Image icon="icon-buy-settings" :width="28" :height="28"></Image>
      <span class="title">{{ $t("Trade033") }}</span>
      <Image icon="icon-info" :tooltip="$t('TaskTooltip023')"></Image>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t("Name089") }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="winRate"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name093')"
               :prefix-tip="$t('TaskTooltip012')"
               suffix="%"
               text-align="right"
               :error="winRateError"
               @change="onWinRateChange"
        ></Input>
        <Input class="input-field"
               :text="winOffset"
               type="text"
               :width="215"
               :height="40"
               :prefix="$t('Name094')"
               suffix="%"
               text-align="right"
               :error="winOffsetError"
               @change="onWinOffsetChange"
        ></Input>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t("Name090") }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="winRate2"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name093')"
               :prefix-tip="$t('TaskTooltip012')"
               suffix="%"
               text-align="right"
               :error="winRate2Error"
               @change="onWinRateChange2"
        ></Input>
        <Input class="input-field"
               :text="winOffset2"
               type="text"
               :width="215"
               :height="40"
               :prefix="$t('Name094')"
               suffix="%"
               text-align="right"
               :error="winOffset2Error"
               @change="onWinOffsetChange2"
        ></Input>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t("Name091") }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="winRate3"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name093')"
               :prefix-tip="$t('TaskTooltip012')"
               suffix="%"
               text-align="right"
               :error="winRate3Error"
               @change="onWinRateChange3"
        ></Input>
        <Input class="input-field"
               :text="winOffset3"
               type="text"
               :width="215"
               :height="40"
               :prefix="$t('Name094')"
               suffix="%"
               text-align="right"
               :error="winOffset3Error"
               @change="onWinOffsetChange3"
        ></Input>
      </div>
    </div>
    <div class="row gap-24 flex-start">
      <div class="row-head">{{ $t("Name092") }}</div>
      <div class="row-tail">
        <Input class="input-field"
               :text="lossRate"
               type="text"
               :width="215"
               :height="40"
               placeholder=""
               :prefix="$t('Name095')"
               :prefix-tip="$t('TaskTooltip013')"
               suffix="%"
               text-align="right"
               :error="lossRateError"
               @change="onLossRateChange"
        ></Input>
        <Input class="input-field"
               :text="lossOffset"
               type="text"
               :width="215"
               :height="40"
               :prefix="$t('Name094')"
               suffix="%"
               text-align="right"
               :error="lossOffsetError"
               @change="onLossOffsetChange"
        ></Input>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-sell-style {
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
