<script setup lang="ts">
import {dexLink} from "~/utils/util";
import Image from "~/components/base/Image.vue";

interface KLineData {
  name: string
  rate: string
  pair: string
  buy: string
  sell: string
  chainId: string
}

interface HomeKlineCardProps {
  kline: KLineData
}

const props = defineProps<HomeKlineCardProps>()
const kline = ref<KLineData>(props.kline);
const imageUrl = () => {
  let name = kline.value.name.toUpperCase() || "";
  return `kline/${name}`
}
const gotoDex = () => {
  let link = dexLink(kline.value.chainId, kline.value.pair)
  window.open(link, "_blank");
}
watch(() => props.kline, (newVal) => {
  kline.value = newVal
})
</script>

<template>
  <div class="card" @click="gotoDex">
    <div class="column">
      <div class="column" style="gap:23px">
        <div class="title-row">
          <div class="row auto flex-start" style="align-items: baseline">
            <span class="rate">{{ kline.rate }}</span>
            <span class="rate">x</span>
          </div>
          <span class="symbol">{{ kline.name }}</span>
        </div>
        <div class="column align-items-left" style="padding-left: 16px;gap: 9px">
          <div class="row auto flex-start gap-4">
            <span class="symbol gray">Buy</span>
            <span class="symbol">{{ kline.buy }}</span>
          </div>
          <div class="row auto flex-start gap-4">
            <span class="symbol gray">Sell</span>
            <span class="symbol">{{ kline.sell }}</span>
          </div>
        </div>
      </div>
      <div class="column">
        <Image :icon="imageUrl()" :disabled="true"/>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.card {
  @include box($justify: space-between, $align: flex-start, $width: 299px, $height: 280px);
  background-image: url(imageUrl('icon-home-kling-bg-001'));
  background-position: top center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    transform: scale(0.9);
  }
}

.title-row {
  @include box($justify: space-between, $padding: 8px 22px 0 30px)
}

.symbol {
  @include font(16px);
  color: $textColor1;

  &.gray {
    color: $textColor2;
  }
}

.rate {
  @include font(28px);
  color: black;
}

</style>
