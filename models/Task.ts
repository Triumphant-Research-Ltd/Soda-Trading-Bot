import {Entity} from "@/models/Entity";
import {TaskStatus} from "@/utils/constant";
import {FollowOrder} from "@/models/FollowOrder";
import type {TaskSettings} from "~/models/TaskSettings";

export class Task extends Entity {
    public description: string = "";
    public status: TaskStatus = TaskStatus.Running;
    public timestamp: string = "0";
    public address: string = "";
    public buyMode: string = "0";
    public sellMode: string = "0";
    public amount: string = "";
    public expand: boolean = false;
    public symbol: string = "";
    
    public activeTimestamp: string = "";
    public order: FollowOrder = new FollowOrder();

    public override valueOf(data: any): void {
        super.valueOf(data);
        if (data.remark) {
            this.description = data.remark || "";
        }
        if (data.state != undefined) {
            this.status = data.state || TaskStatus.Running;
        }
        if (data.ctime != undefined) {
            this.timestamp = data.ctime || "0";
        }
        if (data.wallet != undefined) {
            this.address = data.wallet || "";
        }
        if (data.amount != undefined) {
            this.amount = data.amount || "0";
        }
        if (data.activeTimestamp != undefined) {
            this.activeTimestamp = data.activeTimestamp || "";
        }

        if (data.config) {
            this.buyMode = data.config.buyMode || "";
            this.sellMode = data.config.sellMode || "";
            this.order.address = this.address;
            this.order.sellMode = data.sellMode || "0";
            this.order.buyMode = data.buyMode || "0";
            this.order.valueOf(data.config);
            
            if (data.config.buyLimit != undefined) {
                this.amount = data.config.buyLimit || "0";
            }
        }


    }

    public updateSettings(settings: TaskSettings) {
        this.address = settings.address;
        this.buyMode = settings.style.buyMode;
        this.sellMode = settings.style.sellMode;
        this.amount = settings.style.buyLimit;
        this.order.copyFromTaskSettings(settings);
    }
}
