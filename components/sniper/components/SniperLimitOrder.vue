<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {useAppStore} from "~/stores/appstore";
import BigNumber from "bignumber.js";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {formatNumber} from "~/utils/util";

interface SniperLimitOrderProps {
  address: string
  symbol: string
  amount: string
  baseAmount: string
  loading: boolean
  price: string
  time: number
  errorType: TradeProperty
  errorText: string
}

const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const props = defineProps<SniperLimitOrderProps>();
const emit = defineEmits(['change', 'timeChange']);
const limitAmount = ref<string>(props.balance);
const usd = ref<string>('');
const loading = ref<boolean>(false);
const time = ref<number>(props.time);
const marketPercent = ref<number>(-1);
const marketText = ref<string>('');
const marketTextColor = ref<Array<string>>(['green']);
const limitPriceError = ref('');

const computeUsd = (amount: string) => {
  let n = BigNumber(amount);
  let price = BigNumber(store.nativeTokenPrice);
  let total = n.multipliedBy(price);
  if (total.isNaN()) {
    return '';
  } else {
    return formatNumber(total.toString(), '$', 8, true);
  }
}

const onAmountChange = (text: string) => {
  limitAmount.value = text;
  usd.value = computeUsd(text);
  updateMarketString(text, false);
  marketPercent.value = -1;
  limitPriceError.value = "";
  emit('change', text);
}
const onTimeChange = (ts: number) => {
  time.value = ts;
  emit('timeChange', ts)
}

const timeClass = (ts: number) => {
  return {
    "time-button": true,
    'selected': time.value == ts
  }
}

const marketPercentClass = (p: number) => {
  return {
    'time-button': true,
    'selected': p == marketPercent.value
  }
}
const updateMarketString = (text: string, percent: boolean) => {

  let n1 = BigNumber(text);
  let flag: string = "";
  if (percent) {
    if (n1.isPositive()) {
      flag = "+"
      marketTextColor.value = ['green'];
    } else {
      flag = "";
      marketTextColor.value = ['red'];
    }
    marketText.value = t('Sniper008', {value: flag + text + '%'});
  } else {
    let n2 = BigNumber(props.baseAmount);
    let c = n1.div(n2);
    if (c.isNaN()) {
      marketText.value = '';
    } else {
      c = c.minus(1);
      if (c.isPositive()) {
        flag = "+";
      }
      let value = c.multipliedBy(100).toFixed(2) + '%'
      marketText.value = t('Sniper008', {value: flag + value});
    }
    if (c.isPositive()) {
      marketTextColor.value = ['green'];
    } else {
      marketTextColor.value = ['red'];
    }
  }


}
const selectPercent = (percent: number) => {
  marketPercent.value = percent;
  let n = BigNumber(100 + percent);
  let n2 = BigNumber(props.baseAmount);
  let c = n.div(100).multipliedBy(n2)
  if (c.isNaN()) {
    limitAmount.value = '';
    usd.value = '-';
  } else {
    let v = c.toFixed();
    limitAmount.value = v
    usd.value = computeUsd(v);
  }
  updateMarketString(percent.toString(), true);
  emit('change', limitAmount.value);
}

watch(() => props.time, (val) => {
  time.value = val;
});

watch(() => props.loading, (val) => {
  loading.value = val;
});

watch(() => props.amount, (val) => {
  limitAmount.value = val;
  usd.value = computeUsd(val);
});

watch(() => props.errorType, (val) => {
  if (val == TradeProperty.limitOrderAmount) {
    limitPriceError.value = props.errorText;
  } else {
    limitPriceError.value = "";
  }
})
</script>

<template>
  <div class="sniper-limit-price">
    <div class="sniper-limit-price-card">
      <div class="row flex-start gap-8">
        <Image icon="icon-sniper-settings"></Image>
        <span class="title-text">{{ $t("Name039") }}</span>
      </div>
      <div class="title">
        <span>{{ $t("Sniper009") }}</span>
        <Image :token="props.address" :chain="store.chainId" :width="24" :height="24"></Image>
        <span>{{ props.symbol }}</span>
        <span>{{ $t("Sniper010") }}</span>
        <Image :chain="store.chainId" :width="24" :height="24"></Image>
        <span>{{ nativeToken(store.chainId) }}</span>
      </div>
      <div class="row flex-start" v-if="loading">
        <ItemLoading theme="white"></ItemLoading>
      </div>
      <div class="column" v-else>
        <div class="row flex-start gap-8">
          <Input :text="limitAmount"
                 class="input-field"
                 :height="40"
                 type="text"
                 :width="300"
                 placeholder="0"
                 variant="borderless"
                 :font-size="32"
                 :font-weight="500"
                 :error="limitPriceError"
                 @change="onAmountChange"/>
          <span :class="marketTextColor">{{ marketText }}</span>
        </div>
      </div>
      <div class="row flex-justify balance">
        <span>{{ usd }}</span>
      </div>
      <div class="row flex-justify">
        <div class="row auto gap-8">
          <div :class="marketPercentClass(-50)" @click="()=>selectPercent(-50)">-50%</div>
          <div :class="marketPercentClass(-20)" @click="()=>selectPercent(-20)">-20%</div>
          <div :class="marketPercentClass(-10)" @click="()=>selectPercent(-10)">-10%</div>
        </div>
        <div :class="marketPercentClass(0)" @click="()=>selectPercent(0)">{{ $t("Sniper011") }}</div>
        <div class="row auto gap-8">
          <div :class="marketPercentClass(50)" @click="()=>selectPercent(50)">+50%</div>
          <div :class="marketPercentClass(100)" @click="()=>selectPercent(100)">+100%</div>
          <div :class="marketPercentClass(200)" @click="()=>selectPercent(200)">+200%</div>
        </div>
      </div>
    </div>
    <div class="time-bar">
      <div class="time-title">{{ $t("Sniper012") }}</div>
      <div class="row flex-end gap-8">
        <div :class="timeClass(0)" @click="()=>onTimeChange(0)">{{ $t("Name040", {value: 1}) }}</div>
        <div :class="timeClass(1)" @click="()=>onTimeChange(1)">{{ $t("Name041", {value: 1}) }}</div>
        <div :class="timeClass(2)" @click="()=>onTimeChange(2)">{{ $t("Name042", {value: 1}) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.sniper-limit-price {
  @include box($padding: 24px, $gap: 16px, $height: $cardHeight);
  flex-direction: column;
  border: $border1;
  width: 642px;
  min-height: 358px;
}

.sniper-limit-price-card {
  @include box($direction: column, $gap: 14px, $padding: 20px);
  background-color: $backgroundColor2;
  border-radius: 2px;
}

.input-field {
  padding: 0 !important;
}

.title {
  @include box($justify: flex-start, $gap: 4px);
  @include font(12px, 400);
  color: $red1;
}

.title-text {
  @include font(18px, 500);
  color: $textColor1;
}

.time-bar {
  @include box($justify: space-between, $padding: 16px 24px);
  background-color: $backgroundColor2;
  border-radius: 2px;
}

.time-title {
  @include box($justify: flex-start);
  color: $textColor1;
}

.balance {
  color: $textColor2;
}

.time-button {
  @include box($width: 60px, $height: 32px);
  color: $textColor1;
  background-color: $backgroundColor4;
  cursor: pointer;
  border-radius: 2px;

  &.selected {
    background-color: $blue1;
  }
}


.green {
  color: $green1;
}

.red {
  color: $red1;
}
</style>
