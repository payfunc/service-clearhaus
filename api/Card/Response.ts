import * as isoly from "isoly"
import * as model from "@cardfunc/model"

export interface Response {
	id: string
	scheme: model.Card.Scheme
	last4: string
	country: isoly.CountryCode.Alpha2
	type: "credit" | "debit"
	_links: {
		self: { href: string },
		authorizations: { href: string },
		credits: { href: string },
	}
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return typeof value == "object" &&
			typeof value.id == "string" &&
			model.Card.Scheme.is(value.scheme) &&
			typeof value.last4 == "string" &&
			isoly.CountryCode.Alpha2.is(value.country) &&
			value.type == "credit" || value.type == "debit" &&
			typeof value._links == "object" &&
			typeof value._links.self == "object" && typeof value._links.self.href == "string" &&
			typeof value._links.authorizations == "object" && typeof value._links.authorizations.href == "string" &&
			typeof value._links.credits == "object" && typeof value._links.credits.href == "string"
	}
}
