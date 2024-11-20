<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             @opened="onDialogOpened"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
  >
    <template #footer>
      <div class="row gap-8">
        <div class="bulk-button" @click="onCancel">{{ $t("Trade074") }}</div>
        <div class="bulk-button fill" @click="onSubmit">{{ $t("Trade073") }}</div>
      </div>
    </template>
    <div class="new-token-group">
      <div class="row">
        <span class="title-text">{{ $t("Trade076") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onCancel"></Image>
      </div>
      <Input
          ref="inputField"
          :text="text"
          :height="48"
          type="text"
          :width="400"
          :placeholder="$t('Message002')"
          variant="outlined"
          @change="onTextChange"
          class-name="token-group-name-input"/>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import {useAppStore} from "~/stores/appstore";

interface NewTokenGroupProps {
  visible: boolean,
}

const {t} = useI18n({useScope: "global"});
const store = useAppStore();
const emit = defineEmits(['submit']);
const props = defineProps<NewTokenGroupProps>();
const inputField = ref(null);
const text = ref<string>('');
const open = ref<boolean>(false);
const onCancel = () => {
  open.value = false;
  emit('submit', '');
}
const onSubmit = () => {
  if (!isGroupName(text.value)) {
    store.showMessageBox(t("Trade076"), t("Message003"));
    return;
  }
  open.value = false;
  emit('submit', text.value);
}
const onTextChange = (val: string) => {
  text.value = val;
}
const onDialogOpened = () => {
  inputField.value?.focus();
}
watch(() => props.visible, (val) => {
  open.value = val;
  text.value = '';
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.new-token-group {
  @include box($gap: 32px);
  flex-direction: column;

}

.token-group-name-input {
  padding: 0 !important;
}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}


.bulk-button {
  @include box($width: auto, $height: 40px);
  @include font(14px, 500);
  flex: 1;
  cursor: pointer;
  color: $textColor1;
  border-radius: 2px;
  border: 1px solid $line1;
  background-color: transparent;

  &.fill {
    background-color: $blue1;
    border: none;
  }
}
</style>
