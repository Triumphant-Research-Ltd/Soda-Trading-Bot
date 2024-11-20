<script setup lang="ts">
import SolutionSelect from "~/components/base/SolutionSelect.vue";
import TradeStyle from "~/components/copytrade/components/TradeStyle.vue";
import TradeGasSettings from "~/components/copytrade/components/TradeGasSettings.vue";
import TradeBuySettings from "~/components/copytrade/components/TradeBuySettings.vue";
import TradeSellSettings from "~/components/copytrade/components/TradeSellSettings.vue";
import {AppEvent} from "~/utils/events";
import TitleBar from "~/components/base/TitleBar.vue";
import {Result} from "~/models/Result";
import {TaskTemplate} from "~/models/TaskTemplate";
import {TaskBuySettings} from "~/models/TaskBuySettings";
import {TaskSellSettings} from "~/models/TaskSellSettings";
import {TaskStyleSettings} from "~/models/TaskStyleSettings";
import {TaskGasSettings} from "~/models/TaskGasSettings";
import {defaultCopyTradeValue} from "~/utils/config";
import {DefaultValueKeys, isPositiveInteger, useAppStore, useI18n} from "#imports";
import {TradeProperty} from "~/utils/constant";
import NewSolution from "~/components/base/NewSolution.vue";
import BigNumber from "bignumber.js";
import ManageSolution from "~/components/base/ManageSolution.vue";
import {TaskSettings} from "~/models/TaskSettings";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {Solution} from "~/models/Solution";


interface StepTwoProps {
  address: string
  name: string
}

const {t} = useI18n({useScope: 'global'});
const {$bus, $api} = useNuxtApp();
let solutionList: Array<Solution> = [];
const templateList = Array<TaskTemplate>();
const selectedTemplate = ref<TaskTemplate>();
const selectedSolution = ref<Solution>();
const emit = defineEmits(['back', 'submit']);
const props = defineProps<StepTwoProps>();

const buySettings = ref<TaskBuySettings>();
const sellSettings = ref<TaskSellSettings>();
const taskStyle = ref<TaskStyleSettings>();
const gasSettings = ref<TaskGasSettings>();
const store = useAppStore();
const newSolution = ref<TaskTemplate>();
const managedSolutions = ref<TaskTemplate[]>([]);
const loading = ref(true);
const openNewSolution = ref(false);
const openManageSolution = ref(false);
const showSellSetting = ref(false);
const errorText = ref('');
const errorProps = ref<TradeProperty>();
const allowSubmit = ref(false);
const submitting = ref(false);
const solutions = ref<Solution[]>([]);
const convertSolution = () => {
  let list: Solution[] = templateList.map((item) => {
    return {id: item.id, remark: item.remark};
  });
  return list;
}
const reloadTaskTemplate = (selected: TaskTemplate | undefined) => {
  solutionList = convertSolution();
  solutions.value = solutionList;
  selectedTemplate.value = selected;
}
const updateTaskStyle = (template: TaskTemplate | undefined) => {
  let style = new TaskStyleSettings();
  if (template == undefined) {
    let buyMode = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyMode);
    style.buyMode = buyMode == "1" ? "1" : "0";
    style.securityBuy = buyMode == "0" ? "1" : "0";
    style.buyLimit = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyLimit);
    let sellMode = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellMode);
    style.sellMode = sellMode == "0" ? "1" : "0";
    style.customSell = sellMode == "1" ? "1" : "0";
    style.followAmount = defaultCopyTradeValue(store.chainId, DefaultValueKeys.followAmount);
    style.duplicateBuyLimit = defaultCopyTradeValue(store.chainId, DefaultValueKeys.duplicatePurchaseLimit);
    style.buyFreqLimitHour = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyFreqLimitHour);
    style.sellRatioFollow = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellRatioFollow);
  } else {
    style.buyMode = template.buyMode;
    style.securityBuy = template.securityBuy;
    style.buyLimit = template.buyLimit;
    style.sellMode = template.sellMode;
    style.customSell = template.customSell;
    style.followAmount = template.followAmount;
    style.duplicateBuyLimit = template.duplicateBuyLimit;
    style.buyFreqLimitHour = template.buyFreqLimitHour;
    style.sellRatioFollow = template.sellRatioFollow;
  }
  
  showSellSetting.value = style.customSell == "1";
  taskStyle.value = style;
}
const updateBuySettings = (template: TaskTemplate | undefined) => {
  let buy = new TaskBuySettings();
  if (template == undefined) {
    
    buy.buyRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyRate);
    
    buy.sellRate = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellRate);
    
    buy.liquidity = defaultCopyTradeValue(store.chainId, DefaultValueKeys.liquidity);
    
    buy.buySlippage = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buySlippage);
    
    buy.highSpeedBuy = defaultCopyTradeValue(store.chainId, DefaultValueKeys.highSpeedBuy);
    
    buy.buyTxProtect = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyTxProtect);
    
    buy.buyLimitMin = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyLimitMin);
    
    buy.buyLimitMax = defaultCopyTradeValue(store.chainId, DefaultValueKeys.buyLimitMax);
  } else {
    
    buy.buyRate = template.buyRate;
    
    buy.sellRate = template.sellRate;
    
    buy.liquidity = template.liquidity;
    
    buy.buySlippage = template.buySlippage;
    
    buy.highSpeedBuy = template.highSpeedBuy;
    
    buy.buyTxProtect = template.buyTxProtect;
    
    buy.buyLimitMin = template.buyLimitMin;
    
    buy.buyLimitMax = template.buyLimitMax;
  }
  buySettings.value = buy;
}
const updateGasSettings = (template: TaskTemplate | undefined) => {
  let gas = new TaskGasSettings();
  if (template == undefined) {
    
    gas.gasLimit = defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasLimit);
    
    gas.gasPriceLimit = defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasPriceLimit);
    
    gas.gasOverflow = defaultCopyTradeValue(store.chainId, DefaultValueKeys.gasOverflow);
    
    gas.sellGasOverflow = defaultCopyTradeValue(store.chainId, DefaultValueKeys.sellGasOverflow);
  } else {
    
    gas.gasLimit = template.gasLimit;
    
    gas.gasPriceLimit = template.gasPriceLimit;
    
    gas.gasOverflow = template.gasOverflow;
    
    gas.sellGasOverflow = template.sellGasOverflow;
  }
  gasSettings.value = gas;
}
const updateSellSettings = (template: TaskTemplate | undefined) => {
  let sell = new TaskSellSettings();
  if (template == undefined) {
    
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
    
    sell.sellWinRate = template.sellWinRate;
    sell.sellWinRate2 = template.sellWinRate2;
    sell.sellWinRate3 = template.sellWinRate3;
    
    sell.sellWinExtent = template.sellWinExtent;
    sell.sellWinExtent2 = template.sellWinExtent2;
    sell.sellWinExtent3 = template.sellWinExtent3;
    
    sell.sellLossRate = template.sellLossRate;
    
    sell.sellLossExtent = template.sellLossExtent;
    
    sell.sellSlippage = template.sellSlippage;
  }
  sellSettings.value = sell;
}
const updateTaskSetting = (template: TaskTemplate | undefined) => {
  updateTaskStyle(template);
  updateBuySettings(template);
  updateGasSettings(template);
  updateSellSettings(template);
}
const parseTaskTemplate = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (Array.isArray(data)) {
      templateList.length = 0;
      for (let info of data) {
        let template = new TaskTemplate();
        template.valueOf(info);
        console.log(template);
        templateList.push(template);
      }
    }
  }

}
const loadTemplateList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result = await $api.taskTemplateList();
      parseTaskTemplate(result);
      let temp: TaskTemplate | undefined = undefined;
      if (templateList.length > 0) {
        temp = templateList[0];
      }
      reloadTaskTemplate(temp);
      if (temp == undefined) {
        updateTaskSetting(undefined);
      }
    } catch (e: any) {

    } finally {
      loading.value = false;
    }

  }, 500)
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
  emit('back');
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
  let task = TaskSettings.build(taskStyle.value, buySettings.value, gasSettings.value, sell);
  task.address = props.address;
  task.description = props.name;
  setTimeout(() => {
    $api.createTask(task).then((result) => {
      if (result.code == 0) {
        emit('submit');
      } else {
        let message = result.message || t("Message035");
        store.showMessageBox(t("Trades006"), message);
      }
    }).catch(e => {
      let message = e.message || t("Message035");
      store.showMessageBox(t("Trades006"), message);
    }).finally(() => {
      submitting.value = false;
    });
  }, 1500);


}
const onSelectSolution = (solution: string) => {
  let template: TaskTemplate | undefined = undefined;
  for (let tp of templateList) {
    if (tp.id == solution) {
      template = tp;
      break;
    }
  }
  selectedTemplate.value = template;

}
const onGotoStepOne = () => {
  let url = new URL(window.location.href);
  url.pathname = "/copytrade";
  url.searchParams.delete("address");
  url.searchParams.delete("chain");
  window.location.href = url.href;
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
        break;
      case TradeProperty.customSellMode:
        value.customSell = val == SwitchState.on ? "1" : "0";
        value.sellMode = val == SwitchState.on ? "0" : "1";
        showSellSetting.value = value.customSell == "1";
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    let sellLoseRate = parseInt(sell.sellLossRate);
    if (sellLoseRate < 0) {
      if (showError) {
        let msg = t("Message029", {name1: t("Trade059"), name2: "0"});
        errorProps.value = TradeProperty.sellLossRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    if (sellLoseRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade059"), name2: "0"});
        errorProps.value = TradeProperty.sellLossRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false
    }
    let sellLoseExtent = parseInt(sellLoseExtentValue);
    if (sellLoseExtent < 0) {
      if (showError) {
        let msg = t("Message032", {name: t("Trade060")});
        errorProps.value = TradeProperty.sellLossExtent;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    if (sellLoseExtent > 100) {
      if (showError) {
        let msg = t("Message031", {name: t("Trade060")});
        errorProps.value = TradeProperty.sellLossExtent;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    let sellWinRate = parseInt(winRate);
    if (sellWinRate <= 0) {
      if (showError) {
        let msg = t("Message029", {name1: winRateName, name2: "0"});
        errorProps.value = winRateErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    let sellWinExtent = parseInt(winExtent);
    if (sellWinExtent <= 0) {
      if (showError) {
        let msg = t("Message029", {name1: winExtentName, name2: "0"});
        errorProps.value = winExtentErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    if (sellWinExtent > 100) {
      if (showError) {
        let msg = t("Message031", {name1: winExtentName, name2: "100"});
        errorProps.value = winExtentErrorProps;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let buyLimit = BigNumber(buyLimitValue);
  if (buyLimit.lte(0)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name038")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    let buyRate = parseInt(buyRateValue);
    if (buyRate < 0) {
      if (showError) {
        let msg = t("Message032", {name1: t("Trade042"), name2: "0"});
        errorProps.value = TradeProperty.buyRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    if (buyRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade042"), name2: "100"});
        errorProps.value = TradeProperty.buyRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    let sellRate = parseInt(sellRateValue);
    if (sellRate < 0) {
      if (showError) {
        let msg = t("Message032", {name1: t("Trade052"), name2: "0"});
        errorProps.value = TradeProperty.sellRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
      }
      return false;
    }
    if (sellRate > 100) {
      if (showError) {
        let msg = t("Message031", {name1: t("Trade052"), name2: "100"});
        errorProps.value = TradeProperty.sellRate;
        errorText.value = msg;
        store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
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
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let buySlippage = parseInt(buy.buySlippage);
  if (buySlippage < 0) {
    if (showError) {
      let msg = t("Message032", {name1: t("Trade044"), name2: "0"});
      errorProps.value = TradeProperty.buySlippage;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }

  if (buySlippage > 100) {
    if (showError) {
      let msg = t("Message031", {name1: t("Trade044"), name2: "100"});
      errorProps.value = TradeProperty.buySlippage;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
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
        store.showMessageBox(t("Home020"), msg);
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
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let gasLimit = parseInt(gasLimitValue);
  if (gasLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade061"), name2: "0"});
      errorProps.value = TradeProperty.gasLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let gasPriceLimitValue = gas.gasPriceLimit.trim();
  if (!isPositiveNumber(gasPriceLimitValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade062")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let gasPriceLimit = parseFloat(gasPriceLimitValue);

  if (gasPriceLimit <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: "0"});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let gasOverflowValue = gas.gasOverflow.trim();
  if (!isPositiveNumber(gasOverflowValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade063")});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let gasOverflow = parseFloat(gasOverflowValue);

  if (gasOverflow <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade063"), name2: "0"});
      errorProps.value = TradeProperty.gasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }

  let sellGasOverflowValue = gas.sellGasOverflow.trim();
  if (!isPositiveNumber(sellGasOverflowValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Trade064")});
      errorProps.value = TradeProperty.sellGasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  let sellGasOverflow = parseFloat(sellGasOverflowValue);
  if (sellGasOverflow <= 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade064"), name2: "0"});
      errorProps.value = TradeProperty.sellGasOverflow;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
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
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }

  if (n1.lte(n3)) {
    if (showError) {
      let msg = t("Message029", {name1: t("Trade062"), name2: t("Trade064")});
      errorProps.value = TradeProperty.gasPriceLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home020"), msg);
    }
    return false;
  }
  return true;
}
const onSubmitManageSolution = (templates: TaskTemplate[] | undefined) => {
  openManageSolution.value = false;
  if (templates == undefined) {//just close dialog
    return;
  }
  templateList.length = 0;
  templateList.push(...templates);
  
  let newSelectedTemplate: TaskTemplate | undefined = undefined;
  if (selectedTemplate.value) {
    let contains = false;
    for (let ts of templateList) {
      if (ts.id == selectedTemplate.value.id) {
        contains = true;
        break;
      }
    }
    if (contains) {
      newSelectedTemplate = selectedTemplate.value;
    }
  }
  if (newSelectedTemplate == undefined) {
    if (templateList.length > 0) {
      newSelectedTemplate = templateList[templateList.length - 1];
    }
  }
  reloadTaskTemplate(newSelectedTemplate);
}
const onSubmitNewSolution = (template: TaskTemplate | undefined) => {
  openNewSolution.value = false;
  if (template == undefined) {//just close dialog
    return;
  }
  templateList.push(template);
  reloadTaskTemplate(template);
}
const onAddTemplate = () => {
  let ok = validate(true);
  if (!ok) {
    return;
  }
  newSolution.value = TaskTemplate.build(taskStyle.value, buySettings.value, sellSettings.value, gasSettings.value)
  openNewSolution.value = true;
}
const onManageTemplate = () => {
  managedSolutions.value = [...templateList];
  openManageSolution.value = true;
}
const buttonClass = () => {
  return {
    'submit-button': true,
    disabled: !allowSubmit.value
  }
}
watch(() => selectedTemplate.value, (val) => {
  updateTaskSetting(val);
  allowSubmit.value = validate(false);
  if (val) {
    for (let sc of solutionList) {
      if (sc.id == val.id) {
        selectedSolution.value = sc;
        break;
      }
    }
  } else {
    selectedSolution.value = undefined;
  }
})
onMounted(() => {
  $bus.on(AppEvent.ChainChange, onGotoStepOne);
  $bus.on(AppEvent.Logout, onGotoStepOne);
  loadTemplateList();
})
onUnmounted(() => {
  $bus.off(AppEvent.ChainChange, onGotoStepOne);
  $bus.off(AppEvent.Logout, onGotoStepOne);
})
</script>

<template>
  <div class="column step-two">
    <TitleBar :title="$t('CopyTrade009')" tag="STEP 2" :tip-text="$t('CopyTrade003')"></TitleBar>
    <div class="column gap-16">
      <SolutionSelect :selected="selectedSolution"
                      :loading="loading"
                      :solutions="solutions"
                      :type="0"
                      @select="onSelectSolution"
                      @add="onAddTemplate"
                      @manage="onManageTemplate"></SolutionSelect>
      <div class="column gap-24">
        <div class="row gap-24 step-two-settings">
          <TradeStyle :error-type="errorProps" :error-text="errorText" :task-style="taskStyle"
                      @change="onTaskStyleChange"></TradeStyle>
          <TradeBuySettings :error-text="errorText" :error-type="errorProps" :buy-settings="buySettings"
                            @change="onBuySettingsChange"></TradeBuySettings>
        </div>
        <div class="row gap-24 step-two-settings">
          <TradeGasSettings :error-type="errorProps" :error-text="errorText" :gas-settings="gasSettings"
                            :title="$t('Trade084')"
                            @change="onGasSettingsChange"></TradeGasSettings>
          <TradeSellSettings v-if="showSellSetting" :error-type="errorProps" :error-text="errorText"
                             :sell-settings="sellSettings"
                             @change="onSellSettingsChange"></TradeSellSettings>
          <div class="blank" v-else></div>
        </div>
      </div>
      <div class="row flex-end gap-24 submit-button-bar">
        <div class="cancel-button" @click="onBack">{{ $t("CopyTrade004") }}</div>
        <div class="submit-button" v-if="submitting">
          <ItemLoading theme="black"></ItemLoading>
        </div>
        <div :class="buttonClass()" @click="onSubmit" v-else>{{ $t("Trade073") }}</div>
      </div>
    </div>
    <div class="submit-bar-padding"></div>
  </div>
  <NewSolution type="copytrade" :template="newSolution" :visible="openNewSolution"
               @submit="onSubmitNewSolution"></NewSolution>
  <ManageSolution type="copytrade" :mode="undefined" :templates="managedSolutions" :visible="openManageSolution"
                  @submit="onSubmitManageSolution"></ManageSolution>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.step-two {
  gap: 40px !important;
}

.step-two-settings {
  align-items: stretch !important;
}

.submit-bar-padding {
  height: 80px;
  width: 100%;
}

.submit-button-bar {
  padding: 12px 20% !important;
  background-color: $blue1;
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 100vw !important;
  left: 0;
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
  color: $backgroundColor1;
  cursor: pointer;
  border-radius: 2px;
  background-color: $primaryColor;

  &.disabled {
    background-color: $backgroundColor3;
    border: $border1;
    color: $line1;
    pointer-events: none;
  }
}
</style>
