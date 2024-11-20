<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="task-name-edit">
      <div class="row">
        <span class="title-text">{{ $t("Trade082") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column gap-1">
        <div class="text-field">
          <Input ref="textField"
                 :text="text"
                 :placeholder="$t('Message006')"
                 type="text"
                 width="100%"
                 :error="error"
                 :height="48"
                 @change="onTextChange"></Input>
        </div>
      </div>
      <div class="row gap-16">
        <div class="cancel-button" @click="onClose">{{ $t("Trade074") }}</div>
        <div class="submit-button" v-if="submitting">
          <ItemLoading theme="white"></ItemLoading>
        </div>
        <div class="submit-button" @click="onSubmit()" v-else>{{ $t("ActionTitle006") }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">

import {useAppStore} from "~/stores/appstore";

import Image from "~/components/base/Image.vue";
import Input from "~/components/base/Input.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";

interface TaskNameEditProps {
  type: "sniper" | "copytrade"
  address: string
  name: string
  visible: boolean
}

const emit = defineEmits(['submit'])
const props = defineProps<TaskNameEditProps>();
const {$api} = useNuxtApp();
const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const open = ref<boolean>(false);
const text = ref(props.name || '');
const error = ref('');
const textField = ref(null);
const submitting = ref(false);


const onDialogOpen = () => {
  textField.value?.focus();
}
const onClose = () => {

  text.value = "";
  error.value = "";
  submitting.value = false;
  emit('submit', props.address, '');

}


const onSubmit = () => {
  if (submitting.value) {
    return;
  }
  if (text.value.length == 0) {
    error.value = t("Message006")
    store.showMessageBox(t("Trade082"), error.value);
    textField.value?.focus();
    return;
  }
  if (!isName(text.value)) {
    error.value = t("Message007");
    store.showMessageBox(t("Trade082"), error.value);
    textField.value?.focus();
    return
  }
  error.value = "";
  submitting.value = true;

  if (props.type == "copytrade") {
    setTimeout(() => {
      $api.editTaskName(props.address, text.value).then((result) => {
        if (result.code == 0) {
          emit('submit', props.address, text.value);
        } else {
          store.showMessageBox(t("Trade082"), t("Message020"));
        }
      }).catch(e => {
        store.showMessageBox(t("Trade082"), t("Message020"));
      }).finally(() => {
        submitting.value = false;
      })
    }, 500)
  } else {
    setTimeout(() => {
      $api.editSniperTaskName(props.address, text.value).then((result) => {
        if (result.code == 0) {
          emit('submit', props.address, text.value);
        } else {
          store.showMessageBox(t("Trade082"), t("Message020"));
        }
      }).catch(e => {
        store.showMessageBox(t("Trade082"), t("Message020"));
      }).finally(() => {
        submitting.value = false;
      })
    }, 500)
  }


}

const onTextChange = (v: string) => {
  text.value = v;
  error.value = "";
}
watch(() => props.visible, (val) => {
  open.value = val;
});
watch(() => props.name, (val) => {
  text.value = val;
});

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.task-name-edit {
  @include box($direction: column, $gap: 40px);
}

.text {
  @include font(16px, 500);
  color: $textColor1;
}

.gap-1 {
  gap: 45px !important;
}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(20px, 600);
  color: $textColor1;
}

.text-field {
  @include box($justify: flex-start, $gap: 8px);
  background-color: $backgroundColor3;
  border-radius: 2px;


}


.submit-button {
  @include box($height: 40px);
  color: $textColor1;
  background-color: $blue1;
  cursor: pointer;
  flex: 1;
}

.cancel-button {
  @include box($height: 40px);
  color: $textColor1;
  border: $border1;
  cursor: pointer;
  flex: 1;

  &.max-width {
    max-width: 120px;
  }
}
</style>
