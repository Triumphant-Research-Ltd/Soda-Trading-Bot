import {Entity} from "@/models/Entity";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

export class BackTestingEntity extends Entity {
    public balance: string = ""
    public chainId: string = ""
    public address: string = ""
    public profit5: string = ""
    public rate5: string = ""
    public profit10: string = ""
    public rate10: string = ""
    public profit50: string = ""
    public rate50: string = ""
    public profit100: string = ""
    public rate100: string = ""
    public day30: string = ""
    public tradeCount: string = ""
    public honeypotRate: string = ""
    public noneHoneypotRate: string = ""
    public lastTradeTime: string = ""
    public lastTradeTimeString = ""

    public override valueOf(data: any) {
        this.address = data.address || "0";
        this.profit5 = data.rate5?.toString() || "0";
        this.rate5 = data.rate5_p?.toString() || "0";
        this.profit10 = data.rate10?.toString() || "0";
        this.rate10 = data.rate10_p?.toString() || "0";
        this.profit50 = data.rate50?.toString() || "0";
        this.rate50 = data.rate50_p?.toString() || "0";
        this.profit100 = data.rate100?.toString() || "0";
        this.rate100 = data.rate100_p?.toString() || "0";
        this.day30 = data.r30?.toString() || "0";
        this.tradeCount = data.transaction?.toString() || "0";
        this.honeypotRate = data.honeypot_p?.toString() || "0";
        this.noneHoneypotRate = data.no_honetpot_zeroing_p?.toString() || "0";
        this.lastTradeTime = data.last_date?.toString() || "";
        this.balance = data.balance?.toString() || "";
        try {
            let n = BigNumber(this.lastTradeTime).multipliedBy(1000);
            this.lastTradeTimeString = dayjs(n.toNumber()).format("YYYY-MM-DD hh:mm:ss")
        } catch (e: any) {

        }

    }
}
