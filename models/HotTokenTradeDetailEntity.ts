import {Entity} from "~/models/Entity";

export class HotTokenTradeDetailEntity extends Entity {
    public amount: string = "";
    public count: string = "";
    public timestamp: string = "";

    public override valueOf(data: any) {
        this.amount = data.liquidity?.toString() || ""
        this.timestamp = data.ctime?.toString() || ""
        this.count = data.num?.toString() || ""
    }
}
