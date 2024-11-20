<template>

  <div class="column gap-16 wallet-link">
    <div class="row flex-start title">{{ $t("Name004") }}</div>
    <div class="row flex-start" v-if="loading">
      <ItemLoading theme="white"></ItemLoading>
    </div>
    <div class="row flex-start gap-4 sub-title" v-else-if="!store.isLogin">
      <span>{{ $t("Trade066") }}</span>
      <span>-></span>
      <div class="link" @click="connectToWallet">{{ $t("Trade067") }}</div>
    </div>
    <div class="row flex-start gap-4 sub-title" v-else-if="!store.hasWallet">
      <span>{{ $t("Trade077", {name: $t("Name000")}) }}</span>
      <span>-></span>
      <div class="link" @click="createWallet">{{ $t("Trade078") }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemLoading from "~/components/base/ItemLoading.vue";
import {useNuxtApp} from "#imports";
import {Account} from "~/models/Account";

const {t} = useI18n({useScope: "global"});
const {$api} = useNuxtApp();
const store = useAppStore();
const loading = ref(false);
const localForage = useLocalForage();
const updateAccountProxyWallet = async (proxyWallet: string) => {
  try {
    let accountInfo = await localForage.getItem('account')
    if (accountInfo != null) {
      let info = JSON.parse(accountInfo);
      if (info) {
        let account = new Account();
        account.valueOf(info);
        account.wallet = proxyWallet;
        store.login(store.chainId, store.userAddress, proxyWallet, store.walletType);
        let text = JSON.stringify(account.raw);
        await localForage.setItem("account", text);

      }

    }

  } catch (e: any) {
  }


}
const connectToWallet = () => {
  store.showLoginWalletDialog("0x1");
}
const createWallet = () => {
  loading.value = true;
  setTimeout(() => {
    $api.createWallet().then(result => {
      if (result.code == 0) {
        let data = result.data;
        if (data) {
          let proxyWallet = data.proxyWallet;
          updateAccountProxyWallet(proxyWallet).catch((e) => {
          });
        }
      } else {
        let message = result.message || t("Message036", {name: t('Name000')})
        store.showMessageBox(t('CopyTrade002', {name: t('Name000')}), message);
      }
    }).catch(e => {
      store.showMessageBox(t('CopyTrade002', {name: t('Name000')}), t("Message036", {name: t('Name000')}));
    }).finally(() => {
      loading.value = false;
    });
  }, 500)

}

</script>

<style scoped lang="scss">
@use "@/assets/scss/base.scss" as *;
@use "@/assets/scss/global.variable" as *;

.wallet-link {
  background-color: rgba($blue2, 0.2);
  color: $textColor1;
  padding: 16px 24px !important;
  border-radius: 2px;

  .title {
    @include font(16px, 500);
  }

  .sub-title {
    @include font(14px, 400);
  }

  .link {
    cursor: pointer;
    color: $blue1;
  }
}
</style>
