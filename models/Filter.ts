import {FilterField, FilterRelation, FilterResult} from "@/utils/constant";
import {isPositiveNumber} from "@/utils/util";
import BigNumber from "bignumber.js";

export class Filter {
    public min: string = "";
    public max: string = "";
    public minScale: number = 1;
    public maxScale: number = 1;
    public field: FilterField = FilterField.Profit;
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
        if (this.isMinValid() && this.isMaxValid()) {
            this.relation = FilterRelation.Bte;
        } else if (this.isMinValid()) {
            this.relation = FilterRelation.Gte;
        } else if (this.isMaxValid()) {
            this.relation = FilterRelation.Lte;
        } else {
            this.relation = FilterRelation.Ign;
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
            let minValue = BigNumber(this.min).multipliedBy(this.minScale);
            let maxValue = BigNumber(this.max).multipliedBy(this.maxScale);
            if (this.relation == FilterRelation.Gte) {
                if (minValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                if (this.field == FilterField.AverageLoss) {
                    return num.abs().gte(minValue.abs()) ? FilterResult.Fit : FilterResult.NotFit;
                }
                return num.gte(minValue) ? FilterResult.Fit : FilterResult.NotFit;
            } else if (this.relation == FilterRelation.Lte) {
                if (maxValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                if (this.field == FilterField.AverageLoss) {
                    return num.abs().lte(maxValue.abs()) ? FilterResult.Fit : FilterResult.NotFit;
                }
                return num.lte(maxValue) ? FilterResult.Fit : FilterResult.NotFit;
            } else {
                if (minValue.isNaN() || maxValue.isNaN()) {
                    return FilterResult.Ignore;
                }
                if (this.field == FilterField.AverageLoss) {
                    let valueAbs = num.abs();
                    let maxAbs = maxValue.abs();
                    let minAbs = minValue.abs();
                    return valueAbs.gte(minAbs) && valueAbs.lte(maxAbs) ? FilterResult.Fit : FilterResult.NotFit;
                }
                return num.gte(minValue) && num.lte(maxValue) ? FilterResult.Fit : FilterResult.NotFit;
            }

        } catch (e: any) {

        }
        return FilterResult.Ignore;

    }
}
