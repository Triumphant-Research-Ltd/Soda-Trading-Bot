<script setup lang="ts">

import SolutionSelect from "~/components/base/SolutionSelect.vue";
import Image from "~/components/base/Image.vue";
import Radio from "~/components/base/Radio.vue";
import Switch from "~/components/base/Switch.vue";
import {Solution} from "~/models/Solution";

interface SniperSolutionProps {
  solutionList: Array<Solution>
  selectedSolution: Solution
  loading: boolean
  highSpeedBuy: SwitchState
  secureBuy: SwitchState
  commonSolution: SwitchState
}

const props = defineProps<SniperSolutionProps>();

const emit = defineEmits(['select', 'add', 'manage', 'secureBuyChange', 'highSpeedBuyChange', 'commonSolutionChange']);
const highSpeedBuy = ref<SwitchState>(SwitchState.off);
const secureBuy = ref<SwitchState>(SwitchState.off);

const showCommonSolution = ref<SwitchState>(props.commonSolution);
const selectedSolution = ref<Solution>(props.selectedSolution);
const solutionList = ref<Array<Solution>>(props.solutionList || []);
const loading = ref(props.loading);

const onSelectSolution = (solution: string) => {
  emit('select', solution);
}
const onAddSolution = (type: number) => {
  emit('add');
}
const onManageSolution = (type: number) => {
  emit('manage');
}
const onHighSpeedBuyChange = (state: SwitchState) => {
  highSpeedBuy.value = state;
  secureBuy.value = state == SwitchState.on ? SwitchState.off : SwitchState.on;
  emit('highSpeedBuyChange', state);
}
const onSecureBuyChange = (state: SwitchState) => {
  secureBuy.value = state;
  highSpeedBuy.value = state == SwitchState.on ? SwitchState.off : SwitchState.on;
  emit('secureBuyChange', state);
}

const onShowCommonSolutionChange = (state: SwitchState) => {
  showCommonSolution.value = state;
  emit('commonSolutionChange', state);
}
const onPopoverShow = () => {
  if (props) {
    buyTxProtect.value = props.buyTxProtect
    highSpeedBuy.value = props.highSpeedBuy;
    secureBuy.value = props.secureBuy;
    showCommonSolution.value = props.commonSolution;
    solutionList.value = props.solutionList;
    selectedSolution.value = props.selectedSolution;
  }
}
watch(() => props.loading, val => loading.value = val);
watch(() => props.selectedSolution, (val) => selectedSolution.value = val);
watch(() => props.solutionList, (val) => solutionList.value = val);
watch(() => props.buyTxProtect, (val) => buyTxProtect.value = val);
watch(() => props.highSpeedBuy, (val) => highSpeedBuy.value = val);
watch(() => props.secureBuy, (val) => secureBuy.value = val);
watch(() => props.commonSolution, (val) => showCommonSolution.value = val);
</script>

<template>
  <div class="solution-bar">
    <SolutionSelect
        v-if="showCommonSolution"
        :loading="loading"
        :selected="selectedSolution"
        :solutions="solutionList"
        :type="1"
        @select="onSelectSolution"
        @add="onAddSolution"
        @manage="onManageSolution"
    ></SolutionSelect>
    <div class="flex"></div>
    <el-popover placement="bottom" trigger="click" :width="320" effect="dark" popper-class="popover"
                @after-enter="onPopoverShow">
      <template #reference>
        <Image icon="icon-settings" :width="20" :height="20" :button="true"></Image>
      </template>
      <div class="sniper-settings">
        <div class="row gap-8">
          <div class="header">{{ $t("Sniper003") }}</div>
          <div class="tail">
            <Radio :state="highSpeedBuy" :text="$t('Name024')" @change="onHighSpeedBuyChange"></Radio>
          </div>
        </div>
        <div class="row gap-8">
          <div class="header"></div>
          <div class="tail">
            <Radio :state="secureBuy" :text="$t('Name025')" @change=" onSecureBuyChange" :tooltip="$t('TaskTooltip002')"></Radio>
          </div>
        </div>
        <div class="row gap-8">
          <div class="header">{{ $t("Name023") }}</div>
          <div class="tail">
            <Switch :state="showCommonSolution" text="" @change="onShowCommonSolutionChange"></Switch>
          </div>
        </div>
      </div>
    </el-popover>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.solution-bar {
  @include box($justify: space-between, $height: 40px);
}

.sniper-settings {
  @include box($direction: column, $gap: 8px, $padding: 16px);
  background-color: $backgroundColor2;
  border-radius: 2px;

  .header {
    @include box($justify: flex-start, $width: auto);
    min-width: 140px;
    color: $textColor1;
  }

  .tail {
    @include box($justify: flex-start, $width: 170px);
  }
}
</style>
