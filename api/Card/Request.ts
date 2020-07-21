import * as authly from "authly"

export type Request = authly.Token

export namespace Request {
	export function is(value: any | Request): value is Request {
		return authly.Token.is(value)
	}
}
