<template>
  <div class="home-action-button" @click="onClick">
    <span class="button-text">{{ $t("Home038") }}</span>
    <Image icon="icon-home-arrow" :disabled="true"></Image>
  </div>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";

const emit = defineEmits(['click'])


const onClick = () => {
  emit("click");
}

</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.button-text {
  @include font(20px, 500);
}

.home-action-button {
  @include box($width: 479px, $height: 64px, $gap: 20px);
  background-color: $blue3;
  cursor: pointer;
  border-radius: 16px;
  color: $textColor1;
}
</style>
