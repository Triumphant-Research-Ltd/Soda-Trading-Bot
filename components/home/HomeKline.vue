<script setup lang="ts">

import HomeKlineCard from "~/components/home/HomeKlineCard.vue";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";

interface KLineData {
  name: string
  rate: string
  buy: string
  sell: string
  chainId: string
  pair: string
}

const store = useAppStore();
const profitList: Array<KLineData> = [];
const {$api} = useNuxtApp();
const dataList = ref<Array<KLineData>>([]);
const processDataList = (result: Result, save: boolean) => {
  if (result.code == 0) {
    let data = result.data;
    if (Array.isArray(data)) {
      if (save) {
        window.sessionStorage.setItem("homeKline", JSON.stringify(result));
      }
      for (let info of data) {
        let profit: KLineData = {
          name: info.name,
          rate: info.rate,
          buy: info.buy,
          sell: info.sell,
          chainId: info.chainId,
          pair: info.pair
        }
        profitList.push(profit);
      }
      dataList.value = [...profitList]
    }
  }
}

const loadData = async () => {
  try {
    let dataString = window.sessionStorage.getItem("homeKline");
    let result: Result
    let save: boolean;
    if (dataString != undefined) {
      result = JSON.parse(dataString);
      save = false;
    } else {
      save = true;
      result = await $api.homeKline(store.chainId);
    }
    processDataList(result, save);
  } catch (e) {
    console.log(e);
  }

}
onMounted(() => {

  loadData();
})
</script>

<template>
  <div class="home-kline">
    <HomeKlineCard v-for="(data,index) in dataList" :key="index" :kline="data"></HomeKlineCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home-kline {
  @include box($gap: 24px);
}
</style>
