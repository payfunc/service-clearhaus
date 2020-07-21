import * as authly from "authly"
import * as isoly from "isoly"
import * as card from "../Card"

export interface Request {
	amount: number
	currency: isoly.Currency
	ip?: string
	recurring?: boolean
	text_on_statement?: string
	reference?: string
}

export namespace Request {
	export function is(value: any | Request): value is Request {
		return typeof value == "object" &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			(value.ip == undefined || typeof value.ip == "string") &&
			(value.recurring == undefined || typeof value.recurring == "boolean") &&
			(value.text_on_statement == undefined || typeof value.text_on_statement == "string") &&
			(value.reference == undefined || typeof value.reference == "string")
	}
}
