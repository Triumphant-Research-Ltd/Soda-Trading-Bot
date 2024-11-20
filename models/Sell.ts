import {Entity} from "@/models/Entity";

export class Sell extends Entity {
    public tokenSymbol: string = "";
    public tokenQuantity: string = "0";
    public contractAddress: string = "";

    public override  valueOf(data: any) {
        this.tokenSymbol = data.tokenSymbol || "";
        this.tokenQuantity = data.tokenQuantity || "0";
        this.contractAddress = data.contractAddress || "";
    }
}
