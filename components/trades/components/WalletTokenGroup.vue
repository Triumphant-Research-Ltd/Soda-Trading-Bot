<script setup lang="ts">
import type {TokenGroup} from "~/models/TokenGroup";
import Image from "~/components/base/Image.vue";

interface TokenGroupProps {
  selected?: string,
  groups: Array<TokenGroup>;
}

const props = defineProps<TokenGroupProps>();
const selectedGroup = ref<string>(props.selected || '');
const emit = defineEmits(['selectGroup', 'closeGroup', 'addGroup']);
const tokenGroupSelectedClass = (group: string) => {
  return selectedGroup.value == group ? ["token-group", 'gap-4', "selected"] : ["token-group", 'gap-4'];
}
const selectGroup = (group: string) => {
  selectedGroup.value = group;
  emit('selectGroup', group)
}
watch(() => props.selected, (val) => {
  selectedGroup.value = val || '';
})
</script>

<template>
  <div class="row token-groups">
    <div :class="tokenGroupSelectedClass('')" @click="()=>selectGroup('')">
      <div class="row auto group-text disabled">{{ $t("Trade068") }}</div>
    </div>
    <div :class="tokenGroupSelectedClass(group.entry)" v-for="group in props.groups" :key="group.entry">
      <div class="row auto group-text" @click="()=>selectGroup(group.entry)">{{ group.name }}</div>
      <Image icon="icon-tokengroup-close" :width="16" :height="16" :button="true"
             @click="()=>emit('closeGroup', group.entry)"></Image>
    </div>
    <div v-if="props.groups.length<3" class="token-group center" @click="()=>emit('addGroup')">
      <div class="row auto group-text">
        <Image icon="icon-tokengroup-plus" :width="16" :height="16" :disabled="true"></Image>
      </div>
    </div>
    <div class="flex"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.token-groups {

  height: 40px;
  border-left: $border1;
}

.token-group {
  @include box($justify: space-between, $width: auto, $height: 40px, $padding: 0 16px);
  min-width: 88px;
  cursor: pointer;
  border-top: $border1;
  border-right: $border1;

  &.selected {
    background-color: $blue1;
  }

  &.center {
    justify-content: center;
  }

  .group-text {
    cursor: pointer;
    @include font(14px, 500);
    color: $textColor1;
    height: 100%;
    flex: 1;

    &.disabled {
      pointer-events: none;
    }
  }
}
</style>
