import {Entity} from "@/models/Entity";

export class TradeDetail extends Entity {
    
    public chainId: string = "0x1";
    public token0Name: string = "";
    public token1Name: string = "";
    public pairName: string = "";
    
    public txnHash: string = "";
    
    public blockTime: string = "0";
    
    public market: string = "";
    //token0
    public token0Amount: string = "0";
    //token1
    public token1Amount: string = "0";
    public token0: string = "";
    public token1: string = "";
    
    public price: string = "0";

    public override valueOf(data: any) {

        if (data.pairName != undefined) {
            let name = data.pairName.toString();
            this.pairName = name;
            let names = name.split("/");
            if (names.length == 2) {
                this.token0Name = names[0];
                this.token1Name = names[1];
            }
        }


        this.txnHash = data.transaction?.toString() || "";
        this.blockTime = data.timestamp?.toString() || "0";

        this.market = data.market?.toString() || "";

        this.token0Amount = data.amount0?.toString() || "0";
        this.token1Amount = data.amount1?.toString() || "0";

        this.token0 = data.token0?.toString() || "";
        this.token1 = data.token1?.toString() || "";

        this.price = data.amountUSD?.toString() || "0";

    }
}
