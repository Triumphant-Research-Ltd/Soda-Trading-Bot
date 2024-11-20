import {Entity} from "@/models/Entity";

export class Invitation extends Entity{
    public rate:string="";
    public usdtAmount:string="";
    public symbol:string="";
    public returnAmount:string="";
    public ts:string="";
    public override  valueOf(data: any) {
        super.valueOf(data);

    }
}
