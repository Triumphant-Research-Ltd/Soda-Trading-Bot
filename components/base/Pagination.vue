<template>
  <div class="row flex-end">
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :page-size="props.pageSize"
                   :default-current-page="page"
                   :total="props.total" @change="onPageChange"/>
  </div>
</template>
<script setup lang="ts">
interface PaginationProps {
  total: number,
  pageSize: number,
  page: number
}

const page = ref(1);
const emit = defineEmits(['change']);
const props = defineProps<PaginationProps>();
const onPageChange = (page: number, pageSize: number) => {
  emit('change', page, pageSize);
}
watch(() => props.page, (val) => {
  page.value = val;
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

</style>
