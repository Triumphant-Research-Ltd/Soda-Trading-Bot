<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {useAppStore} from "~/stores/appstore";
import BigNumber from "bignumber.js";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {formatAmountValue, formatNumber, isPositiveNumber} from "~/utils/util";

interface SniperAmountProps {
  title: string
  address: string
  symbol: string
  amount: string
  loading: boolean
  accountBalance: string
  buyLimit: string
  price: string
  errorText: string
  errorType: TradeProperty
}

const store = useAppStore();
const props = defineProps<SniperAmountProps>();
const emit = defineEmits(['select', 'balanceChange']);
const balance = ref<string>(props.buyLimit);
const usd = ref<string>('');
const accountBalance = ref<string>(props.accountBalance);
const loading = ref<boolean>(false);
const titleText = ref(props.title);
const balanceError = ref('');
const tokenBalance = () => {
  if (isPositiveNumber(props.price)) {
    return props.price;
  }
  return store.nativeTokenPrice;
}

const computeUsd2 = (amount: string) => {
  let n = BigNumber(amount);
  let price = BigNumber(store.nativeTokenPrice);
  let total = n.multipliedBy(price);
  if (total.isNaN()) {
    return '';
  } else {
    return formatNumber(total.toString(), '$', 8, true);
  }
}
const computeUsd = (amount: string) => {
  let n = BigNumber(amount);
  let price = BigNumber(tokenBalance());
  let total = n.multipliedBy(price);
  if (total.isNaN()) {
    return '';
  } else {
    return formatNumber(total.toString(), '$', 8, true);
  }
}
const onMax = () => {
  balance.value = accountBalance.value;
  usd.value = computeUsd2(accountBalance.value);
  balanceError.value = "";
  emit('balanceChange', accountBalance.value);
}
const onAmountChange = (text: string) => {
  balance.value = text;
  usd.value = computeUsd2(text);
  balanceError.value = "";
  emit('balanceChange', text);

}
const selectToken = () => {
  emit('select');
}
watch(() => props.loading, (val) => {
  loading.value = val;
});
watch(() => props.buyLimit, (val) => {
  balance.value = val;
  usd.value = computeUsd2(val);
})
watch(() => props.title, (val) => {
  titleText.value = val;
})
watch(() => props.errorType, (val) => {
  if (val == TradeProperty.buyLimit) {
    balanceError.value = props.errorText
  }
})
watch(() => props.accountBalance, (val) => {
  accountBalance.value = val;
})
</script>

<template>
  <div class="sniper-amount">
    <div class="sniper-amount-card">
      <div class="title">{{ $t("Name044") }}*:</div>
      <div class="row flex-justify">
        <Input :text="balance"
               class="input-field"
               :height="40"
               type="text"
               :width="300"
               placeholder="0"
               variant="borderless"
               :font-size="32"
               :font-weight="500"
               :error="balanceError"
               @change="onAmountChange"/>
        <div class="sniper-amount-button">
          <Image :chain="store.chainId" :width="28" :height="28" :disabled="true"></Image>
          <span>{{ nativeToken(store.chainId) }}</span>
        </div>
      </div>
      <div class="row flex-justify balance">
        <span>{{ usd }}</span>
        <div class="row auto gap-4">
          <span>{{ $t("Name043") }}:</span>
          <span v-if="isPositiveNumber(accountBalance)">{{ formatAmountValue(accountBalance, 6, '', true) }}</span>
          <span v-else>-</span>
          <div class="max-button" @click="onMax">Max</div>
        </div>
      </div>
    </div>
    <div class="sniper-amount-sep">
      <div class="box">
        <Image icon="icon-sniper-arrow-down" :disabled="true"></Image>
      </div>
    </div>
    <div class="sniper-amount-card">
      <div class="title">{{ titleText }}</div>
      <div class="row flex-justify">
        <div class="amount-value">{{ props.amount }}</div>
        <div class="sniper-amount-button" @click="selectToken">
          <div class="row gap-4" v-if="loading">
            <ItemLoading theme="white"></ItemLoading>
          </div>
          <div class="row" v-else-if="!isAddress(props.address)">
            <span>{{ $t("Sniper013") }}</span>
          </div>
          <div class="row gap-4 flex-start" v-else>
            <Image :chain="store.chainId" :token="address" :width="28" :height="28" :disabled="true"></Image>
            <span>{{ props.symbol }}</span>
          </div>
        </div>
      </div>
      <div class="row flex-start balance">
        <span>{{ computeUsd(props.amount) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.sniper-amount {
  @include box($padding: 24px, $gap: 2px, $height: $cardHeight);
  flex-direction: column;
  border: $border1;
  width: 642px;
  min-height: 358px;

  .sniper-amount-card {
    @include box($direction: column, $height: 50%, $gap: 8px, $padding: 20px);
    background-color: $backgroundColor2;
    border-radius: 2px;

  }

  .amount-value {
    @include font(32px, 500);
    color: $textColor1;
  }

  .input-field {
    padding: 0 !important;
  }

  .sniper-amount-sep {
    @include box($height: 0, $width: 28px);
    z-index: 222;

    .box {
      @include box($height: 28px, $width: 28px);
      background-color: $backgroundColor4;
      border-radius: 2px;
    }
  }

  .title {
    @include box($justify: flex-start);
    color: $red1;
  }

  .balance {
    color: $textColor2;
  }

  .max-button {
    @include box($width: 40px, $height: 24px);
    color: $green1;
    cursor: pointer;
  }

  .sniper-amount-button {
    @include box($justify: flex-start, $width: 140px, $height: 40px, $padding: 6px 10px, $gap: 8px);
    border-radius: 2px;
    background-color: $backgroundColor4;
    cursor: pointer;
    color: $textColor1;

  }
}
</style>
