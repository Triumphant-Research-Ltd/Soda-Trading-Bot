<template>
  <el-popover placement="bottom" trigger="hover" :width="184" style="height: 144px" :show-arrow="false" effect="dark"
              popper-class="popover">
    <template #reference>
      <div class="user-menu">
        <Image icon="icon-user-metamask" :width="24" :height="24" :disabled="false"></Image>
        <span>{{ displayedAddress }}</span>
        <div class="user-menu-ball"></div>
      </div>
    </template>
    <div class="banner-menu">
      <div class="menu-item user" @click="onWallet">
        <Image icon="icon-user-wallet" :disabled="true"></Image>
        {{ $t("Home006") }}
      </div>
      <div class="menu-item user" @click="onCode">
        <Image icon="icon-user-code" :disabled="true"></Image>
        {{ $t("Home007") }}
      </div>
      <div class="menu-item user" @click="onDisconnect">
        <Image icon="icon-user-disconnect" :disabled="true"></Image>
        {{ $t("Home008") }}
      </div>
    </div>
  </el-popover>

</template>
<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import {NavigationRoute} from "~/utils/constant";
import {reduceAddress} from "~/utils/util";


const store = useAppStore();
const displayedAddress = computed(() => reduceAddress(store.userAddress, 4, 4));
const emit = defineEmits(["click"]);
const onWallet = () => {
  emit('click', NavigationRoute.Wallet);
}
const onCode = () => {
  emit('click', NavigationRoute.PromotionCode);
}
const onDisconnect = () => {
  emit('click', NavigationRoute.Disconnect);
}

</script>
<style scoped lang="scss">
@use "assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.user-menu {
  @include box($width: 152px, $height: 40px, $gap: 4px, $padding: 10px);
  border-radius: 16px;
  border: 1px solid $textColor1;
  white-space: nowrap;
  color: $textColor1;
  cursor: pointer;
}

.user-menu-ball {
  @include box($width: 6px, $height: 6px);
  background-color: $green2;
  border-radius: 50%;
}
</style>
