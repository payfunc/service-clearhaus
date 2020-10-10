import * as model from "@payfunc/model"

export type OrderAction = {
	[orderId: string]: (model.Event.Settle | model.Event.Fail)[] | undefined
}
export namespace OrderAction {
	export function is(value: any | OrderAction): value is OrderAction {
		return (
			typeof value == "object" &&
			Object.entries(value).every(
				o =>
					o[1] == undefined ||
					(Array.isArray(o[1]) && o[1].every(e => model.Event.Settle.is(e) || model.Event.Fail.is(e)))
			)
		)
	}
}
