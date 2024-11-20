import {BackTestingFilterField, FilterRelation, FilterResult} from "@/utils/constant";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import {isPositiveNumber} from "~/utils/util";

export class BackTestingFilter {
    public min: string = "0";
    public max: string = "0";
    public minScale: number = 1;
    public maxScale: number = 1;
    public field: BackTestingFilterField = BackTestingFilterField.Profit5;
    public relation: FilterRelation = FilterRelation.Ign;

    public valid(): boolean {
        return this.isMinValid() || this.isMaxValid();
    }

    public isMinValid(): boolean {
        return isPositiveNumber(this.min);
    }

    public isMaxValid(): boolean {
        return isPositiveNumber(this.max);
    }

    public valueOf(data: any) {
        if (data.min != undefined) {
            this.min = data.min;
        }
        if (data.max != undefined) {
            this.max = data.max;
        }
        if (data.field != undefined) {
            this.field = data.field;
        }
        if (data.minScale != undefined) {
            this.minScale = data.minScale;
        }
        if (data.maxScale != undefined) {
            this.maxScale = data.maxScale;
        }
        let min = BigNumber(this.min);
        let max = BigNumber(this.max);
        if (min.isNaN() && max.isNaN()) {
            this.relation = FilterRelation.Ign;
        } else if (min.isNaN() && !max.isNaN()) {
            this.relation = FilterRelation.Lte;
        } else if (!min.isNaN() && max.isNaN()) {
            this.relation = FilterRelation.Gte;
        } else {
            this.relation = FilterRelation.Bte;
        }

    }

    public filter(value: any): FilterResult {
        try {
            if (this.relation == FilterRelation.Ign) {
                return FilterResult.Ignore;
            }
            let v = Reflect.get(value, this.field);
            if (v == undefined) {
                return FilterResult.Ignore;
            }
            let num = BigNumber(v);
            if (num.isNaN()) {
                return FilterResult.NotFit;
            }
            if (this.field == BackTestingFilterField.LastTradeTime) {
                num = BigNumber(dayjs().unix()).minus(num);
            }
            let minValue = BigNumber(this.min).multipliedBy(this.minScale);
            let maxValue = BigNumber(this.max).multipliedBy(this.maxScale);
            if (this.relation == FilterRelation.Gte) {
                if (minValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                return num.gte(minValue) ? FilterResult.Fit : FilterResult.NotFit;
            } else if (this.relation == FilterRelation.Lte) {
                if (maxValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                return num.lte(maxValue) ? FilterResult.Fit : FilterResult.NotFit;
            } else {
                if (minValue.isNaN() || maxValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                return num.gte(minValue) && num.lte(maxValue) ? FilterResult.Fit : FilterResult.NotFit;
            }

        } catch (e: any) {

        }
        return FilterResult.Ignore;

    }
}
