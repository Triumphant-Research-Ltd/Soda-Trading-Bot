<template>
  <div class="row auto">
    <div :class="buttonSep"></div>
    <div :class="buttonClass" @click="onClick">
      <div class="row button-text-gap">
        <Image :icon="buttonIcon" :disabled="true"></Image>
        <span class="button-text">{{ $t(buttonText) }}</span>
        <div class="flex"></div>
        <Image icon="icon-home-arrow" :disabled="true"></Image>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";

interface IProps {
  type: "trade" | "sniper" | "trades";

}

const props = defineProps<IProps>();
const emit = defineEmits(['click'])
const buttonClass = computed(() => (props.type == "trade") ? ["home-action-button", "trade-button"] : ["home-action-button", "sniper-button"]);
const buttonIcon = computed(() => (props.type == "trade") ? "icon-home-copytrading" : "icon-home-sniper");
const buttonText = computed(() => {
  if (props.type == "trade") {
    return "Home020"
  } else if (props.type == "sniper") {
    return "Home021"
  }
  return "Home044"
});
const buttonSep = computed(() => {
  return (props.type == "trade") ? ["sep-decorate", "green"] : ["sep-decorate", "yellow"];
})

const onClick = () => {
  emit("click", props.type);
}

</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.button-text {
  @include font(20px, 500);
}

.button-text-gap {
  gap: 20px;
}

.home-action-button {
  @include box($padding: 20px 24px, $width: 638px);
  cursor: pointer;
  border: $border1;
  border-radius: 2px;
  color: $textColor1;
  height: 64px;
  border-left: none;

  &.trade-button {
    background-color: $backgroundColor0;
  }

  &.sniper-button {
    background-color: $backgroundColor3;
  }
}

.sep-decorate {
  width: 5px;
  height: 64px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border-top: $border1;
  border-bottom: $border1;
  border-left: $border1;

  &.green {
    background-color: $green1;
  }

  &.yellow {
    background-color: $yellow1;
  }
}
</style>
