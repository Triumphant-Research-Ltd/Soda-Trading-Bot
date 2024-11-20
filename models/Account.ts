import {Entity} from "@/models/Entity";

export class Account extends Entity {
    public token: string = "";
    public chainId: string = "";
    public chainName: string = "";
    public address: string = "";
    public balance: string = "0";
    public signature: string = '';
    public signatureTime: number = 0;
    public wallet: string = "";
    public walletType: string = "";

    public override inner(): Record<string, any> {
        return {
            chainId: this.chainId,
            address: this.address,
            sign: this.signature,
            ts: this.signatureTime,
        }
    }

    public get raw(): any {
        return {
            chainId: this.chainId,
            address: this.address,
            wallet: this.wallet,
            walletType: this.walletType
        }
    }

    override valueOf(data: any): void {

        if (data.chainId !== undefined) {
            this.chainId = data.chainId;
        }

        if (data.address !== undefined) {
            this.address = data.address;
        }

        if (data.signature !== undefined) {
            this.signature = data.signature;
        }
        if (data.signatureTime !== undefined) {
            this.signatureTime = data.signatureTime;
        }

        if (data.chainName !== undefined) {
            this.chainName = data.chainName;
        }
        if (data.token !== undefined) {
            this.token = data.token;
        }

        if (data.balance !== undefined) {
            this.balance = data.balance;
        }
        if (data.wallet !== undefined) {
            this.wallet = data.wallet;
        }
        if (data.walletType) {
            this.walletType = data.walletType;
        }
    }
}
