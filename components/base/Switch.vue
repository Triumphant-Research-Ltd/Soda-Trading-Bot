<template>
  <div class="switch" @click="toggle">
    <Image icon="icon-switch-on" :width="38" :height="20" v-if="isStateOn" :disabled="true"/>
    <Image icon="icon-switch-off" :width="38" :height="20" v-else :disabled="true"/>
    <div class="text" v-if="props.text">{{ props.text }}</div>
  </div>

</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {SwitchState} from "~/utils/constant";

interface SwitchProps {
  state: SwitchState,
  text?: string
}

const emit = defineEmits(['change']);
const props = defineProps<SwitchProps>();
const state = ref<SwitchState>(props.state);
const isStateOn = computed(() => state.value === SwitchState.on);
const toggle = () => {
  let old = state.value;
  if (state.value === SwitchState.on) {
    state.value = SwitchState.off;
  } else {
    state.value = SwitchState.on;
  }
  emit('change', state.value);
}
watch(() => props.state, (val) => state.value = val)
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
