import {Entity} from '@/models/Entity';
import BigNumber from "bignumber.js";


export class Token extends Entity {
    public chainName: string = "";
    public chainId: string = "";
    public tokenName: string = '';
    public tokenAddress: string = '';
    public tokenSymbol: string = '';
    public tokenDecimals: number = 18;
    public tokenQuantity: string = '0.0';
    public tokenUsd: string = '0.0';
    public tokenPrice: string = '0.0';
    public tokenValue: string = "0.0"
    public nativeToken: boolean = false;
    public groupName:string=""
    public groupNameEntry:string=""
    public honeypot:string=""
    public liquidity:string=""
    public lowLiquidity:string=""
    public selected:boolean=false
    public airdrop:boolean=false

    public override valueOf(data: any): void {
        this.tokenName = data.name || "";
        this.tokenDecimals = data.decimals || 0;
        this.tokenAddress = data.address || "";
        this.tokenSymbol = data.symbol || "";
        this.tokenQuantity = data.amount || "";
        this.tokenPrice = data.price || "";
        this.chainId = data.chainId || "";
        this.nativeToken = data.nativeToken || false;
        this.groupName = data.groupName || "";
        this.groupNameEntry=data.groupNameEntry || "";
        let price = new BigNumber(this.tokenPrice);
        let quantity = new BigNumber(this.tokenQuantity);
        if (price.isZero() || price.isPositive()) {
            if (quantity.isZero() || quantity.isPositive()) {
                let value = price.multipliedBy(quantity);
                this.tokenValue = value.toString();
                this.tokenUsd = value.toFixed(2);
            }
        }

    }
}
