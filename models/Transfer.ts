import {Entity} from "@/models/Entity";

export class Transfer extends Entity {
    public tokenSymbol: string = "";
    public tokenQuantity: string = "0";
    public fromAddress: string = "";
    public toAddress: string = "";
    public contractAddress: string = "";

    public override valueOf(data: any) {
        this.tokenSymbol = data.tokenSymbol || "";
        this.tokenQuantity = data.tokenQuantity || "";
        this.fromAddress = data.fromAddress || "";
        this.toAddress = data.toAddress || "";
        this.contractAddress = data.contractAddress || "";
    }
}
