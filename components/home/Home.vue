<template>
  <div class="home">
    <HomeBanner @launch="launch"></HomeBanner>
    <div class="column" style="margin-top: 141px;gap:56px">
      <HomeKline></HomeKline>
      <HomeUserProfit></HomeUserProfit>
    </div>
    <HomeFeatures></HomeFeatures>
    <HomeFuturePlan></HomeFuturePlan>
    <HomeBottomBar></HomeBottomBar>
  </div>
</template>
<script setup lang="ts">
import HomeBanner from "~/components/home/HomeBanner.vue";
import HomeUserProfit from "~/components/home/HomeUserProfit.vue";

const store = useAppStore();
const launch = () => {
  let url = new URL(window.location.href);
  url.pathname = "/smartmoney/trending";
  window.open(url, "_self");
}

</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home {
  @include box($padding: 0 0 29px 0);
  flex-direction: column;
}

.sep {
  height: 120px;
}


</style>
