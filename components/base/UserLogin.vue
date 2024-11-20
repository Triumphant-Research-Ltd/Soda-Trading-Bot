<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpened">
    <div class="user-login">
      <div class="row align-items-top">
        <div class="column">
          <span class="title-text">{{ $t("UserLogin001") }}</span>
          <span class="sub-title-text">{{ $t("UserLogin002", {name: $t("Name000")}) }}</span>
        </div>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      
      <div class="user-login-wallets">
        <div class="user-login-wallet" @click="()=>login(WalletType.OkxWallet)">
          <div class="wallet-icon">
            <Image icon="icon-wallet-okx"></Image>
          </div>
          <span class="user-login-wallet-text">{{ $t("WalletName003") }}</span>
          <ItemLoading theme="white" v-if="walletLoading(WalletType.OkxWallet)"></ItemLoading>
        </div>
        <div class="user-login-wallet" @click="()=>login(WalletType.Phantom)">
          <div class="wallet-icon">
            <Image icon="icon-wallet-phantom"></Image>
          </div>
          <span class="user-login-wallet-text">{{ $t("WalletName004") }}</span>
          <ItemLoading theme="white" v-if="walletLoading(WalletType.Phantom)"></ItemLoading>
        </div>
      </div>
      <div class="row">
        <Image icon="icon-wallet-bottom-soda"></Image>
      </div>
    </div>

  </el-dialog>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {WalletType, Web3Status} from "~/utils/constant";
import type {Account} from "~/models/Account";
import {useNuxtApp, useRoute} from "#imports";
import {Result} from "~/models/Result";
import {dumpWalletType, parseWalletType} from "~/utils/util";

interface UserLoginProps {
  open: boolean;
}

const emit = defineEmits(['close'])
const props = defineProps<UserLoginProps>()
const {t} = useI18n({useScope: 'global'});
const store = useAppStore();
const {$bus, $okx_connect, $phantom_connect, $api} = useNuxtApp();
const localForage = useLocalForage();
const route = useRoute();
const q = route.query.q || '';
const isLogin = ref<boolean>(false);
const open = ref<boolean>(false);
const timer = ref<number>(0);
const walletType = ref<WalletType>();


const onClose = () => {
  window.clearTimeout(timer.value);
  isLogin.value = false;
  emit('close');
}
const walletLoading = (wallet: WalletType) => {
  return walletType.value == wallet && isLogin.value;
}
const connectionTimeout = () => {
  isLogin.value = false;
  store.showMessageBox(t("UserLogin001"), t("Message004"), "error")
}
const onLoginSuccess = (account: Account) => {
  $api.userLogin(account, q).then((result: Result) => {
    if (result.code == 0) {
      let data = result.data;
      account.wallet = data?.wallet || '';
      let info = JSON.stringify(account.raw);
      localForage.setItem("account", info).then(() => {

      }).catch(e => {

      }).finally(() => {
        let wt = parseWalletType(account.walletType);
        store.login(account.chainId, account.address, account.wallet, wt);
        isLogin.value = false;
        
        window.clearTimeout(timer.value);
        emit('close');
        $bus.dispatch(AppEvent.Login);
        $bus.dispatch(AppEvent.RefreshBalance);

      })
    } else {
      let message = result.message;
      onLoginFail(message);
    }
  })


}
const onLoginFail = (error: string) => {
  isLogin.value = false;
  window.clearTimeout(timer.value);
  store.showMessageBox(t("UserLogin001"), error);
}
const processLoginFailed = (message: Web3Message, wallet: WalletType) => {
  let msg: string;
  if (message.message == WalletError.ErrorWalletNotAvailable) {
    let name = "";
    switch (wallet) {
      case WalletType.Metamask:
        name = "WalletName001"
        break;
      case WalletType.TokenPocket:
        name = "WalletName002"
        break;
      case WalletType.OkxWallet:
        name = "WalletName003"
        break;
      case WalletType.Phantom:
        name = "WalletName004"
        break;
    }
    msg = t("Web3Error" + message.message, {name: t(name)});
  } else if (/^[0-9]+$/.test(message.message) || message.message == WalletError.ErrorUnknown) {
    msg = t("Web3Error" + message.message);
  } else {
    msg = message.message;
  }
  onLoginFail(msg);
}
const login = async (wallet: WalletType) => {
  if (isLogin.value) {
    return;
  }
  isLogin.value = true;
  walletType.value = wallet;
  window.clearTimeout(timer.value);
  timer.value = window.setTimeout(connectionTimeout, 30000);
  let wt = dumpWalletType(wallet);
  if (wallet == WalletType.OkxWallet) {//okx wallet
    let event: Web3Message = await $okx_connect('solana');
    if (event.status == Web3Status.Success) {
      let account = event.data as Account;
      account.walletType = wt;
      onLoginSuccess(account);
    } else {
      processLoginFailed(event, wallet);
    }
  } else if (wallet == WalletType.Phantom) { //phantom
    let event: Web3Message = await $phantom_connect('solana');
    if (event.status == Web3Status.Success) {
      let account = event.data as Account;
      account.walletType = wt;
      onLoginSuccess(account);
    } else {
      processLoginFailed(event, wallet);
    }
  }


}
const onDialogOpened = () => {
  isLogin.value = false;
}
watch(() => props.open, (val) => {
  open.value = val;
});
onUnmounted(() => {
  window.clearTimeout(timer.value);
})

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.user-login {
  @include box($gap: 32px);
  flex-direction: column;
}


.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}

.sub-title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(12px, 400);
  color: $textColor2;
}

.user-login-wallets {
  @include box($gap: 20px);
  flex-direction: column;
}

.user-login-wallet {
  @include box($justify: flex-start, $height: 56px, $padding: 10px 16px, $gap: 12px);
  cursor: pointer;
  border-radius: 2px;
  background-color: $backgroundColor3;

  &:hover {
    background-color: $backgroundColor4;
  }

  .wallet-icon {
    @include box($width: 40px, $height: 40px);
    pointer-events: none;
  }

  .user-login-wallet-text {
    @include font(16px, 500);
    color: $textColor1;
  }
}

</style>
