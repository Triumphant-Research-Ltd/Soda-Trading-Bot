<template>
  <div class="row tab-bar">
    <div class="tabs">
      <div class="row gap-20">
        <div class="tab-item" v-for="(tab,index) in props.tabs" :key="tab">
          <div :class="tabClass(tab)" @click="()=>selectTab(tab)">
            {{ $t(tabString(tab)) }}
          </div>
          <div v-if="index!=props.tabs.length-1" class="separator"></div>
        </div>
      </div>
    </div>
    <div class="flex"></div>
    <div class="search">
      <Input type="text"
             variant="borderless"
             :max-length="64"
             :text="term"
             :placeholder="placeholder"
             :width="380"
             :height="48"
             @submit="onSearch"
             @change="onSearchTermChange"
      />
      <Image icon="icon-search" :button="true" @click="onSearch"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {UserTab} from "~/utils/constant";
import Input from "~/components/base/Input.vue";
import Image from "~/components/base/Image.vue";

interface TabBarProps {
  placeholder?: string,
  selectedTab: UserTab,
  tabs: UserTab[]
}

const emit = defineEmits(['search', 'change']);
const props = defineProps<TabBarProps>();
const term = ref<string>('');
const selectedTab = ref<UserTab>(props.selectedTab);
const placeholder = computed(() => props.placeholder);

const tabClass = (tab: UserTab) => (tab === selectedTab.value) ? ["tab", "selected"] : ["tab"];

const selectTab = (tab: UserTab) => {
  selectedTab.value = tab;
  emit('change', tab);
}
const onSearch = () => {
  emit('search', term.value);
}
const onSearchTermChange = (text: string) => {
  term.value = text;
}

const tabString = (tab: UserTab) => {
  switch (tab) {
    case UserTab.CopyTradeOrders:
      return "TabBar001";
    case UserTab.CopyTradeTask:
      return "TabBar002";
    case UserTab.SniperOrders:
      return "TabBar001";
    case UserTab.SniperTask:
      return "TabBar002";
    case UserTab.FlashOrders:
      return "TabBar001";
    case UserTab.FlashTask:
      return "TabBar002";
    case UserTab.Wallet:
      return "TabBar005";
    default:
      return "";
  }
}

watch(() => props.selectedTab, (val) => selectedTab.value = val);

</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.tab-bar {
  justify-content: space-between;

  .tabs {
    @include box($justify: flex-start, $width: auto);

    .gap-20 {
      gap: 20px;
    }

    .tab-item {
      @include box($width: auto, $height: auto, $gap: 20px);

      .tab {
        @include box($width: auto, $height: 40px);
        cursor: pointer;
        color: $textColor2;
        @include font(16px, 500);

        &.selected {
          color: $textColor1;
        }
      }

      .separator {
        width: 2px;
        height: 20px;
        background-color: $line1;
      }
    }

  }


  .search {
    @include box($gap: 8px, $padding: 0 24px, $width: auto, $height: 48px);
    border: $border1;
    border-radius: 1000px;
  }
}

.input {
  border: none;
  background-color: transparent;
  color: $textColor1;
}


</style>
