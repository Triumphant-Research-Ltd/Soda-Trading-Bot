<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import Checkbox from "~/components/base/Checkbox.vue";
import Switch from "~/components/base/Switch.vue";
import {SwitchState} from "~/utils/constant";

interface SniperInfoBarProps {
  text: string
  buyTxProtect: SwitchState
  advanceSettings: SwitchState
  customSell: SwitchState
  limitPrice: SwitchState
}

const store = useAppStore();
const props = defineProps<SniperInfoBarProps>()
const advanceSettings = ref<SwitchState>();
const customSell = ref<SwitchState>();
const limitPrice = ref<SwitchState>();
const buyTxProtect = ref<SwitchState>(props.buyTxProtect);
const emit = defineEmits(['change', 'buyTxProtectChange']);
const onAdvanceSettingsChange = (state: SwitchState) => {
  advanceSettings.value = state;
  emit('change', 0, state);
}
const onLimitPriceChange = (state: SwitchState) => {
  limitPrice.value = state;
  emit('change', 1, state);
}
const onCustomSellChange = (state: SwitchState) => {
  customSell.value = state;
  emit('change', 2, state);
}
const onBuyTxProtectChange = (state: SwitchState) => {
  buyTxProtect.value = state;
  emit('buyTxProtectChange', state);
}
watch(() => props.advanceSettings, (val) => {
  advanceSettings.value = val;
})
watch(() => props.customSell, (val) => {
  customSell.value = val;
})
watch(() => props.limitPrice, (val) => {
  limitPrice.value = val;
})
</script>

<template>
  <div class="sniper-info-bar">
    <div class="row flex-start gap-8">
      <Image icon="icon-sniper-settings" :width="28" :height="28" :disabled="false"></Image>
      <span class="text">{{ props.text }}</span>
    </div>
    <div class="row gap-8 flex-start">
      <div class="row gap-8 auto">
        <span class="defaultText">{{ $t('Name026') }}</span>
        <Switch :state="buyTxProtect" text="" @change="onBuyTxProtectChange"></Switch>
      </div>
      <Checkbox :state="advanceSettings" :text="$t('Name035')" @change="onAdvanceSettingsChange"></Checkbox>
      <Checkbox :state="limitPrice" :text="$t('Name036')"
                @change="onLimitPriceChange"></Checkbox>
      <Checkbox :state="customSell" :text="$t('Name037')" @change="onCustomSellChange"></Checkbox>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.sniper-info-bar {
  @include box($justify: space-between, $gap: 16px, $padding: 8px, $direction: column);
}

.text {
  @include font(18px, 500);
  color: $textColor1;
}
</style>
