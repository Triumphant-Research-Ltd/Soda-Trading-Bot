import {Entity} from "@/models/Entity";
import {SniperTaskSettings} from "~/models/SniperTaskSettings";


export class SniperTaskTemplate extends Entity {
    
    public remark: string = "";
    
    public highSpeedBuy: string = "";
    
    public secureBuy: string = "";
    
    public buyLimit: string = "";
    
    public buySlippage: string = "";
    
    public bribeAmount: string = "";
    
    public gasLimit: string = "";
    
    public gasPriceLimit: string = "";
    
    public gasOverflow: string = "";
    
    public customSell: string = "0";
    
    public advancedSettings: string = "0";
    public mode: string = "0";
    public sellWinRate: string = "";
    public sellWinRate2: string = "";
    public sellWinRate3: string = "";
    public sellWinExtent: string = "";
    public sellWinExtent2: string = "";
    public sellWinExtent3: string = "";
    public sellLossRate: string = "";
    public sellLossExtent: string = "";
    public sellSlippage: string = "";
    
    public buyTxProtect: string = "0"
    
    public priorityFee: string = "0"

    
    public limitPriceAmount: string = "";
    
    public limitExpireTime: string = "";
    
    public limitPriceType: string = "";
    
    public limitPriceBasePrice: string = "";

    public override valueOf(data: any) {
        super.valueOf(data);
        this.remark = data.remark || "";
        this.highSpeedBuy = data.highSpeedBuy || "0";
        this.secureBuy = data.secureBuy || "0";
        this.customSell = data.customSell || "0";
        this.buyLimit = data.buyLimit || "";
        this.buySlippage = data.buySlippage || "";
        this.bribeAmount = data.bribeAmount || "";
        this.gasPriceLimit = data.gasPriceLimit || "";
        this.gasOverflow = data.gasOverflow || "";
        this.gasLimit = data.gasLimit || "";
        this.mode = data.mode || "0";
        this.sellWinRate = data.sellWinRate || "";
        this.sellWinRate2 = data.sellWinRate2 || "";
        this.sellWinRate3 = data.sellWinRate3 || "";
        this.sellWinExtent = data.sellWinExtent || "";
        this.sellWinExtent2 = data.sellWinExtent2 || "";
        this.sellWinExtent3 = data.sellWinExtent3 || "";
        this.sellLossRate = data.sellLossRate || "";
        this.sellLossExtent = data.sellLossExtent || "";
        this.advancedSettings = data.advancedSettings || "0";
        this.sellSlippage = data.sellSlippage || "";
        this.buyTxProtect = data.buyTxProtect || "0";
        this.priorityFee = data.priorityFee || "";
        this.limitPriceAmount = data.limitPriceAmount || "";
        this.limitExpireTime = data.limitExpireTime || "";
        this.limitPriceType = data.limitPriceType || "";
        this.limitPriceBasePrice = data.limitPriceBasePrice || "";
    }

    public copy(taskSettings: SniperTaskSettings) {
        this.highSpeedBuy = taskSettings.buy.highSpeedBuy || "0";
        this.secureBuy = taskSettings.buy.secureBuy || "0";
        this.customSell = taskSettings.buy.customSell || "0";
        this.buyLimit = taskSettings.buy.buyLimit || "";
        this.buySlippage = taskSettings.buy.buySlippage || "";
        this.bribeAmount = taskSettings.buy.bribeAmount || "";
        this.gasPriceLimit = taskSettings.gas.gasPriceLimit || "";
        this.gasOverflow = taskSettings.gas.gasOverflow || "";
        this.gasLimit = taskSettings.gas.gasLimit || "";
        this.priorityFee = taskSettings.gas.priorityFee || "";
        this.mode = taskSettings.mode || "0";
        this.sellWinRate = taskSettings.sell.sellWinRate || "";
        this.sellWinRate2 = taskSettings.sell.sellWinRate2 || "";
        this.sellWinRate3 = taskSettings.sell.sellWinRate3 || "";
        this.sellWinExtent = taskSettings.sell.sellWinExtent || "";
        this.sellWinExtent2 = taskSettings.sell.sellWinExtent2 || "";
        this.sellWinExtent3 = taskSettings.sell.sellWinExtent3 || "";
        this.sellLossRate = taskSettings.sell.sellLossRate || "";
        this.sellLossExtent = taskSettings.sell.sellLossExtent || "";
        this.advancedSettings = taskSettings.buy.advancedSettings || "0";
        this.sellSlippage = taskSettings.sell.sellSlippage || "";
        this.buyTxProtect = taskSettings.buy.buyTxProtect || "0";
        this.limitExpireTime = taskSettings.limitExpireTime || "";
        this.limitPriceAmount = taskSettings.limitPriceAmount || "";
        this.limitPriceType = taskSettings.limitPriceType || "";
        this.limitPriceBasePrice=taskSettings.limitPriceBasePrice||""
    }
}
