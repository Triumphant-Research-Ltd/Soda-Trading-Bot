import {Entity} from "@/models/Entity";
import BigNumber from "bignumber.js";

export class ProjectDetail extends Entity {
    public chainId: string = "";
    public token0: string = "";
    public token1: string = "";
    public pairAddress: string = "";
    public boughtCount: string = "0";
    public soldCount: string = "0";
    public boughtValue: string = "";
    public soldValue: string = "";
    public profit: string = "0";
    public averageHoldTime: string = "0";
    public rate: string = "0";
    public block0: string = "0";

    public symbol0: string = "";

    public symbol1: string = "";

    public honeypot: string = "0";

    public lowLiquidity: string = "0";
    public liquidity: string = "0";


    public override  valueOf(data: any) {
        this.token0 = data.token0_id?.toString() || '';
        this.token1 = data.token1_id?.toString() || '';
        this.pairAddress = data.pool?.toString() || "";
        this.boughtCount = data.amount0?.toString() || "0";
        this.soldCount = data.amount1?.toString() || "0";
        this.boughtValue = data.buy?.toString() || "0";
        this.soldValue = data.sell?.toString() || "0";
        this.profit = data.profitable?.toString() || "0";
        this.averageHoldTime = data.avg_holding_time?.toString() || "0";
        this.rate = data.yield?.toString() || "0";
        if (data.same == 0) {
            this.block0 = "0";
        } else {
            this.block0 = "1";
        }
        this.symbol0 = data.token0_symbol || "";
        this.symbol1 = data.token1_symbol || "";
        this.honeypot = data.isHoneypot == "1" ? "1" : "0";
        if (data.liquidity != undefined) {
            let liquidity = BigNumber(data.liquidity);
            if (liquidity.isNegative() || liquidity.isNaN()) {
                liquidity = BigNumber(0);
            }
            this.liquidity = liquidity.toString();
            this.lowLiquidity = liquidity.lte(100) ? "1" : "0"
        }
    }
}
