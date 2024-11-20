<template>
  <el-dialog :width="503"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpened"
  >
    <div class="message-box-content">
      <div class="row">
        <span class="title-text">{{ $t("Name006") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column gap-32">
        <div class="row">
          <canvas class="qr-image" ref="qrImage" :width="217" :height="217"></canvas>
        </div>
        <div class="balance">
          <div class="row flex-start" v-if="loading">
            <ItemLoading theme="white"></ItemLoading>
          </div>
          <div class="row flex-start gap-4" v-else>
            <div class="balance-text">{{ formatTokenAmount(balance, true) }}&nbsp;&nbsp;{{
                nativeToken(store.chainId)
              }}
            </div>
            <div class="flex"></div>
            <div class="balance-title">{{ $t('Name007') }}</div>
          </div>
        </div>
        <div class="balance">
          <div class="defaultText">{{ store.walletAddress }}</div>
          <div class="flex"></div>
          <el-tooltip :content="$t('Message044')" trigger="click" placement="top">
            <Image icon="icon-address-copy" :width="16" :height="16" :button="true" @click="copyAddress"></Image>
          </el-tooltip>
        </div>

        <div class="row tip-text">{{
            $t("WalletQrCode001", {chain: chainName(), token: nativeToken(store.chainId)})
          }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";
import ItemLoading from "~/components/base/ItemLoading.vue";
import QRCode from 'qrcode'
import {formatTokenAmount, nativeToken} from "~/utils/util";

const store = useAppStore();
const {$api} = useNuxtApp();
const {t} = useI18n({useScope: 'global'});
const qrImage = ref(null);
const balance = ref('-');
const loading = ref<boolean>(false);
const open = ref<boolean>(false);

const chainName = () => {
  if (store.chainId == "0x1") {
    return t("Name008");
  } else if (store.chainId == "0x38") {
    return t("Name009");
  } else if (store.chainId == "0x2105") {
    return t("Name010");
  }
  return t("Name011");
}
const onClose = () => {
  store.showWalletQrCode(false);
}
const copyAddress = () => {
  copy(store.walletAddress, () => {
    // store.showMessageBox(t("ActionTitle001"), t("Message001", {name: t("Name006")}), "success")
  });
}
const loadAccountBalance = async () => {
  try {
    let result = await $api.accountBalance()
    if (result.code == 0) {
      return result
    }
  } catch (e: any) {

  }

  return {code: 0, message: "success", data: "-"}
}
const loadQrCode = () => {
  let opts: any = {
    errorCorrectionLevel: 'H',
    type: 'image/webp',
    quality: 1,
    margin: 1,
    color: {
      dark: "#000",
      light: "#FFF"
    }
  }
  if (qrImage.value) {
    let cv = qrImage.value as HTMLCanvasElement;
    let addr: string = store.walletAddress;
    QRCode.toCanvas(cv, addr, opts, (err) => {

    });
  }

}
watch(() => store.walletQrCode, (val) => {
  open.value = val;
});
const onDialogOpened = () => {
  loading.value = true;
  setTimeout(() => {
    loadAccountBalance().then(r => {
      balance.value = r.data || '-';
    }).catch(e => {
    }).finally(() => {
      loading.value = false;
    });
  }, 500);
  loadQrCode();
}
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.message-box-content {
  @include box($gap: 32px);
  flex-direction: column;
}


.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}

.qr-image {
  @include box($padding: 8px);
  background-color: $backgroundColor4;
  border-radius: 8px;
  width: 217px;
  height: 217px;
}

.balance {
  @include box($justify: flex-start, $gap: 4px);
  background-color: $backgroundColor3;
  padding: 12.5px 16px;
}

.balance-text {
  @include font(18px, 500);
  color: $textColor1;
  flex: 1;
}

.balance-title {
  @include font(14px, 400);
  color: $textColor2;
  width: auto;
}

.tip-text {
  color: $red1;
}
</style>
