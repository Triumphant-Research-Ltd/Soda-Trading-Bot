import {Entity} from "@/models/Entity";

export class BackTestingProject extends Entity {
    public token0: string = ""
    public token1: string = ""
    public pair: string = ""
    public lowLiquidity: string = ""
    public honeypot: string = ""
    public buyAmount: string = ""
    public sellAmount: string = ""
    public highestRate: string = ""
    public buyPrice:string=""
    public sellPrice:string=""
    public lastTradeTime: string = ""
}
