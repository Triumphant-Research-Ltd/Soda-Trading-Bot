import {Entity} from "@/models/Entity";
import BigNumber from "bignumber.js";

export class SmartMoneyEntity extends Entity {

    public chainId: string = "";
    
    public address: string = "";
    
    public profit: string = "0";
    //token
    public tokenAmount: string = "0";
    
    public positiveProfit: string = "0";
    
    public negativeProfit: string = "0";
    
    public winningRate: string = "0";
    
    public tradeProfitRate: string = "0";
    
    public maximumProfit: string = "0";
    
    public minimumProfit: string = "0";
    
    public averageProfit: string = "0";
    
    public averageLoss: string = "0";
    
    public maximumLoss: string = "0";
    
    public minimumLoss: string = "0";
    
    public averageEarnings: string = "0";
    
    public averageBuyEarnings: string = "0";
    
    public averageHoldTime: string = "0";
    
    public newlyTokenRate: string = "0";
    
    public tradeCount: string = "0";
    
    public maxProfitRate: string = "0";
    
    public lastTradeTime: string = "";
    
    public balance: string = "0";

    public override valueOf(data: any) {
        if (data == undefined) {
            return;
        }
        if (data.rank != undefined) {
            let index = parseInt(data.rank.toString());
            if (!isNaN(index)) {
                this.index = index;
            }
        }
        
        this.address = data.address?.toString() || "";
        
        this.profit = data.positive_total?.toString() || "0";
        //token
        this.tokenAmount = data.total?.toString() || "0";
        
        this.positiveProfit = data.positive?.toString() || "0"
        
        this.negativeProfit = data.negative?.toString() || "0"
        
        this.winningRate = data.rate?.toString() || "0";
        
        this.tradeCount = data.count?.toString() || "0";
        
        this.tradeProfitRate = data.rate_return?.toString() || "0";
        
        this.maximumProfit = data.positive_max?.toString() || "0"
        
        this.minimumProfit = data.positive_min?.toString() || "0";
        
        this.averageProfit = data.positive_rate?.toString() || '0';
        
        this.averageLoss = data.negative_rate?.toString() || '0';
        
        this.maximumLoss = data.negative_max?.toString() || '0'
        
        this.minimumLoss = data.negative_min?.toString() || '0';
        
        this.averageEarnings = data.total_rate?.toString() || '0';
        
        this.averageBuyEarnings = data.average_buying?.toString() || '0';
        
        this.averageHoldTime = data.average_holding_time?.toString() || '0';
        
        this.newlyTokenRate = data.rate_in_coins?.toString() || '0'
        
        let n1 = BigNumber(this.maximumProfit);
        let n2 = BigNumber(this.profit);
        if (n1.isNaN() || n2.isNaN() || n2.isZero()) {
            this.maxProfitRate = "0.0";
        } else {
            this.maxProfitRate = n1.div(n2).toFixed(6, BigNumber.ROUND_DOWN);
        }
        this.lastTradeTime = data.maxTime?.toString() || '';
        this.balance = data.balance?.toString() || '';
    }
}
