import {Entity} from "~/models/Entity";

export class Integral extends Entity {
    public address: string = "";
    public total: string = "";
    public day7: string = "";

    public rank: string = ""

    public override valueOf(data: any) {
        super.valueOf(data);
        this.address = data.address || '';
        this.total = data.total || '';
        this.day7 = data.day7 || '';
        this.rank = data.rank || '';
    }

}
