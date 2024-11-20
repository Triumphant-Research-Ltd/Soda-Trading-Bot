import {Entity} from "@/models/Entity";

export class Pair extends Entity {
    name: string = ""
    address: string = ""
    liquidity: string = ""
    buyRate: string = ""
    sellRate: string = ""
    //true,false,unknown
    honeypot: string = "unknown"

    public override valueOf(data: any) {
        super.valueOf(data);
        this.name = data.poolName || "";
        this.address = data.poolAddress || "";
        this.liquidity = data.poolLiquidity || "";
        this.buyRate = data.buyTax || "";
        this.sellRate = data.sellTax || "";
        this.honeypot = data.isHoneypot || "";
    }
}
