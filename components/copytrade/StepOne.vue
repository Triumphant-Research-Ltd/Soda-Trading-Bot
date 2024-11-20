<script setup lang="ts">
import AddressInput from "~/components/copytrade/components/AddressInput.vue";
import AddressList from "~/components/copytrade/components/AddressList.vue";
import TitleBar from "~/components/base/TitleBar.vue";
import {useAppStore, useNuxtApp} from "#imports";
import {Result} from "~/models/Result";

const route = useRoute();
const routeAddress = route.query.address;
let preferredAddress = '';
if (routeAddress != null) {
  if (Array.isArray(routeAddress)) {
    preferredAddress = routeAddress[0];
  } else {
    preferredAddress = routeAddress;
  }
  if (!isAddress(preferredAddress)) {
    preferredAddress = '';
  } else {
    preferredAddress = preferredAddress.trim();
  }
}
const {t} = useI18n({useScope: 'global'});
const loading = ref(false);
const emit = defineEmits(['submit']);
const address = ref<string>(preferredAddress);
const {$api} = useNuxtApp();
const store = useAppStore();
const onCopyTrade = (addr: string) => {
  address.value = addr;
  window.scrollTo({top: 0, behavior: "smooth"})
}
const checkAddress = (address: string, name: string) => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let r: Result = await $api.checkTrackWallet(address);
      if (r.code == 0) {
        emit('submit', address, name);
      } else {
        let msg = r.message;
        store.showMessageBox(t("Home020"), msg);
      }
    } catch (e: any) {
      store.showMessageBox(t("Home020"), msg);
    } finally {
      loading.value = false;
    }
  }, 500)
}
const onSubmit = (address: string, name: string) => {
  checkAddress(address, name);
}
// onMounted(() => {
//   if (isAddress(preferredAddress)) {
//     address.value = preferredAddress
//   }
// })
</script>

<template>
  <div class="column copy-trade-step-one">
    <TitleBar :title="$t('CopyTrade001')" tag="STEP 1" :tip-text="$t('CopyTrade003')"></TitleBar>
    <AddressInput :loading="loading" :copy-trade-address="address" @submit="onSubmit"></AddressInput>
    <AddressList @copy-trade="onCopyTrade"></AddressList>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.copy-trade-step-one {
  gap: 56px !important;
}
</style>
