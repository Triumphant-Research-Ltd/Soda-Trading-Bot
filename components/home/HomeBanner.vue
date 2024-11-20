<template>
  <div class="message">
    <div class="left-icon">
      <Image icon="icon-home-banner-001" :disabled="true"></Image>
    </div>
    <div class="column message-gap auto">
      <Image icon="icon-home-text-001" :disabled="true"></Image>
      <div class="row button-gap flex-end">
        <HomeLaunchAppButton @click="launchApp"></HomeLaunchAppButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";

const emit = defineEmits(['launch']);
const launchApp = () => {
  emit('launch');
}
</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.message {
  @include box($justify: space-between, $padding: 0 162px 0 111px, $align: flex-start);
  z-index: 10;

  .left-icon {
    @include box($justify: flex-start, $direction: column, $padding: 61px 0 0 0, $width: auto);

  }

  .button-gap {
    gap: 32px;
  }

  .message-gap {
    gap: 30px;
    padding: 84px 0 0 0;
  }

}

</style>
