import {Entity} from "@/models/Entity";
import {TaskSettings} from "~/models/TaskSettings";

export class FollowOrder extends Entity {
    public address: string = "";
    public sellMode: string = "0";
    public customSell: string = "0";
    public buyMode: string = "0";
    public followAmount: string = "";
    public duplicateBuyLimit: string = "";
    public buyFreqLimitHour: string = "";
    public buyLimit: string = "0";
    public gasLimit: string = "0";
    public gasPriceLimit: string = "0";
    public gasOverflow: string = "0"
    public sellGasOverflow: string = "0";
    public buyRate: string = "0";
    public sellRate: string = "0";
    public liquidity: string = "0";
    public buySlippage: string = "0";
    public highSpeedBuy: string = "0";
    public buyTxProtect: string = "0";
    public sellWinRate: string = "0";
    public sellWinExtent: string = "0";
    public sellWinRate2: string = "0";
    public sellWinExtent2: string = "0";
    public sellWinRate3: string = "0";
    public sellWinExtent3: string = "0";
    public sellLossExtent: string = "";
    public sellLossRate: string = "";
    public sellSlippage: string = "";


    public buyLimitMin: string = "";
    public buyLimitMax: string = "";

    public sellRatioFollow: string = "";

    public override valueOf(data: any): void {
        this.buyMode = data.buyMode || "0";
        this.securityBuy = data.securityBuy || "0";
        this.buyLimit = data.buyLimit || "0";
        this.followAmount = data.followAmount || "0";
        this.duplicateBuyLimit = data.duplicateBuyLimit || "0";
        this.buyFreqLimitHour = data.buyFreqLimitHour || "0";
        this.gasLimit = data.gasLimit || "0";
        this.gasPriceLimit = data.gasPriceLimit || "0";
        this.gasOverflow = data.gasOverflow || "0";
        this.sellGasOverflow = data.sellGasOverflow || "0";
        this.customSell = data.customSell || "0";
        this.sellMode = data.sellMode || "0";
        this.buyRate = data.buyRate || "0";
        this.sellRate = data.sellRate || "0";
        this.liquidity = data.liquidity || "0";
        this.buySlippage = data.buySlippage || "0";
        this.sellWinRate = data.sellWinRate || "";
        this.sellWinExtent = data.sellWinExtent || "";
        this.sellWinRate2 = data.sellWinRate2 || "";
        this.sellWinExtent2 = data.sellWinExtent2 || "";
        this.sellWinRate3 = data.sellWinRate3 || "";
        this.sellWinExtent3 = data.sellWinExtent3 || "";

        this.sellLossExtent = data.sellLossExtent || "";
        this.sellLossRate = data.sellLossRate || "";
        this.sellSlippage = data.sellSlippage || "";
        this.buyTxProtect = data.buyTxProtect || "0";
        if (this.buyTxProtect == "1") {
            this.highSpeedBuy = "0";
        } else {
            this.highSpeedBuy = "1";
        }
        this.buyLimitMin = data.buyLimitMin || "";
        this.buyLimitMax = data.buyLimitMax || "";
        this.sellRatioFollow = data.sellRatioFollow || "0";
    }

    public createTaskSettings(): TaskSettings {

        let taskSettings = new TaskSettings();

        taskSettings.address = this.address;

        taskSettings.style.buyMode = this.buyMode;
        taskSettings.style.securityBuy = this.securityBuy;
        taskSettings.style.buyLimit = this.buyLimit;
        taskSettings.style.followAmount = this.followAmount;
        taskSettings.style.duplicateBuyLimit = this.duplicateBuyLimit;
        taskSettings.style.buyFreqLimitHour = this.buyFreqLimitHour;
        taskSettings.style.sellMode = this.sellMode;
        taskSettings.style.customSell = this.customSell;
        taskSettings.style.sellRatioFollow = this.sellRatioFollow;

        taskSettings.buy.buyRate = this.buyRate;
        taskSettings.buy.sellRate = this.sellRate;
        taskSettings.buy.liquidity = this.liquidity;
        taskSettings.buy.buySlippage = this.buySlippage;

        taskSettings.buy.buyTxProtect = this.buyTxProtect;
        if (taskSettings.buy.buyTxProtect == "1") {
            taskSettings.buy.highSpeedBuy = "0";
        } else {
            taskSettings.buy.highSpeedBuy = "1";
        }

        taskSettings.buy.buyLimitMin = this.buyLimitMin;
        taskSettings.buy.buyLimitMax = this.buyLimitMax;
        taskSettings.sell.sellWinRate = this.sellWinRate;
        taskSettings.sell.sellWinExtent = this.sellWinExtent
        taskSettings.sell.sellWinRate2 = this.sellWinRate2;
        taskSettings.sell.sellWinExtent2 = this.sellWinExtent2;
        taskSettings.sell.sellWinRate3 = this.sellWinRate3;
        taskSettings.sell.sellWinExtent3 = this.sellWinExtent3;
        taskSettings.sell.sellLossRate = this.sellLossRate;
        taskSettings.sell.sellLossExtent = this.sellLossExtent;
        taskSettings.sell.sellSlippage = this.sellSlippage;
        taskSettings.gas.gasPriceLimit = this.gasPriceLimit;
        taskSettings.gas.gasLimit = this.gasLimit;
        taskSettings.gas.gasOverflow = this.gasOverflow;
        taskSettings.gas.sellGasOverflow = this.sellGasOverflow;

        return taskSettings;
    }

    public copyFromTaskSettings(taskSettings: TaskSettings) {

        this.address = taskSettings.address;
        this.buyMode = taskSettings.style.buyMode;
        this.securityBuy = taskSettings.style.securityBuy;
        this.buyLimit = taskSettings.style.buyLimit
        this.followAmount = taskSettings.style.followAmount
        this.duplicateBuyLimit = taskSettings.style.duplicateBuyLimit
        this.buyFreqLimitHour = taskSettings.style.buyFreqLimitHour
        this.sellMode = taskSettings.style.sellMode
        this.customSell = taskSettings.style.customSell
        this.sellRatioFollow = taskSettings.style.sellRatioFollow;
        this.buyRate = taskSettings.buy.buyRate
        this.sellRate = taskSettings.buy.sellRate
        this.liquidity = taskSettings.buy.liquidity
        this.buySlippage = taskSettings.buy.buySlippage

        this.buyTxProtect = taskSettings.buy.buyTxProtect
        if (taskSettings.buy.buyTxProtect == "1") {
            this.highSpeedBuy = "0"
        } else {
            this.highSpeedBuy = "1"
        }

        this.buyLimitMin = taskSettings.buy.buyLimitMin
        this.buyLimitMax = taskSettings.buy.buyLimitMax
        this.sellWinRate = taskSettings.sell.sellWinRate
        this.sellWinExtent = taskSettings.sell.sellWinExtent
        this.sellWinRate2 = taskSettings.sell.sellWinRate2
        this.sellWinExtent2 = taskSettings.sell.sellWinExtent2
        this.sellWinRate3 = taskSettings.sell.sellWinRate3
        this.sellWinExtent3 = taskSettings.sell.sellWinExtent3
        this.sellLossRate = taskSettings.sell.sellLossRate
        this.sellLossExtent = taskSettings.sell.sellLossExtent
        this.sellSlippage = taskSettings.sell.sellSlippage
        this.gasPriceLimit = taskSettings.gas.gasPriceLimit
        this.gasLimit = taskSettings.gas.gasLimit
        this.gasOverflow = taskSettings.gas.gasOverflow
        this.sellGasOverflow = taskSettings.gas.sellGasOverflow

    }

}
