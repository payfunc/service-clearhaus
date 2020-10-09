import * as service from "../../index"

export type SettleAction = {
	merchant: service.api.MerchantApi.MerchantInfo
	action: service.api.MerchantApi.OrderAction
}
export namespace SettleAction {
	export function is(value: any | SettleAction): value is SettleAction {
		return (
			typeof value == "object" &&
			service.api.MerchantApi.MerchantInfo.is(value.merchant) &&
			service.api.MerchantApi.OrderAction.is(value.action)
		)
	}
}
