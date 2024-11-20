<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";
import Input from "~/components/base/Input.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";
import BigNumber from "bignumber.js";
import TokenAddress from "~/components/base/TokenAddress.vue";
import type {Result} from "~/models/Result";


const {t} = useI18n({useScope: 'global'});
const {$api} = useNuxtApp();
const store = useAppStore();
const loading = ref(false);
const text = ref<string>('');
const title = ref<string>('');
const open = ref<boolean>(false);
const symbol = ref('');
const token = ref('');
const to = ref('');
const action = ref('');
const tokenAmount = ref('');
const maxAmount = ref('');
const submitting = ref(false);
const textField = ref(null);
const canSubmit = ref(false);
const source = ref('');


const loadTokenAmount = async () => {
  let value = "";
  try {
    let result: Result
    if (token.value == defaultToken || token.value == defaultSolToken) {
      result = await $api.accountBalance();
      value = result.data?.toString() || "-";
    } else {
      result = await $api.tokenBalance(store.chainId, store.walletAddress, token.value);
      value = result.data?.balance?.toString() || '-';
    }
    let n = BigNumber(value);
    if (!n.isFinite()) {
      value = "-";
    } else {
      let z = n.decimalPlaces();
      if (z != undefined) {
        value = n.toFixed(z, 1);//ROUND_DOWN
      } else {
        value = n.toFixed();
      }
    }
  } catch (e: any) {
  } finally {
    loading.value = false;
    updateMaxAmount(value);
  }
}

const updateMaxAmount = (val: string) => {
  maxAmount.value = val;
  tokenAmount.value = maxAmount.value;
  canSubmit.value = allowSubmit();
}
const allowSubmit = () => {
  if (loading.value) {
    return false;
  }
  if (submitting.value) {
    return false;
  }
  if (isPositiveNumber(maxAmount.value) && isPositiveNumber(tokenAmount.value)) {
    let n1 = BigNumber(tokenAmount.value);
    let n2 = BigNumber(maxAmount.value);
    if (n1.isPositive() && n2.isPositive()) {
      if (n1.isZero() || n2.isZero()) {
        return false;
      }
      return n1.isLessThanOrEqualTo(n2);
    }

  }
  return false;

}
const onMaxAmount = () => {
  tokenAmount.value = maxAmount.value;
  canSubmit.value = allowSubmit();
}
const onDialogOpened = () => {
  tokenAmount.value = "";
  submitting.value = false;
  loading.value = true;
  setTimeout(() => {
    loadTokenAmount();
  }, 500);

}
const onInputValueChange = (value: string) => {
  tokenAmount.value = value;
  canSubmit.value = allowSubmit();
}
const onClose = () => {
  loading.value = true;
  canSubmit.value = false;
  store.hideTransferDialog();
}
const maxAmountValue = () => {
  if (isPositiveNumber(maxAmount.value)) {
    return maxAmount.value;
  }
  return "-"
}
const tokenMaxAmountClass = () => {
  if (isPositiveNumber(maxAmount.value)) {
    let n = BigNumber(maxAmount.value);
    if (n.isLessThan('0.0001', 10)) {
      return {'token-text': true, 'red': true}
    }
  }
  return {'token-text': true, 'green': true}
}
const end = () => {
  if (source.value == "flash") {
    let url = new URL(window.location.href);
    url.pathname = "trades/flash"
    url.searchParams.set("t", UserTab.FlashOrders)
    window.location.href = url.href;
  } else if (source.value == "sniper") {
    let url = new URL(window.location.href);
    url.pathname = "trades/sniper"
    url.searchParams.set("t", UserTab.SniperOrders)
    window.location.href = url.href;
  } else {
    let url = new URL(window.location.href);
    url.pathname = "trades"
    url.searchParams.set("t", UserTab.CopyTradeOrders)
    window.location.href = url.href;
  }

}
const transferOrSell = () => {
  if (submitting.value) {
    return;
  }
  submitting.value = true;
  setTimeout(() => {
    if (action.value == "transfer") {
      $api.transfer(token.value, tokenAmount.value).then(r => {
        if (r.code == 0) {
          setTimeout(() => {
            submitting.value = false;
            end();
          }, 1500);
        } else {
          submitting.value = false;
          store.showMessageBox(title.value, t("Transfer003"), "error");
        }
      }).catch(e => {
        submitting.value = false;
        store.showMessageBox(title.value, t("Transfer003"), "error");
      })
    } else {
      $api.manualSell(token.value, tokenAmount.value).then(r => {
        if (r.code == 0) {
          setTimeout(() => {
            submitting.value = false;
            end();
          }, 1500);
        } else {
          submitting.value = false;
          store.showMessageBox(title.value, t("Transfer005"), "error");
        }
      }).catch(e => {
        submitting.value = false;
        store.showMessageBox(title.value, t("Transfer005"), "error");
      })
    }
  }, 500);
}
const onSubmit = () => {
  if (submitting.value) {
    return;
  }
  let n = BigNumber(tokenAmount.value);
  if (n.isZero() || n.isNegative()) {
    store.showMessageBox(title.value, t("Transfer008"), "error");
    return;
  }
  let m = BigNumber(maxAmount.value);
  if (m.isZero() || m.isNegative()) {
    store.showMessageBox(title.value, t("Transfer008"), "error");
    return;
  }
  if (tokenAmount.value > maxAmount.value) {
    store.showMessageBox(title.value, t("Transfer007", {amount: maxAmount}), "error");
    return;
  }
  transferOrSell();
}
watch(() => loading.value, (val) => {
  if (!val) {
    textField.value?.focus();
  }
})
watch(() => store.transfer, (val) => {
  action.value = val.type;
  symbol.value = val.symbol;
  token.value = val.token;
  to.value = store.userAddress
  title.value = val.type == "transfer" ? t("Name076") : t("Name077");
  text.value = val.type == 'transfer' ? t("Transfer001", {action: t("ActionTitle004")}) : t("Transfer001", {action: t("ActionTitle005")});
  open.value = val.visible;
  source.value = val.source;
});
</script>
<template>
  <el-dialog :width="560"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :destroy-on-close="true"
             @opened="onDialogOpened"
  >
    <div class="transfer-content">
      <div class="row">
        <span class="title-text">{{ title }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="token-amount">
        <div class="row flex-start">
          <span class="transfer-text">{{ text }}</span>
        </div>
        <div class="row">
          <Input ref="textField"
                 height="40px"
                 type="text"
                 width="380px"
                 variant="borderless"
                 style="padding-left:0"
                 placeholder="0"
                 :text="tokenAmount"
                 :font-size="32"
                 :font-weight="500"
                 @change="onInputValueChange"></Input>
          <div class="flex"></div>
          <div class="max-button" @click="onMaxAmount">Max</div>
        </div>
      </div>

      <div class="token-info">
        <Image :token="token" :chain="store.chainId" :width="28" :height="28" :disabled="false"></Image>
        <span class="token-text">{{ symbol }}</span>
        <div class="flex"></div>
        <ItemLoading theme="white" v-if="loading"></ItemLoading>
        <span :class="tokenMaxAmountClass()" v-else>{{ $t('Trade010') }}:{{ maxAmountValue() }}</span>
        <div class="flex"></div>
        <TokenAddress :address="token" :chain-id="store.chainId" copyable linkable></TokenAddress>
      </div>
      <div class="token-info" v-if="action=='transfer'">
        <span class="token-text">{{ $t('Transfer009') }}</span>
        <div class="flex"></div>
        <TokenAddress :address="to" :chain-id="store.chainId" linkable copyable no-reduce
                      address-type="wallet"></TokenAddress>
      </div>
      <div class="tip-message">{{ $t("Transfer002") }}</div>
      <div class="blank"></div>
    </div>
    <template #footer>
      <div class="row auto gap-8">
        <div class="transfer-button" @click="onClose">{{ $t("Trade074") }}</div>
        <div class="transfer-button fill" v-if="submitting">
          <ItemLoading theme="white"></ItemLoading>
        </div>
        <div class="transfer-button disabled" v-else-if="!canSubmit||loading">{{ $t("Trade073") }}</div>
        <div class="transfer-button fill" @click="onSubmit" v-else>{{ $t("Trade073") }}</div>
      </div>
    </template>
  </el-dialog>
</template>


<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.transfer-content {
  @include box($gap: 10px);
  flex-direction: column;
}

.token-amount {
  @include box($padding: 16px, $direction: column, $gap: 10px);
  background-color: $backgroundColor3;
  border-radius: 2px;

}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}

.transfer-text {
  @include font(14px, 400);
  color: $textColor1;
}

.transfer-button {
  @include box($width: 221px, $height: 40px);
  @include font(14px, 500);
  cursor: pointer;
  color: $textColor1;
  border-radius: 2px;
  border: 1px solid $line1;
  background-color: transparent;


  &.disabled {
    background-color: $backgroundColor4;
    cursor: not-allowed;
    color: $textColor3;

  }

  &.fill {
    background-color: $blue1;
    border: none;
  }
}

.tip-message {
  @include box($padding: 16px);
  background-color: $backgroundColor3;
  color: $red1;
  border-radius: 2px;
}

.max-button {
  @include box($width: 60px, $height: 40px);
  cursor: pointer;
  color: $green1;
}

.token-text {
  color: $textColor1;
  @include font(14px, 500);

  &.green {
    color: $green1;
  }

  &.red {
    color: $red1;
  }
}

.token-info {
  @include box($padding: 16px, $gap: 8px);
  background-color: $backgroundColor3;
  border-radius: 2px;

}

.blank {
  width: 100%;
  height: 80px;
}
</style>
