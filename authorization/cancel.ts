import * as gracely from "gracely"
import * as authly from "authly"
import * as card from "@payfunc/model-card"
import { Cancel, Configuration, Status } from "../api"

export async function cancel(configuration: Configuration.Clearhaus, id: string): Promise<card.Cancel | gracely.Error> {
	let result: card.Cancel | gracely.Error
	const clearhausCancel = Cancel.connect(configuration, id)
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
				result = Status.asError(response.status)
				break
		}
	}
	return result
}
