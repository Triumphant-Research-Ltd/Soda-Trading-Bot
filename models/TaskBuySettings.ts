import {Entity} from "@/models/Entity";
import {TaskTemplate} from "@/models/TaskTemplate";


export class TaskBuySettings extends Entity {
    
    public buyRate: string = "";
    
    public sellRate: string = "";
    
    public liquidity: string = "";
    
    public buySlippage: string = "";

    public highSpeedBuy: string = "0";

    public buyTxProtect: string = "0";

    public buyLimitMin: string = "";
    public buyLimitMax: string = "";

    public  override valueOf(data: any) {
        this.buyRate = data.buyRate || "";
        this.sellRate = data.sellRate || "";
        this.liquidity = data.liquidity || "";
        this.buySlippage = data.buySlippage || "";
        this.highSpeedBuy = data.highSpeedBuy || "0";
        this.buyTxProtect = data.buyTxProtect || "0";
        this.buyLimitMin = data.buyLimitMin || "";
        this.buyLimitMax = data.buyLimitMax || "";
    }

    public copy(template: TaskTemplate) {
        this.buyRate = template.buyRate;
        this.sellRate = template.sellRate;
        this.liquidity = template.liquidity;
        this.buySlippage = template.buySlippage;
        this.highSpeedBuy = template.highSpeedBuy;
        this.buyTxProtect = template.buyTxProtect;
        this.buyLimitMax = template.buyLimitMax;
        this.buyLimitMin = template.buyLimitMin;
    }
}
