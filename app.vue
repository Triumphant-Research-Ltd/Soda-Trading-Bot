<template>
  <NuxtLayout>
    <el-config-provider :locale="esLocale">
      <div class="main">
        <div class="container">
          <Banner @navigate="onNavigate"></Banner>
          <NuxtPage></NuxtPage>
          <ProfitImage></ProfitImage>
          <Transfer></Transfer>
          <UserWallet></UserWallet>
          <WalletQrCode></WalletQrCode>
          <UserLogin :open="showSolanaLoginDialog" @close="onSolanaLoginDialogClose"></UserLogin>
          <MessageBox></MessageBox>
        </div>
      </div>
    </el-config-provider>
  </NuxtLayout>
</template>
<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import Banner from "@/components/banner/Banner.vue";
import {NavigationRoute, WalletType} from "~/utils/constant";
import MessageBox from "~/components/base/MessageBox.vue";
import WalletQrCode from "~/components/base/WalletQrCode.vue";
import UserWallet from "~/components/base/UserWallet.vue";
import Transfer from "~/components/base/Transfer.vue";
import {formatChain, useCookie, useI18n, useNuxtApp, useRoute} from "#imports";
import {isChain, parseWalletType,} from "~/utils/util";
import {Account} from "~/models/Account";
import {Result} from "~/models/Result";
import ProfitImage from "~/components/base/ProfitImage.vue";
import type {AppKit} from "@web3modal/base";
import {useDisconnect, useSwitchNetwork, useWeb3ModalAccount, useWeb3ModalProvider} from "@web3modal/ethers/vue";
import UserLogin from "~/components/base/UserLogin.vue";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

const isLogin = ref(false);
const {t} = useI18n({useScope: 'global'});
const route = useRoute();
const q = route.query.q || '';
const tokenCookie = useCookie('token');
const localForage = useLocalForage();
const {
  $bus,
  $i18n,
  $api,
  $setupWalletConnect,
  $createEvmMessage,
} = useNuxtApp();

$i18n.setLocale('en');
dayjs.extend(utc);

const modal: AppKit = $setupWalletConnect();
const account = useWeb3ModalAccount();
const store = useAppStore();
const esLocale = computed(() => $i18n.getLocaleCookie() === 'cn' ? zhCn : en);
const showSolanaLoginDialog = ref(false);
const accessToken = useCookie('token');

const onSolanaLoginDialogClose = () => {
  showSolanaLoginDialog.value = false;
}


const showError = (e: any) => {
  let msg: string;
  if (e.info) {
    let error = e.info.error;
    if (error) {
      msg = error.message;
    }
  } else {
    msg = e.message
  }
  if (!msg) {
    msg = t(`Web3Error${WalletError.ErrorUnknown}`)
  }
  store.showMessageBox(t("ActionTitle008"), msg, "error");
}

const cleanup = async () => {
  try {
    await localForage.removeItem('account')
  } catch (e: any) {
  } finally {
    tokenCookie.value = null;
    store.logout();
    $bus.dispatch(AppEvent.Logout);
    try {
      const {disconnect} = useDisconnect();
      await disconnect();
    } catch (e: any) {

    }
  }
}
const isHome = () => {
  return route.path == "/"
}

const onLoginSuccess = async (account: Account, walletType: WalletType) => {
  let result: Result = await $api.userLogin(account, q);
  if (result.code == 0) {
    let data = result.data;
    account.wallet = data?.wallet || '';
    account.walletType = walletType;
    store.login(account.chainId, account.address, account.wallet, walletType);
    $bus.dispatch(AppEvent.ChainChange);
    $bus.dispatch(AppEvent.RefreshBalance);
    try {
      let info = JSON.stringify(account.raw);
      localForage.setItem("account", info).catch((e) => {
      });
    } catch (e: any) {

    } finally {
      if (modal.isOpen()) {
        modal.close().catch(console.error);
      }
    }

  } else {
    // showError(result);
  }
}



const signEvm = async (address: string): Promise<{ ts: number, signature: string }> => {
  const {walletProvider} = useWeb3ModalProvider();
  const provider = walletProvider.value
  let message = $createEvmMessage(address);
  let msg = message.msg;
  let ts = message.ts;
  let signature: string;

  try {
    let sig = await provider.send('personal_sign', [msg, address]);
    if (sig.result) {
      signature = sig.result;
    } else {
      signature = sig.toString();
    }
  } catch (e: any) {
    signature = "";
  }
  return {ts, signature};
}



const switchChain = async (targetChainId: string) => {
  try {

    if (!isChain(targetChainId)) {
      let e = new Error(t(`Web3Error${WalletError.ErrorChainNotSupported}`))
      showError(e);
      return;
    }

    if (targetChainId == 'solana') {
      showSolanaLoginDialog.value = true;
      return;
    }
    let address = modal.getAddress();
    let chain = modal.getChainId();
    if (chain == undefined || address == undefined) {
      await modal.open({view: 'Connect'})
      return
    }

    const walletConnectChainId = formatChain(chain)
    if (walletConnectChainId != targetChainId) {
      const newWalletConnectChainId = parseInt(targetChainId);
      const {switchNetwork} = useSwitchNetwork();
      await switchNetwork(newWalletConnectChainId);
    } else {
      address = modal.getAddress();
      const newChainId = modal.getChainId();
      if (newChainId == undefined || address == undefined) {
        await modal.open({view: 'Connect'})
        return
      }
      const newWalletChainId = formatChain(newChainId)
      await connectEvm(address, newWalletChainId)
    }
  } catch (e: any) {
    console.error(e);
  }

}

const onNavigate = (route: NavigationRoute, data: any = null) => {
  let url: URL;
  switch (route) {
    case NavigationRoute.Home:
      window.location.pathname = "/"
      break;
    case NavigationRoute.Trending:
      window.location.pathname = "/smartmoney/trending"
      break;
    case NavigationRoute.CopyTrade:
      url = new URL(window.location.href);
      url.pathname = "trades";
      url.searchParams.set("t", UserTab.CopyTradeOrders);
      window.location.href = url.href;
      break;
    case NavigationRoute.SniperTrade:
      url = new URL(window.location.href);
      url.pathname = "/trades/sniper";
      url.searchParams.set("t", UserTab.SniperOrders);
      window.location.href = url.href;
      break;
    case NavigationRoute.FlashTrade:
      url = new URL(window.location.href);
      url.pathname = "/trades/flash";
      url.searchParams.set("t", UserTab.FlashOrders);
      window.location.href = url.href;
      break;
    case NavigationRoute.SmartMoney:
      window.location.pathname = "smartmoney"
      break;
    case NavigationRoute.BackTesting:
      window.location.pathname = "backtesting"
      break;
    case NavigationRoute.Ranking:
      window.location.pathname = "integral"
      break;
    case NavigationRoute.Twitter:
      window.open("https://x.com/SodaBotHQ", "_blank");
      break;
    case NavigationRoute.Discord:
      window.open("https://discord.gg/G5MQ2gQFma", "_blank");
      break;
    case NavigationRoute.Telegram:
      window.open("https://t.me/SodaBotAnn", "_blank");
      break;
    case NavigationRoute.Wallet:
      url = new URL(window.location.href);
      url.pathname = "trades"
      url.searchParams.set("t", UserTab.Wallet);
      window.location.href = url.href;
      break;
    case NavigationRoute.PromotionCode:
      url = new URL(window.location.href);
      url.pathname = "referral"
      window.location.href = url.href;
      break;
    case NavigationRoute.Disconnect:
      cleanup();
      break;
    case NavigationRoute.Login:
      isLogin.value = true;
      let ok = modal.getIsConnected()
      if (ok) {
        modal.open({view: 'Account'})
        return
      }
      modal.open({view: 'Connect'})
      break;
    case NavigationRoute.SwitchChain:
      let chainId = data.toString();
      if (chainId != "solana") {
        isLogin.value = true
      }
      switchChain(chainId)
      break;
    case NavigationRoute.TGChannel:
      let chan = data?.toString() || '';
      openChannel(chan);
      break;
    case NavigationRoute.Docs:
      window.open("https://sodabot-1.gitbook.io/sodabot", "_blank")
      break;
  }
}
const openChannel = (chainId: string) => {
  let channelId: string;
  if (chainId == "0x1") {
    channelId = "sodaboteth"
  } else if (chainId == "0x38") {
    channelId = "sodabotbsc"
  } else if (chainId == "0x2105") {
    channelId = "sodabotbase"
  } else {
    channelId = "sodabotsolana"
  }
  let href = `https://t.me/${channelId}`;
  window.open(href, "_blank");
}
const onRequestChangeChain = (chainId: string) => {
  onNavigate(NavigationRoute.SwitchChain, chainId);
}

const showToast = (message: string) => {
  ElMessage({plain: true, customClass: "app-el-message", message: message, duration: 1500});
}
const connectEvm = async (address: string, chainId: string) => {
  try {
    if (address == undefined || chainId == undefined) {
      await modal.open({view: 'Connect'})
      return
    }
    
    let signatureData = await signEvm(address);
    let account = new Account();
    account.signatureTime = signatureData.ts;
    account.signature = signatureData.signature;
    account.address = address;
    account.chainId = chainId;
    await onLoginSuccess(account, WalletType.WalletConnect);

  } catch (e: any) {
    console.error(e);
  } finally {
    isLogin.value = false;
  }
}

const loadAccount = async () => {
  try {
    if (accessToken.value) {
      let accountObj: string | null = await localForage.getItem('account');
      if (accountObj != null) {
        let account = JSON.parse(accountObj);
        if (account && account.address) {
          let wt = parseWalletType(account.walletType);
          store.login(account.chainId, account.address, account.wallet, wt)
        }
      }
    }

  } catch (err: any) {

  }
}


watch(() => store.loginWallet, (val) => {
  if (val.visible) {
    if (val.chainId == 'solana') {
      showSolanaLoginDialog.value = true;
    } else {
      if (account.isConnected.value && account.address.value != undefined && account.chainId.value != undefined) {
        modal.open({view: 'Account'})
        return;
      }
      modal.open({view: 'Connect'})
    }

  } else {
    modal.close().catch(console.error);
    showSolanaLoginDialog.value = false;
  }
});

const connect = async (address: string, chainId: number) => {
  if (!isLogin.value) {
    return;
  }
  const chain = formatChain(chainId)
  if (chain == "0x1" || chain == "0x38" || chain == "0x2105") {
    await connectEvm(address, chain)
  } else {
    isLogin.value = false;
    store.showMessageBox(t("UserLogin001"), t("Web3Error001"))
  }
}


const onAddressChange = async (address: string | undefined) => {
  if (address != undefined && account.chainId.value != undefined && account.isConnected.value) {
    await connect(address, account.chainId.value)
  }
}
const onChainChange = async (chainId: number | undefined) => {
  if (account.address.value != undefined && chainId != undefined && account.isConnected.value) {
    await connect(account.address.value, chainId)
  }
}
const onConnectStateChange = (connected: boolean) => {
  if (!connected) {
    cleanup();
  }
  isLogin.value = false;
}
watch(account.address, onAddressChange)
watch(account.chainId, onChainChange)
watch(account.isConnected, onConnectStateChange)


onMounted(() => {
  $bus.on(AppEvent.RequestSwitchChain, onRequestChangeChain)
  $bus.on(AppEvent.Toast, showToast);
  loadAccount();
})
onUnmounted(() => {
  $bus.off(AppEvent.RequestSwitchChain, onRequestChangeChain)
  $bus.off(AppEvent.Toast, showToast);
})


</script>
