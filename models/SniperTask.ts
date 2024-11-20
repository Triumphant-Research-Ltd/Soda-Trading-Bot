import {Entity} from "@/models/Entity";
import {SnipTaskStatus, TaskStatus} from "@/utils/constant";
import {SniperFollowOrder} from "~/models/SniperFollowOrder";

export class SniperTask extends Entity {
    public description: string = "";
    public status: string = "";
    public timestamp: string = "0";
    public address: string = "";
    public amount: string = "";
    public expand: boolean = false;
    public symbol: string = "";
    
    public activeTimestamp: string = "";
    
    public sellState: string = "";
    public creator: string = "";
    public order: SniperFollowOrder = new SniperFollowOrder();
    public source: number = 0;
    public step: string = ""


    public override valueOf(data: any): void {
        this.id = data.id || "";
        if (data.step != undefined) {
            this.step = data.step || "";
        }
        if (data.source != undefined) {
            this.source = data.source || 0;
        }
        if (data.remark != undefined) {
            this.description = data.remark || "";
        }
        if (data.state != undefined) {
            this.status = data.state || TaskStatus.Running;
        }
        if (data.ctime != undefined) {
            this.timestamp = data.ctime || "0";
        }
        if (data.tokenAddress != undefined) {
            this.address = data.tokenAddress || "";
        }
        if (data.amount != undefined) {
            this.amount = data.amount || "0";
        }
        if (data.activeTimestamp != undefined) {
            this.activeTimestamp = data.activeTimestamp || "";
        }

        if (data.sellState != undefined) {
            this.sellState = data.sellState || SnipTaskStatus.Stopped;
        }
        if (data.config) {
            let config = data.config;
            this.order.valueOf(config);
            this.order.address = this.address;
            
            if (config.buyLimit != undefined) {
                this.amount = data.config.buyLimit || "0";
            }
            if (config.limitPriceAmount != undefined) {
                this.order.limitPriceAmount = config.limitPriceAmount || ""
            }
            if(config.limitExpireTime!=undefined) {
                this.order.limitPriceExpire = config.limitExpireTime || ""
            }
            if(config.limitPriceType!=undefined) {
                this.order.limitPriceType = config.limitPriceType || ""
            }
            if(config.limitPriceBasePrice!=undefined) {
                this.order.limitPriceBasePrice = config.limitPriceBasePrice || ""
            }
        }
        this.order.id = this.id;
        if (data.creator != undefined) {
            this.creator = data.creator || ""
        }
        if (data.source != undefined) {
            this.source = data.source || 0;
        }

        this.order.creator = this.creator || "";

        this.order.taskSource = this.source;

    }
}
