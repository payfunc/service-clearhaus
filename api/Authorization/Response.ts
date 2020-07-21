import * as isoly from "isoly"
import { Response as cardResponse } from "../Card/Response"
import { Status } from "../Status"

export interface Response {
	id: string
	status: { code: Status, message?: string }
	processed_at: isoly.DateTime
	amount: number
	currency: isoly.Currency
	text_on_statement: string
	recurring: boolean
	thread_secure: boolean
	csc: {
		present: boolean,
		matches: boolean,
	}
	_embedded: {
		card: cardResponse,
	}
	_links: {
		self: { href: string },
		card: { href: string },
		captures: { href: string },
		voids: { href: string },
		refunds: { href: string },
	},
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return typeof value == "object" &&
			typeof value.id == "string" &&
			typeof value.status == "object" && Status.is(value.status.code) && (value.status.message == undefined || typeof value.status.message == "string") &&
			isoly.DateTime.is(value.processed_at) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			typeof value.text_on_statement == "string" &&
			typeof value.recurring == "boolean" &&
			typeof value.thread_secure == "boolean" &&
			typeof value.csc == "object" && typeof value.csc.present == "boolean" && typeof value.csc.matches == "boolean" &&
			typeof value._embedded == "object" && cardResponse.is(value._embedded.card) &&
			typeof value._links == "object" &&
			typeof value._links.self == "object" && typeof value._links.self.href == "string" &&
			typeof value._links.card == "object" && typeof value._links.card.href == "string" &&
			typeof value._links.captures == "object" && typeof value._links.captures.href == "string" &&
			typeof value._links.voids == "object" && typeof value._links.voids.href == "string" &&
			typeof value._links.refunds == "object" && typeof value._links.refunds.href == "string"
	}
}
