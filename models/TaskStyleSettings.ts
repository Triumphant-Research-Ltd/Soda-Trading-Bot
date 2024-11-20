import {Entity} from "@/models/Entity";
import {TaskTemplate} from "@/models/TaskTemplate";

export class TaskStyleSettings extends Entity {
    public symbol: string = "";
    public buyMode: string = "";
    public securityBuy: string = "";
    public buyLimit: string = "";
    public sellMode: string = "";
    public customSell: string = "";
    public followAmount: string = "";
    public duplicateBuyLimit: string = "";
    public buyFreqLimitHour: string = "";
    public sellRatioFollow: string = "";

    public override valueOf(data: any) {
        this.buyMode = data.buyMode || "0";
        this.securityBuy = data.securityBuy || "0";
        this.buyLimit = data.buyLimit || "";
        this.sellMode = data.sellMode || "";
        this.customSell = data.customSell || "";
        this.followAmount = data.followAmount || "0";
        this.duplicateBuyLimit = data.duplicateBuyLimit || "0";
        this.buyFreqLimitHour = data.buyFreqLimitHour || "0";
        this.sellRatioFollow = data.sellRatioFollow || "0";
    }

    public copy(template: TaskTemplate) {
        this.buyMode = template.buyMode;
        this.securityBuy = template.securityBuy;
        this.buyLimit = template.buyLimit;
        this.sellMode = template.sellMode;
        this.customSell = template.customSell;
        this.followAmount = template.followAmount;
        this.duplicateBuyLimit = template.duplicateBuyLimit;
        this.buyFreqLimitHour = template.buyFreqLimitHour;
        this.sellRatioFollow = template.sellRatioFollow;
    }
}
