<template>
  <el-dialog :width="448"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="invitation-code">
      <div class="row">
        <span class="title-text">{{ $t("Name083") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <Loading v-if="loading"></Loading>
      <div class="column gap-1 align-items-left" v-else>
        <div class="text-field fill-padding" v-if="userCode">
          <div class="column gap-16">
            <div class="row flex-start gap-8">
              <span class="text">{{ t('InvitationCode002') }}</span>
            </div>
            <div class="row flex-start gap-8">
              <span class="code-text">{{ userCode }}</span>
              <el-tooltip :content="$t('Message044')" trigger="click" placement="top">
                <Image icon="icon-address-copy" :width="20" :height="20" :button="true" @click="copyCode"></Image>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="text-field" v-else>
          <Input ref="textField"
                 :text="text"
                 :placeholder="$t('InvitationCode003')"
                 type="text"
                 width="100%"
                 :error="error"
                 :height="48"
                 @change="onTextChange"></Input>
        </div>
        <div class="row gap-16" v-if="userCode">
          <div class="cancel-button max-width" @click="onClose">{{ $t("Trade073") }}</div>
        </div>
        <div class="row gap-16" v-else>
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
import Loading from "~/components/base/Loading.vue";
import Input from "~/components/base/Input.vue";
import type {Result} from "~/models/Result";

const {$api} = useNuxtApp();
const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const open = ref<boolean>(false);
const loading = ref(true);
const userCode = ref('');
const text = ref('');
const error = ref('');
const textField = ref(null);
const submitting = ref(false);

const parseUserCode = (result: any) => {
  userCode.value = result.data?.code || ''
}

const loadUserCode = async () => {
  try {
    let result: Result = await $api.userCode();
    parseUserCode(result);

  } catch (e: any) {
  } finally {
    loading.value = false;
  }

}


const onDialogOpen = () => {
  loading.value = true;
  setTimeout(() => {
    loadUserCode();
  }, 250)

}
const onClose = () => {
  userCode.value = "";
  text.value = "";
  error.value = "";
  submitting.value = false;
  store.showInvitationCode(false);
}
const copyCode = () => {
  if (!userCode.value) {
    return;
  }
  copy(userCode.value, () => {
    // store.showMessageBox(t("ActionTitle001"), t("Message001", {name: t("Name083")}));
  })
}

const onSubmit = () => {
  if (submitting.value) {
    return;
  }
  if (text.value.length == 0) {
    error.value = t("InvitationCode003")
    store.showMessageBox(t("Name083"), error.value);
    textField.value?.focus();
    return;
  }
  if (!isPromotionCode(text.value)) {
    error.value = t("InvitationCode005");
    store.showMessageBox(t("Name083"), error.value);
    textField.value?.focus();
    return
  }
  error.value = "";
  submitting.value = true;
  let code = text.value;
  setTimeout(() => {
    $api.submitCode(code).then((result) => {
      if (result.code == 0) {
        userCode.value = code;
      } else {
        let message = result.message || t("Message019");
        store.showMessageBox(t("Name083"), message)
      }
    }).catch(e => {
      store.showMessageBox(t("Name083"), t("Message019"))
    }).finally(() => {
      submitting.value = false;
    })

  }, 500)
}

const onTextChange = (v: string) => {
  text.value = v;
  error.value = "";
}
watch(() => store.invitationCode, (val) => {
  open.value = val;
});


</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.invitation-code {
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
