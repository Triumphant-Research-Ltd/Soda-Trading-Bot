<template>
  <div class="row gap-4 trade-address">
    <Image v-if="props.showIcon && props.addressType == 'address'" :chain="props.chainId" :token="props.address"
           :width="24" :height="24"
           :disabled="true"></Image>
    <Image v-if="props.showIcon && isBlockies()" :blockies="props.address"
           :width="24" :height="24"
           :disabled="true"
           inner-class="blockies"></Image>
    <div :class="addressClass()" @click="openLink">{{
        props.noReduce ? props.address : reduceAddress(props.address, 5, 4)
      }}
    </div>
    <el-tooltip trigger="click" :content="$t('Message044')" placement="top">
      <Image v-if="props.copyable" icon="icon-address-copy" :button="true" :width="20"
             :height="20" @click="copyAddress"></Image>
    </el-tooltip>
  </div>
</template>
<script setup lang="ts">

import {addressLink, dexLink, hashLink, reduceAddress} from "~/utils/util";
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";

const emit = defineEmits(['click']);
const {t} = useI18n({useScope: 'global'});
const props = defineProps<{
  address: string,
  chainId: string,
  addressType?: "address" | "hash" | 'wallet' | "dex",
  showIcon?: boolean,
  copyable?: boolean,
  linkable?: boolean,
  noReduce?: boolean,
  button?: boolean,
  addressHighlight?: boolean,

}>();
const store = useAppStore();
const showCopiedMessage = ref(false);
const copiedKey = () => {
  if (props.addressType == "wallet") {//wallet address
    return 'Name006'
  } else if (props.addressType == 'hash') {//transaction hash
    return "Name003"
  }
  return 'Name001'//token address
}
const isBlockies = () => props.addressType == "hash" || props.addressType == "wallet"
const copyAddress = () => {
  copy(props.address, () => {
    // store.showMessageBox(t("ActionTitle001"), t("Message001", {name: t(copiedKey())}), "success")
  });
}
const gotoDex = () => {
  let link = ""
  if (props.addressType == "dex") {
    link = dexLink(props.chainId, props.address);
  } else if (props.addressType == "address") {
    link = addressLink(props.chainId, props.address);
  } else if (props.addressType == "hash") {
    link = hashLink(props.chainId, props.address);
  } else {
    link = addressLink(props.chainId, props.address);
  }
  window.open(link, "_blank");
}
const addressClass = () => {
  return {
    'address-text': true,
    'highlight': props.addressHighlight,
    'underline': props.linkable,
    'cursor-pointer': props.linkable || props.button
  }
}
const openLink = () => {
  if (props.linkable) {
    gotoDex();
  } else if (props.button) {
    emit('click')
  }
}
</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-address {
  width: auto !important;
  height: 26px;


  .address-text {
    white-space: nowrap;
    overflow: hidden;
    color: $textColor1;
    @include font(14px, 400);

    &.underline {
      text-decoration: underline;
    }

    &.highlight {
      color: $blue1;
      @include font(16px, 500);
    }

    &.cursor-pointer {
      cursor: pointer;
    }
  }
}

.blockies {
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
}
</style>
