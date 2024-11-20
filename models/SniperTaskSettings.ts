import {Entity} from "@/models/Entity";
import {SniperTaskBuySettings} from "~/models/SniperTaskBuySettings";
import {SniperTaskGasSettings} from "~/models/SniperTaskGasSettings";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate";
import {SniperTaskSellSettings} from "~/models/SniperTaskSellSettings";


export class SniperTaskSettings extends Entity {
    
    public address: string = "";
    
    public description: string = "";
    
    public buy: SniperTaskBuySettings = new SniperTaskBuySettings();
    
    public gas: SniperTaskGasSettings = new SniperTaskGasSettings();
    
    public sell: SniperTaskSellSettings = new SniperTaskSellSettings();
    
    public mode: string = "0";
    
    public limitPriceAmount: string = "";
    
    public limitExpireTime: string = "";
    
    public limitPriceType: string = "";
    
    public limitPriceBasePrice: string = "";
    public source: number = 0
    public creator: string = ""

    public override inner(): Record<string, any> {
        let record: Record<string, any> = {};
        record["id"] = this.id;
        record["source"] = this.source
        let addr = this.address.trim();
        if (addr.includes("0x") || addr.includes("0X")) {
            addr = addr.toLowerCase()
        }
        record["wallet"] = addr;
        record["remark"] = this.description.trim();
        let config: Record<string, any> = {};
        config["mode"] = this.mode;
        config["secureBuy"] = this.buy.secureBuy;
        config["highSpeedBuy"] = this.buy.highSpeedBuy;
        config["buyLimit"] = this.buy.buyLimit;
        config["buySlippage"] = this.buy.buySlippage;
        config["bribeAmount"] = this.buy.bribeAmount;
        config["gasLimit"] = this.gas.gasLimit;
        config["gasPriceLimit"] = this.gas.gasPriceLimit;
        config["gasOverflow"] = this.gas.gasOverflow;
        config["priorityFee"] = this.gas.priorityFee;
        config["customSell"] = this.buy.customSell;
        config["sellWinRate"] = this.sell.sellWinRate;
        config["sellWinRate2"] = this.sell.sellWinRate2;
        config["sellWinRate3"] = this.sell.sellWinRate3;
        config["sellWinExtent"] = this.sell.sellWinExtent;
        config["sellWinExtent2"] = this.sell.sellWinExtent2;
        config["sellWinExtent3"] = this.sell.sellWinExtent3;
        config["sellLossRate"] = this.sell.sellLossRate;
        config["sellLossExtent"] = this.sell.sellLossExtent;
        config["advancedSettings"] = this.buy.advancedSettings;
        config["sellSlippage"] = this.sell.sellSlippage;
        config["buyTxProtect"] = this.buy.buyTxProtect;
        config["limitPriceAmount"] = this.limitPriceAmount || "";
        config["limitExpireTime"] = this.limitExpireTime || "";
        config["limitPriceType"] = this.limitPriceType || "";
        config["limitPriceBasePrice"] = this.limitPriceBasePrice || "";
        config["creator"] = this.creator || "";
        record["config"] = config;
        return record;
    }

    public override valueOf(data: any) {
        this.id = data.id;
        this.address = data.address || "";
        this.description = data.remark || "";
        this.mode = data.mode || "0";
        this.limitPriceAmount = data.limitExpireTime || "";
        this.limitExpireTime = data.limitExpireTime || "";
        this.limitPriceType = data.limitPriceType || ""
        this.limitPriceBasePrice = data.limitPriceBasePrice || ""
        this.buy.valueOf(data);
        this.gas.valueOf(data);
        this.sell.valueOf(data);

    }

    public copy(template: SniperTaskTemplate) {
        this.mode = template.mode;
        this.limitPriceAmount = template.limitPriceAmount;
        this.limitExpireTime = template.limitExpireTime;
        this.limitPriceBasePrice = template.limitPriceBasePrice;
        this.limitPriceType = template.limitPriceType;
        this.buy.copy(template);
        this.gas.copy(template);
        this.sell.valueOf(template);
    }

    public static from(data: any) {
        let task = new SniperTaskSettings();
        task.id = data.id;
        task.address = data.address || "";
        task.description = data.description || "";
        task.mode = data.mode || "0";
        task.limitExpireTime = data.limitExpireTime || "";
        task.limitPriceAmount = data.limitPriceAmount || "";
        task.limitPriceType = data.limitPriceType || ""
        task.limitPriceBasePrice=data.limitPriceBasePrice || "";
         if (data.creator != undefined) {
            task.creator = data.creator || "";
        }
        if (data.source != undefined) {
            task.source = data.source
        }
        if (data.buy) {
            task.buy.valueOf(data.buy);
        }
        if (data.gas) {
            task.gas.valueOf(data.gas);
        }
        if (data.sell) {
            task.sell.valueOf(data.sell);
        }
        task.gas.slippage = task.buy.buySlippage;
        return task;
    }
}
