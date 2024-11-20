import {Entity} from "@/models/Entity";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

export class BackTestingProjectDetail extends Entity {
    public chainId: string = "";
    public token0: string = "";
    public token1: string = "";
    public pairAddress: string = "";
    public boughtCount: string = "0";
    public soldCount: string = "0";
    public boughtValue: string = "";
    public soldValue: string = "";
    public highestRate: string = "0";
    public symbol0: string = "";
    public symbol1: string = "";
    public honeypot: string = "0";
    public lowLiquidity: string = "0";
    public liquidity: string = "0";
    public lastTradeTime: string = "0";
    public lastTradeTimeString: string = "";
    public buyHash: string = ""
    public sellHash: string = ""
    public override valueOf(data: any) {
        this.token0 = data.token0_id?.toString() || '';
        this.token1 = data.token1_id?.toString() || '';
        this.pairAddress = data.pool?.toString() || "";
        this.boughtCount = data.buy?.toString() || "0";
        this.soldCount = data.sell?.toString() || "0";
        this.boughtValue = data.buyPrice?.toString() || "0";
        this.soldValue = data.sellPrice?.toString() || "0";
        this.highestRate = data.rate?.toString() || "0";
        this.lastTradeTime = data.buyTime?.toString() || "0";
        this.symbol0 = data.token0_symbol || "";
        this.symbol1 = data.token1_symbol || "";
        this.honeypot = data.isHoneypot == "1" ? "1" : "0";
        this.buyHash = data.buy_hash?.toString() || ""
        this.sellHash = data.sell_hash?.toString() || ""
        if (data.liquidity != undefined) {
            let liquidity = BigNumber(data.liquidity);
            if (liquidity.isNegative() || liquidity.isNaN()) {
                liquidity = BigNumber(0);
            }
            this.liquidity = liquidity.toString();
            this.lowLiquidity = liquidity.lte(100) ? "1" : "0"
        }
        try {
            let n = BigNumber(this.lastTradeTime).multipliedBy(1000);
            this.lastTradeTimeString = dayjs(n.toNumber()).format("YYYY-MM-DD hh:mm:ss")
        } catch (e: any) {

        }
    }
}
