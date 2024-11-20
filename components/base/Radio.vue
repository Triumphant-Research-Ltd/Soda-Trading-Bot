<template>
  <div class="switch" @click="toggle">
    <Image icon="icon-radio-on" :width="16" :height="16" v-if="isStateOn" :disabled="true"/>
    <Image icon="icon-radio-off" :width="16" :height="16" v-else :disabled="true"/>
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
const isStateOn = computed(() => state.value === SwitchState.on);
const toggle = () => {
  if (state.value != SwitchState.on) {
    state.value = SwitchState.on;
  }
  emit('change', state.value);
}
watch(() => props.state, (newVal) => {
  state.value = newVal;
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.switch {
  @include box($width: auto, $height: auto, $gap: 8px);
  cursor: pointer;

  .text {
    color: $textColor1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
