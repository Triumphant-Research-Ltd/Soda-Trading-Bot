<template>
  <div class="row flex-start gap-8 address-container">
    <div class="address">{{ props.address }}</div>
    <el-tooltip :content="$t('Message044')" placement="top" trigger="click">
      <Image icon="icon-address-copy" :button="true" @click="copyAddress"></Image>
    </el-tooltip>
    <Image icon="icon-wallet-qrcode" :button="true" @click="openWalletQrCode" :tooltip="$t('Trade071')"></Image>
  </div>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";

interface WalletAddressProps {
  address: string,
  chainId: string,
}

const {t} = useI18n({useScope: 'global'});
const store = useAppStore();
const props = defineProps<WalletAddressProps>();
const copyAddress = () => {
  copy(props.address, () => {
    // store.showMessageBox(t("ActionTitle001"), t("Message001", {name: t("Name001")}), "success")
  });
}
const openWalletQrCode = () => {
  store.showWalletQrCode(true);
}
</script>

<style scoped lang="scss">
@use "@/assets/scss/base.scss" as *;
@use "@/assets/scss/global.variable" as *;

.address-container {
  padding: 16px 24px !important;
  background-color: rgba($blue2, 0.2);
  border-radius: 2px;

  .address {
    color: $textColor1;
  }
}
</style>
