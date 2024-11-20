<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="profit-image">
      <div class="row flex-justify">
        <Image icon="icon-logo" :icon-set="iconSet('icon-logo')" extension="png"/>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="image-cell">
        <div class="column" v-if="loading">
          <Loading></Loading>
        </div>
        <div class="column" v-else-if="showError">
          <EmptyData></EmptyData>
        </div>
        <el-image
            v-else
            style="width: 420px;height: 600px;background-color: #131413"
            :src="image"
            :zoom-rate="1.2"
            :max-scale="1"
            :min-scale="0.3"
            :preview-src-list="srcList"
            :initial-index="4"
            @load="onImageLoad"
            @error="onImageLoadError"
            fit="cover"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import Loading from "~/components/base/Loading.vue"
import {useAppStore} from "~/stores/appstore";
import {useNuxtApp} from "#imports";
import EmptyData from "~/components/base/EmptyData.vue";


const store = useAppStore();
const {$api} = useNuxtApp();
const open = ref<boolean>(false);
const image = ref('');
const showError = ref(false);
const loading = ref(true);
const srcList = ref<string[]>([]);
const onImageLoad = (e: Event) => {
  loading.value = false;
  showError.value = false;
}
const onImageLoadError = () => {
  showError.value = true;
  loading.value = false;
}
const onDialogOpen = () => {
  showError.value = false;
  loading.value = true;
  setTimeout(() => {
    $api.profitImage(store.chainId, store.imagePreview.image, store.imagePreview.imageType).then((r) => {
      if (r.code == 0) {
        let data = r.data?.toString() || '';
        if (data.startsWith("https://")) {
          image.value = data;
          srcList.value = [data];
          return;
        }
      }
      showError.value = true;
    }).catch(e => {
      showError.value = true;
    }).finally(() => {
      loading.value = false;
    })
  }, 1500);
}
const onClose = () => {
  store.hideImagePreview();
}
watch(() => store.imagePreview, (val) => {
  open.value = val.visible;

}, {deep: true});
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.profit-image {
  @include box($gap: 32px);
  flex-direction: column;
}

.image-cell {
  @include box($direction: column, $width: 420px);
  min-height: 600px;
}


</style>
