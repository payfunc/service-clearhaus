import * as gracely from "gracely"
import * as model from "@payfunc/model"
import { Card as CardConfiguration } from "./Card"
import { Clearhaus as ClearhausConfiguration } from "./Clearhaus"
export interface Configuration {
	card: CardConfiguration
	clearhaus: ClearhausConfiguration
}
export namespace Configuration {
	export function is(value: any | Configuration): value is Configuration {
		return typeof value == "object" && CardConfiguration.is(value.card) && ClearhausConfiguration.is(value.clearhaus)
	}
	export function from(
		merchant: model.Key,
		signer?: string | undefined,
		secret?: string | undefined
	): Configuration | gracely.Error {
		const result = {
			card: CardConfiguration.from(merchant),
			clearhaus: ClearhausConfiguration.from(merchant, signer, secret),
		}
		return is(result) && merchant.card?.acquirer.protocol == "clearhaus" ? result : gracely.client.unauthorized()
	}
	export type Card = CardConfiguration
	export namespace Card {
		export const is = CardConfiguration.is
		export const from = CardConfiguration.from
	}
	export type Clearhaus = ClearhausConfiguration
	export namespace Clearhaus {
		export const is = ClearhausConfiguration.is
		export const from = ClearhausConfiguration.from
	}
}
