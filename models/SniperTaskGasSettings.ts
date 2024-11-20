import {Entity} from "@/models/Entity";
import {SniperTaskTemplate} from "~/models/SniperTaskTemplate";

export class SniperTaskGasSettings extends Entity {
    
    public gasPriceLimit: string = "";
    
    public gasOverflow: string = "";
    
    public gasLimit: string = "";
    
    public slippage: string = "0";
    
    public priorityFee: string = "";

    public override valueOf(data: any): void {
        super.valueOf(data);
        this.gasLimit = data.gasLimit || "";
        this.gasPriceLimit = data.gasPriceLimit || "";
        this.gasOverflow = data.gasOverflow || "";
        this.slippage = data.slippage || "";
        this.priorityFee = data.priorityFee || "";
    }

    public copy(template: SniperTaskTemplate) {
        this.gasLimit = template.gasLimit;
        this.gasPriceLimit = template.gasPriceLimit;
        this.gasOverflow = template.gasOverflow;
        this.slippage = template.buySlippage;
        this.priorityFee = template.priorityFee;
    }
}
