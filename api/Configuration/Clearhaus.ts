import * as gracely from "gracely"
import * as model from "@payfunc/model"
export interface Clearhaus {
	url: string
	key: string
	signer: string
	secret: string
}
export namespace Clearhaus {
	export function is(value: any | Clearhaus): value is Clearhaus {
		return (
			typeof value == "object" &&
			typeof value.url == "string" &&
			typeof value.key == "string" &&
			typeof value.signer == "string" &&
			typeof value.secret == "string"
		)
	}
	export function from(
		merchant: model.Key,
		signer?: string | undefined,
		secret?: string | undefined
	): Clearhaus | gracely.Error {
		const result = {
			url: merchant.card?.acquirer.url,
			key: merchant.card?.acquirer.key,
			signer,
			secret,
		}
		return is(result) && merchant.card?.acquirer.protocol == "clearhaus" ? result : gracely.client.unauthorized()
	}
}
