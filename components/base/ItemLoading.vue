<script setup lang="ts">


import Image from "~/components/base/Image.vue";

interface ItemLoadingProps {
  theme: "white" | "black" | "green"
}

const props = defineProps<ItemLoadingProps>()
const imageLoadingIcon = computed(() => {
  if (props.theme === "black") {
    return 'icon-loading-b';
  } else if (props.theme === "green") {
    return 'icon-loading-g';
  } else if (props.theme === "white") {
    return 'icon-loading-w';
  } else {
    return 'icon-loading';
  }
})
</script>

<template>
  <div class="item-loading">
    <Image class-name="rotate-animation" :icon="imageLoadingIcon" :disabled="true"></Image>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.item-loading {
  @include box($width: 20px, $height: 20px);
  pointer-events: none;
}

</style>
