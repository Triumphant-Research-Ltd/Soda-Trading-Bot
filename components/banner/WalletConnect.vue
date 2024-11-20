<template>
  <div class="chain-switch" @click="onLogin()">
    CONNECT WALLET
  </div>
</template>
<script setup lang="ts">

import {NavigationRoute} from "@/utils/constant";
const emit = defineEmits(["click"]);
const onLogin = () => {
  emit('click',NavigationRoute.Login);
}

</script>
<style scoped lang="scss">
@use "assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.chain-switch {
  @include box($width: 152px, $height: 40px, $gap: 8px);
  @include font($fontSize: 14px, $fontWeight: 600);
  border-radius: 16px;
  background-color: $orange1;
  white-space: nowrap;
  color: $primaryColor;
  cursor: pointer;
}
</style>
