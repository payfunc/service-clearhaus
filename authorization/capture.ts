import * as gracely from "gracely"
import * as isoly from "isoly"
import * as card from "@payfunc/model-card"
import * as model from "@payfunc/model"
import * as service from "../index"

export async function capture(
	merchant: model.Key,
	reference: string,
	currency: isoly.Currency,
	capture: card.Capture.Creatable,
	id: string
): Promise<card.Capture | gracely.Error> {
	let result: card.Capture | gracely.Error
	if (!merchant.card || !merchant.card.acquirer.key)
		result = gracely.client.unauthorized()
	else {
		const captures = service.api.Capture.connect(
			{ url: merchant.card.acquirer.url, key: merchant.card.acquirer.key },
			reference
		)
		const request: service.api.Capture.Request = {}
		const decimals = isoly.Currency.decimalDigits(currency) || 0
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
					result = gracely.server.backendFailure(`Acquirer failed with status code ${response.status.code}.`)
			}
		}
	}
	return result
}
