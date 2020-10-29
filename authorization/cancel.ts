import * as gracely from "gracely"
import * as authly from "authly"
import * as model from "@payfunc/model"
import * as card from "@payfunc/model-card"
import * as service from "../index"

export async function cancel(merchant: model.Key, id: string): Promise<card.Cancel | gracely.Error> {
	let result: card.Cancel | gracely.Error
	if (!merchant.card)
		result = gracely.client.unauthorized()
	else {
		const clearhausCancel = service.api.Cancel.connect(merchant.card.acquirer, id)
		const response = await clearhausCancel.create({})
		if (gracely.Error.is(response))
			result = response
		else {
			switch (response.status.code) {
				case 20000:
					result = {
						id: authly.Identifier.generate(12),
						created: response.processed_at,
						reference: response.id,
					}
					break
				default:
					result = service.api.Status.asError(response.status)
					break
			}
		}
	}
	return result
}
