import {Entity} from "~/models/Entity";

export class IntegralTask extends Entity {
    public content: string = "";
    public points: string = "";
    public type: string = "";
    public status: string = "";
    public rate: string = "";

    public link: string = "";
    public order: number = 0;

    override valueOf(data: any) {
        super.valueOf(data);
        this.status = data.status || '';
        if (data.config) {
            this.content = data.config.content || '';
            this.points = data.config.points || '';
            this.type = data.config.type || '';
            this.rate = data.config.rate || "";
            this.link = data.config.link || "";
            this.order = data.config.order || 0;
        }

    }

}
