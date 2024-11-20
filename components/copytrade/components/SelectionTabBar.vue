<script setup lang="ts">
interface SelectionTabBarProps {
  tabs: Array<{ label: string, value: string, i18n?: boolean }>
  defaultTab: string
  disabled?: boolean
}

const emit = defineEmits(['change']);
const props = defineProps<SelectionTabBarProps>();
const selectedTab = ref<string>(props.defaultTab);
const tabBarClass = () => {
  return {
    'tab-bar': true,
    'disabled': props.disabled
  }
}

const selectTab = (tab: string) => {
  if (selectedTab.value === tab) {
    return;
  }
  selectedTab.value = tab;
  emit('change', tab);
}
const selectedTabClass = (tab: string) => {
  return {
    'tab': true,
    'selected': selectedTab.value === tab,
  }
}
</script>

<template>
  <div :class="tabBarClass()">

    <div :class="selectedTabClass(tab.value)" v-for="tab in props.tabs" :key="tab.value"
         @click="()=>{!props.disabled&&selectTab(tab.value);}">
      <span v-if="tab.i18n">{{ $t(tab.label) }}</span>
      <span v-else>{{ tab.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.tab-bar {
  @include box($width: auto, $height: auto, $padding: 4px);
  border: $border1;
  border-radius: 2px;
  background-color: black;

  &.disabled {
    pointer-events: none;
    cursor: default !important;
  }

  .tab {
    @include box($width: auto, $height: 32px, $padding: 8px);
    color: $textColor2;
    cursor: pointer;
    min-width: 48px;
    border-radius: 2px;

    &.selected {
      background-color: $backgroundColor4;
      color: $textColor1;
    }
  }
}
</style>
