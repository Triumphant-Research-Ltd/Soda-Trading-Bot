<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";

import {TradeDetailAnalyze} from "~/models/TradeDetailAnalyze";
import EmptyData from "~/components/base/EmptyData.vue";
import Loading from "~/components/base/Loading.vue";
import BigNumber from "bignumber.js";
import {Result} from "~/models/Result";

interface TradeAnalyzeProps {
  pair: string
  visible: boolean
}

const open = ref<boolean>(false);
const emit = defineEmits(['close']);

const {t} = useI18n({useScope: 'global'});

const props = defineProps<TradeAnalyzeProps>();
const store = useAppStore();
const loading = ref(false);
const detail = ref<TradeDetailAnalyze | null>(null);

const parseApiResult = (pair: string, result: any) => {
  let data = result.data;
  if (Array.isArray(data)) {
    for (let item of data) {
      let pool = data.pool;
      if (pool == null) {
        continue;
      }
      if (store.chainId != 'solana') {
        pool = pool.toString().toLowerCase();
      } else {
        pool = pool.toString();
      }
      if (pool == pair) {
        let analyze = new TradeDetailAnalyze();
        analyze.valueOf(item);
        detail.value = analyze;
      }

    }
  }

}
const loadData = async (pair: string) => {
  loading.value = true;
  try {
    let result: Result = await $api.projectList(pair, store.walletAddress, "90day");
    parseApiResult(pair, result);
  } catch (e: any) {
  } finally {
    loading.value = false;
  }
}


const onDialogOpened = () => {
  loading.value = true;
  loadData(props.pair)
}

const onClose = () => {
  emit('close');
}
const boughtTxnCount = () => {
  if (detail.value) {
    return detail.value.boughtTxnCount || "-"
  }
  return "-"
}
const soldTxnCount = () => {
  if (detail.value) {
    return detail.value.soldTxnCount || "-"
  }
  return "-"
}
const pnlClass = (detail: TradeDetailAnalyze) => {
  let c = BigNumber(detail.pnl);
  let green = c.isPositive();
  return {
    'row-item': true,
    'green': green,
    'red': !green
  }
}
watch(() => props.visible, (val) => {
  open.value = val;
});

</script>
<template>
  <el-dialog :width="560"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpened"
  >
    <div class="trade-detail-analyze">
      <div class="row">
        <span class="title-text">{{ $t("TradeAnalyze001") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column">
        <Loading v-if="loading"></Loading>
        <EmptyData v-else-if="!detail"></EmptyData>
        <div class="trade-detail" v-else>
          <div class="trade-detail-row">
            <div class="row-item gray">{{ $t('TradeAnalyze002') }}</div>
            <div class="row-item red">{{ formatNumber(detail.boughtValue, "$", 2, true) }}</div>
            <div class="row-item"></div>
            <div class="row-item gray">{{ $t('TradeAnalyze003', {count: boughtTxnCount(detail)}) }}</div>
          </div>
          <div class="trade-detail-row">
            <div class="row-item gray">{{ $t('TradeAnalyze004') }}</div>
            <div class="row-item green">{{ formatNumber(detail.soldValue, "$", 2, true) }}</div>
            <div class="row-item"></div>
            <div class="row-item gray">{{ $t('TradeAnalyze003', {count: soldTxnCount(detail)}) }}</div>
          </div>
          <div class="trade-detail-row">
            <div class="row-item gray">{{ $t('TradeAnalyze005') }}</div>
            <div :class="pnlClass(detail)">{{ formatNumber(detail.pnl, "$", 2, true) }}</div>
            <div class="row-item"></div>
            <div class="row-item"></div>
          </div>
          <div class="line"></div>
          <div class="column gap-8">
            <div class="trade-detail-row">
              <div class="row-item gray">{{ $t('TradeAnalyze006') }}</div>
              <div class="row-item">{{ formatNumber(detail.unrealized, "$", 2, true) }}</div>
              <div class="row-item"></div>
              <div class="row-item"></div>
            </div>
            <div class="trade-detail-row">
              <div class="row gap-8">
                <el-progress :width="325"
                             :show-text="false"
                             :percentage="detail.percent"
                             color="#0DBC48"
                             :stroke-width="8">
                   <span class="defaultText">{{
                       formatNumber(detail.offsetQuantity, "$", 2, true)
                     }}/{{ formatNumber(detail.boughtQuantity, "$", 2, true) }}</span>
                </el-progress>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </el-dialog>
</template>


<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.trade-detail-analyze {
  @include box($gap: 10px);
  flex-direction: column;
}

.trade-detail {
  @include box($direction: column, $gap: 8px);

  .trade-detail-row {
    @include box();

    .row-item {
      @include box();
      flex: 1;
      color: $textColor1;
      word-break: normal;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &.red {
        color: $red1;
      }

      &.green {
        color: $green1;
      }

      &.gray {
        color: $textColor2;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: $line1;
    }
  }


}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}

.transfer-text {
  @include font(14px, 400);
  color: $textColor1;
}


</style>
