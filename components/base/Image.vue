<template>
  <el-tooltip v-if="toolTipVisible" effect="dark" placement="top">
    <template #content>
      <div class="tooltip">
        <span>{{ props.tooltip }}</span>
      </div>
    </template>
    <div :class="imageClass()"
         :style="imageStyle()"
         @click="props.button ? onClick() : undefined">
      <img :src="imageSrc"
           :srcset="props.iconSet"
           :alt="props.alt"
           :width="props.width"
           :height="props.height"
           :class="props.innerClass"
           :style="props.innerStyle"
           @error="imageError"/>
    </div>
  </el-tooltip>
  <div v-else
       :class="imageClass()"
       :style="imageStyle()"
       @click="props.button ? onClick() : undefined">
    <img :src="imageSrc"
         :srcset="props.iconSet"
         :alt="props.alt"
         :width="props.width"
         :height="props.height"
         :class="props.innerClass"
         :style="props.innerStyle"
         @error="imageError"/>
  </div>
</template>

<script lang="ts" setup>

import {fallbackIconUrl, tokenIconUrl} from "~/utils/resource";

interface ImageProps {
  className?: string,
  token?: string,
  market?: string,
  icon?: string,
  blockies?: string,
  iconSet?: string,
  chain?: string,
  extension?: string,
  fallback?: string,
  alt?: string,
  width?: number,
  height?: number,
  button?: boolean,
  tooltip?: string,
  disabled?: boolean,
  innerClass?: string,
  innerStyle?: string,
  style?: { [key: string]: CSSStyleValue }
}

const props = defineProps<ImageProps>();
const emit = defineEmits(['click']);

const imageLink = () => {
  if (props.blockies) {
    return fallbackIconUrl();
  } else if (props.icon) {
    let ext = props.extension ? props.extension : "svg";
    return iconUrl(props.icon, ext);
  } else if (props.market) {
    let ext = props.extension ? props.extension : "webp";
    return marketIconUrl(props.market, ext);
  } else if (props.chain && props.token) {
    let ext = props.extension ? props.extension : "png";
    return tokenIconUrl(props.chain, props.token, ext);
  } else if (props.chain) {
    let ext = props.extension ? props.extension : "png";
    return chainIconUrl(props.chain, ext);
  }
  return ""
}

const imageSrc = ref(imageLink());

const toolTipVisible = computed(() => !!props.tooltip);

const imageClass = () => {
  let array: Array<string> = ["image"];
  if (props.className) {
    array.push(props.className);
  } else if (props.disabled) {
    array.push("disabled")
  }
  return array;
}

const imageStyle = () => {
  return {
    ...props.style,
    cursor: props.button ? 'pointer' : 'auto',
  }
}


const fallbackUrl = () => {
  if (props.fallback) {
    return props.fallback
  }
  return fallbackIconUrl();
};

const imageError = () => {
  imageSrc.value = fallbackUrl();
}

const onClick = () => {
  emit("click")
}
watch(imageLink, (newValue: string) => {
  imageSrc.value = newValue;
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/base.scss" as *;
@use "@/assets/scss/global.variable" as *;

.image {
  @include box($width: auto);
}

.disabled {
  pointer-events: none;
}

.tooltip {
  @include box($padding: 4px);
  @include font(14px, 500);
  max-width: 250px;
  color: $textColor1;
}
</style>
