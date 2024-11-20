<script setup lang="ts">
import Image from "~/components/base/Image.vue";
</script>

<template>
  <div class="home-future-plan-wrapper">
    <div class="column home-future-plan gap-24">
      <div class="title">{{ $t("HomeFuturePlan001") }}</div>
      <div class="row">
        <!--card1 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-1"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan002") }}</div>
        </div>
        <div class="line">
          <div class="line-content"></div>
        </div>
        <!--card2 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-2"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan003") }}</div>
        </div>
        <div class="line">
          <div class="line-content"></div>
        </div>
        <!--card3 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-3"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan004") }}</div>
        </div>
        <div class="line">
          <div class="line-content"></div>
        </div>
        <!--card4 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-4"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan005") }}</div>
        </div>
        <div class="line">
          <div class="line-content"></div>
        </div>
        <!--card5 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-5"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan006") }}</div>
        </div>
        <div class="line">
          <div class="line-content"></div>
        </div>
        <!--card6 -->
        <div class="card">
          <div class="row">
            <Image icon="icon-plan-6"></Image>
          </div>
          <div class="row row-text">{{ $t("HomeFuturePlan007") }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home-future-plan-wrapper {
  @include box($direction: column, $padding: 140px 0 64px 0, $height: 543px);
  background-image: url(imageUrl('home-future-plan-bg', 'png'));
  background-position: top center;
  background-repeat: no-repeat;

}

.home-future-plan {
  border-top: 0.5pt solid $textColor1;
  padding: 52px 106px !important;
  gap: 40px !important;
  height: 380px;
  border-bottom: 0.5pt solid $textColor1;
  background-color: #000000;
}


.title {
  @include box($justify: flex-start);
  @include font(24px, 600);
  color: $textColor1;
}

.card {
  @include box($direction: column, $justify: flex-start, $gap: 48px, $padding: 16px 0);
  height: 152px;
  flex: 1;
}


.row-text {
  @include box();
  text-align: center;
  @include font(14px, 600);
  color: $textColor1;
}

.line {
  @include box($width: 65px);

  .line-content {
    width: 1px;
    height: 138px;
    background-color: $blue3;
  }

}
</style>
