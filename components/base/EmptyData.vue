<script setup lang="ts">

import Image from "~/components/base/Image.vue";
</script>

<template>
  <div class="row empty-data">
    <Image icon="icon-empty-data" :width="100" :height="100" :disabled="false"></Image>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.empty-data {
  min-height: 220px;
}
</style>
