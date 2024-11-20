<script setup lang="ts">
import TradeStyle from "~/components/copytrade/components/TradeStyle.vue";
import TradeGasSettings from "~/components/copytrade/components/TradeGasSettings.vue";
import TradeBuySettings from "~/components/copytrade/components/TradeBuySettings.vue";
import TradeSellSettings from "~/components/copytrade/components/TradeSellSettings.vue";
import {TaskBuySettings} from "~/models/TaskBuySettings";
import {TaskSellSettings} from "~/models/TaskSellSettings";
import {TaskStyleSettings} from "~/models/TaskStyleSettings";
import {TaskGasSettings} from "~/models/TaskGasSettings";
import {defaultCopyTradeValue} from "~/utils/config";
import {DefaultValueKeys, isPositiveInteger, useAppStore, useI18n} from "#imports";
import {TradeProperty} from "~/utils/constant";
import BigNumber from "bignumber.js";
import {TaskSettings} from "~/models/TaskSettings";
import ItemLoading from "~/components/base/ItemLoading.vue";
import Image from "~/components/base/Image.vue";


interface CopyTradeTaskEditProps {
  task: TaskSettings
  visible: boolean;
}

const {t} = useI18n({useScope: 'global'});
const {$api} = useNuxtApp();

const emit = defineEmits(['submit']);
const props = defineProps<CopyTradeTaskEditProps>();
const editableTask = ref<TaskSettings>();
const buySettings = ref<TaskBuySettings>();
const sellSettings = ref<TaskSellSettings>();
const taskStyle = ref<TaskStyleSettings>();
const gasSettings = ref<TaskGasSettings>();
const store = useAppStore();
const loading = ref(true);
const showSellSetting = ref(false);
const errorText = ref('');
const errorProps = ref<TradeProperty>();
const allowSubmit = ref(false);
const submitting = ref(false);
const open = ref(false);

const updateTaskSetting = (template: TaskSettings | undefined) => {
  if (template == undefined) {
    return;
  }
  taskStyle.value = template.style;
 
  showSellSetting.value = template.style.customSell == "1";
  buySettings.value = template.buy;
  gasSettings.value = template.gas
  sellSettings.value = template.sell;
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
  submitting.value = true;
  errorProps.value = undefined;
  errorText.value = '';
  let task = editableTask.value;
  if (task == undefined) {
    return;
  }
  let sell: TaskSellSettings;
  if (!showSellSetting.value) {
    sell = new TaskSellSettings();
   
    sell.sellWinRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellWinRate);
    sell.sellWinRate2 = "";
    sell.sellWinRate3 = "";

    sell.sellWinExtent = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellWinExtent);
    sell.sellWinExtent2 = "";
    sell.sellWinExtent3 = "";
 
    sell.sellLossRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellLossRate);

    sell.sellLossExtent = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellLossExtent);

    sell.sellSlippage = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellSlippage);
  } else {
    sell = sellSettings.value;
  }
  task.sell = sell;
  setTimeout(() => {
    $api.editTask(task).then((result) => {
      if (result.code == 0) {
        emit('submit', task);
      } else {
        let message = result.message || t("Message035");
        store.showMessageBox(t("ActionTitle009"), message);
      }
    }).catch(e => {
      let message = e.message || t("Message035");
      store.showMessageBox(t("ActionTitle009"), message);
    }).finally(() => {
      submitting.value = false;
    });
  }, 1500);


}


const onTaskStyleChange = (prop: TradeProperty, val: SwitchState | string) => {
  let value = taskStyle.value;
  if (value != undefined) {
    switch (prop) {
      case TradeProperty.buyMode:
        value.buyMode = val == SwitchState.on ? "1" : "0";
        value.securityBuy = val == SwitchState.on ? "0" : "1";
        break;
      case TradeProperty.secureBuyMode:
        value.securityBuy = val == SwitchState.on ? "1" : "0";
        value.buyMode = val == SwitchState.on ? "0" : "1";
        break;
      case TradeProperty.buyLimit:
        value.buyLimit = val;
        clearError(prop);
        allowSubmit.value = validate(false);
        break;
      case TradeProperty.sellMode:
        value.sellMode = val == SwitchState.on ? "1" : "0";
        value.customSell = val == SwitchState.on ? "0" : "1";
        showSellSetting.value = value.customSell == "1";
        allowSubmit.value = validate(false);
        break;
      case TradeProperty.customSellMode:
        value.customSell = val == SwitchState.on ? "1" : "0";
        value.sellMode = val == SwitchState.on ? "0" : "1";
        showSellSetting.value = value.customSell == "1";
        allowSubmit.value = validate(false);
        break;
      case TradeProperty.allSellMode:
        if (val == SwitchState.on) {
          value.sellMode = val == SwitchState.on ? "1" : "0";
          value.customSell = val == SwitchState.on ? "1" : "0";
          showSellSetting.value = true;
        } else {
          value.sellMode = "1";
          value.customSell = "0";
          showSellSetting.value = false;
        }
        break;
      case TradeProperty.followAmount:
        value.followAmount = val == SwitchState.on ? "1" : "0";
        break;
      case TradeProperty.duplicateBuyLimit:
        value.duplicateBuyLimit = val == SwitchState.on ? "1" : "0";
        break;
      case TradeProperty.buyFreqLimitHour:
        value.buyFreqLimitHour = val == SwitchState.on ? "1" : "0";
        break;
      case TradeProperty.sellRatioFollow:
        value.sellRatioFollow = val == SwitchState.on ? "1" : "0";
    }
  }

  taskStyle.value = value;
}
const onBuySettingsChange = (prop: TradeProperty, val: SwitchState | string) => {
  let value = buySettings.value;
  if (value != undefined) {
    switch (prop) {
      case TradeProperty.buyRate:
        value.buyRate = val;
        clearError(prop);
        break;
      case TradeProperty.sellRate:
        value.sellRate = val;
        clearError(prop);
        break;
      case TradeProperty.liquidity:
        value.liquidity = val;
        clearError(prop);
        break;
      case TradeProperty.buyLimitMin:
        value.buyLimitMin = val;
        clearError(prop);
        break;
      case TradeProperty.buyLimitMax:
        value.buyLimitMax = val;
        clearError(prop);
        break;
      case TradeProperty.buySlippage:
        value.buySlippage = val;
        clearError(prop);
        break;
      case TradeProperty.highSpeedBuy:
        value.highSpeedBuy = val == SwitchState.on ? "1" : "0";
        value.buyTxProtect = val == SwitchState.on ? "0" : "1";
        break;
      case TradeProperty.buyTxProtect:
        value.buyTxProtect = val == SwitchState.on ? "1" : "0";
        value.highSpeedBuy = val == SwitchState.on ? "0" : "1";
        break;
    }
  }
  allowSubmit.value = validate(false);
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
      case TradeProperty.sellGasOverflow:
        value.sellGasOverflow = val;
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
  let style = taskStyle.value;
  if (style == undefined) {
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


  if (style.sellMode == "0" && style.customSell == "0") {
    return false;
  }
  let buyLimitValue = style.buyLimit.trim();

  if (!isPositiveNumber(buyLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name038")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let buyLimit = BigNumber(buyLimitValue);
  if (buyLimit.lte(0)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name038")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  let buyLimitMinValue = buy.buyLimitMin.trim();
  if (buyLimitMinValue.length > 0) {
    let buyLimitMin = BigNumber(buyLimitMinValue);
    if (buyLimitMin.isNaN() || buyLimitMin.isNegative()) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade050")});
        errorProps.value = TradeProperty.buyLimitMin;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }
  let buyLimitMaxValue = buy.buyLimitMax.trim();
  if (buyLimitMaxValue.length > 0) {
    let buyLimitMax = BigNumber(buyLimitMaxValue);
    if (buyLimitMax.isNaN() || buyLimitMax.isNegative()) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade051")});
        errorProps.value = TradeProperty.buyLimitMax;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  if (buyLimitMaxValue.length > 0 && buyLimitMinValue.length > 0) {
    let buyLimitMin = BigNumber(buyLimitMinValue);
    let buyLimitMax = BigNumber(buyLimitMaxValue);
    if (buyLimitMin.gt(buyLimitMax)) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade050"), name2: t("Trade051")});
        errorProps.value = TradeProperty.buyLimitMin;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  let buyRateValue = buy.buyRate.trim();
  if (buyRateValue.length > 0) {
    if (!isPositiveInteger(buyRateValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade042")});
        errorProps.value = TradeProperty.buyRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let buyRate = parseInt(buyRateValue);
    if (buyRate < 0) {
      if (showError) {
        let msg = t("Message032", {name1: t("Trade042"), name2: "0"});
        errorProps.value = TradeProperty.buyRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (buyRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade042"), name2: "100"});
        errorProps.value = TradeProperty.buyRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }


  let sellRateValue = buy.sellRate.trim();
  if (sellRateValue.length > 0) {
    if (!isPositiveInteger(sellRateValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade052")});
        errorProps.value = TradeProperty.sellRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let sellRate = parseInt(sellRateValue);
    if (sellRate < 0) {
      if (showError) {
        let msg = t("Message032", {name1: t("Trade052"), name2: "0"});
        errorProps.value = TradeProperty.sellRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (sellRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade052"), name2: "100"});
        errorProps.value = TradeProperty.sellRate;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  let liquidityValue = buy.liquidity.trim();
  if (liquidityValue.length > 0) {
    if (!isPositiveNumber(liquidityValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Trade043")});
        errorProps.value = TradeProperty.liquidity;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  let buySlippageValue = buy.buySlippage.trim();
  if (!isPositiveInteger(buySlippageValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade044")});
      errorProps.value = TradeProperty.buySlippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let buySlippage = parseInt(buy.buySlippage);
  if (buySlippage < 0) {
    if (showError) {
      let msg = t("Message032", {name1: t("Trade044"), name2: "0"});
      errorProps.value = TradeProperty.buySlippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  if (buySlippage > 100) {
    if (showError) {
      let msg = t("Message031", {name1: t("Trade044"), name2: "100"});
      errorProps.value = TradeProperty.buySlippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
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
        store.showMessageBox(t("Home021"), msg);
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
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let gasLimit = parseInt(gasLimitValue);
  if (gasLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade061"), name2: "0"});
      errorProps.value = TradeProperty.gasLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let gasPriceLimitValue = gas.gasPriceLimit.trim();
  if (!isPositiveNumber(gasPriceLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade062")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let gasPriceLimit = parseFloat(gasPriceLimitValue);

  if (gasPriceLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: "0"});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let gasOverflowValue = gas.gasOverflow.trim();
  if (!isPositiveNumber(gasOverflowValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade063")});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let gasOverflow = parseFloat(gasOverflowValue);

  if (gasOverflow <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade063"), name2: "0"});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  let sellGasOverflowValue = gas.sellGasOverflow.trim();
  if (!isPositiveNumber(sellGasOverflowValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade064")});
      errorProps.value = TradeProperty.sellGasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let sellGasOverflow = parseFloat(sellGasOverflowValue);
  if (sellGasOverflow <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade064"), name2: "0"});
      errorProps.value = TradeProperty.sellGasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  let n1 = BigNumber(gasPriceLimitValue)
  let n2 = BigNumber(gasOverflowValue)
  let n3 = BigNumber(sellGasOverflowValue)
  if (n1.lte(n2)) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: t("Trade063")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  if (n1.lte(n3)) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: t("Trade064")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
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
  updateTaskSetting(editableTask.value);
}
watch(() => props.task, (val) => {
  if (val != undefined) {
    editableTask.value = val;
  }
})
watch(() => props.visible, (val) => {
  open.value = val;
});

</script>

<template>
  <el-dialog :width="1356"
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
            <TradeStyle :error-type="errorProps" :error-text="errorText" :task-style="taskStyle"
                        @change="onTaskStyleChange"></TradeStyle>
            <TradeBuySettings :error-text="errorText" :error-type="errorProps" :buy-settings="buySettings"
                              @change="onBuySettingsChange"></TradeBuySettings>
          </div>
          <div class="row gap-24 ">
            <TradeGasSettings :error-type="errorProps" :error-text="errorText" :gas-settings="gasSettings"
                              :title="$t('Trade084')"
                              @change="onGasSettingsChange"></TradeGasSettings>
            <TradeSellSettings v-if="showSellSetting" :error-type="errorProps" :error-text="errorText"
                               :sell-settings="sellSettings"
                               @change="onSellSettingsChange"></TradeSellSettings>
            <div class="blank" v-else></div>
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
