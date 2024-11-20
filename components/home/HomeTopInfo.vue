<template>
  <div class="row top-info">
    <div class="info-card">
      <div class="row gap-8 justify-start">
        <Image icon="icon-home-topprofit"></Image>
        <div class="tile-text">{{$t("Home022")}}</div>
      </div>
      <div class="item-sep"></div>
      <div class="column item-gap">
        <div class="column item-gap2 align-start">
          <span class="text">{{ $t("Home023", {day: 7})}}</span>
          <span class="value-text">$21322.52</span>
        </div>
        <div class="column item-gap2 align-start">
          <span class="text">{{ $t("Home023", {day: 30})}}</span>
          <span class="value-text">$21322.52</span>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row gap-16 justify-start">
        <div class="address">
          <span class="address-text">{{ $t("Home024", {day: 30})}}</span>
          <span class="address-text">0x12...3212</span>
          <Image icon="icon-address-copy" :button="true" @click="copyPast7DayAddress"></Image>
        </div>
        <div class="address">
          <span class="address-text">{{ $t("Home024", {day: 30})}}</span>
          <span class="address-text">0x12...3212</span>
          <Image icon="icon-address-copy" :button="true" @click="copyPast30ayAddress"></Image>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row analyze-button" @click="analyzeTopProfit">
        <span class="analyze-text">{{$t("Home025")}}</span>
        <Image icon="icon-home-analyze-arrow" :disabled="true"></Image>
      </div>
    </div>
    <div class="info-card">
      <div class="row gap-8 justify-start">
        <Image icon="icon-home-topwinrate"></Image>
        <div class="tile-text">{{$t("Home026")}}</div>
      </div>
      <div class="item-sep"></div>
      <div class="column item-gap">
        <div class="column item-gap2 align-start">
          <span class="text">{{$t("Home027")}}</span>
          <span class="value-text">32</span>
        </div>
        <div class="column item-gap2 align-start">
          <span class="text">{{$t("Home028")}}</span>
          <span class="value-text">78%</span>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row gap-16 justify-start">
        <div class="address">
          <span class="address-text">0x12...3123</span>
          <Image icon="icon-address-copy" :button="true" @click="copyTopWinRateAddress"></Image>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row analyze-button" @click="analyzeTopWinRate">
        <span class="analyze-text">{{$t("Home025")}}</span>
        <Image icon="icon-home-analyze-arrow" :disabled="true"></Image>
      </div>
    </div>
    <div class="info-card">
      <div class="row gap-8 justify-start">
        <Image icon="icon-home-topyield"></Image>
        <div class="tile-text">{{ $t("Home029")}}</div>
      </div>
      <div class="item-sep"></div>
      <div class="column item-gap">
        <div class="column item-gap2 align-start">
          <span class="text">{{ $t("Home030") }}</span>
          <span class="value-text">2132131231%</span>
        </div>
        <div class="row">
          <div class="column item-gap2 align-start">
            <span class="text">{{$t("Home031")}}</span>
            <span class="value-text">2132</span>
          </div>
          <div class="column item-gap2 align-start">
            <span class="text">{{$t("Home032")}}</span>
            <span class="value-text">927213</span>
          </div>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row gap-16 justify-start">
        <div class="address">
          <span class="address-text">0x12...3123</span>
          <Image icon="icon-address-copy" :button="true" @click="copyTopYieldAddress"></Image>
        </div>
      </div>
      <div class="item-sep"></div>
      <div class="row analyze-button" @click="analyzeTopYield">
        <span class="analyze-text">{{$t("Home025")}}</span>
        <Image icon="icon-home-analyze-arrow" :disabled="true"></Image>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import Image from "~/components/base/Image.vue";

const copyPast7DayAddress = () => {

}
const copyPast30ayAddress = () => {

}
const copyTopWinRateAddress = () => {

}
const copyTopYieldAddress = () => {

}
const analyzeTopProfit = () => {

}
const analyzeTopWinRate = () => {

}
const analyzeTopYield = () => {

}
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.top-info {
  padding: 108px 86px !important;
  gap: 36px !important;
  background-color: $backgroundColor0;

  .info-card {
    @include box();
    flex-direction: column;
    padding: 24px;
    border: $border1;
    background-color: $backgroundColor0;
    height: 424px;
    flex: 1;
    border-radius: 2px;

    .item-sep {
      height: 48px;
    }


    .item-gap {
      gap: 36px;
    }

    .item-gap2 {
      gap: 16px;
    }

    .align-start {
      align-items: flex-start !important;
    }

    .justify-start {
      justify-content: flex-start;
    }

    .item-row {
      height: 57px;
    }

    .tile-text, .value-text, .analyze-text {
      color: $textColor1;
    }

    .tile-text {
      @include font(20px, 600);
    }

    .value-text {
      @include font(24px, 500);
    }

    .analyze-text {
      @include font(14px, 600);
    }

    .text {
      @include font(12px, 500);
      color: $textColor2;
    }

    .address-text {
      @include font(12px, 400);
      color: $textColor2;
      white-space: nowrap;
      overflow: hidden;
    }

    .address {
      @include box($justify: flex-start, $gap: 4px, $width: auto, $padding: 0 8px);
      background-color: $backgroundColor2;
      height: 24px;

      &.blank {
        background-color: transparent;
      }
    }

    .analyze-button {
      height: 24px;
      gap: 8px !important;
      cursor: pointer;
      justify-content: flex-start !important;
    }
  }
}
</style>
