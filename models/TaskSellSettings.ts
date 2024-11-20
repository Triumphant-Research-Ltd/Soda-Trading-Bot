import {Entity} from "@/models/Entity";
import {TaskTemplate} from "@/models/TaskTemplate";
import {isPositiveNumber} from "@/utils/util";


/**
 * 
 */
export class TaskSellSettings extends Entity {
    
    public sellWinRate: string = "";
    public sellWinRate2: string = "";
    public sellWinRate3: string = "";
    
    public sellWinExtent: string = "";
    public sellWinExtent2: string = "";
    public sellWinExtent3: string = "";
    
    public sellLossRate: string = "";
    
    public sellLossExtent: string = "";
    
    public sellSlippage: string = "";

    public getSellWinRateCount(): number {
        let a1 = isPositiveNumber(this.sellWinRate2);
        let a2 = isPositiveNumber(this.sellWinExtent2);
        let a3 = isPositiveNumber(this.sellWinRate3);
        let a4 = isPositiveNumber(this.sellWinExtent3);
        let count = 1;
        if (a1 && a2) {
            count++;
        }
        if (a3 && a4) {
            count++;
        }
        return count;
    }

    public override valueOf(data: any) {
        this.sellWinRate = data.sellWinRate;
        this.sellWinRate2 = data.sellWinRate2;
        this.sellWinRate3 = data.sellWinRate3;
        this.sellWinExtent = data.sellWinExtent;
        this.sellWinExtent2 = data.sellWinExtent2;
        this.sellWinExtent3 = data.sellWinExtent3;
        this.sellLossRate = data.sellLossRate;
        this.sellLossExtent = data.sellLossExtent;
        this.sellSlippage = data.sellSlippage;
    }

    public copy(template: TaskTemplate) {
        this.sellWinRate = template.sellWinRate;
        this.sellWinRate2 = template.sellWinRate2;
        this.sellWinRate3 = template.sellWinRate3;
        this.sellWinExtent = template.sellWinExtent;
        this.sellWinExtent2 = template.sellWinExtent2;
        this.sellWinExtent3 = template.sellWinExtent3;
        this.sellLossRate = template.sellLossRate;
        this.sellLossExtent = template.sellLossExtent;
        this.sellSlippage = template.sellSlippage;
    }
}
