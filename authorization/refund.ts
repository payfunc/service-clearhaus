import * as isoly from "isoly"
import * as gracely from "gracely"
import * as authly from "authly"
import * as model from "@payfunc/model"
import * as card from "@cardfunc/model"
import * as api from "../api"

export async function refund(merchant: model.Merchant.Key, authorization: card.Authorization, refundBody: card.Refund.Creatable): Promise<card.Refund | gracely.Error> {
	let result: card.Refund | gracely.Error
	if (!merchant.card)
		result = gracely.client.unauthorized()
	else {
		const clearhausRefund = api.Refund.connect(merchant.card.acquirer, authorization.reference)
		const refundRequest: api.Refund.Request = {}
		const decimals = authorization.currency && isoly.Currency.decimalDigits(authorization.currency) || 0
		if (refundBody.amount)
			refundRequest.amount = Math.round(refundBody.amount * 10 ** decimals)
		if (refundBody.descriptor)
			refundRequest.text_on_statement = refundBody.descriptor
		const response = await clearhausRefund.create(refundRequest)
		if (gracely.Error.is(response))
			result = response
		else {
			switch (response.status.code) {
				case 20000:
					result = {
						id: authly.Identifier.generate(12),
						amount: response.amount / 10 ** decimals,
						created: response.processed_at,
						reference: response.id,
						descriptor: response.text_on_statement,
					}
					break
				default:
					result = api.Status.asError(response.status)
					break
			}
		}
	}
	return result
}
