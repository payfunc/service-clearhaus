import * as authly from "authly"
import * as model from "@payfunc/model"

export interface Merchant {
	id: authly.Identifier
	name: string
	reference: string
}

export namespace Merchant {
	export function is(value: any | Merchant): value is Merchant {
		return (
			typeof value == "object" &&
			authly.Identifier.is(value.id) &&
			typeof value.name == "string" &&
			typeof value.reference == "string"
		)
	}
	export function convert(value: any | model.Key | model.Key.Creatable): Merchant | undefined {
		const output =
			typeof value == "object" &&
			(authly.Identifier.is(value.id) || authly.Identifier.is(value.sub)) &&
			typeof value.name == "string" &&
			typeof value.card == "object" &&
			typeof value.card.mid == "string"
				? { id: value?.id ?? value?.sub, name: value?.name, reference: value?.card?.mid }
				: undefined
		return is(output) ? output : undefined
	}
}
