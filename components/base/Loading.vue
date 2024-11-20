<script setup lang="ts">

</script>

<template>
  <div class="loading-container">
    <div class="loading-view">
      <div class="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/loading" as *;

.loading-container {
  @include box();
  min-height: 200px;

  .loading-view {
    @include box($width: 120px, $height: 120px);
  }
}
</style>
