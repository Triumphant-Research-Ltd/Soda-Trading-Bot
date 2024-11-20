import {Entity} from "~/models/Entity";

export class UserReferralStats extends Entity {
    public totalEarned: string = "0";
    public volumeTraders: string = "0";
    public chainId: string = "";

    constructor(chain:string) {
        super();
        this.chainId=chain;
    }
    public override valueOf(data: any) {
        this.volumeTraders = data.volumeTraders || "0";
        this.totalEarned = data.totalEarned || "0";
    }
}

export class UserReferral extends Entity {
    public userCode: string = "";
    public referrals: string = "0";
    public eth: UserReferralStats = new UserReferralStats("0x1");
    public bsc: UserReferralStats = new UserReferralStats("0x38");
    public base: UserReferralStats = new UserReferralStats("0x2105");
    public solana: UserReferralStats = new UserReferralStats("solana");


    public override valueOf(data: any) {
        this.userCode = data.code || "";
        this.referrals = data.referrals || "0";
        let stats = data.stats;
        if (stats) {
            if (stats.eth) {
                this.eth.valueOf(stats.eth);
            }
            if (stats.bsc) {
                this.bsc.valueOf(stats.bsc);
            }
            if (stats.base) {
                this.base.valueOf(stats.base);
            }
            if (stats.solana) {
                this.solana.valueOf(stats.solana);
            }
        }


    }
}
