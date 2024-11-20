import {Entity} from "@/models/Entity";
import {OrderDirection, TradeStatus} from "@/utils/constant";

export class Order extends Entity {
    public market: string = "";
    public token0: string = "";
    public amount0: string = "";
    public symbol0: string = "";
    public token1: string = "";
    public amount1: string = "";
    public symbol1: string = "";
    public timestamp: string = "";
    public statusMessage: string = "";
    public status: TradeStatus = TradeStatus.WaitSend;
    public direction: OrderDirection = OrderDirection.Unknown;
    public blockHeight: string = "";
    public trackWallet: string = "";
    public hash: string = "";
    public pair: string = "";
    public pairName: string = "";
    public name: string = "";
    public price: string = "";

    public param1: string = ""
    public param2: string = ""

    public override  valueOf(data: any) {
        super.valueOf(data);
        this.market = data.market || "";
        this.token0 = data.token0 || "";
        this.amount0 = data.amount0 || "";
        this.symbol0 = data.symbol0 || "";
        this.token1 = data.token1 || "";
        this.amount1 = data.amount1 || "";
        this.symbol1 = data.symbol1 || "";
        this.timestamp = data.timestamp || "";
        this.statusMessage = data.statusMessage || "";
        this.status = data.status || "";
        this.direction = data.direction || "";
        this.blockHeight = data.blockHeight || "";
        this.trackWallet = data.trackWallet || "";
        this.hash = data.txHash || "";
        this.pair = data.pair || "";
        this.name = data.name || "";
        this.param1 = data.param1 || "";
        this.param2 = data.param2 || "";
        this.pairName = data.pairName || ""
    }
}
