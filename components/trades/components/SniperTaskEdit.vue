<script setup lang="ts">
import {TaskSellSettings} from "~/models/TaskSellSettings";
import {defaultCopyTradeValue} from "~/utils/config";
import {DefaultValueKeys, isPositiveInteger, isPositiveNumber, TradeProperty, useAppStore, useI18n} from "#imports";
import BigNumber from "bignumber.js";
import ItemLoading from "~/components/base/ItemLoading.vue";
import Image from "~/components/base/Image.vue";
import SniperTradeStyle from "~/components/smarmoney/components/HotTokenTradeStyle.vue";
import SniperAdvanceSettings from "~/components/sniper/components/SniperAdvanceSettings.vue";
import SniperSolanaAdvancedSettings from "~/components/sniper/components/SniperSolanaAdvancedSettings.vue";
import {SniperTaskSellSettings} from "~/models/SniperTaskSellSettings";
import {SniperTaskGasSettings} from "~/models/SniperTaskGasSettings";
import HotTokenSellSettings from "~/components/smarmoney/components/HotTokenSellSettings.vue";
import {SniperTaskSettings} from "~/models/SniperTaskSettings";
import {SniperFollowOrder} from "~/models/SniperFollowOrder";
import type {SniperTaskBuySettings} from "~/models/SniperTaskBuySettings";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate";


interface SniperTaskEditProps {
  order: SniperFollowOrder
  visible: boolean;
}

const {t} = useI18n({useScope: 'global'});
const {$api} = useNuxtApp();

const emit = defineEmits(['submit']);
const props = defineProps<SniperTaskEditProps>();
const editableTask = ref<SniperTaskSettings>();
const buySettings = ref<SniperTaskBuySettings>();
const sellSettings = ref<SniperTaskSellSettings>();
const gasSettings = ref<SniperTaskGasSettings>();
const store = useAppStore();
const loading = ref(true);
const showSellSetting = ref(false);
const errorText = ref('');
const errorProps = ref<TradeProperty>();
const allowSubmit = ref(false);
const submitting = ref(false);
const open = ref(false);

const updateTaskSetting = (template: SniperTaskSettings | undefined) => {
  if (template == undefined) {
    return;
  }
  editableTask.value = template;
  buySettings.value = template.buy;
  gasSettings.value = template.gas;
  sellSettings.value = template.sell;
  showSellSetting.value = template.buy.customSell == "1";
  allowSubmit.value = validate(false);
}

const clearError = (target: TradeProperty) => {
  if (errorProps.value == target) {
    errorProps.value = undefined;
    errorText.value = '';
  }

}
const clearSellError = () => {
  if (errorProps.value == TradeProperty.sellWinExtent || errorProps.value == TradeProperty.sellWinExtent2 || errorProps.value == TradeProperty.sellWinExtent3) {
    errorProps.value = undefined;
    errorText.value = '';
  }

}
const onBack = () => {
  emit('submit');
}
const onSubmit = () => {
  if (submitting.value) {
    return;
  }

  let ok = validate(true);
  if (!ok) {
    return;
  }

  let taskSettings = editableTask.value;
  if (!taskSettings) {
    return;
  }
  let taskTemplate = new SniperTaskTemplate();
  let buy = buySettings.value;
  if (buy != undefined) {
    taskTemplate.buyLimit = buy.buyLimit;
    taskTemplate.highSpeedBuy = buy.highSpeedBuy;
    taskTemplate.secureBuy = buy.secureBuy;
    taskTemplate.customSell = buy.customSell;
    taskTemplate.buyTxProtect = buy.buyTxProtect;
  }

  if (!showSellSetting.value) {
  
    taskTemplate.sellWinRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellWinRate);
    taskTemplate.sellWinRate2 = "";
    taskTemplate.sellWinRate3 = "";
  
    taskTemplate.sellWinExtent = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellWinExtent);
    taskTemplate.sellWinExtent2 = "";
    taskTemplate.sellWinExtent3 = "";

    taskTemplate.sellLossRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellLossRate);
 
    taskTemplate.sellLossExtent = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellLossExtent);

    taskTemplate.sellSlippage = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellSlippage);
  } else {
    let sell = sellSettings.value;
    if (sell != undefined) {
      taskTemplate.sellWinRate = sell.sellWinRate;
      taskTemplate.sellWinRate2 = sell.sellWinRate2;
      taskTemplate.sellWinRate3 = sell.sellWinRate3;
      taskTemplate.sellWinExtent = sell.sellWinExtent;
      taskTemplate.sellWinExtent2 = sell.sellWinExtent2;
      taskTemplate.sellWinExtent3 = sell.sellWinExtent3;
      taskTemplate.sellLossRate = sell.sellLossRate;
      taskTemplate.sellLossExtent = sell.sellLossExtent;
    }
  }

  let gas = gasSettings.value;
  if (gas != undefined) {
    taskTemplate.gasPriceLimit = gas.gasPriceLimit;
    taskTemplate.gasOverflow = gas.gasOverflow;
    taskTemplate.gasLimit = gas.gasLimit;
    taskTemplate.buySlippage = gas.slippage;
    taskTemplate.priorityFee = gas.priorityFee;
  }


  taskTemplate.limitPriceType = "";
  taskTemplate.limitExpireTime = "";
  taskTemplate.limitPriceAmount = "";
  taskTemplate.limitPriceBasePrice="";
  let settings = new SniperTaskSettings();
  settings.copy(taskTemplate);
  settings.address = taskSettings.address;
  settings.description = taskSettings.description;
  settings.limitExpireTime = taskSettings.limitExpireTime;
  settings.limitPriceAmount = taskSettings.limitPriceAmount;
  settings.limitPriceType = taskSettings.limitPriceType;
  settings.limitPriceBasePrice = taskSettings.limitPriceBasePrice;
  settings.source=taskSettings.source;
  console.log(settings);
  settings.mode = taskSettings.mode;
  settings.id = props.order.id;

  submitting.value = true;
  errorProps.value = undefined;
  errorText.value = '';
  setTimeout(() => {
    $api.editSniperTask(settings).then(r => {
      let data = r.data;
      if (r.code == 0 && data != undefined && data.success) {
        emit('submit', settings);
      } else {
        let msg = r.message || t('Message037');
        store.showMessageBox(t("ActionTitle009"), msg);
      }
    }).catch(e => {
      store.showMessageBox(t("ActionTitle009"), t('Message037'));
    }).finally(() => {
      submitting.value = false;
    });
  }, 500);
}


const onTaskStyleChange = (prop: TradeProperty, val: SwitchState | string) => {
  let value = buySettings.value;
  if (value) {
    switch (prop) {
      case TradeProperty.highSpeedBuy:
        value.highSpeedBuy = val == SwitchState.on ? "1" : "0";
        value.secureBuy = val == SwitchState.on ? "0" : "1";
        break;
      case TradeProperty.secureBuyMode:
        value.secureBuy = val == SwitchState.on ? "1" : "0";
        value.highSpeedBuy = val == SwitchState.on ? "0" : "1";
        break;
      case TradeProperty.buyLimit:
        value.buyLimit = val;
        clearError(prop);
        allowSubmit.value = validate(false);
        break;
      case TradeProperty.customSellMode:
        value.customSell = val == SwitchState.on ? "1" : "0";
        showSellSetting.value = value.customSell == "1";
        allowSubmit.value = validate(false);
        break;
      case TradeProperty.buyTxProtect:
        value.buyTxProtect = val == SwitchState.on ? "1" : "0";
        break;
    }
  }

  buySettings.value = value;

}
const onSellSettingsChange = (prop: TradeProperty, val: string) => {
  let value = sellSettings.value;
  clearError(prop);
  if (value != undefined) {
    switch (prop) {
      case TradeProperty.sellWinRate:
        value.sellWinRate = val;
        break;
      case TradeProperty.sellWinExtent:
        value.sellWinExtent = val;
        clearSellError()
        break;
      case TradeProperty.sellWinRate2:
        value.sellWinRate2 = val;
        break;
      case TradeProperty.sellWinExtent2:
        value.sellWinExtent2 = val;
        clearSellError()
        break;
      case TradeProperty.sellWinRate3:
        value.sellWinRate3 = val;
        break;
      case TradeProperty.sellWinExtent3:
        value.sellWinExtent3 = val;
        clearSellError()
        break;
      case TradeProperty.sellLossRate:
        value.sellLossRate = val;
        break;
      case TradeProperty.sellLossExtent:
        value.sellLossExtent = val;
        break;
    }
  }
  allowSubmit.value = validate(false);
  sellSettings.value = value;
}
const onGasSettingsChange = (prop: TradeProperty, val: string) => {
  let value = gasSettings.value;
  clearError(prop);
  if (value != undefined) {
    switch (prop) {
      case TradeProperty.gasSlippage:
        value.slippage = val;
        break;
      case TradeProperty.gasOverflow:
        value.gasOverflow = val;
        break;
      case TradeProperty.gasLimit:
        value.gasLimit = val;
        break;
      case TradeProperty.gasPriceLimit:
        value.gasPriceLimit = val;
        break;
      case TradeProperty.priorityFee:
        value.priorityFee = val;
        break;
    }
  }
  allowSubmit.value = validate(false);
  gasSettings.value = value;
}
const validateStopLoss = (sell: TaskSellSettings) => {

  let sellLoseRateValue = sell.sellLossRate.trim();
  if (sellLoseRateValue.length > 0) {
    if (!isPositiveInteger(sellLoseRateValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade059")});
        errorProps.value = TradeProperty.sellLossRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let sellLoseRate = parseInt(sell.sellLossRate);
    if (sellLoseRate < 0) {
      if (showError) {
        let msg = t("Message029", {name1: t("Trade059"), name2: "0"});
        errorProps.value = TradeProperty.sellLossRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (sellLoseRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade059"), name2: "0"});
        errorProps.value = TradeProperty.sellLossRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }


  let sellLoseExtentValue = sell.sellLossExtent.trim();
  if (sellLoseExtentValue.length > 0) {
    if (!isPositiveInteger(sellLoseExtentValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade060")});
        errorProps.value = TradeProperty.sellLossExtent;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false
    }
    let sellLoseExtent = parseInt(sellLoseExtentValue);
    if (sellLoseExtent < 0) {
      if (showError) {
        let msg = t("Message032", {name: t("Trade060")});
        errorProps.value = TradeProperty.sellLossExtent;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (sellLoseExtent > 100) {
      if (showError) {
        let msg = t("Message031", {name: t("Trade060")});
        errorProps.value = TradeProperty.sellLossExtent;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }
  return true;
}
const validateTakeProfit = (pos: number, winRate: string, winExtent: string, showError: boolean): boolean => {
  

  let hasWinRate = winRate.length > 0;
  let hasWinExtent = winExtent.length > 0;
  let winRateValidate = hasWinRate;
  let winExtentValidate = hasWinExtent;
  let winRateErrorProps: TradeProperty

  let key: string;
  if (pos == 1) {
    key = "Trade053";
    winRateErrorProps = TradeProperty.sellWinRate
  } else if (pos == 2) {
    key = "Trade055";
    winRateErrorProps = TradeProperty.sellWinRate2
  } else {
    key = "Trade057";
    winRateErrorProps = TradeProperty.sellWinRate3
  }
  let winExtentErrorProps: TradeProperty
  let winRateName = t(key);
  if (pos == 1) {
    key = "Trade054";
    winExtentErrorProps = TradeProperty.sellWinExtent
  } else if (pos == 2) {
    key = "Trade056";
    winExtentErrorProps = TradeProperty.sellWinExtent2
  } else {
    key = "Trade058";
    winExtentErrorProps = TradeProperty.sellWinExtent3
  }
  let winExtentName = t(key);
  if (winRateValidate) {
    
    if (!isPositiveInteger(winRate)) {
      if (showError) {
        let msg = t("Message028", {name: winRateName});
        errorProps.value = winRateErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let sellWinRate = parseInt(winRate);
    if (sellWinRate <= 0) {
      if (showError) {
        let msg = t("Message029", {name1: winRateName, name2: "0"});
        errorProps.value = winRateErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }
  if (winExtentValidate) {
    
    if (!isPositiveInteger(winExtent)) {
      if (showError) {
        let msg = t("Message028", {name: winExtentName});
        errorProps.value = winExtentErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let sellWinExtent = parseInt(winExtent);
    if (sellWinExtent <= 0) {
      if (showError) {
        let msg = t("Message029", {name1: winExtentName, name2: "0"});
        errorProps.value = winExtentErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (sellWinExtent > 100) {
      if (showError) {
        let msg = t("Message031", {name1: winExtentName, name2: "100"});
        errorProps.value = winExtentErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  return true;
}

const validate = (showError: boolean = true) => {
  let template = editableTask.value;
  if (!template) {
    return false;
  }
  let buy = buySettings.value;
  if (buy == undefined) {
    return false;
  }

  let gas = gasSettings.value;
  if (gas == undefined) {
    return false;
  }

  let buyLimitValue = buy.buyLimit.trim();
  
  if (!isPositiveNumber(buyLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name112")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let buyLimit = BigNumber(buyLimitValue);
  if (buyLimit.lte(0)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name038")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }

  if (store.chainId == "solana") {
    let priorityFeeValue = gas.priorityFee.trim();
    if (!isPositiveNumber(priorityFeeValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Name106")});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("ActionTitle009"), msg);
      }
      return false;
    }
    let priorityFee = BigNumber(priorityFeeValue);
    if (priorityFee.isNegative()) {
      if (showError) {
        let msg = t("Message032", {name1: t("Name106"), name2: "0"});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("ActionTitle009"), msg);
      }
      return false;
    }
    if (priorityFee.isLessThan(0.00001)) {
      if (showError) {
        let msg = t("Message032", {name1: t("Name106"), name2: "0.00001"});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("ActionTitle009"), msg);
      }
      return false;
    }
    if (priorityFee.isGreaterThan(1)) {
      if (showError) {
        let msg = t("Message031", {name1: t("Name106"), name2: "1"});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("ActionTitle009"), msg);
      }
      return false;
    }
  }


 
  let slippageValue = gas.slippage.trim();
  if (!isPositiveInteger(slippageValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name104")});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let slippage = parseInt(slippageValue);
  if (slippage < 0) {
    if (showError) {
      let msg = t("Message032", {name1: t("Name104"), name2: "0"});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }

  if (slippage > 100) {
    if (showError) {
      let msg = t("Message031", {name1: t("Name104"), name2: "100"});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }

  if (showSellSetting.value) {
    let sell = sellSettings.value;
    if (sell == undefined) {
      return false;
    }

  
    let ok = validateTakeProfit(1, sell.sellWinRate, sell.sellWinExtent, showError)
    if (!ok) {
      return false;
    }
    
    ok = validateTakeProfit(2, sell.sellWinRate2, sell.sellWinExtent2, showError)
    if (!ok) {
      return false;
    }
    
    ok = validateTakeProfit(3, sell.sellWinRate3, sell.sellWinExtent3, showError)
    if (!ok) {
      return false;
    }
    
    ok = validateStopLoss(sell);
    if (!ok) {
      return false;
    }
    
    let total: BigNumber = BigNumber(0);
    let n1 = BigNumber(sell.sellWinExtent)
    if (n1.isFinite()) {
      total = total.plus(n1)
    }
    let n2 = BigNumber(sell.sellWinExtent2)
    if (n2.isFinite()) {
      total = total.plus(n2);
    }
    let n3 = BigNumber(sell.sellWinExtent3)
    if (n3.isFinite()) {
      total = total.plus(n3);
    }
    if (total.isGreaterThan(100)) {
      if (showError) {
        let msg = t("Message033", {name1: t("Trade054"), name2: t("Trade056"), name3: t("Trade058"), name4: "100"});
        errorProps.value = TradeProperty.sellWinExtent;
        errorText.value = msg;
        store.showMessageBox(t("ActionTitle009"), msg);
      }
      return false;
    }
  }

  let gasLimitValue = gas.gasLimit.trim();
  if (!isPositiveInteger(gasLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade061")});
      errorProps.value = TradeProperty.gasLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let gasLimit = parseInt(gasLimitValue);
  if (gasLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade061"), name2: "0"});
      errorProps.value = TradeProperty.gasLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let gasPriceLimitValue = gas.gasPriceLimit.trim();
  if (!isPositiveNumber(gasPriceLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade062")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let gasPriceLimit = parseFloat(gasPriceLimitValue);

  if (gasPriceLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: "0"});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let gasOverflowValue = gas.gasOverflow.trim();
  if (!isPositiveNumber(gasOverflowValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade063")});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  let gasOverflow = parseFloat(gasOverflowValue);

  if (gasOverflow <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade063"), name2: "0"});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }

  let n1 = BigNumber(gasPriceLimitValue)
  let n2 = BigNumber(gasOverflowValue)
  if (n1.lte(n2)) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: t("Trade063")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("ActionTitle009"), msg);
    }
    return false;
  }
  return true;
}

const buttonClass = () => {
  return {
    'submit-button': true,
    disabled: !allowSubmit.value
  }
}
const onDialogOpen = () => {
  if (props.order) {
    let taskSettings = props.order.createTaskSettings();
    updateTaskSetting(taskSettings);
  }

}
watch(() => props.order, (val) => {
  if (val != undefined) {
    editableTask.value = val.createTaskSettings();
  }
})
watch(() => props.visible, (val) => {
  open.value = val;
});

</script>

<template>
  <el-dialog :width="700"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpen"
  >
    <div class="column copytrade-task-edit">
      <div class="row">
        <span class="title-text">{{ $t('ActionTitle009') }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onBack"></Image>
      </div>
      <div class="column gap-24">
        <div class="column gap-24">
          <div class="row gap-24 ">
            <SniperTradeStyle :error-type="errorProps"
                              :error-text="errorText"
                              :buy-settings="buySettings"
                              @change="onTaskStyleChange"></SniperTradeStyle>
          </div>
          <div class="row gap-24 ">
            <SniperSolanaAdvancedSettings v-if="store.chainId=='solana'"
                                          :error-type="errorProps"
                                          :error-text="errorText"
                                          :title="$t('Trade034')"
                                          :gas="gasSettings"
                                          @change="onGasSettingsChange"
            ></SniperSolanaAdvancedSettings>
            <SniperAdvanceSettings v-else
                                   :gas="gasSettings"
                                   :title="$t('Trade034')"
                                   :error-type="errorProps"
                                   :error-text="errorText"
                                   @change="onGasSettingsChange"></SniperAdvanceSettings>
          </div>
          <div class="row gap-24 ">
            <HotTokenSellSettings v-if="showSellSetting" :error-type="errorProps" :error-text="errorText"
                                  :sell-settings="sellSettings"
                                  @change="onSellSettingsChange"></HotTokenSellSettings>
          </div>
        </div>
        <div class="row gap-24">
          <div class="cancel-button" @click="onBack">{{ $t("Trade074") }}</div>
          <div class="submit-button" v-if="submitting">
            <ItemLoading theme="white"></ItemLoading>
          </div>
          <div :class="buttonClass()" @click="onSubmit" v-else>{{ $t("Trade073") }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "assets/scss/base" as *;
@use "assets/scss/global.variable" as *;

.copytrade-task-edit {
  gap: 24px !important;
}

.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(20px, 600);
  color: $textColor1;
}


.cancel-button {
  @include box($width: 128px, $height: 40px);
  border: $border1;
  @include font(14px, 500);
  color: $textColor1;
  border-radius: 2px;
  cursor: pointer;
}

.blank {
  height: 0;
  width: 642px;
}

.submit-button {
  @include box($width: 128px, $height: 40px);
  @include font(14px, 500);
  color: $textColor1;
  cursor: pointer;
  border-radius: 2px;
  background-color: $blue1;

  &.disabled {
    background-color: $backgroundColor3;
    border: $border1;
    color: $line1;
    pointer-events: none;
  }
}
</style>
