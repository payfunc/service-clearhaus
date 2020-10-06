import * as isoly from "isoly"

export interface ApiToken {
	token: string
	expires?: isoly.DateTime
}

export namespace ApiToken {
	export function is(value: any | ApiToken): value is ApiToken {
		return (
			typeof value == "object" &&
			typeof value.token == "string" &&
			(value.expires == undefined || typeof value.expires == "string")
		)
	}
}
