import {Entity} from "~/models/Entity";

export class HomeProfitEntity extends Entity {
    public address: string = "";
    public symbol: string = "";
    public profit: string = "";
    public profitRate: string = "";
    public chainId: string = "";
    public maker: string = "";

    public override valueOf(data: any) {
        this.address = data.address || "";
        this.symbol = data.symbol || "";
        this.profit = data.profit || "";
        this.profitRate = data.profitRate || "";
        this.chainId = data.chainId || "";
        this.maker = data.maker || "";
    }
}
