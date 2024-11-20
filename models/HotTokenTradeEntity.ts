import {Entity} from "~/models/Entity";
import {HotTokenTradeDetailEntity} from "~/models/HotTokenTradeDetailEntity";
import BigNumber from "bignumber.js";

export class HotTokenTradeEntity extends Entity {
    public chainId: string = "";
    public symbol: string = "";
    public token: string = "";
    public timestamp: string = "";
    public address: string = "";
    public liquidity: string = "";
    public newLiquidity: string = "";
    public liquidityChange: string = "";
    public boughtCount: string = "";
    public clearance: string = "";
    public clearanceBought: string = "";
    public honeypot: string = "0";
    public details: Array<HotTokenTradeDetailEntity> = [];

    public override valueOf(data: any) {
        this.symbol = data.symbol || "";
        this.token = data.token || "";
        this.timestamp = data.ctime?.toString() || ""
        this.address = data.pair || "";
        this.liquidity = data.liquidity?.toString() || "";
        this.newLiquidity = data.newLiquidity?.toString() || "";
        if (data.newLiquidity != undefined) {
            let n1 = BigNumber(data.newLiquidity)
            let n2 = BigNumber(data.liquidity)
            if (!n1.isFinite() || !n2.isFinite() || n2.isZero()) {
                this.liquidityChange = "";
            } else {
                let z = n1.minus(n2);
                let percent = z.div(n2);
                this.liquidityChange = percent.toFixed();
            }
        } else {
            this.liquidityChange = "";
        }
        this.boughtCount = data.num?.toString() || "";
        this.clearance = data.sellNum?.toString() || "";
        this.clearanceBought = data.buyNum?.toString() || "";
        if (data.honeyPot == "no") {
            this.honeypot = "0";
        } else if (data.honeyPot == "yes") {
            this.honeypot = "1";
        } else {
            this.honeypot = "unknown";
        }

        if (Array.isArray(data.pushList)) {
            for (let d of data.pushList) {
                let item = new HotTokenTradeDetailEntity();
                item.valueOf(d);
                this.details.push(item);
            }
        }


    }

}
