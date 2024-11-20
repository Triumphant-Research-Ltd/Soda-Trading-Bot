import {Entity} from "@/models/Entity";
import {TaskBuySettings} from "@/models/TaskBuySettings";
import {TaskStyleSettings} from "@/models/TaskStyleSettings";
import {TaskSellSettings} from "@/models/TaskSellSettings";
import {TaskGasSettings} from "@/models/TaskGasSettings";
import {TaskTemplate} from "@/models/TaskTemplate";
import BigNumber from "bignumber.js";


export class TaskSettings extends Entity {
    
    public address: string = "";
    
    public description: string = "";
    
    public style: TaskStyleSettings = new TaskStyleSettings();
    
    public buy: TaskBuySettings = new TaskBuySettings();
    
    public sell: TaskSellSettings = new TaskSellSettings();
    
    public gas: TaskGasSettings = new TaskGasSettings();

    public override inner(): Record<string, any> {
        let record: Record<string, any> = {};
        record["wallet"] = this.address.trim();
        record["remark"] = this.description.trim();
        let config: Record<string, any> = {};
        config["buyMode"] = this.style.buyMode.trim();
        config["securityBuy"] = this.style.securityBuy.trim();
        config["sellMode"] = this.style.sellMode.trim()
        config["customSell"] = this.style.customSell.trim();
        config["buyRate"] = this.buy.buyRate.trim();
        config["sellRate"] = this.buy.sellRate.trim();
        config["liquidity"] = this.buy.liquidity.trim();
        config["buyLimit"] = this.style.buyLimit.trim();
        let buyLimitMinValue = BigNumber(this.buy.buyLimitMin.trim());
        if (buyLimitMinValue.isNaN() || buyLimitMinValue.isNegative()) {
            config["buyLimitMin"] = "";
        } else {
            config["buyLimitMin"] = buyLimitMinValue.toString();
        }
        let buyLimitMaxValue = BigNumber(this.buy.buyLimitMax.trim());
        if (buyLimitMaxValue.isNaN() || buyLimitMaxValue.isNegative()) {
            config["buyLimitMax"] = "";
        } else {
            config["buyLimitMax"] = buyLimitMaxValue.toString();
        }
        config["buySlippage"] = this.buy.buySlippage.trim();
        config["highSpeedBuy"] = this.buy.highSpeedBuy.trim();
        config["buyTxProtect"] = this.buy.buyTxProtect.trim();
        config["sellWinRate"] = this.sell.sellWinRate.trim();
        config["sellWinExtent"] = this.sell.sellWinExtent.trim();
        config["sellWinRate2"] = this.sell.sellWinRate2.trim();
        config["sellWinExtent2"] = this.sell.sellWinExtent2.trim();
        config["sellWinRate3"] = this.sell.sellWinRate3.trim();
        config["sellWinExtent3"] = this.sell.sellWinExtent3.trim();
        config["sellLossRate"] = this.sell.sellLossRate.trim();
        config["sellLossExtent"] = this.sell.sellLossExtent.trim();
        config["sellSlippage"] = this.sell.sellSlippage.trim();
        config["gasPriceLimit"] = this.gas.gasPriceLimit.trim();
        config["gasLimit"] = this.gas.gasLimit.trim();
        config["gasOverflow"] = this.gas.gasOverflow.trim();
        config["followAmount"] = this.style.followAmount.trim();
        config["duplicateBuyLimit"] = this.style.duplicateBuyLimit.trim();
        config["sellGasOverflow"] = this.gas.sellGasOverflow.trim();
        config["buyFreqLimitHour"] = this.style.buyFreqLimitHour.trim();
        config["sellRatioFollow"] = this.style.sellRatioFollow.trim();
        record["config"] = config;
        return record;
    }

    public override valueOf(data: any) {
        this.address = data.address || "";
        this.description = data.remark || "";
        this.style.valueOf(data);
        this.buy.valueOf(data);
        this.sell.valueOf(data);
        this.gas.valueOf(data)
    }

    public copy(template: TaskTemplate) {
        this.style.copy(template);
        this.buy.copy(template);
        this.sell.copy(template);
        this.gas.copy(template);
    }

    public static from(data: any) {
        let task = new TaskSettings();
        task.address = data.address || "";
        task.description = data.description || "";
        if (data.style) {
            task.style.valueOf(data.style);
        }
        if (data.buy) {
            task.buy.valueOf(data.buy);
        }
        if (data.sell) {
            task.sell.valueOf(data.sell);
        }
        if (data.gas) {
            task.gas.valueOf(data.gas);
        }
        return task;
    }

    public static build(style: TaskStyleSettings, buy: TaskBuySettings, gas: TaskGasSettings, sell: TaskSellSettings) {
        let task = new TaskSettings();
        if (style != undefined) {
            task.style = style;
        }
        if (buy) {
            task.buy = buy;
        }
        if (gas) {
            task.gas = gas;
        }
        if (sell) {
            task.sell = sell;
        }
        return task;
    }
}
