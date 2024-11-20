import {Entity} from "@/models/Entity";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate";


export class SniperTaskBuySettings extends Entity {

    
    public buyLimit: string = "";
    
    public buySlippage: string = "";
    
    public bribeAmount: string = "";
    
    public highSpeedBuy: string = "0";
    
    public secureBuy: string = "0";
    
    public customSell: string = "0";
    
    public advancedSettings: string = "0";
    
    public buyTxProtect: string = "1"

    public override  valueOf(data: any) {
        this.buyLimit = data.buyLimit || "";
        this.buySlippage = data.buySlippage || "0";
        this.bribeAmount = data.bribeAmount || "";
        this.highSpeedBuy = data.highSpeedBuy || "0";
        this.secureBuy = data.secureBuy || "0";
        this.customSell = data.customSell || "0";
        this.advancedSettings = data.advancedSettings || "0";
        this.buyTxProtect=data.buyTxProtect || "0"
    }

    public copy(template: SniperTaskTemplate) {
        this.highSpeedBuy = template.highSpeedBuy || "0";
        this.secureBuy = template.secureBuy || "0";
        this.customSell = template.customSell || "0";
        this.buyLimit = template.buyLimit;
        this.buySlippage = template.buySlippage || "0";
        this.bribeAmount = template.bribeAmount || "";
        this.advancedSettings = template.advancedSettings || "0";
        this.buyTxProtect=template.buyTxProtect || "0"
    }
}
