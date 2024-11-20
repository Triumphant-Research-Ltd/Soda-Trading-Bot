<script setup lang="ts">

import Image from "~/components/base/Image.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {Solution} from "~/models/Solution";

interface SolutionSelectProps {
  solutions: Array<Solution>
  type: 0 | 1
  loading: boolean
  selected: Solution | undefined
}

const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const emit = defineEmits(['select', 'add', 'manage']);
const props = defineProps<SolutionSelectProps>();
const popoverVisible = ref<boolean>(false);
const selectedSolutionText = ref<string>('');
const selectedSolutionId = ref<string>('');
const solutions = ref<Solution[]>(props.solutions || [])
const manageSolution = () => {
  if (solutions.value.length == 0) {
    store.showMessageBox(t("CopyTrade010"), t("Message011"));
    return;
  }
  emit('manage', props.type);
}
const saveSolution = () => {
  if (solutions.value.length >= 3) {
    store.showMessageBox(t("CopyTrade010"), t("Message012"));
    return;
  }
  emit('add', props.type);
}
const openSolution = () => {
  popoverVisible.value = !popoverVisible.value;
}
const selectSolution = (solution: string) => {
  selectedSolutionId.value = solution;
  emit('select', solution);
  popoverVisible.value = false;
  for (let s of props.solutions) {
    if (s.id == solution) {
      selectedSolutionText.value = s.remark;
    }
  }
}
const menuItemClass = (id: string) => {
  return {
    "menu-item": true,
    "common-solution": true,
    "selected": selectedSolutionId.value == id
  }
}
watch(() => props.selected, (val) => {
  if (val) {
    selectedSolutionId.value = val.id;
    selectedSolutionText.value = val.remark
  } else {
    selectedSolutionId.value = undefined;
    selectedSolutionText.value = t("Name023");
  }
})
watch(() => props.solutions, (val) => {
  solutions.value = val;
})
onMounted(() => {
  if (props.selected) {
    selectedSolutionId.value = props.selected.id;
    selectedSolutionText.value = props.selected.remark
  } else {
    selectedSolutionId.value = undefined;
    selectedSolutionText.value = t("Name023");
  }
})
</script>

<template>
  <div class="row gap-8 flex-start" v-if="loading">
    <div class="banner-menu common-solution">
      <ItemLoading theme="white"></ItemLoading>
    </div>
  </div>
  <div class="row gap-8 flex-start" v-else>
    <el-popover placement="bottom" trigger="hover" :width="200" :show-arrow="false" effect="dark"
                popper-class="popover" :visible="popoverVisible">
      <template #reference>
        <div class="step-select-button gap-8" @click="openSolution">
          <Image icon="icon-solution" :disabled="true"></Image>
          <div class="step-select-button-text" v-if="selectedSolutionText">{{ selectedSolutionText }}</div>
          <div class="step-select-button-text" v-else>{{ $t("Name023") }}</div>
          <Image icon="icon-chevron-down" :disabled="true"></Image>
        </div>
      </template>
      <div class="banner-menu common-solution">
        <div :class="menuItemClass(solution.id)" @click="()=>selectSolution(solution.id)"
             v-for="solution in solutions"
             :key="solution.id">
          <div class="row auto flex-start gap-8">
            <Image icon="icon-solution-select" v-if="selectedSolutionId==solution.id"></Image>
            <div style="width: 20px;height: 20px" v-else></div>
            <span class="defaultText">{{ solution.remark }}</span>
          </div>
        </div>
      </div>
    </el-popover>
    <div class="step-manage-button" @click="manageSolution">{{ $t("CopyTrade010") }}</div>
    <div class="step-manage-button highlight" @click="saveSolution">{{ $t("CopyTrade011") }}</div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/scss/base" as *;
@use "assets/scss/global.variable" as *;


.step-select-button-text {
  width: 130px;
  color: $textColor1;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-select-button, .step-manage-button {
  background-color: $backgroundColor2;
  color: $textColor1;
  border-radius: 2px;
  cursor: pointer;

  &.highlight {
    background-color: $blue1;
  }
}

.step-select-button {
  @include box($width: 210px, $height: 40px, $padding: 12px);
}

.step-manage-button {
  @include box($width: 88px, $height: 40px);

}

</style>
