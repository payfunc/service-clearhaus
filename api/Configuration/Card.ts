import * as gracely from "gracely"
import * as model from "@payfunc/model"
export interface Card {
	url: string
	key: string
}
export namespace Card {
	export function is(value: any | Card): value is Card {
		return typeof value == "object" && typeof value.url == "string" && typeof value.key == "string"
	}
	export function from(merchant: model.Key): Card | gracely.Error {
		const result = {
			url: merchant.card?.url,
			key: merchant.token,
		}
		return is(result) && merchant.card?.acquirer.protocol == "clearhaus" ? result : gracely.client.unauthorized()
	}
}
