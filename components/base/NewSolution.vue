<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="new-solution">
      <div class="row">
        <span class="title-text">{{ $t("Trade085") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column gap-1 align-items-left">

        <div class="text-field">
          <Input ref="textField"
                 :text="text"
                 :placeholder="$t('Message027')"
                 type="text"
                 width="100%"
                 :error="error"
                 :height="48"
                 @change="onTextChange"></Input>
        </div>

        <div class="row gap-16">
          <div class="cancel-button" @click="onClose">{{ $t("Trade074") }}</div>
          <div class="submit-button" v-if="submitting">
            <ItemLoading theme="white"></ItemLoading>
          </div>
          <div class="submit-button" @click="onSubmit()" v-else>{{ $t("ActionTitle006") }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">

import {useAppStore} from "~/stores/appstore";

import Image from "~/components/base/Image.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";

import Input from "~/components/base/Input.vue";
import {TaskTemplate} from "~/models/TaskTemplate";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate";


interface NewSolutionProps {
  template: TaskTemplate | SniperTaskTemplate,
  visible: boolean
  type: "copytrade" | "snipertrade"
}

const emit = defineEmits(['submit']);
const props = defineProps<NewSolutionProps>();
const {$api} = useNuxtApp();
const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const open = ref<boolean>(false);
const loading = ref(true);

const text = ref('');
const error = ref('');
const textField = ref(null);
const submitting = ref(false);
const template = ref<TaskTemplate | SniperTaskTemplate>();

const onDialogOpen = () => {
  submitting.value = false;
  textField.value?.focus();

}
const onClose = () => {
  text.value = "";
  error.value = "";
  submitting.value = false;
  template.value = undefined;
  emit('submit');

}
const submitSniperTaskTemplate = (template: SniperTaskTemplate) => {
  submitting.value = true;
  if (template) {
    template.remark = text.value;
    setTimeout(() => {
      $api.addSniperTaskTemplate(template).then((result) => {
        if (result.code == 0) {
          let data = result.data;
          if (data) {
            if (template) {
              template.id = data.entry;
            }
            emit('submit', template);
          } else {
            store.showMessageBox(t("Trade085"), t("Message026"));
          }
        } else {
          store.showMessageBox(t("Trade085"), t("Message026"));
        }
      }).catch(e => {
        store.showMessageBox(t("Trade085"), t("Message026"));
      }).finally(() => {
        submitting.value = false;
      })

    }, 500)
  } else {
    submitting.value = false;
  }
}

const submitTaskTemplate = (template: TaskTemplate) => {
  submitting.value = true;
  if (template) {
    template.remark = text.value;
    setTimeout(() => {
      $api.addTaskTemplate(template).then((result) => {
        if (result.code == 0) {
          let data = result.data;
          if (data) {
            if (template) {
              template.id = data.entry;
            }
            emit('submit', template);
          } else {
            store.showMessageBox(t("Trade085"), t("Message026"));
          }
        } else {
          store.showMessageBox(t("Trade085"), t("Message026"));
        }
      }).catch(e => {
        store.showMessageBox(t("Trade085"), t("Message026"));
      }).finally(() => {
        submitting.value = false;
      })

    }, 500)
  } else {
    submitting.value = false;
  }
}

const onSubmit = () => {
  if (submitting.value) {
    return;
  }
  if (text.value.length == 0) {
    error.value = t("Message027")
    store.showMessageBox(t("Name083"), error.value);
    textField.value?.focus();
    return;
  }
  if (!isName(text.value)) {
    error.value = t("Message009");
    store.showMessageBox(t("Name083"), error.value);
    textField.value?.focus();
    return;
  }
  if (template.value == undefined) {
    return;
  }
  error.value = "";
  if (props.type == "copytrade") {
    submitTaskTemplate(template.value)
  } else {
    submitSniperTaskTemplate(template.value);
  }

}


const onTextChange = (v: string) => {
  text.value = v;
  error.value = "";
}
watch(() => props.template, (val) => {
  template.value = val;
});
watch(() => props.visible, (val) => {
  open.value = val;
})

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.new-solution {
  @include box($direction: column, $gap: 40px);
}

.text {
  @include font(16px, 500);
  color: $textColor1;

  &.gray {
    color: $textColor2;
  }
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

  &.fill-padding {
    padding: 8px !important;
  }
}

.code-text {
  padding: 0;
  @include font(16px, 600);
  color: $textColor1;
  border-radius: 8px !important;


}

.blank {
  width: 100%;
  height: 45px;
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
