import * as model from "@payfunc/model"
import * as service from "../../index"

export type SettleAction = {
	merchant: model.Merchant.Key | { card: { mid: string } }
	action: service.api.MerchantApi.OrderAction
}
export namespace SettleAction {
	export function is(value: any | SettleAction): value is SettleAction {
		return (
			typeof value == "object" &&
			(model.Merchant.Key.is(value.merchant) ||
				(typeof value.merchant == "object" &&
					typeof value.merchant.card == "object" &&
					typeof value.merchant.card.mid == "string")) &&
			service.api.MerchantApi.OrderAction.is(value.action)
		)
	}
}
