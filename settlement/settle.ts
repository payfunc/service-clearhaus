import * as isoly from "isoly"
import * as gracely from "gracely"
import * as model from "@payfunc/model"
import * as service from "../index"
import * as fs from "fs"
import { MerchantApi } from "api"

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
				const settlementsResponse = !merchant.card
					? gracely.client.missingProperty(
							"card",
							"card.Configuration",
							"Merchant " + merchant.name + " missing valid Cardfunc configuration."
					  )
					: await accessToken.get(
							"/settlements",
							"period:" + startDate?.substring(0, 10) + ".." + endDate?.substring(0, 10) + " mid:" + merchant.card.mid,
							undefined,
							undefined
					  )
				if (gracely.Error.is(settlementsResponse))
					result = settlementsResponse
				else {
					if (!service.api.Settle.Response.is(result)) {
						result = gracely.server.backendFailure("Unexpected response from merchant api.")
					} else {
						// 2. get transactions based on settlement-id from (1) // /settlements/<settlement-id>/transactions
						const settlements: service.api.MerchantApi.Settlement[] | undefined = result?._embedded?.["ch:settlements"]
						if (!settlements) {
							result = gracely.client.notFound()
						} else {
							const settlementsList:
								| { [settlementId: string]: service.api.MerchantApi.Transaction[] | undefined }
								| gracely.Error = await getTransactions(settlements, merchant, accessToken, startDate, endDate)
							settlementsList.
						}
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

async function getTransactions(
	settlements: service.api.MerchantApi.Settlement[],
	merchant: model.Merchant.Key,
	accessToken: service.api.MerchantApi,
	startDate: string | undefined,
	endDate: string | undefined
): Promise<{ [settlementId: string]: service.api.MerchantApi.Transaction[] | undefined } | gracely.Error> {
	// console.log("hello", settlements)
	let result: { [settlementId: string]: service.api.MerchantApi.Transaction[] | undefined } | gracely.Error = {}
	// if (settlements) {
	// 	const filepath = "settlements_" + isoly.DateTime.now() + ".json"
	// 	fs.writeFileSync(filepath, JSON.stringify(settlements))
	// 	console.log("tried to print out")
	// }
	result = {} as { [settlementId: string]: service.api.MerchantApi.Transaction[] | undefined }
	result = await settlements.reduce(async (previous, current) => {
		let output:
			| { [settlementId: string]: service.api.MerchantApi.Transaction[] | undefined }
			| gracely.Error = await previous
		if (!gracely.Error.is(output)) {
			const transactionList = await getTransactionsBySettlement(current, merchant, accessToken, startDate, endDate)
			if (gracely.Error.is(transactionList))
				output = transactionList
			else
				output[current.id] = transactionList
		}
		return output
	}, Promise.resolve(result))
	return result
}

async function getTransactionsBySettlement(
	settlement: service.api.MerchantApi.Settlement,
	merchant: model.Merchant.Key,
	accessToken: service.api.MerchantApi,
	startDate: string | undefined,
	endDate: string | undefined
): Promise<service.api.MerchantApi.Transaction[] | gracely.Error> {
	let result: service.api.MerchantApi.Transaction[] | gracely.Error
	const transactionsResponse = !merchant.card
		? gracely.client.missingProperty(
				"card",
				"card.Configuration",
				"Merchant " + merchant.name + " missing valid Cardfunc configuration."
		  )
		: await accessToken.get(
				"/settlements/" + settlement.id + "/transactions",
				"period:" + startDate?.substring(0, 10) + ".." + endDate?.substring(0, 10) + " mid:" + merchant.card.mid,
				undefined,
				undefined
		  )
	if (gracely.Error.is(transactionsResponse))
		result = transactionsResponse
	else {
		if (!service.api.Settle.Response.is(transactionsResponse)) {
			result = gracely.server.backendFailure("Unexpected response from merchant api.")
		} else {
			const transactions: service.api.MerchantApi.Transaction[] | undefined =
				transactionsResponse?._embedded?.["ch:transactions"]
			result = !transactions ? gracely.client.notFound() : transactions
			// if (transactions) {
			// 	console.log("hello", transactions)
			// 	if (transactions) {
			// 		const filepath = "transactions_" + isoly.DateTime.now() + ".json"
			// 		fs.writeFileSync(filepath, JSON.stringify(transactions))
			// 		console.log("tried to print out")
			// 	}
			// 	// result = await accessToken.get(
			// 	// 	"/settlements",
			// 	// 	"period.start_date:" +
			// 	// 		startDate?.substring(0, 10) +
			// 	// 		" period.end_date:" +
			// 	// 		endDate?.substring(0, 10) +
			// 	// 		" mid:" +
			// 	// 		merchant.card.mid,
			// 	// 	undefined,
			// 	// 	undefined
			// 	// )
			// }
		}
	}
	return result
}

export function convertResponse(response: service.api.MerchantApi.Transaction): model.Event.Settle | model.Event.Fail {
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
