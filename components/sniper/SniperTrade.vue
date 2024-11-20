<script setup lang="ts">


import SniperSolution from "~/components/sniper/components/SniperSolution.vue";
import SniperAmount from "~/components/sniper/components/SniperAmount.vue";
import TradeSellSettings from "~/components/copytrade/components/TradeSellSettings.vue";
import SniperTokenInfo from "~/components/sniper/components/SniperTokenInfo.vue";
import SniperPairInfo from "~/components/sniper/components/SniperPairInfo.vue";
import SniperAdvanceSettings from "~/components/sniper/components/SniperAdvanceSettings.vue";
import SniperSolanaAdvancedSettings from "~/components/sniper/components/SniperSolanaAdvancedSettings.vue";
import {Pair} from "~/models/Pair";
import {Token} from "~/models/Token";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate"
import SniperLimitOrder from "~/components/sniper/components/SniperLimitOrder.vue";
import BigNumber from "bignumber.js";
import SniperTokenSelect from "~/components/sniper/components/SniperTokenSelect.vue";
import TitleBar from "~/components/base/TitleBar.vue";
import {TaskSellSettings} from "~/models/TaskSellSettings";

import {DefaultSnipValueKeys, SnipBuyMode, SwitchState, TradeProperty} from "~/utils/constant"
import {defaultSnipValue, isPositiveInteger, useI18n, useNuxtApp} from "#imports";
import {Solution} from "~/models/Solution";
import NewSolution from "~/components/base/NewSolution.vue";
import ManageSolution from "~/components/base/ManageSolution.vue";
import ItemLoading from "~/components/base/ItemLoading.vue";
import {SniperTaskSellSettings} from "~/models/SniperTaskSellSettings";
import {SniperTaskGasSettings} from "~/models/SniperTaskGasSettings";
import {TaskTemplate} from "~/models/TaskTemplate";
import {SniperTaskSettings} from "~/models/SniperTaskSettings";
import dayjs from "dayjs";
import {Result} from "~/models/Result";
import {useRoute} from "#app";

const route = useRoute();
const page = route.query.t;

const {t} = useI18n({useScope: 'global'});
const {$api, $bus} = useNuxtApp();
const store = useAppStore();
const errorProps = ref<TradeProperty>();
const errorText = ref('');

const showTokenSelect = ref<boolean>(false);

const highSpeedBuy = ref<SwitchState>(SwitchState.off);

const secureBuy = ref<SwitchState>(SwitchState.off);

const buyTxProtect = ref<SwitchState>(SwitchState.off);
const sellSettings = ref<SniperTaskSellSettings>();
const gasSettings = ref<SniperTaskGasSettings>();


const sniperAddress = ref<string>('');

const commonSolution = ref<SwitchState>(SwitchState.off);

const tokenSymbol = ref<string>('');
const sniperMode = ref<SnipBuyMode>();
let templateList: Array<SniperTaskTemplate> = [];
const selectedTemplate = ref<SniperTaskTemplate>();
const newTemplate = ref<SniperTaskTemplate>();
let solutions: Array<Solution> = [];
const solutionList = ref<Solution[]>([]);
const selectedSolution = ref<Solution>();
const solutionLoading = ref(false);
const showNewSolution = ref(false);
const showManageSolution = ref(false);
const managedSolutions = ref<SniperTaskTemplate[]>([]);
const accountBalance = ref('-');
boolean>(false);

const tokenAmount = ref<string>('');

const buyLimit = ref<string>('');

const tokenTitle = ref<string>('');

const advancedSettings = ref<SwitchState>(SwitchState.off);

const showLimitPrice = ref<SwitchState>(SwitchState.off);

const customSell = ref<SwitchState>(SwitchState.off);

const pair = ref<Pair>();

const token = ref<Token>();


const submitting = ref(false);

const allowSubmit = ref(false);

const limitPriceAmount = ref<string>('');

const limitPriceTime = ref<number>(-1);

const limitPriceBaseAmount = ref<string>('');

const limitPricePrice = ref<string>('');

const limitPriceLoading = ref(false);

const clearError = (prop: TradeProperty) => {
  if (prop == errorProps.value) {
    errorText.value = "";
  }
}
const clearSellError = () => {
  if (errorProps.value == TradeProperty.sellWinExtent || errorProps.value == TradeProperty.sellWinExtent2 || errorProps.value == TradeProperty.sellWinExtent3) {
    errorProps.value = undefined;
    errorText.value = '';
  }

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
  if (!isAddress(sniperAddress.value)) {
    return false;
  }
  let gas = gasSettings.value;
  if (gas == undefined) {
    return false;
  }

  let buyLimitValueString = buyLimit.value.trim();

  if (!isPositiveNumber(buyLimitValueString)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name044")});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let buyLimitValue = BigNumber(buyLimitValueString);
  if (buyLimitValue.lte(0)) {
    if (showError) {
      let msg = t("Message029", {name1: t("Name044"), name2: "0"});
      errorProps.value = TradeProperty.buyLimit;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }


  if (customSell.value == SwitchState.on) {
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
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
  }

  let slippageValue = gas.slippage.trim();
  if (!isPositiveNumber(slippageValue)) {
    if (showError) {
      let msg = t("Message028", {name: t("Name104")});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  let slippage = parseInt(slippageValue);
  if (slippage < 0) {
    if (showError) {
      let msg = t("Message029", {name1: t("Name104"), name2: "0"});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }
  if (slippage > 100) {
    if (showError) {
      let msg = t("Message031", {name1: t("Name104"), name2: "100"});
      errorProps.value = TradeProperty.slippage;
      errorText.value = msg;
      store.showMessageBox(t("Home021"), msg);
    }
    return false;
  }

  if (isSolanaAdvancedSettings()) {
    let priorityValue = gas.priorityFee.trim();
    if (!isPositiveNumber(priorityValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Name106")});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    let priorityFee = BigNumber(priorityValue);
    if (priorityFee.isLessThan(0.00001)) {
      if (showError) {
        let msg = t("Message032", {name1: t("Name106"), name2: "0.00001"});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }
    if (priorityFee.isGreaterThan(1)) {
      if (showError) {
        let msg = t("Message031", {name1: t("Name106"), name2: "1"});
        errorProps.value = TradeProperty.priorityFee;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }

  } else if (isNormalAdvancedSettings()) {
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

    let n1 = BigNumber(gasPriceLimitValue)
    let n2 = BigNumber(gasOverflowValue)

    if (n1.lte(n2)) {
      if (showError) {
        let msg = t("Message029", {name1: t("Trade062"), name2: t("Trade063")});
        errorProps.value = TradeProperty.gasPriceLimit;
        errorText.value = msg;
        store.showMessageBox(t("Home021"), msg);
      }
      return false;
    }

  }

  if (showLimitPrice.value == SwitchState.on) {
    let limitPriceAmountValue = limitPriceAmount.value.trim();
    if (!isPositiveNumber(limitPriceAmountValue)) {
      if (showError) {
        let msg = t("Message028", {name: t("Name107")});
        errorProps.value = TradeProperty.limitOrderAmount;
        errorText.value = msg;
        store.showMessageBox(t("Name036"), msg);
      }
      return false;
    }
    let limitPrice = BigNumber(limitPriceAmountValue);
    if (limitPrice.isZero() || limitPrice.isNegative()) {
      if (showError) {
        let msg = t("Message029", {name1: t("Name107"), name2: "0"});
        errorProps.value = TradeProperty.limitOrderAmount;
        errorText.value = msg;
        store.showMessageBox(t("Name036"), msg);
      }
      return false;
    }
  }
  return true;
}


const loadAccountBalance = () => {
  $api.accountBalance().then(r => {
    if (r.code == 0) {
      accountBalance.value = r.data?.toString() || '-'
    } else {
      accountBalance.value = "-"
    }
  }).catch(e => {
    accountBalance.value = '-';
  });
}

const reloadTemplateList = (selected: SniperTaskTemplate) => {
  solutions = templateList.map(item => {
    return {remark: item.remark, id: item.id}
  });
  solutionList.value = solutions;
  selectedTemplate.value = selected;
}

const hasPair = () => {
  return pair.value != undefined;
}
const hasToken = () => {
  return token.value != undefined;
}
const loadLimitPriceBaseAmount = (chainId: string, pair: string) => {
  limitPriceLoading.value = true;
  $api.loadPairBaseAmount(chainId, pair).then(r => {
    if (r.code == 0) {
      let data = r.data;
      let amount = data?.amount || "";
      let price = data?.price || "0";
      limitPriceAmount.value = amount;
      limitPriceBaseAmount.value = amount;
      limitPricePrice.value = price;
      limitPriceTime.value = 0
    } else {
      limitPriceAmount.value = "";
      limitPricePrice.value = ""
      limitPriceBaseAmount.value = "";
      limitPriceTime.value = 0
    }

  }).catch(e => {
  }).finally(() => {
    limitPriceLoading.value = false;
  })
}
const loadTaskTemplate = (mode: SnipBuyMode) => {
  $api.snipTaskTemplateList(mode).then(result => {
    if (result.code === 0) {
      let data = result.data;
      if (Array.isArray(data)) {
        templateList.length = 0;

        let array: SniperTaskTemplate[] = data.map(item => {
          let template = new SniperTaskTemplate();
          template.valueOf(item);
          template.mode = mode;
          return template
        });
        templateList.push(...array);
        solutions.length = 0;
        solutions = templateList.map(item => {
          return {id: item.id, remark: item.remark}
        });
        solutionList.value = solutions;
        let temp: SniperTaskTemplate | undefined = undefined;
        if (templateList.length > 0) {
          temp = templateList[0];
        }
        reloadTemplateList(temp);
        updateTaskSettings(temp);
      }
    }
  }).catch(error => {

  }).finally(() => {
  });
}

const end = () => {
  if (page == "flash") {
    let href = window.location.href;
    let url = new URL(href);
    url.pathname = "/trades/flash";
    url.searchParams.set("t", UserTab.FlashOrders.toString());
    window.location.href = url.href;
    return;
  }
  let tab: string;
  if (sniperMode.value == SnipBuyMode.Snip) {
    tab = DataSource.SnipCurrentTask.toString();
  } else {
    tab = DataSource.SnipTradeList.toString()
  }
  let href = window.location.href;
  let url = new URL(href);
  url.pathname = "/trades/sniper";
  url.searchParams.set("t", tab);
  window.location.href = url.href;
}

const submitSnip = () => {
  let taskSettings = new SniperTaskSettings();
  taskSettings.address = sniperAddress.value;

  taskSettings.buy.buySlippage = gasSettings.value?.slippage;
  taskSettings.buy.bribeAmount = "0";
  taskSettings.buy.highSpeedBuy = highSpeedBuy.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.secureBuy = secureBuy.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.customSell = customSell.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.advancedSettings = advancedSettings.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.buyTxProtect = buyTxProtect.value == SwitchState.on ? "1" : "0";
  taskSettings.description = tokenSymbol.value
  taskSettings.mode = sniperMode.value;
  taskSettings.buy.buyLimit = buyLimit.value;
  taskSettings.description = tokenSymbol.value;
  if (customSell.value == SwitchState.off) {
    taskSettings.sell.sellWinRate = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinRate);
    taskSettings.sell.sellWinExtent = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinExtent);
    taskSettings.sell.sellLossRate = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellLossRate);
    taskSettings.sell.sellLossExtent = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellLossExtent);
  } else {
    taskSettings.sell = sellSettings.value;
  }
  if (advancedSettings.value == SwitchState.off) {
    taskSettings.gas.gasPriceLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasPriceLimit);
    taskSettings.gas.gasLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasLimit);
    taskSettings.gas.gasOverflow = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasOverflow);
    taskSettings.gas.priorityFee = defaultSnipValue(store.chainId, DefaultSnipValueKeys.priorityFee);
  } else {
    taskSettings.gas = gasSettings.value;
  }
  taskSettings.limitPriceAmount = "0";
  taskSettings.limitExpireTime = "0";
  taskSettings.limitPriceType = "";
  submitting.value = true;
  setTimeout(() => {
    $api.createSniperTask(taskSettings, "").then(result => {
      if (result.code === 0) {
        setTimeout(() => {
          end();
        }, 1000)
      } else {
        let message: string;
        if (result.code == 3009) {
          message = t("Message037");
        } else {
          message = result.message || t("Message038");
        }
        store.showMessageBox(t("Home021"), message);
      }

    }).catch(error => {
    }).finally(() => {
      submitting.value = false;
    })
  }, 500);
}

const submitNormal = () => {
  let taskSettings = new SniperTaskSettings();
  taskSettings.buy.customSell = customSell.value;
  taskSettings.buy.buyLimit = buyLimit.value;
  taskSettings.buy.buySlippage = gasSettings.value?.slippage || "0";
  taskSettings.buy.bribeAmount = "0";
  taskSettings.buy.highSpeedBuy = highSpeedBuy.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.secureBuy = secureBuy.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.customSell = customSell.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.advancedSettings = advancedSettings.value == SwitchState.on ? "1" : "0";
  taskSettings.buy.buyTxProtect = buyTxProtect.value == SwitchState.on ? "1" : "0";
  taskSettings.mode = sniperMode.value;
  taskSettings.address = sniperAddress.value;
  taskSettings.description = tokenSymbol.value;
  if (customSell.value == SwitchState.off) {
    taskSettings.sell.sellWinRate = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinRate);
    taskSettings.sell.sellWinExtent = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinExtent);
    taskSettings.sell.sellLossRate = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellLossRate);
    taskSettings.sell.sellLossExtent = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellLossExtent);
  } else {
    taskSettings.sell = sellSettings.value;
  }
  if (advancedSettings.value == SwitchState.off) {
    taskSettings.gas.gasPriceLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasPriceLimit);
    taskSettings.gas.gasLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasLimit);
    taskSettings.gas.gasOverflow = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasOverflow);
    taskSettings.gas.priorityFee = defaultSnipValue(store.chainId, DefaultSnipValueKeys.priorityFee);
  } else {
    taskSettings.gas = gasSettings.value;
  }
  if (showLimitPrice.value == SwitchState.on) {
    taskSettings.limitPriceAmount = limitPriceAmount.value;
    taskSettings.limitPriceBasePrice = limitPriceBaseAmount.value;
    let now = dayjs().unix();
    let deadline: number;
    if (limitPriceTime.value == 0) {
      deadline = now + 24 * 3600;
    } else if (limitPriceTime.value == 1) {
      deadline = now + 7 * 24 * 3600;
    } else {
      deadline = now + 30 * 24 * 3600;
    }
    taskSettings.limitExpireTime = deadline.toFixed(0);
    let n1 = BigNumber(limitPriceAmount.value);
    let n2 = BigNumber(limitPriceBaseAmount.value);
    if (n1.lt(n2)) {
      taskSettings.limitPriceType = "0";
    } else {
      taskSettings.limitPriceType = "1";
    }
  } else {
    taskSettings.limitPriceAmount = "0";
    taskSettings.limitExpireTime = "0";

    taskSettings.limitPriceType = "";
    taskSettings.limitPriceBasePrice = "";
  }

  taskSettings.description = token.value.tokenSymbol;
  submitting.value = true;
  setTimeout(() => {
    $api.createSniperTask(taskSettings, pair.value.address).then(result => {
      if (result.code === 0) {
        setTimeout(() => {
          end();
        }, 1000)
      } else {
        let message: string;
        if (result.code == 3009) {
          message = t("Message037");
        } else {
          message = result.message || t("Message038");
        }
        store.showMessageBox(t("Home021"), message);
      }

    }).catch(error => {
    }).finally(() => {
      submitting.value = false;
    })
  }, 500);
}
const onSubmit = () => {
  if (!store.isLogin) {
    store.showLoginWalletDialog("0x1");
    return;
  }
  if (!store.hasWallet) {
    store.showMessageBox(t("Home021"), t("Sniper002"));
    return;
  }
  let ok = validate(true);
  if (!ok) {
    return;
  }
  errorProps.value = undefined;
  errorText.value = "";
  if (sniperMode.value == SnipBuyMode.Normal) {
    submitNormal();
  } else {
    submitSnip();
  }
}
const onHighSpeedBuyChange = (state: SwitchState) => {
  highSpeedBuy.value = state;
  secureBuy.value = state == SwitchState.on ? SwitchState.off : SwitchState.on;
}
const onSecureBuyChange = (state: SwitchState) => {
  secureBuy.value = state;
  highSpeedBuy.value = state == SwitchState.on ? SwitchState.off : SwitchState.on;
}
const onBuyTxProtectChange = (state: SwitchState) => {
  buyTxProtect.value = state;
}
const onAddSolution = () => {
  let ok = validate(true);
  if (!ok) {
    return;
  }
  if (gasSettings.value == undefined || sellSettings.value == undefined) {
    return;
  }
  let gas = gasSettings.value;
  let sell = sellSettings.value;
  let template = new SniperTaskTemplate();

  template.highSpeedBuy = highSpeedBuy.value == SwitchState.on ? "1" : "0";

  template.secureBuy = secureBuy.value == SwitchState.on ? "1" : "0";


  template.buySlippage = gas.slippage;

  template.bribeAmount = "";

  template.gasLimit = gas.gasLimit;

  template.gasPriceLimit = gas.gasPriceLimit;

  template.gasOverflow = gas.gasOverflow;

  template.customSell = customSell.value == SwitchState.on ? "1" : "0";

  template.advancedSettings = advancedSettings.value == SwitchState.on ? "1" : "0";

  template.mode = sniperMode || SnipBuyMode.Snip;
  template.sellWinRate = sell.sellWinRate;
  template.sellWinRate2 = sell.sellWinRate2;
  template.sellWinRate3 = sell.sellWinRate3;
  template.sellWinExtent = sell.sellWinExtent;
  template.sellWinExtent2 = sell.sellWinExtent2;
  template.sellWinExtent3 = sell.sellWinExtent3;
  template.sellLossRate = sell.sellLossRate;
  template.sellLossExtent = sell.sellLossExtent;
  template.sellSlippage = "";

  template.buyTxProtect = buyTxProtect.value == SwitchState.on ? "1" : "0"

  template.priorityFee = gas.priorityFee;
  newTemplate.value = template;
  showNewSolution.value = true;
}
const onManageSolution = () => {
  managedSolutions.value = [...templateList]
  showManageSolution.value = true;
}
const onSelectSolution = (solution: string) => {
  for (let template of templateList) {
    if (template.id == solution) {
      selectedTemplate.value = template;
      break;
    }
  }
}
const reset = () => {
  token.value = undefined;
  pair.value = undefined;
  sniperMode.value = undefined
  tokenLoading.value = false;
  tokenTitle.value = '';
  sniperAddress.value = "";
  tokenSymbol.value = "";
  tokenAmount.value = "";
  advancedSettings.value = SwitchState.off;
  customSell.value = SwitchState.off;
  showLimitPrice.value = SwitchState.off;
}
const onBack = () => {
  if (token.value) {
    reset();
    return;
  }
  let url = new URL(window.location.href);
  url.pathname = "/"
  window.location.href = url.href;
}
const updateSellSettings = (template: SniperTaskTemplate | undefined) => {
  let sell = new SniperTaskSellSettings();
  if (template == undefined) {
    sell.sellWinRate = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinRate);
    sell.sellWinRate2 = "";
    sell.sellWinRate3 = "";

    sell.sellWinExtent = defaultSnipValue(store.chainId, DefaultSnipValueKeys.sellWinExtent);
    sell.sellWinExtent2 = "";
    sell.sellWinExtent3 = "";

    sell.sellLossRate = "";

    sell.sellLossExtent = "";
  } else {
    sell.valueOf(template);
  }
  sellSettings.value = sell;
}
const updateAdvanceSettings = (template: SniperTaskTemplate | undefined) => {
  let gas = new SniperTaskGasSettings();
  if (template == undefined) {
    gas.priorityFee = defaultSnipValue(store.chainId, DefaultSnipValueKeys.priorityFee);
    gas.slippage = defaultSnipValue(store.chainId, DefaultSnipValueKeys.buySlippage);
    gas.gasPriceLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasPriceLimit);
    gas.gasLimit = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasLimit);
    gas.gasOverflow = defaultSnipValue(store.chainId, DefaultSnipValueKeys.gasOverflow);
  } else {
    gas.slippage = template.buySlippage;
    gas.priorityFee = template.priorityFee;
    gas.gasPriceLimit = template.gasPriceLimit;
    gas.gasLimit = template.gasLimit;
    gas.gasOverflow = template.gasOverflow;
  }
  gasSettings.value = gas;

}
const updateTaskSettings = (template: SniperTaskTemplate | undefined) => {
  if (template == undefined) {
    let hsb = defaultSnipValue(store.chainId, DefaultSnipValueKeys.highSpeedBuy);
    highSpeedBuy.value = hsb == "1" ? SwitchState.on : SwitchState.off;
    let sb = defaultSnipValue(store.chainId, DefaultSnipValueKeys.secureBuy)
    secureBuy.value = sb == "1" ? SwitchState.on : SwitchState.off;
    let btx = defaultSnipValue(store.chainId, DefaultSnipValueKeys.buyTxProtect)
    buyTxProtect.value = btx == "1" ? SwitchState.on : SwitchState.off;
    buyLimit.value = defaultSnipValue(store.chainId, DefaultSnipValueKeys.buyLimit);
    let advs = defaultSnipValue(store.chainId, DefaultSnipValueKeys.advancedSettings)
    advancedSettings.value = advs == "1" ? SwitchState.on : SwitchState.off;
    let cst = defaultSnipValue(store.chainId, DefaultSnipValueKeys.customSell);
    customSell.value = cst == "1" ? SwitchState.on : SwitchState.off;
    updateSellSettings(undefined);
    updateAdvanceSettings(undefined);
  } else {
    highSpeedBuy.value = template.highSpeedBuy == "1" ? SwitchState.on : SwitchState.off;
    secureBuy.value = template.secureBuy == "1" ? SwitchState.on : SwitchState.off;
    buyTxProtect.value = template.buyTxProtect == "1" ? SwitchState.on : SwitchState.off;
    buyLimit.value = template.buyLimit;
    advancedSettings.value = template.advancedSettings == "1" ? SwitchState.on : SwitchState.off;
    customSell.value = template.customSell == "1" ? SwitchState.on : SwitchState.off;
    updateSellSettings(template);
    updateAdvanceSettings(template);
  }


}
const onSubmitNewSolution = (template: SniperTaskTemplate | undefined) => {
  showNewSolution.value = false;
  newTemplate.value = undefined;
  if (template == undefined) {//just close dialog
    return;
  }
  templateList.push(template);
  reloadTemplateList(template)

}
const onSubmitManageSolution = (templates: SniperTaskTemplate[] | undefined) => {
  showManageSolution.value = false;
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
  reloadTemplateList(newSelectedTemplate);
}
const showSubmitButton = computed(() => {
  return hasPair() || hasToken();
})

const computeLimitAmount = (amount: string, limitPriceAmount: string) => {
  let n1 = BigNumber(amount);
  let n2 = BigNumber(limitPriceAmount);
  let c = n1.div(n2);
  if (c.isNaN()) {
    tokenAmount.value = "";
  } else {
    let value = c.toFixed();
    let index = value.indexOf(".")
    if (index >= 0) {
      let fact = value.substring(index + 1)
      if (fact.length > 6) {
        tokenAmount.value = c.toFixed(6);
        return;
      }
    }
    tokenAmount.value = value;
  }
}
const balanceChange = (val: string) => {
  buyLimit.value = val;
  if (showLimitPrice.value == SwitchState.on) {
    computeLimitAmount(val, limitPriceAmount.value);
  }
  clearError(TradeProperty.buyLimit);
  allowSubmit.value = validate(false);
}
const selectToken = () => {
  if (tokenLoading.value) {
    return;
  }
  showTokenSelect.value = true;
}
const processCheckToken = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    let sniperToken = new Token();
    sniperToken.valueOf(data);
    token.value = sniperToken;
    tokenSymbol.value = sniperToken.tokenSymbol;
    sniperAddress.value = sniperToken.tokenAddress;
    if (data.swapInfo) {
      let snipPair = new Pair();
      snipPair.valueOf(data.swapInfo);
      if (snipPair.honeypot == "true") {
        store.showMessageBox(t("Home021"), t("Sniper017"));
        return;
      }
      let n = BigNumber(snipPair.liquidity)
      if (n.isNaN() || n.isZero() || n.isNegative()) {
        token.value = sniperToken;
        tokenTitle.value = t("Sniper016");
        sniperMode.value = SnipBuyMode.Snip
        loadTaskTemplate(SnipBuyMode.Snip);
      } else {
        pair.value = snipPair;
        tokenTitle.value = "";
        sniperMode.value = SnipBuyMode.Normal
        loadTaskTemplate(SnipBuyMode.Normal);
      }

    } else {
      sniperMode.value = SnipBuyMode.Snip
      tokenTitle.value = t("Sniper016");
      loadTaskTemplate(SnipBuyMode.Snip);
    }
  } else {
    let msg = result.message || t("Message038");
    tokenSymbol.value = "";
    sniperAddress.value = "";
    buyLimit.value = "";
    store.showMessageBox(t("Home021"), msg);
  }
}
const forceDemo = () => {}
const onCloseSniperTokenSelect = (address: string) => {
  showTokenSelect.value = false;
  if (isAddress(address)) {
    sniperAddress.value = address;
    tokenLoading.value = true;
    setTimeout(() => {
      $api.checkSnipToken(store.chainId, sniperAddress.value).then(result => {
        processCheckToken(result);
        if (showLimitPrice.value == SwitchState.on) {
          if (pair.value) {
            loadLimitPriceBaseAmount(store.chainId, pair.value.address);
          }

        }
      }).catch(e => {
      }).finally(() => {
        // forceDemo();
        tokenLoading.value = false;
      })

    }, 500)

  }
}
const onSettingsChange = (type: number, state: SwitchState) => {
  switch (type) {
    case 0:
      advancedSettings.value = state;
      break;
    case 1:
      showLimitPrice.value = state;
      break;
    case 2:
      customSell.value = state;
      break;
  }
}
const onCommonSolutionChange = (state: SwitchState) => {
  commonSolution.value = state;
  localStorage.setItem('commonSolution', state == SwitchState.on ? '1' : '0');
}
const isSolanaAdvancedSettings = () => {
  return store.chainId == 'solana' && advancedSettings.value == SwitchState.on;
}
const isNormalAdvancedSettings = () => {
  return store.chainId != 'solana' && advancedSettings.value == SwitchState.on;
}
const onLimitPriceAmountChange = (amount: string) => {
  limitPriceAmount.value = amount;
  computeLimitAmount(buyLimit.value, amount);
  clearError(TradeProperty.limitOrderAmount);
  allowSubmit.value = validate(false);
}
const onLimitPriceTimeChange = (ts: string) => {
  limitPriceTime.value = ts;
}
const submitButtonClass = () => {
  return {
    'submit-button': true,
    disabled: !allowSubmit.value,
  }
}
const isCustomSell = () => {
  return customSell.value == SwitchState.on
}
const onLogout = () => {
  reset();
}
const pageTitle = () => {
  return page == "flash" ? t("Sniper020", {name: t("Sniper019")}) : t("Sniper020", {name: t("Sniper015")});
}
const pageTag = () => {
  return page == "flash" ? t("Sniper019") : t("Sniper015");
}
watch(() => showLimitPrice.value, (val) => {
  if (val == SwitchState.on) {
    if (pair.value) {
      loadLimitPriceBaseAmount(store.chainId, pair.value.address);
    }
  }
})
watch(() => selectedTemplate.value, (val) => {
  updateTaskSettings(val);
  allowSubmit.value = validate(false);
  if (val) {
    for (let solution of solutions) {
      if (solution.id == val.id) {
        selectedSolution.value = solution;
        break;
      }
    }
  } else {
    selectedSolution.value = undefined;
  }
})

onMounted(() => {
  loadAccountBalance();
  $bus.on(AppEvent.Logout, onLogout)
  let value = localStorage.getItem("commonSolution");
  if (value != undefined) {
    commonSolution.value = value == "1" ? SwitchState.on : SwitchState.off
  }
});

onUnmounted(() => {
  $bus.off(AppEvent.Logout, onLogout)
});
</script>

<template>
  <div class="column step">
    <TitleBar :tag="pageTag()" :title="pageTitle()" :tip-text="$t('Sniper002')"></TitleBar>
    <SniperSolution v-if="showSubmitButton"
                    :high-speed-buy="highSpeedBuy"
                    :secure-buy="secureBuy"
                    :solution-list="solutionList"
                    :loading="solutionLoading"
                    :common-solution="commonSolution"
                    :selected-solution="selectedSolution"
                    @add="onAddSolution"
                    @manage="onManageSolution"
                    @select="onSelectSolution"
                    @secure-buy-change="onSecureBuyChange"
                    @high-speed-buy-change="onHighSpeedBuyChange"
                    @common-solution-change="onCommonSolutionChange"
    ></SniperSolution>
    <div class="row gap-24 align-items-stretch">
      <div class="column auto gap-24 flex-start">
        <SniperAmount :title="tokenTitle"
                      :accountBalance="accountBalance"
                      :error-type="errorProps"
                      :error-text="errorText"
                      :amount="tokenAmount"
                      :symbol="tokenSymbol"
                      :address="sniperAddress"
                      :buyLimit="buyLimit"
                      :loading="tokenLoading"
                      :price="limitPricePrice"
                      @select="selectToken"
                      @balance-change="balanceChange">
        </SniperAmount>
        <SniperLimitOrder v-if="showLimitPrice == SwitchState.on"
                          :error-text="errorText"
                          :error-type="errorProps"
                          :base-amount="limitPriceBaseAmount"
                          :symbol="tokenSymbol"
                          :amount="limitPriceAmount"
                          :address="sniperAddress"
                          :price="limitPricePrice"
                          :time="limitPriceTime"
                          :loading="limitPriceLoading"
                          @change="onLimitPriceAmountChange"
                          @time-change="onLimitPriceTimeChange"
        ></SniperLimitOrder>
        <SniperPairInfo
            v-if="sniperMode==SnipBuyMode.Normal"
            :buy-tx-protect="buyTxProtect"
            :text="$t('Sniper006')"
            :advance-settings="advancedSettings"
            :limit-price="showLimitPrice"
            :custom-sell="customSell"
            :pair="pair"
            @change="onSettingsChange"
            @buy-tx-protect-change="onBuyTxProtectChange"
        ></SniperPairInfo>
        <SniperTokenInfo
            v-if="sniperMode==SnipBuyMode.Snip"
            :buy-tx-protect="buyTxProtect"
            :token="token"
            :text="$t('Sniper007')"
            :advance-settings="advancedSettings"
            :limit-price="showLimitPrice"
            :custom-sell="customSell"
            @change="onSettingsChange"
            @buy-tx-protect-change="onBuyTxProtectChange"
        ></SniperTokenInfo>
      </div>
      <div class="column auto gap-24 flex-start">
        <TradeSellSettings v-if="isCustomSell()"
                           :sell-settings="sellSettings"
                           :error-text="errorText"
                           :error-type="errorProps"
                           @change="onSellSettingsChange"></TradeSellSettings>
        <SniperSolanaAdvancedSettings v-if="isSolanaAdvancedSettings()"
                                      :error-type="errorProps"
                                      :error-text="errorText"
                                      :title="$t('Name035')"
                                      :gas="gasSettings"
                                      @change="onGasSettingsChange"
        ></SniperSolanaAdvancedSettings>
        <SniperAdvanceSettings v-if="isNormalAdvancedSettings()"
                               :gas="gasSettings"
                               :title="$t('Name035')"
                               :error-type="errorProps"
                               :error-text="errorText"
                               @change="onGasSettingsChange"></SniperAdvanceSettings>
      </div>
    </div>
    <div class="row flex-end gap-24 submit-button-bar" v-if="showSubmitButton">
      <div class="cancel-button" @click="onBack">{{ $t("CopyTrade004") }}</div>
      <div class="submit-button" v-if="submitting">
        <ItemLoading theme="black"></ItemLoading>
      </div>
      <div :class="submitButtonClass()" @click="onSubmit" v-else>{{ $t("Trade073") }}</div>
    </div>
    <div class="submit-bar-padding"></div>
  </div>
  <SniperTokenSelect :visible="showTokenSelect" @close="onCloseSniperTokenSelect"></SniperTokenSelect>
  <NewSolution type="snipertrade" :template="newTemplate" :visible="showNewSolution"
               @submit="onSubmitNewSolution"></NewSolution>
  <ManageSolution type="snipertrade" :mode="sniperMode" :templates="managedSolutions" :visible="showManageSolution"
                  @submit="onSubmitManageSolution"></ManageSolution>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.step {
  padding: 42px 86px !important;
  gap: 40px !important;

}

.submit-button-bar {
  padding: 12px 20% !important;
  background-color: $blue1;
  position: fixed;
  width: 100vw !important;
  bottom: 0;
  z-index: 999;
}

.cancel-button {
  @include box($width: 128px, $height: 40px);
  border: $border1;
  @include font(14px, 500);
  color: $textColor1;
  border-radius: 2px;
  cursor: pointer;

  &.disabled {
    background-color: $backgroundColor3;
    color: $line1;
    pointer-events: none;
  }
}

.submit-bar-padding {
  height: 80px;
  width: 100%;
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
    color: rgba($textColor1, 0.3);
    pointer-events: none;
  }
}

</style>
