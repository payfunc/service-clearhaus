import * as model from "@payfunc/model"
import * as authly from "authly"

export interface MerchantInfo {
	id: authly.Identifier
	name: string
	card: {
		mid: string
	}
}

export namespace MerchantInfo {
	export function is(value: any | MerchantInfo): value is MerchantInfo {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			typeof value.name == "string" &&
			typeof value.card == "object" &&
			typeof value.card.mid == "string"
		)
	}
	export function convert(value: any | model.Merchant.Key | model.Merchant.Creatable): MerchantInfo | undefined {
		const output =
			typeof value == "object" &&
			(authly.Identifier.is(value.id) || authly.Identifier.is(value.sub)) &&
			typeof value.name == "string" &&
			typeof value.card == "object" &&
			typeof value.card.mid == "string"
				? { id: value?.id ?? value?.sub, name: value?.name, card: { mid: value?.card?.mid } }
				: undefined
		return is(output) ? output : undefined
	}
}