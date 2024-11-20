<script setup lang="ts">

import Image from "~/components/base/Image.vue";
</script>

<template>

  <div class="column home-features flex-end">

    <div class="row gap-42">
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-fastsecure" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature001") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature007") }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-securityscan" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature002") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature008") }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row gap-42">
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-snipetrading" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature003") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature009") }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-copytrade" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature004") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature010") }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row gap-42">
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-quantitativetrade" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature005") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature011") }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row gap-24">
          <Image icon="icon-feature-antimev" :disabled="false"></Image>
          <div class="column gap-16">
            <div class="top-row-text">{{ $t("HomeFeature006") }}</div>
            <div class="bottom-row-text">{{ $t("HomeFeature012") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home-features {
  padding: 0 106px !important;
  gap: 60px !important;
  margin-top: 136.5px;
}

.card {
  @include box($justify: space-between, $gap: 24px);
  flex: 1;
}

.top-row-text {
  @include box($justify: flex-start);
  @include font(20px, 600);
  color: $textColor1;
}

.bottom-row-text {
  @include box($justify: flex-start);
  @include font(14px, 500);
  color: $textColor2;
}

.gap-42 {
  gap: 42px !important;
}

.card-top-row {
  @include box($direction: column, $justify: space-between, $height: 86px);
}


</style>
