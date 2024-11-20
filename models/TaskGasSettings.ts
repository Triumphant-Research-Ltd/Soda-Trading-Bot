import {Entity} from "@/models/Entity";
import {TaskTemplate} from "@/models/TaskTemplate";

export class TaskGasSettings extends Entity {
    public gasLimit: string = "";
    
    public gasPriceLimit: string = "";
    
    public gasOverflow: string = "";
    public sellGasOverflow: string = "";

    public override valueOf(data: any): void {
        super.valueOf(data);
        this.gasLimit = data.gasLimit || "";
        this.gasPriceLimit = data.gasPriceLimit || "";
        this.gasOverflow = data.gasOverflow || "";
        this.sellGasOverflow= data.sellGasOverflow || "";
    }

    public copy(template: TaskTemplate) {
        this.gasLimit = template.gasLimit;
        this.gasPriceLimit = template.gasPriceLimit;
        this.gasOverflow = template.gasOverflow;
        this.sellGasOverflow=template.sellGasOverflow;
    }
}
