import * as isoly from "isoly"
import * as gracely from "gracely"
import * as authly from "authly"
import * as model from "@payfunc/model"
import * as service from "../index"

/*

1. get settlement // /settlements?query=<mid, date etc.>
2. get transactions based on settlement-id from (1) // /settlements/<settlement-id>/transactions

*/

export async function settle(
	merchants: model.Merchant.Key[],
	configuration: service.api.MerchantApi.Configuration,
	startDate?: isoly.DateTime,
	endDate?: isoly.DateTime
): Promise<(model.Event.Settle | model.Event.Fail)[] | gracely.Error> {
	let result: (model.Event.Settle | model.Event.Fail)[] | gracely.Error
	const accessToken = await service.api.Settle.connect(configuration)
	if (gracely.Error.is(accessToken))
		result = accessToken
	else {
		if (!endDate)
			endDate = isoly.DateTime.now()
		if (!startDate)
			startDate = isoly.DateTime.create(new Date(isoly.DateTime.parse(endDate).valueOf() - 1000 * 60 * 60 * 24))
		const responses: (any | gracely.Error)[] = await Promise.all(
			merchants.map(async merchant => {
				let result = !merchant.card
					? gracely.client.missingProperty(
							"card",
							"card.Configuration",
							"Merchant " + merchant.name + " missing valid Cardfunc configuration."
					  )
					: await accessToken.get(
							"/settlements",
							"period.start_date:" +
								startDate?.substring(0, 10) +
								" period.end_date:" +
								endDate?.substring(0, 10) +
								" mid:" +
								merchant.card.mid,
							undefined,
							undefined
					  )
				if (!gracely.Error.is(result)) {
					if (!service.api.Settle.Response.is(result)) {
						result = gracely.server.backendFailure("Unexpected response from merchant api.")
					} else {
						// 2. get transactions based on settlement-id from (1) // /settlements/<settlement-id>/transactions
						const transactions: service.api.MerchantApi.Transaction[] | undefined =
							result?._embedded?.["ch:transactions"]
						if (!transactions) {
							result = gracely.client.invalidContent("No transactions found.", "")
						} else {
							result = transactions
						}
						console.log("hello", transactions)
						// result = await accessToken.get(
						// 	"/settlements",
						// 	"period.start_date:" +
						// 		startDate?.substring(0, 10) +
						// 		" period.end_date:" +
						// 		endDate?.substring(0, 10) +
						// 		" mid:" +
						// 		merchant.card.mid,
						// 	undefined,
						// 	undefined
						// )
					}
				}
				return result
			})
		)
		const events: (model.Event.Settle | model.Event.Fail)[] = []
		responses.map(response => {
			if (gracely.Error.is(response))
				events.push({
					type: "fail",
					original: "settle",
					error: response,
					date: isoly.DateTime.now(),
				})
			else
				events.push(convertResponse(response))
		})
		result = events
	}
	return result
}

export function convertResponse(response: MerchantApi.Transaction): model.Event.Settle | model.Event.Fail {
	// const settlements: Record<string, unknown>[] = typeof response == "string"."_embedded"."ch:transaction"
	// const settlements = transactions.map(t => return { order_id: t.reference, settlement: t.settlement })
	// if (response.)
	return {
		type: "fail",
		original: "settle",
		error: gracely.server.backendFailure("TODO!"),
		date: isoly.DateTime.now(),
	}
}
