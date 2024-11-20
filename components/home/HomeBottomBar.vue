<template>
  <div class="home-bottom-bar">
    <Image icon="icon-logo" :icon-set="logoIconSet" extension="png"/>
    <div class="flex"></div>
    <div class="row link-bar">
      <div class="row link-item" @click="openTwitter">
        <Image icon="icon-home-bottom-bar-x" class-name="link-x-icon" :disabled="false"></Image>
        <span class="link-text">TWITTER</span>
        <Image icon="icon-home-bottom-arrow-upright" :disabled="false"></Image>
      </div>
      <div class="row link-item" @click="openDocs">
        <Image icon="icon-home-docs" :disabled="false"></Image>
        <span class="link-text">{{ $t("Home047") }}</span>
        <Image icon="icon-home-bottom-arrow-upright" :disabled="false"></Image>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import {iconSet} from "~/utils/resource";
import {useTranslation} from "@intlify/h3";

const {t} = useTranslation();
const openTwitter = () => {
  window.open("https://x.com/SodaBotHQ", "_blank");
}
const openDocs = () => {
  window.open("https://sodabot-1.gitbook.io/sodabot", "_blank");
}
const logoIconSet = computed(() => iconSet("icon-logo"));
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home-bottom-bar {
  @include box($padding: 0 85.5px, $height: 73px);
  margin-top: 41px;
}

.link-x-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #323232;
}

.link-item {
  cursor: pointer;
  width: auto !important;
  gap: 4px;

  .link-text {
    @include font(14px, 500);
    color: $textColor1;
  }
}

.link-bar {
  width: auto !important;
  gap: 4px;
}
</style>
