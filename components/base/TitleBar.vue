<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";
import StepAccountBalance from "~/components/copytrade/components/AccountBalance.vue";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";
import {Account} from "~/models/Account";

interface TitleBarProps {
  tag: string,
  title: string,
  tipText: string
}

const {t} = useI18n({useScope: 'global'});
const {$api} = useNuxtApp();
const store = useAppStore();
const props = defineProps<TitleBarProps>();
const loading = ref(false);
const localForage = useLocalForage();
const allow = () => {
  return store.isLogin && store.hasWallet;
}
const canShowTip = () => {
  let ok = allow();
  return !ok;
}
const showTip = ref<boolean>(canShowTip());
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
const closeTip = () => {
  showTip.value = false;
}
const createWallet = () => {
  if (loading.value) {
    return;
  }
  if (!store.isLogin) {
    store.showLoginWalletDialog("0x1");
    return;
  }
  loading.value = true;
  setTimeout(() => {
    $api.createWallet().then((result: Result) => {
      if (result.code == 0) {
        let data = result.data;
        if (data) {
          let proxyWallet = data.proxyWallet;
          closeTip();
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
    })
  }, 500);
}

watch(canShowTip, (val) => {
  showTip.value = val;
});
</script>

<template>
  <div class="column gap-16" v-if="!allow()">
    <div class="row flex-justify">
      <div class="row auto gap-16">
        <div class="step-tag">{{ props.tag }}</div>
        <div class="step-title">{{ props.title }}</div>
      </div>
      <StepAccountBalance v-if="allow()"></StepAccountBalance>
      <div v-else class="row auto gap-8 step-create-wallet-button" @click="createWallet">
        <div class="defaultText">{{ $t("CopyTrade002", {name: $t("Name000")}) }}</div>
        <div class="image" v-if="loading">
          <ItemLoading theme="white"></ItemLoading>
        </div>
        <div class="image" v-else>
          <Image icon="icon-step-plus" :width="16" :height="16" :disabled="true"></Image>
        </div>
      </div>

    </div>
    <div class="row flex-justify tip" v-if="showTip">
      <span class="tip-text">{{ props.tipText }}</span>
      <Image icon="icon-close-yellow" :width="16" :height="16" :button="true" @click="closeTip"></Image>
    </div>
  </div>
  <div class="column gap-16" v-else>
    <div class="row flex-justify">
      <div class="row auto gap-16">
        <div class="step-tag">{{ props.tag }}</div>
        <div class="step-title">{{ props.title }}</div>
      </div>
      <StepAccountBalance></StepAccountBalance>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;


.step-tag {
  @include box($width: fit-content, $height: 33px, $padding: 0 8px);
  @include font(20px, 500);
  color: $textColor1;
  min-width: 83px;
  background-color: $blue1;
}

.step-title {
  @include font(20px, 500);
  color: $textColor1;
}

.step-create-wallet-button {
  min-width: 204px;
  height: 40px;
  border-radius: 2px;
  background-color: $blue1;
  cursor: pointer;

  .image {
    @include box($width: 40px, $height: 40px);
    pointer-events: none;
  }
}

.tip {
  background-color: rgba($yellow1, 0.2);
  padding: 8px 16px;

  .tip-text {
    color: $yellow1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
