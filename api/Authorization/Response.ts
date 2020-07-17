import * as isoly from "isoly"
import * as model from "@cardfunc/model"
import * as card from "../Card"
import { Status } from "../Status"
import { Request } from "./Request"

export interface Response {
	id: string
	status: { code: Status, message?: string }
	processed_at: isoly.DateTime
	amount: number
	currency: isoly.Currency
	text_on_statement: string
	reacurring: boolean
	thread_secure: boolean
	csc: {
		present: boolean,
		matches: boolean,
	}
	_embedded: {
		card: card.Response,
	}
	_links: {
		self: { href: string },
		card: { href: string },
		captures: { href: string },
		voids: { href: string },
		refunds: { href: string },
	},
}
