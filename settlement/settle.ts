import * as isoly from "isoly"
import * as gracely from "gracely"
import * as model from "@payfunc/model"
import * as service from "../index"

export async function settle(
	merchants: model.Merchant.Key[],
	configuration: service.api.MerchantApi.Configuration,
	startDate?: isoly.DateTime,
	endDate?: isoly.DateTime
): Promise<(service.api.MerchantApi.SettleAction | gracely.Error)[] | gracely.Error> {
	let result: (service.api.MerchantApi.SettleAction | gracely.Error)[] | gracely.Error
	const connection = await service.api.Settle.connect(configuration)
	if (gracely.Error.is(connection))
		result = connection
	else {
		if (!endDate)
			endDate = isoly.DateTime.now()
		if (!startDate)
			startDate = isoly.DateTime.create(new Date(isoly.DateTime.parse(endDate).valueOf() - 1000 * 60 * 60 * 24))
		const responses: (service.api.MerchantApi.SettleAction | gracely.Error)[] = await Promise.all(
			merchants.map(async merchant => {
				let output: service.api.MerchantApi.SettleAction | gracely.Error
				const settlementsResponse = !merchant.card
					? gracely.client.missingProperty(
							"card",
							"card.Configuration",
							"Merchant " + merchant.name + " missing valid Cardfunc configuration."
					  )
					: await connection.get(
							"/settlements",
							"payout.date:" +
								startDate?.substring(0, 10) +
								".." +
								endDate?.substring(0, 10) +
								" mid:" +
								merchant.card.mid,
							undefined,
							undefined
					  )
				if (gracely.Error.is(settlementsResponse))
					output = settlementsResponse
				else {
					if (!service.api.Settle.Response.is(settlementsResponse)) {
						output = gracely.server.backendFailure("Unexpected response from merchant api.")
					} else {
						const settlements: service.api.MerchantApi.Settlement[] | undefined =
							settlementsResponse?._embedded?.["ch:settlements"]
						if (!settlements)
							output = gracely.client.notFound()
						else {
							const settlementsList:
								| service.api.MerchantApi.SettlementTransactions[]
								| gracely.Error = await getTransactions(settlements, merchant, connection, startDate, endDate)
							const initial: service.api.MerchantApi.SettleAction = { merchant, action: {} }
							output = gracely.Error.is(settlementsList)
								? settlementsList
								: addendSettlementTransactions(settlementsList, merchant, initial)
						}
					}
				}
				return output
			})
		)
		result = responses
	}
	return result
}

function addendSettlementTransactions(
	newList: service.api.MerchantApi.SettlementTransactions[],
	merchant: model.Merchant.Key,
	initial: service.api.MerchantApi.SettleAction
): service.api.MerchantApi.SettleAction {
	return newList.reduce(
		(previous: service.api.MerchantApi.SettleAction, s: service.api.MerchantApi.SettlementTransactions) => {
			const newAction: service.api.MerchantApi.OrderAction = convertResponse(merchant, s).action
			appendOrderAction(previous, newAction)
			return previous
		},
		initial
	)
}

export function addendSettleAction(
	newList: service.api.MerchantApi.SettleAction[],
	initial: service.api.MerchantApi.SettleAction
): service.api.MerchantApi.SettleAction {
	return newList.reduce((previous: service.api.MerchantApi.SettleAction, s: service.api.MerchantApi.SettleAction) => {
		const newAction: service.api.MerchantApi.OrderAction = s.action
		appendOrderAction(previous, newAction)
		return previous
	}, initial)
}

function appendOrderAction(
	previous: service.api.MerchantApi.SettleAction,
	newAction: service.api.MerchantApi.OrderAction
) {
	Object.keys(previous.action).forEach(a =>
		Object.keys(newAction).forEach(b => {
			if (a == b)
				previous.action[a] = previous.action[a]?.concat(newAction[b] ?? [])
		})
	)
	Object.keys(newAction).forEach(a => {
		if (!Object.keys(previous.action).some(b => a == b))
			previous.action[a] = newAction[a]
	})
}

async function getTransactions(
	settlements: service.api.MerchantApi.Settlement[],
	merchant: model.Merchant.Key,
	connection: service.api.MerchantApi,
	startDate: string | undefined,
	endDate: string | undefined
): Promise<service.api.MerchantApi.SettlementTransactions[] | gracely.Error> {
	let result: service.api.MerchantApi.SettlementTransactions[] | gracely.Error = []
	result = [] as service.api.MerchantApi.SettlementTransactions[]
	result = await settlements.reduce(async (previous, current) => {
		let output: service.api.MerchantApi.SettlementTransactions[] | gracely.Error = await previous
		if (!gracely.Error.is(output)) {
			const transactions = await getTransactionsBySettlement(current, merchant, connection, startDate, endDate)
			if (gracely.Error.is(transactions))
				output = transactions
			else
				output.push({ settlement: current, transactions })
		}
		return output
	}, Promise.resolve(result))
	return result
}

async function getTransactionsBySettlement(
	settlement: service.api.MerchantApi.Settlement,
	merchant: model.Merchant.Key,
	connection: service.api.MerchantApi,
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
		: await connection.get(
				"/settlements/" + settlement.id + "/transactions",
				"date:" + startDate?.substring(0, 10) + ".." + endDate?.substring(0, 10) + " mid:" + merchant.card.mid,
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
		}
	}
	return result
}

export function convertResponse(
	merchant: model.Merchant.Key,
	input: service.api.MerchantApi.SettlementTransactions
): service.api.MerchantApi.SettleAction {
	const result: service.api.MerchantApi.SettleAction = {
		merchant,
		action: {},
	}
	const initial: { [orderId: string]: (model.Event.Settle | model.Event.Fail)[] } = {}
	result.action = input.transactions.reduce((previous, transaction) => {
		const OrderId = transaction.reference ?? ""
		const currency = isoly.Currency.is(transaction.currency) ? transaction.currency : "EUR"
		const decimals = isoly.Currency.decimalDigits(currency) || 0
		const amount = transaction.amount / 10 ** decimals
		const newEvent: model.Event.Settle = {
			type: "settle",
			date: isoly.DateTime.now(),
			reference: input.settlement.id,
			amount,
			currency,
			period: {
				start: input.settlement.period?.start_date ?? "0001-01-01T00:00:00:000Z",
				end: input.settlement.period?.end_date ?? "0001-01-01T00:00:00:000Z",
			},
			fee: {
				total: input.settlement.fees?.total ?? 0,
				sales: input.settlement.fees?.sales ?? 0,
				refunds: input.settlement.fees?.refunds ?? 0,
				authorisations: input.settlement.fees?.authorisations ?? 0,
				credits: input.settlement.fees?.credits ?? 0,
				interchange: input.settlement.fees?.interchange ?? 0,
				scheme: input.settlement.fees?.scheme ?? 0,
				minimumProcessing: input.settlement.fees?.service ?? 0,
				service: input.settlement.fees?.service ?? 0,
				wireTransfer: input.settlement.fees?.wire_transfer ?? 0,
				chargebacks: input.settlement.fees?.chargebacks ?? 0,
				retrievalRequests: input.settlement.fees?.retrieval_requests ?? 0,
			},
			payout: {
				amount: input.settlement.payout?.amount ?? 0,
				date: input.settlement.payout?.date
					? isoly.DateTime.create(new Date(Date.parse(input.settlement.payout?.date))) ?? "0001-01-01T00:00:00:000Z"
					: "0001-01-01T00:00:00:000Z",
				descriptor: input.settlement.payout?.descriptor,
				reference: input.settlement.payout?.reference_number,
			},
		}
		if (Array.isArray(previous[OrderId]))
			previous[OrderId].push(newEvent)
		else
			previous[OrderId] = [newEvent]
		return previous
	}, initial)
	return (
		result ?? {
			type: "fail",
			original: "settle",
			error: gracely.server.backendFailure("TODO!"),
			date: isoly.DateTime.now(),
		}
	)
}
