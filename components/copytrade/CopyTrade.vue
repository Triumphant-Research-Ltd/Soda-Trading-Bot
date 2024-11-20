<script setup lang="ts">

import CopyTradeStepOne from "~/components/copytrade/StepOne.vue";
import CopyTradeStepTwo from "~/components/copytrade/StepTwo.vue";
import {useAppStore} from "#imports";
import NotFound from "~/components/base/NotFound.vue";


const store = useAppStore();
const step = ref<number>(1);
const copyTradeAddress = ref<string>('');
const taskName = ref<string>('');
const loading = ref(false);
const showStep = (value: number) => {
  return step.value == value;
}


const onSubmit = (address: string, name: string) => {
  copyTradeAddress.value = address;
  taskName.value = name;
  step.value = 2;
}
const onBack = () => {
  copyTradeAddress.value = "";
  taskName.value = "";
  step.value = 1;
}
const onSubmitCopyTradeTask = () => {
  let url = new URL(window.location.href);
  url.hash = "";
  url.pathname = "trades/trade"
  url.searchParams.set("t", UserTab.CopyTradeTask);
  window.location.href = url.href;
}
</script>

<template>
  <div class="column step" v-if="store.chainId=='solana'">
    <NotFound></NotFound>
  </div>
  <div class="column step" v-else>
    <CopyTradeStepOne v-if="showStep(1)" @submit="onSubmit"></CopyTradeStepOne>
    <CopyTradeStepTwo v-else :address="copyTradeAddress" :name="taskName" @back="onBack"
                      @submit="onSubmitCopyTradeTask"></CopyTradeStepTwo>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.step {
  padding: 42px 86px !important;

}


</style>
