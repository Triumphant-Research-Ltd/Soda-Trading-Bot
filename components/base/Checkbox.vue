<template>
  <div class="switch" @click="toggle">
    <Image icon="icon-checkbox-on" :width="16" :height="16" v-if="isStateOn()" :disabled="true"/>
    <Image icon="icon-checkbox-off" :width="16" :height="16" v-else :disabled="true"/>
    <div class="text" v-if="props.text">{{ props.text }}</div>
    <Image icon="icon-info" :width="12" :height="12" v-if="props.tooltip" :tooltip="props.tooltip"/>
  </div>

</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {SwitchState} from "~/utils/constant";

interface CheckboxProps {
  state: SwitchState,
  text?: string
  tooltip?: string
}

const emit = defineEmits(['change']);
const props = defineProps<CheckboxProps>();
const state = ref<SwitchState>(props.state);
const isStateOn = () => state.value === SwitchState.on;
const toggle = () => {
  let old = state.value;
  if (old === SwitchState.on) {
    state.value = SwitchState.off;
  } else {
    state.value = SwitchState.on;
  }
  emit('change', state.value);
}
watch(() => props.state, (val) => {
  state.value = val;
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.switch {
  @include box($width: auto, $height: auto, $gap: 6px);
  cursor: pointer;

  .text {
    color: $textColor1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
