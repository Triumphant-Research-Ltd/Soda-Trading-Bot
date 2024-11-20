export class TokenGroup {
    entry: string = ""
    name: string = ""
    order: number = -1

    valueOf(data: any) {
        this.entry = data.entry || "";
        this.name = data.name || "";
        this.order = data.order || -1;
    }
}
