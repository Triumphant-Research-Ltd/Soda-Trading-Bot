<template>

  <div :class="inputFieldClass()" :style="textStyle()">
    <el-tooltip popper-class="popper-red" :content="errorText" :disabled="!errorBorder" placement="top">
      <el-input ref="inputField"
                v-model="inputText"
                v-if="props.type == 'text' || props.type == 'password'"
                style="width: 100%"
                :maxlength="maxLength"
                :disabled="props.disabled"
                :show-password="isPassword"
                :readonly="props.readonly"
                @input="onTextChange"
                @change="onSubmit"
                :clearable="props.allowClear"
                :placeholder="placeholder"
                :input-style="inputStyle">
        <template #prepend v-if="props.prefix || props.prefixTip">
          <div class="row auto gap-4">
            <span>{{ props.prefix }}</span>
            <Image v-if="props.prefixTip" icon="icon-info" :tooltip="props.prefixTip"></Image>
          </div>
        </template>
        <template #append v-if="props.suffix">
          <span>{{ props.suffix }}</span>
        </template>
      </el-input>
      <el-input-number v-else
                       ref="inputField"
                       style="width: 100%"
                       v-model="inputValue"
                       :disabled="props.disabled"
                       :readonly="props.readonly"
                       :controls="false"
                       :precision="props.precision"
                       :min="props.min"
                       :max="props.max"
                       value-on-clear="min"
                       @change="onValueChange">
      </el-input-number>
    </el-tooltip>

  </div>

</template>
<script setup lang="ts">

import Image from "~/components/base/Image.vue";

interface InputProps {
  text?: string,
  min?: number,
  max?: number,
  precision?: number,
  allowClear?: boolean,
  disabled?: boolean,
  suffix?: string,
  prefix?: string,
  prefixTip?: string
  readonly?: boolean,
  maxLength?: number,
  textAlign?: "left" | "center" | "right"
  type: "text" | "password" | "number",
  color?: string,
  customClass?: string,
  fontSize?: number,
  fontWeight?: number,
  variant?: "outlined" | "borderless",
  borderRadius?: number,
  placeholder?: string,
  error?: string,
  width: number | string,
  height: number | string
}

const defaultNumber = () => {
  let n = parseFloat(props.text);
  if (isNaN(n)) {
    n = 0;
  }
  return n;
}
const emit = defineEmits(['submit', 'change']);
const props = defineProps<InputProps>();
const inputField = ref(null);
const inputText = ref<string | number>(props.text || '');
const inputValue = ref<number>(defaultNumber());
const errorBorder = ref<boolean>(props.error != undefined && props.error.length > 0);
const placeholder = computed(() => props.placeholder);
const isPassword = computed(() => props.type === 'password');
const maxLength = computed(() => props.maxLength == undefined ? 9999999999 : props.maxLength);
const errorText = ref('');
const inputFieldClass = () => {
  let x = {
    'input-field': true,
  }
  if (props.customClass) {
    x[props.customClass] = true
  }
  return x
}
const textStyle = () => {
  let border: string;
  if (errorBorder.value) {
    border = '1px solid #E93A0B';
  } else if (props.variant === 'outlined') {
    border = '1px solid #FFFFFF33';
  } else {
    border = 'none';
  }
  let width = "";
  if (typeof props.width === 'number') {
    width = `${props.width}px`
  } else {
    width = props.width;
  }
  let height = "";

  if (typeof props.height === 'number') {
    height = `${props.height}px`;
  } else {
    height = props.height;
  }
  return {
    borderRadius: props.borderRadius ? `${props.borderRadius}px` : 0,
    border: border,
    width: width,
    height: height,
    padding: '8px',
    fontSize: props.fontSize ? `${props.fontSize}px` : '14px',
  };
};

const inputStyle = computed(() => {
  return {
    color: props.color,
    textAlign: props.textAlign,
    fontSize: props.fontSize != undefined ? `${props.fontSize}px` : '14px',
    fontWeight: props.fontWeight != undefined ? props.fontWeight : 400,
  }
});

const onTextChange = (text: string | number) => {
  errorBorder.value = false;
  errorText.value = '';
  emit('change', text);

}

const onValueChange = (text: number) => {
  errorBorder.value = false;
  errorText.value = '';
  emit('submit', text);

}
const onSubmit = (text: string | number) => {
  emit('submit', text);
}

const focus = () => {
  inputField.value?.focus();
}

const blur = () => {
  inputField.value?.blur();
}

defineExpose({
  'focus': focus,
  'blur': blur,
});
watch(() => props.error, (val) => {
  errorText.value = val;
})
watch(() => props.text, (value) => {
  if (props.type == 'text' || props.type == 'password') {
    inputText.value = value || '';
  } else {
    let val = parseFloat(value?.toString() || '0');
    if (isNaN(val)) {
      val = 0;
    }
    inputValue.value = val;
  }
})

watch(() => props.error, (value) => {
  errorBorder.value = value != undefined && value.length > 0;
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.input-field {
  @include box();
}

.popper-red {
  background-color: $red1 !important;
  color: $textColor1 !important;
  border: none !important;
}

</style>
