import * as authly from "authly"
import * as model from "@payfunc/model"

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
	export function convert(value: any | model.Key | model.Key.Creatable): MerchantInfo | undefined {
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
