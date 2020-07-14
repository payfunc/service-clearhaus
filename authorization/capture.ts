import * as isoly from "isoly"
import * as gracely from "gracely"
import * as model from "@payfunc/model"
import * as card from "@cardfunc/model"
import * as api from "../api"

// tslint:disable-next-line: no-shadowed-variable
export async function capture(merchant: model.Merchant.Key, authorization: card.Authorization, capture: card.Capture.Creatable, id: string): Promise<card.Capture | gracely.Error> {
	let result: card.Capture | gracely.Error
	if (!merchant.card)
		result = gracely.client.unauthorized()
	else {
		const captures = api.Capture.connect(merchant.card.acquirer, authorization.reference)
		const request: api.Capture.Request = {}
		const decimals = authorization.currency && isoly.Currency.decimalDigits(authorization.currency) || 0
		if (capture.amount)
			request.amount = Math.round(capture.amount * 10 ** decimals)
		if (capture.descriptor)
			request.text_on_statement = capture.descriptor
		const response = await captures.create(request)
		if (gracely.Error.is(response))
			result = response
		else {
			switch (response.status.code) {
				case 20000:
					result = {
						id,
						reference: response.id,
						descriptor: capture.descriptor,
						amount: response.amount / 10 ** decimals,
						created: response.processed_at,
					}
					break
				default:
					result = gracely.server.backendFailure(`Acquirer failed with status code ${ response.status.code }.`)
			}
		}
	}
	return result
}
