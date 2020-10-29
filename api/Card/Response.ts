import * as isoly from "isoly"
import * as card from "@payfunc/model-card"

export interface Response {
	id: string
	scheme: card.Card.Scheme
	last4: string
	country: isoly.CountryCode.Alpha2
	type: "credit" | "debit"
	_links: {
		self: { href: string }
		authorizations: { href: string }
		credits: { href: string }
	}
	iin?: string // added by cardfunc
	expires?: card.Card.Expires // added by cardfunc
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return (
			(typeof value == "object" &&
				typeof value.id == "string" &&
				card.Card.Scheme.is(value.scheme) &&
				typeof value.last4 == "string" &&
				isoly.CountryCode.Alpha2.is(value.country) &&
				value.type == "credit") ||
			(value.type == "debit" &&
				typeof value._links == "object" &&
				typeof value._links.self == "object" &&
				typeof value._links.self.href == "string" &&
				typeof value._links.authorizations == "object" &&
				typeof value._links.authorizations.href == "string" &&
				typeof value._links.credits == "object" &&
				typeof value._links.credits.href == "string" &&
				(value.iin == undefined || (typeof typeof value.iin == "string" && value.iin.length == 6)) &&
				(value.expires == undefined || card.Card.Expires.is(value.expires)))
		)
	}
}
