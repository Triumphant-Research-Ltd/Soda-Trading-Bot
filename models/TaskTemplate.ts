import {Entity} from "@/models/Entity";
import {TaskSettings} from "@/models/TaskSettings";
import {TaskStyleSettings} from "~/models/TaskStyleSettings";
import {TaskBuySettings} from "~/models/TaskBuySettings";
import {TaskSellSettings} from "~/models/TaskSellSettings";
import {TaskGasSettings} from "~/models/TaskGasSettings";


export class TaskTemplate extends Entity {
    
    public remark: string = "";
    
    public buyMode: string = "";
    
    public securityBuy: string = "";
    
    public buyLimit: string = "";
    
    public sellMode: string = "";
    
    public customSell: string = "";
    
    public buyRate: string = "";
    
    public sellRate: string = "";
    
    public liquidity: string = "";
    
    public buySlippage: string = "";
    
    public highSpeedBuy: string = "0"
    
    public buyTxProtect: string = "0";
    
    public sellWinRate: string = "";
    
    public sellWinRate2: string = "";
    
    public sellWinRate3: string = "";
    
    public sellWinExtent: string = "";
    
    public sellWinExtent2: string = "";
    
    public sellWinExtent3: string = "";
    
    public sellLossRate: string = "";
    
    public sellLossExtent: string = "";
    
    public sellSlippage: string = "";
    
    public gasLimit: string = "";
    
    public gasPriceLimit: string = "";
    
    public gasOverflow: string = "";
    
    public buyLimitMin: string = "";
    
    public buyLimitMax: string = "";
    
    public followAmount: string = "";
    
    public duplicateBuyLimit: string = "";
    
    public sellGasOverflow: string = "";
    
    public buyFreqLimitHour: string = "";
    
    public sellRatioFollow :string = "";

    public override valueOf(data: any) {
        super.valueOf(data);
        this.remark = data.remark || "";
        this.buyMode = data.buyMode || "0";
        this.securityBuy = data.securityBuy || "0";
        this.buyLimit = data.buyLimit || "";
        this.sellMode = data.sellMode || "";
        this.customSell = data.customSell || "";
        this.buyRate = data.buyRate || "";
        this.sellRate = data.sellRate || "";
        this.liquidity = data.liquidity || "";
        this.buySlippage = data.buySlippage || "";
        this.followAmount = data.followAmount || "0";
        this.duplicateBuyLimit = data.duplicateBuyLimit || "0";
        if (data.highSpeedBuy == "1") {
            this.highSpeedBuy = data.highSpeedBuy;
        } else {
            this.highSpeedBuy = "0";
        }
        if (data.buyTxProtect == "1") {
            this.buyTxProtect = "1";
        } else {
            this.buyTxProtect = "0";
        }
        this.buyLimitMin = data.buyLimitMin || "";
        this.buyLimitMax = data.buyLimitMax || "";
        this.sellWinRate = data.sellWinRate || "";
        this.sellWinRate2 = data.sellWinRate2 || "";
        this.sellWinRate3 = data.sellWinRate3 || "";
        this.sellWinExtent = data.sellWinExtent || "";
        this.sellWinExtent2 = data.sellWinExtent2 || "";
        this.sellWinExtent3 = data.sellWinExtent3 || "";
        this.sellLossRate = data.sellLossRate || "";
        this.sellLossExtent = data.sellLossExtent || "";
        this.sellSlippage = data.sellSlippage || "";
        this.gasLimit = data.gasLimit || "";
        this.gasPriceLimit = data.gasPriceLimit || "";
        this.gasOverflow = data.gasOverflow || "";
        this.sellGasOverflow = data.sellGasOverflow || "";
        this.buyFreqLimitHour = data.buyFreqLimitHour || "0";
        this.sellRatioFollow = data.sellRatioFollow || "0";
    }

    public copy(taskSettings: TaskSettings) {
        this.followAmount = taskSettings.style.followAmount;
        this.duplicateBuyLimit = taskSettings.style.duplicateBuyLimit;
        this.buyMode = taskSettings.style.buyMode;
        this.securityBuy = taskSettings.style.securityBuy;
        this.buyLimit = taskSettings.style.buyLimit;
        this.sellMode = taskSettings.style.sellMode;
        this.customSell = taskSettings.style.customSell;
        this.buyFreqLimitHour = taskSettings.style.buyFreqLimitHour;
        this.sellRatioFollow = taskSettings.style.sellRatioFollow;

        this.buyRate = taskSettings.buy.buyRate;
        this.sellRate = taskSettings.buy.sellRate;
        this.liquidity = taskSettings.buy.liquidity;
        this.buySlippage = taskSettings.buy.buySlippage;
        this.highSpeedBuy = taskSettings.buy.highSpeedBuy;
        this.buyTxProtect = taskSettings.buy.buyTxProtect;
        this.buyLimitMin = taskSettings.buy.buyLimitMin;
        this.buyLimitMax = taskSettings.buy.buyLimitMax;

        this.sellWinRate = taskSettings.sell.sellWinRate;
        this.sellWinRate2 = taskSettings.sell.sellWinRate2;
        this.sellWinRate3 = taskSettings.sell.sellWinRate3;
        this.sellWinExtent = taskSettings.sell.sellWinExtent;
        this.sellWinExtent2 = taskSettings.sell.sellWinExtent2;
        this.sellWinExtent3 = taskSettings.sell.sellWinExtent3;
        this.sellLossRate = taskSettings.sell.sellLossRate;
        this.sellLossExtent = taskSettings.sell.sellLossExtent;
        this.sellSlippage = taskSettings.sell.sellSlippage;

        this.gasLimit = taskSettings.gas.gasLimit;
        this.gasPriceLimit = taskSettings.gas.gasPriceLimit;
        this.gasOverflow = taskSettings.gas.gasOverflow;
        this.sellGasOverflow = taskSettings.gas.sellGasOverflow;
    }

    public static build(style: TaskStyleSettings, buy: TaskBuySettings, sell: TaskSellSettings, gas: TaskGasSettings): TaskTemplate {
        let template = new TaskTemplate();
        if (style != undefined) {
            
            template.buyMode = style.buyMode;
            
            template.securityBuy = style.securityBuy;
            
            template.buyLimit = style.buyLimit;
            
            template.sellMode = style.sellMode;
            
            template.customSell = style.customSell;
            
            template.followAmount = style.followAmount;
            
            template.duplicateBuyLimit = style.duplicateBuyLimit;
            
            template.buyFreqLimitHour = style.buyFreqLimitHour;
            
            template.sellRatioFollow = style.sellRatioFollow;
        }
        if (buy != undefined) {
            
            template.buyRate = buy.buyRate;
            
            template.sellRate = buy.sellRate;
            
            template.liquidity = buy.liquidity;
            
            template.buySlippage = buy.buySlippage;
            
            template.highSpeedBuy = buy.highSpeedBuy
            
            template.buyTxProtect = buy.buyTxProtect;
            
            template.buyLimitMin = buy.buyLimitMin;
            
            template.buyLimitMax = buy.buyLimitMax;
        }

        if (sell != undefined) {
            
            template.sellWinRate = sell.sellWinRate;
            
            template.sellWinRate2 = sell.sellWinRate2;
            
            template.sellWinRate3 = sell.sellWinRate3;
            
            template.sellWinExtent = sell.sellWinExtent;
            
            template.sellWinExtent2 = sell.sellWinExtent2;
            
            template.sellWinExtent3 = sell.sellWinExtent3;
            
            template.sellLossRate = sell.sellLossRate;
            
            template.sellLossExtent = sell.sellLossExtent;
           
        }

        if (gas != undefined) {
            
            template.gasLimit = gas.gasLimit;
            
            template.gasPriceLimit = gas.gasPriceLimit;
            
            template.gasOverflow = gas.gasOverflow;

            
            template.sellGasOverflow = gas.sellGasOverflow;
        }


        return template;
    }

    public buildDefault(chain:string){

    }
}
