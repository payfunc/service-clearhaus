import { MerchantInfo } from "./MerchantInfo"
import { OrderAction } from "./OrderAction"

export type SettleAction = {
	merchant: MerchantInfo
	action: OrderAction
}
export namespace SettleAction {
	export function is(value: any | SettleAction): value is SettleAction {
		return typeof value == "object" && MerchantInfo.is(value.merchant) && OrderAction.is(value.action)
	}
}
