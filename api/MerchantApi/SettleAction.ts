import { Merchant } from "./Merchant"
import { OrderAction } from "./OrderAction"

export type SettleAction = {
	merchant: Merchant
	action: OrderAction
}
export namespace SettleAction {
	export function is(value: any | SettleAction): value is SettleAction {
		return typeof value == "object" && Merchant.is(value.merchant) && OrderAction.is(value.action)
	}
}
