import {v4 as uuid} from 'uuid';


export class Entity {
    public index: number = 0;
    public key: string = uuid();
    public id: string = uuid();

    public valueOf(data: any): void {
        if (data && data.entry) {
            this.id = data.entry
        }
    }

    public inner(): Record<string, any> {
        let record: Record<string, any> = {};
        Object.entries(this).forEach(([key, value]) => {
            record[key] = value;
        });
        return record;
    }
}
