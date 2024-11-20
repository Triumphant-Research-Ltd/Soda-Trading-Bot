import {Entity} from "@/models/Entity";

export class OrderDetailInfo extends Entity {
    public hash: string = "";
    public token0: string = "";
    public symbol0: string = "";
    public amount0: string = "";
    public token1: string = "";
    public symbol1: string = "";
    public amount1: string = "";
    public price: string = "";
    public blockHeight: string = "";
    public timestamp: string = ""

    public override valueOf(data: any) {
        if (data == null) {
            return;
        }
        super.valueOf(data);

        this.token0 = data.token0 || "";
        this.amount0 = data.amount0 || "";
        this.symbol0 = data.symbol0 || "";
        this.token1 = data.token1 || "";
        this.amount1 = data.amount1 || "";
        this.symbol1 = data.symbol1 || "";

        this.blockHeight = data.blockHeight || "";
        this.hash = data.txHash || "";
        this.price = data.price || "";
        this.timestamp = data.timestamp || "";
    }
}
