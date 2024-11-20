<template>

  <div class="home-profit">
    <div class="row" v-if="loading">
      <Loading></Loading>
    </div>
    <div class="container" v-else>
      <div class="arrow-handle" @click="scrollToFirst">
        <Image icon="icon-user-reviews-arrow-left" :disabled="true"></Image>
      </div>
      <div class="item-scroller-wrapper" id="itemScroller">
        <div class="item-scroller">
          <HomeUserProfitCard :index="index" :profit="profit" v-for="(profit,index) in dataList"
                              :key="index+1"></HomeUserProfitCard>
        </div>
      </div>
      <div class="arrow-handle" @click="scrollToLast">
        <Image icon="icon-user-reviews-arrow-right" :disabled="true"></Image>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import {HomeProfitEntity} from "~/models/HomeProfitEntity";
import {useNuxtApp} from "#imports";
import Loading from "~/components/base/Loading.vue";
import {Result} from "~/models/Result";
import HomeUserProfitCard from "~/components/home/HomeUserProfitCard.vue";
import Image from "~/components/base/Image.vue";


const {t} = useI18n({useScope: 'global'});

const store = useAppStore();
const {$api} = useNuxtApp();
let itemList: HomeProfitEntity[] = [];
const dataList = ref<HomeProfitEntity[]>([]);

const loading = ref(true);

const scrollToFirst = () => {
  let element = document.querySelector("#itemScroller");
  if (element != null) {
    element.scrollTo({left: 0, behavior: "smooth"});
  }
}
const scrollToLast = () => {
  let element = document.querySelector("#itemScroller");
  if (element != null) {
    let w = element.clientWidth + 24;
    element.scrollTo({left: w, behavior: "smooth"});
  }
}
const processDataList = (result: Result, save: boolean) => {
  if (result.code == 0) {
    let data = result.data;
    if (Array.isArray(data)) {
      if (save) {
        window.sessionStorage.setItem("homeProfit", JSON.stringify(result));
      }
      let max = data.length;
      for (let index = 0; index < max; index++) {
        let entity = new HomeProfitEntity();
        let item = data[index];
        entity.valueOf(item);
        itemList.push(entity);
      }
      dataList.value = [...itemList];
    }
  }
}
const loadData = async () => {
  loading.value = true;
  try {
    let dataString = window.sessionStorage.getItem("homeProfit");
    let result: Result
    let save: boolean;
    if (dataString != undefined) {
      result = JSON.parse(dataString);
      save = false;
    } else {
      save = true;
      result = await $api.homeProfit(store.chainId);
    }
    processDataList(result, save);
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});


</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.arrow-handle {
  @include box($width: 40px, $height: 40px);
  cursor: pointer;
}

.home-profit {
  @include box($gap: 24px, $padding: 0 106px);
}

.container {
  @include box($justify: flex-start, $gap: 4px, $width: fit-content);

}

.item-scroller-wrapper {
  @include box($width: calc(299px * 4 + 24px * 3), $justify: flex-start);
  overflow-x: scroll;
  scrollbar-width: none;
}

.item-scroller {
  @include box($justify: flex-start, $gap: 24px, $width: fit-content);


}

</style>
