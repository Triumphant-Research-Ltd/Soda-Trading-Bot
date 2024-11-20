<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="manage-solution">
      <div class="row">
        <span class="title-text">{{ $t("Trade086") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column gap-1">
        <div class="column gap-24" v-if="dataList.length>0">
          <div class="text-field" v-for="template in dataList" :key="template.id">
            <Image icon="icon-solution"></Image>
            <Input :text="template.remark"
                   readonly
                   type="text"
                   width="100%"
                   :height="48"
            ></Input>
            <Image icon="icon-solution-delete" :button="true" @click="()=>deleteSolution(template)"></Image>
          </div>
        </div>
        <div class="column gap-24" v-else>
          <span class="empty-tip">{{ $t("Trade088") }}</span>
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


interface ManageSolutionProps {
  templates: Array<TaskTemplate | SniperTaskTemplate>,
  type: "copytrade" | "snipertrade"
  visible: boolean
  mode: SnipBuyMode | undefined
}

const emit = defineEmits(['submit']);
const props = defineProps<ManageSolutionProps>();
const {$api} = useNuxtApp();
const store = useAppStore();
let templateList: Array<TaskTemplate | SniperTaskTemplate> = [];
let deletedTemplate: Array<TaskTemplate | SniperTaskTemplate> = [];
const dataList = ref<TaskTemplate[] | SniperTaskTemplate[]>([]);
const {t} = useI18n({useScope: 'global'});
const open = ref<boolean>(false);
const submitting = ref(false);


const onDialogOpen = () => {
  submitting.value = false;

}
const onClose = () => {
  submitting.value = false;
  emit('submit');
}

const deleteSolution = (template: TaskTemplate | SniperTaskTemplate) => {
  deletedTemplate.push(template);
  for (let index = 0; index < templateList.length; index++) {
    let ts = templateList[index];
    if (ts.id == template.id) {
      templateList.splice(index, 1);
      break;
    }
  }
  dataList.value = [...templateList];
}
const submitDeleteTaskTemplate = (id: string) => {
  submitting.value = true;
  setTimeout(() => {
    $api.deleteTaskTemplate(id).then((result) => {
      if (result.code == 0) {
        let data = result.data;
        if (data) {
          let ids = data.ids;
          if (Array.isArray(ids)) {
            if (ids.length > 0) {
              emit('submit', templateList);
              return;
            }
          }
        }
      }
      store.showMessageBox(t("Trade085"), t("Message034"));
    }).catch(e => {
      store.showMessageBox(t("Trade085"), t("Message034"));
    }).finally(() => {
      submitting.value = false;
    });
  }, 500);
}
const submitDeleteSniperTaskTemplate = (id: string) => {
  submitting.value = true;
  let mode = props.mode?.toString() || '';
  setTimeout(() => {
    $api.deleteSniperTaskTemplate(id, mode).then((result) => {
      if (result.code == 0) {
        let data = result.data;
        if (data) {
          let ids = data.ids;
          if (Array.isArray(ids)) {
            if (ids.length > 0) {
              emit('submit', templateList);
              return;
            }
          }
        }
      }
      store.showMessageBox(t("Trade085"), t("Message034"));
    }).catch(e => {
      store.showMessageBox(t("Trade085"), t("Message034"));
    }).finally(() => {
      submitting.value = false;
    });
  }, 500);
}
const onSubmit = () => {
  if (submitting.value) {
    return;
  }

  if (deletedTemplate.length == 0) {
    submitting.value = false;
    emit('submit', templateList);
    return;
  }

  let id = deletedTemplate.map(temp => temp.id).join(",");
  if (props.type == "copytrade") {
    submitDeleteTaskTemplate(id);
  } else {
    submitDeleteSniperTaskTemplate(id)
  }
}


watch(() => props.templates, (val) => {
  templateList.length = 0;
  templateList.push(...val);
  dataList.value = val;
});
watch(() => props.visible, (val) => {
  open.value = val;
})

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.manage-solution {
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
  @include box($justify: flex-start, $padding: 0 8px);
  background-color: $backgroundColor3;
  border-radius: 2px;
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

.empty-tip {
  @include font(16px, 500);
  color: $textColor1;
}
</style>
