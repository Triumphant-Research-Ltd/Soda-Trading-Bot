<script setup lang="ts">

import {HomeProfitEntity} from "~/models/HomeProfitEntity";
import Image from "~/components/base/Image.vue";
import {reduceAddress} from "~/utils/util";

interface HomeUserProfitCardProps {
  index: number
  profit: HomeProfitEntity
}

const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const props = defineProps<HomeUserProfitCardProps>()
const profit = ref<HomeProfitEntity>(props.profit);
const iconName = () => {
  let iconIndex = props.index % 4 + 1;
  return `avatar${iconIndex}`
}
const openDex = () => {
  let link = dexLink(profit.value.chainId, profit.value.address, profit.value.maker)
  window.open(link)
}
watch(() => props.profit, (newVal) => {
  profit.value = newVal
})
</script>

<template>
  <div class="card" @click="openDex">
    <div class="column align-items-left">
      <div class="title-row">
        <Image :icon="iconName()" :width="40" :height="40" :button="false"></Image>
        <span class="address">{{ reduceAddress(profit.maker, 6, 4) }}</span>
      </div>
      <div class="inset-0"></div>
      <div class="row gap-25 flex-start">
        <div class="item">
          <div class="title">{{ t("Name016") }}</div>
          <div class="value">{{ profit.profit }}</div>
        </div>
        <div class="item">
          <div class="title">{{ t("Name019") }}</div>
          <div class="value">{{ profit.profitRate }}</div>
        </div>
      </div>
      <div class="inset-1"></div>
      <div class="amount">
        <Image :chain="profit.chainId" :token="profit.address" :width="16" :height="16" :button="false"></Image>
        <span class="defaultText">{{ profit.symbol }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.card {
  @include box($direction: column, $align: flex-start, $width: 299px, $height: 258px, $padding: 22px 16px);
  background-image: url(imageUrl('icon-home-user-profit-card'));
  background-position: top center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    transform: scale(0.9);
  }
}

.inset-0 {
  width: 100%;
  height: 20px;
}

.inset-1 {
  width: 100%;
  height: 56px;
}

.title-row {
  @include box($justify: flex-start, $gap: 4px)
}

.item {
  @include box($direction: column, $gap: 4px);
  flex: 1;
}

.address {
  @include font(16px);
  color: $textColor1;
}

.gap-25 {
  gap: 25px;
}

.title {
  @include box($justify: flex-start);
  @include font(12px);
  color: $textColor2;
}

.value {
  @include box($justify: flex-start);
  @include font(14px);
  color: $textColor1;
}

.amount {
  @include box($justify: flex-start, $gap: 4px, $padding: 4px 10px, $width: auto);
  @include font(14px);
  color: $textColor1;
  min-width: 121px;
  border-radius: 1000px;
  background-color: $backgroundColor2;
}
</style>
