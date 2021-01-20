import * as gracely from "gracely"
import * as isoly from "isoly"
import * as authly from "authly"
import * as card from "@payfunc/model-card"
import * as model from "@payfunc/model"
import { Response as cardResponse } from "../Card/Response"
import { Status } from "../Status"
import { Request } from "./Request"

export interface Response {
	id: string
	status: { code: Status; message?: string }
	processed_at: isoly.DateTime
	amount: number
	currency: isoly.Currency
	text_on_statement: string
	recurring: boolean
	threed_secure: boolean
	"3dsecure": Record<string, unknown>
	csc: {
		present: boolean
		matches: boolean
	}
	_embedded?: {
		card: cardResponse
	}
	_links: {
		self?: { href: string }
		card?: { href: string }
		captures: { href: string }
		voids: { href: string }
		refunds: { href: string }
	}
	payfunc?: { card?: card.Card }
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return (
			typeof value == "object" &&
			typeof value.id == "string" &&
			typeof value.status == "object" &&
			Status.is(value.status.code) &&
			(value.status.message == undefined || typeof value.status.message == "string") &&
			isoly.DateTime.is(value.processed_at) &&
			typeof value.amount == "number" &&
			isoly.Currency.is(value.currency) &&
			typeof value.text_on_statement == "string" &&
			typeof value.recurring == "boolean" &&
			typeof value.threed_secure == "boolean" &&
			typeof value["3dsecure"] == "object" &&
			typeof value.csc == "object" &&
			typeof value.csc.present == "boolean" &&
			typeof value.csc.matches == "boolean" &&
			(value._embedded == undefined || (typeof value._embedded == "object" && cardResponse.is(value._embedded.card))) &&
			typeof value._links == "object" &&
			(value._links.self == undefined ||
				(typeof value._links.self == "object" && typeof value._links.self.href == "string")) &&
			(value._links.card == undefined ||
				(typeof value._links.card == "object" && typeof value._links.card.href == "string")) &&
			typeof value._links.captures == "object" &&
			typeof value._links.captures.href == "string" &&
			typeof value._links.voids == "object" &&
			typeof value._links.voids.href == "string" &&
			typeof value._links.refunds == "object" &&
			typeof value._links.refunds.href == "string" &&
			(value.payfunc == undefined ||
				(typeof value.payfunc == "object" && (value.payfunc.card == undefined || card.Card.is(value.payfunc.card))))
		)
	}
	export async function from(
		request: Request,
		response: Response,
		token: authly.Token
	): Promise<model.Payment.Card | gracely.Error> {
		let result: model.Payment.Card | gracely.Error | undefined
		const decimals = isoly.Currency.decimalDigits(response.currency) || 0
		const cardInfo = (await card.Card.Token.verify(token)) || (await model.Account.Method.verify(token))
		if (!cardInfo)
			result = gracely.client.invalidContent(
				"token",
				"Card | Account",
				"Can't verify token as either card or account method."
			)
		else {
			const output: model.Payment.Card = {
				reference: response.id,
				created: response.processed_at,
				amount: response.amount / 10 ** decimals,
				currency: response.currency,
				type: "card",
				scheme: response.payfunc?.card?.scheme ?? "unknown",
				iin: response.payfunc?.card?.iin ?? "??????",
				last4: response.payfunc?.card?.last4 ?? "????",
				expires: response.payfunc?.card?.expires ?? [1, 0],
				service: "cardfunc",
				status: "created",
			}
			if (card.Card.Token.is(cardInfo))
				output.card = token
			else if (model.Account.Method.is(cardInfo)) {
				const cardInternalInfo =
					(await authly.Verifier.create(authly.Algorithm.none())?.verify(cardInfo.token, "development")) ||
					(await authly.Verifier.create(authly.Algorithm.none())?.verify(cardInfo.token, "production"))
				output.account = token
				if (model.Account.Method.Card.Creatable.is(cardInternalInfo) && cardInternalInfo.card)
					output.card = cardInternalInfo.card
			}
			if (request.text_on_statement)
				output.descriptor = request.text_on_statement
			if (output.amount == 0 && request.recurring) {
				delete output.amount
				delete output.currency
			}
			result = output
		}
		return result
	}
}
