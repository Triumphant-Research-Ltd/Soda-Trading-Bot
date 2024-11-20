import {Entity} from "@/models/Entity";
import {SniperTaskSettings} from "~/models/SniperTaskSettings";

export class SniperFollowOrder extends Entity {

    
    public address: string = "";
    public description: string = "";

    
    public highSpeedBuy: string = "0";
    
    public secureBuy: string = "0";
    
    public customSell: string = "0";
    
    public advancedSettings: string = "0";

    
    public buyLimit: string = "0";

    
    public gasLimit: string = "0";
    
    public gasPriceLimit: string = "0";
    
    public gasOverflow: string = "0"


    
    public buySlippage: string = "0";

    
    public sellWinRate: string = "0";
    
    public sellWinExtent: string = "0";

    2
    public sellWinRate2: string = "0";
    2
    public sellWinExtent2: string = "0";

    3
    public sellWinRate3: string = "0";
    3
    public sellWinExtent3: string = "0";

    
    public sellLossExtent: string = "";
    
    public sellLossRate: string = "";
    
    public sellSlippage: string = "";
    
    public bribeAmount: string = "";

    public buyTxProtect: string = "0";
    
    public priorityFee: string = "";

      
    public taskSource:number=0;
    
    public limitPriceAmount: string = "";
    
    public limitPriceExpire: string = "";
    :1，0，
    public limitPriceType: string = "";
    
    public limitPriceBasePrice: string = "";
    
    public creator: string = "";

    public override valueOf(data: any): void {
        this.description = data.description || ""
        this.address = data.tokenAddress || "";

        this.gasLimit = data.gasLimit || "0";
        this.gasPriceLimit = data.gasPriceLimit || "0";
        this.gasOverflow = data.gasOverflow || "0";

        this.highSpeedBuy = data.highSpeedBuy || "0";
        this.secureBuy = data.secureBuy || "0";
        this.buyLimit = data.buyLimit || "0";
        this.buySlippage = data.buySlippage || "0";
        this.bribeAmount = data.bribeAmount || "";
        this.advancedSettings = data.advancedSettings || "0";

        this.sellWinRate = data.sellWinRate || "";
        this.sellWinExtent = data.sellWinExtent || "";
        this.sellWinRate2 = data.sellWinRate2 || "";
        this.sellWinExtent2 = data.sellWinExtent2 || "";
        this.sellWinRate3 = data.sellWinRate3 || "";
        this.sellWinExtent3 = data.sellWinExtent3 || "";
        this.sellLossExtent = data.sellLossExtent || "";
        this.sellLossRate = data.sellLossRate || "";

        this.sellSlippage = data.sellSlippage || "";
        this.customSell = data.customSell || "0";

        this.buyTxProtect = data.buyTxProtect || "0";

        this.priorityFee = data.priorityFee || "0";


    }

    
    public createTaskSettings(): SniperTaskSettings {

        let taskSettings = new SniperTaskSettings();
        taskSettings.id = this.id;
        taskSettings.address = this.address;
        taskSettings.description = this.description
        taskSettings.source=this.taskSource
        taskSettings.limitPriceAmount=this.limitPriceAmount
        taskSettings.limitExpireTime=this.limitPriceExpire
        taskSettings.limitPriceType=this.limitPriceType
        taskSettings.limitPriceBasePrice=this.limitPriceBasePrice
        taskSettings.creator=this.creator

        taskSettings.buy.buyLimit = this.buyLimit;
        taskSettings.buy.bribeAmount = this.bribeAmount;
        taskSettings.buy.buySlippage = this.buySlippage;
        taskSettings.buy.highSpeedBuy = this.highSpeedBuy;
        taskSettings.buy.secureBuy = this.secureBuy;
        taskSettings.buy.advancedSettings = this.advancedSettings
        taskSettings.buy.buyTxProtect = this.buyTxProtect;
        taskSettings.buy.customSell = this.customSell;

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
        taskSettings.gas.priorityFee = this.priorityFee;
        taskSettings.gas.slippage = taskSettings.buy.buySlippage;

        return taskSettings;
    }

}
