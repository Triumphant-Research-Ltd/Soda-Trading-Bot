import {Entity} from "@/models/Entity";
import BigNumber from "bignumber.js";

export class TradeDetailAnalyze extends Entity {
    public boughtValue: string = "";
    public boughtQuantity: string = "";
    public boughtTxnCount: string = "";
    public soldValue: string = "";
    public soldQuantity: string = "";
    public soldTxnCount: string = "";
    public pnl: string = "";
    public unrealized: string = "";
    public offsetQuantity: string = "";
    public percent: number = 0;

    public price: string = "";

    public override valueOf(data: any) {
        this.boughtValue = data.buy?.toString() || "0";
        this.boughtQuantity = data.amount0?.toString() || "0";
        this.boughtTxnCount = data.buyCount?.toString() || "0";
        this.soldValue = data.sell?.toString() || "0";
        this.soldQuantity = data.amount1?.toString() || "0";
        this.soldTxnCount = data.sellCount?.toString() || "";
        this.price = data.price?.toString() || "";
        let sell = BigNumber(this.soldValue);
        let buy = BigNumber(this.boughtValue);
        if (!sell.isNaN() && !buy.isNaN()) {
            this.pnl = sell.minus(buy).toString();
        }
        this.generatePercent();

    }

    public generatePercent() {
        let buyQuantity = new BigNumber(this.boughtQuantity);
        let sellQuantity = new BigNumber(this.soldQuantity);

        if (buyQuantity.isPositive() && sellQuantity.isPositive()) {
            let offset = buyQuantity.minus(sellQuantity);
            if (offset.isNegative()) {
                offset = BigNumber(0);
            }
            this.offsetQuantity = offset.toString();
            let p = offset.dividedBy(buyQuantity).multipliedBy(100).integerValue(BigNumber.ROUND_DOWN).toNumber();
            if (p > 100) {
                p = 100;
            }
            this.percent = p;
            let price = BigNumber(this.price);
            if (!price.isNaN()) {
                let value = offset.multipliedBy(price).toString();
                this.unrealized = value || "";
            }

        } else {
            this.percent = 0;
            this.offsetQuantity = "";
            this.unrealized = "";
        }
    }

}
