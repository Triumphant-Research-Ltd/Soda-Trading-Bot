<script setup lang="ts">

import Input from "~/components/base/Input.vue";
import {isAddress, isName} from "~/utils/util";
import ItemLoading from "~/components/base/ItemLoading.vue";

interface StepAddressInputProps {
  copyTradeAddress?: string
  loading: boolean
}

const emit = defineEmits(['submit']);
const {t} = useI18n({useScope: 'global'});
const props = defineProps<StepAddressInputProps>()
const store = useAppStore();
const allow = ref<boolean>(false);
const address = ref<string>(props.copyTradeAddress || '');
const taskName = ref<string>('');
const addressInputField = ref(null);
const nameInputField = ref(null);
const addressError = ref<string>('');
const nameError = ref<string>('');
const loading = ref(false);
const validate = (showErrorMessage: boolean = true) => {
  let addr = address.value;
  let name = taskName.value;
  if (addr.length == 0) {
    if (showErrorMessage) {
      store.showMessageBox(t('Home020'), t('Message005'));
      addressError.value = t('Message005');
      addressInputField.value?.focus();
    }
    return false;
  }
  if (!isAddress(addr)) {
    if (showErrorMessage) {
      store.showMessageBox(t('Home020'), t('Message008'));
      addressError.value = t('Message008');
      addressInputField.value?.focus();
    }
    return false;
  }
  if (name.length > 0) {
    if (!isName(name)) {
      if (showErrorMessage) {
        store.showMessageBox(t('Home020'), t('Message007'));
        nameError.value = t('Message007');
        nameInputField.value?.focus();
      }
      return false;
    }
  }
  return true;
}
const submitButtonClass = () => {
  return allow.value ? {
    'task-submit-button': true
  } : {
    'task-submit-button': true,
    'disabled': true
  }
}
const onSubmit = () => {
  if (!store.isLogin) {
    store.showLoginWalletDialog("0x1");
    return;
  }
  if (!store.hasWallet) {
    store.showMessageBox(t('Home020'), t('CopyTrade003'));
    return;
  }
  let ok = validate(true);
  if (!ok) {
    return;
  }
  let name = taskName.value;
  let addr = address.value;
  if (!name) {
    name = addr.substring(addr.length - 4);
  }
  if (!isAddress(store.userAddress) || !store.isLogin) {
    store.showLoginWalletDialog("0x1");
    return false;
  }

  if (!isAddress(store.walletAddress) || !store.hasWallet) {
    store.showMessageBox(t("Home020"), t("CopyTrade003"));
    return false;
  }
  emit('submit', addr, name);
}
const onBack = () => {
  let href = new URL(window.location.href);
  href.pathname = "/"
  window.location.href = href.href;
}
const inputAddressChange = (text: string) => {
  addressError.value = '';
  address.value = text;
  allow.value = validate(false)
}
const inputTaskNameChange = (text: string) => {
  nameError.value = '';
  taskName.value = text;
  allow.value = validate(false);
}
watch(() => props.copyTradeAddress, (value) => {
  address.value = value || '';
  allow.value = validate(false);
})
watch(() => props.loading, (val) => {
  loading.value = val;
})
</script>

<template>
  <div class="step-address-input">
    <div class="row gap-24">
      <div class="input-column">
        <div class="input-title">{{ $t("Name013") }}</div>
        <Input ref="addressInputField"
               :text="address"
               :max-length="64"
               :placeholder="$t('Message005')"
               :height="48"
               type="text"
               :width="618"
               :error="addressError"
               class="step-text-input"
               @change="inputAddressChange"></Input>
      </div>
      <div class="input-column">
        <div class="input-title">{{ $t("Name014") }}</div>
        <Input ref="nameInputField"
               :max-length="15"
               :placeholder="$t('Message006')"
               :height="48" type="text"
               :width="618"
               :error="nameError"
               class="step-text-input"
               @change="inputTaskNameChange"></Input>
      </div>
    </div>
    <div class="row flex-end gap-8">
      <div class="task-back-button" @click="onBack">{{ $t("CopyTrade004") }}</div>
      <div class="task-submit-button" v-if="loading">
        <ItemLoading theme="white"></ItemLoading>
      </div>
      <div :class="submitButtonClass()" @click="onSubmit" v-else>{{ $t("CopyTrade005") }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.step-address-input {
  @include box($padding: 32px 24px, $gap: 16px);
  flex-direction: column;
  border: $border1;
  border-radius: 2px;

}

.input-column {
  @include box($gap: 16px, $align: flex-start);
  flex-direction: column;
  flex: 1;
}

.input-title {
  color: $textColor1;
  @include font(16px, 400);
}

.task-back-button {
  @include box($width: 81px, $height: 36px);
  border: $border1;
  color: $textColor1;
  border-radius: 2px;
  cursor: pointer;
}

.task-submit-button {
  @include box($width: 81px, $height: 36px);
  border-radius: 2px;
  background-color: $blue1;
  color: $textColor1;
  cursor: pointer;

  &.disabled {
    color: rgba($textColor1, 0.8);
    background-color: rgba($backgroundColor2, 0.6);
    pointer-events: none;
    cursor: not-allowed;
  }
}

.step-text-input {
  background-color: $backgroundColor3;
}
</style>
