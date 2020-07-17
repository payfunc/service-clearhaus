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
