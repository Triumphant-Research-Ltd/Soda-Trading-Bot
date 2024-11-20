<template>
  <div class="column gap-16 wallet-link">
    <div class="row flex-start title">{{ $t("Name004") }}</div>
    <div class="row flex-start gap-4 sub-title">
      <div class="row">
        <div class="row auto gap-4">
          <TokenAddress :address="store.walletAddress"
                        :chain-id="store.chainId"
                        :copyable="true"
                        :no-reduce="true"
                        :show-icon="true"
                        :linkable="false"
                        address-type="wallet"
          ></TokenAddress>
          <Image icon="icon-wallet-qrcode" :width="20" :height="20" :button="true" @click="openWalletQrCode"
                 :tooltip="$t('Trade071')"></Image>
        </div>
        <div class="flex"></div>
        <div class="row auto gap-8" v-if="props.state==BatchSellRunState.unknown"></div>
        <div class="row auto gap-8" v-else-if="props.state==BatchSellRunState.ready">
          <div class="bulk-button fill" @click="bulkSell">{{
              $t("Trade072")
            }}
          </div>
        </div>
        <div class="row auto gap-8" v-else-if="props.state==BatchSellRunState.selecting">
          <div class="bulk-button" @click="bulkCancelSelect">{{ $t("Trade074") }}</div>
          <div class="bulk-button fill  " @click="bulkConfirmSelect">{{ $t("Trade073") }}</div>
        </div>
        <div class="row auto gap-8" v-else-if="props.state==BatchSellRunState.beforeRunning">
          <ItemLoading theme="white"></ItemLoading>
        </div>
        <div class="row auto gap-8 flex-start" v-else>
          <ItemLoading theme="white"></ItemLoading>
          <div class="bulk-running">{{ ticker }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TokenAddress from "~/components/base/TokenAddress.vue";
import Image from "~/components/base/Image.vue";
import {BatchSellRunState} from "~/utils/constant";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {formatSeconds} from "~/utils/util";

interface BulkSellProps {
  state: BatchSellRunState,
  time: number
}

const emit = defineEmits(['start', 'confirm', 'cancel'])
const props = defineProps<BulkSellProps>();
const store = useAppStore();
const timer = ref<number>(0);
const time = ref<number>(0);
const ticker = computed(() => formatSeconds(time.value));
const connectToWallet = () => {
  store.bindWallet('8YAG6CPcnPCrEHcusPo4S7c4GT6tNQPdgtMvWfKKk3TQ');
}
const openWalletQrCode = () => {
  store.showWalletQrCode(true);
}
const bulkSell = () => {
  emit('start');
}
const bulkCancelSelect = () => {
  emit('cancel');
}
const bulkConfirmSelect = () => {
  emit('confirm');
}
const stopTimer = () => {
  if (timer.value > 0) {
    window.clearInterval(timer.value);
  }
}
const startTimer = () => {
  stopTimer();
  timer.value = window.setInterval(() => {
    time.value -= 1;
    if (time.value <= 0) {
      stopTimer();
    }
  }, 1000);
}

watch(() => props.state, (newState) => {
  if (newState == BatchSellRunState.running && time.value > 0) {
    startTimer();
  } else {
    stopTimer();
  }
});
watch(() => props.time, (newTime) => {
  time.value = newTime;
  if (newTime > 0) {
    startTimer();
  }
});
onMounted(() => {
  if (props.state == BatchSellRunState.running && time.value > 0) {
    startTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});
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
    white-space: nowrap;
    overflow: hidden;
  }

  .bulk-button {
    @include box($width: 106px, $height: 36px);
    cursor: pointer;
    color: $textColor1;
    border-radius: 2px;
    background-color: $blue1;
  }

  .bulk-button {
    @include box($width: 106px, $height: 36px);
    cursor: pointer;
    color: $textColor1;
    border-radius: 2px;
    border: 1px solid $line1;
    background-color: transparent;

    &.fill {
      background-color: $blue1;
      border: none;
    }
  }

  .bulk-running {
    @include box($justify: flex-start, $width: 68px, $height: 36px);
    white-space: nowrap;
    overflow: hidden;
    color: $textColor1;
    @include font(15px, 500);
  }

}
</style>
