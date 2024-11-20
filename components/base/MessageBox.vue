<template>
  <el-dialog :width="320"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
  >
    <template #footer>
      <div class="row auto gap-8">
        <div class="message-box-button fill" @click="onSubmit">{{ $t("Trade073") }}</div>
      </div>
    </template>
    <div class="message-box-content">
      <div class="row">
        <span class="title-text">{{ title }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onSubmit"></Image>
      </div>
      <div class="row gap-4">
        <Image v-if="icon" :icon="icon" :width="24" :height="24" :disabled="false"></Image>
        <span class="defaultText">{{ text }}</span>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";


const store = useAppStore();
const text = ref<string>('');
const title = ref<string>('');
const open = ref<boolean>(false);
const icon = ref<string | undefined>(undefined)
const onSubmit = () => {
  store.hideMessageBox();
}
watch(() => store.message, (val) => {
  let iconUrl: any = undefined;
  if (val.icon == 'success') {
    iconUrl = "icon-success"
  } else if (val.icon == "error") {
    iconUrl = "icon-error"
  }
  open.value = val.visible;
  text.value = val.text;
  title.value = val.title;
  icon.value = iconUrl
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.message-box-content {
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

.message-box-button {
  @include box($width: 120px, $height: 36px);
  @include font(14px, 500);
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
