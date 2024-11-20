import {Entity} from "@/models/Entity";
import {OrderDetailInfo} from "@/models/OrderDetailInfo";
import {OrderDirection, TradeStatus} from "@/utils/constant";

export class OrderDetail extends Entity {
    public marketName: string = "";
    public user: OrderDetailInfo = new OrderDetailInfo();
    public smartMoney: OrderDetailInfo = new OrderDetailInfo();
    public direction: OrderDirection = OrderDirection.Unknown;

    public status: TradeStatus = TradeStatus.WaitSend;
    public statusMessage: string = "";
    public timestamp: string = "0";
    public trackWallet: string = "";
    public proxyWallet: string = "";
    public hash: string = "";
    public name: string = "";
    public pair: string = "";
    public pairName: string = "";
    public param1: string = "";
    public param2: string = "";

    public override valueOf(data: any): void {
        super.valueOf(data);
        this.marketName = data.market || "";
        this.user.valueOf(data.user);
        this.smartMoney.valueOf(data.smartMoney);
        this.direction = data.direction || OrderDirection.Unknown;
        this.status = data.status || "";
        this.statusMessage = data.statusMessage || "";
        this.timestamp = data.timestamp || "";
        this.trackWallet = data.trackWallet || "";
        this.proxyWallet = data.proxyWallet || "";
        this.hash = data.txHash || "";
        this.name = data.name || "";
        this.pair = data.pair || "";
        this.param1 = data.param1 || "";
        this.param2 = data.param2 || "";
        this.pairName = data.pairName || "";
    }
}
