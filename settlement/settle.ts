import * as isoly from "isoly"
import * as gracely from "gracely"
import * as model from "@payfunc/model"
import * as service from "../index"

export async function settle(
	merchants: service.api.MerchantApi.MerchantInfo[],
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
								| gracely.Error = await getTransactions(settlements, merchant, connection)
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
	merchant: service.api.MerchantApi.MerchantInfo,
	initial: service.api.MerchantApi.SettleAction
): service.api.MerchantApi.SettleAction {
	return newList.reduce(
		(previous: service.api.MerchantApi.SettleAction, s: service.api.MerchantApi.SettlementTransactions) => {
			const newAction: service.api.MerchantApi.OrderAction = convertResponse(merchant, s).action
			previous = appendOrderAction(previous, newAction)
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
		previous = appendOrderAction(previous, newAction)
		return previous
	}, initial)
}

function appendOrderAction(
	previous: service.api.MerchantApi.SettleAction,
	newAction: service.api.MerchantApi.OrderAction
): service.api.MerchantApi.SettleAction {
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
	return previous
}

async function getTransactions(
	settlements: service.api.MerchantApi.Settlement[],
	merchant: service.api.MerchantApi.MerchantInfo,
	connection: service.api.MerchantApi.Connection
): Promise<service.api.MerchantApi.SettlementTransactions[] | gracely.Error> {
	let result: service.api.MerchantApi.SettlementTransactions[] | gracely.Error = []
	result = [] as service.api.MerchantApi.SettlementTransactions[]
	result = await settlements.reduce(async (previous, current) => {
		let output: service.api.MerchantApi.SettlementTransactions[] | gracely.Error = await previous
		if (!gracely.Error.is(output)) {
			let transactions: service.api.MerchantApi.Transaction[] = []
			let page = 1
			let nextPage = false
			let transactionsPart
			do {
				;({ transactionsPart, nextPage } = await getTransactionsBySettlement(current, merchant, connection, page, 50))
				if (gracely.Error.is(transactionsPart))
					output = transactionsPart
				else {
					transactions = transactions.concat(transactionsPart)
					if (nextPage)
						page += 1
				}
			} while (!gracely.Error.is(transactionsPart) && nextPage)
			if (!gracely.Error.is(output))
				output.push({ settlement: current, transactions })
		}
		return output
	}, Promise.resolve(result))
	return result
}

async function getTransactionsBySettlement(
	settlement: service.api.MerchantApi.Settlement,
	merchant: service.api.MerchantApi.MerchantInfo,
	connection: service.api.MerchantApi.Connection,
	page: number | undefined = 1,
	perPage: number | undefined = 50
): Promise<{ transactionsPart: service.api.MerchantApi.Transaction[] | gracely.Error; nextPage: boolean }> {
	let result: service.api.MerchantApi.Transaction[] | gracely.Error
	const transactionsResponse = !merchant.card
		? gracely.client.missingProperty(
				"card",
				"card.Configuration",
				"Merchant " + merchant.name + " missing valid Cardfunc configuration."
		  )
		: await connection.get("/settlements/" + settlement.id + "/transactions", undefined, page, perPage)
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
	return { transactionsPart: result, nextPage: !!transactionsResponse?._links?.next }
}

function getAmount(amount: number, decimals: number) {
	return amount / 10 ** decimals
}

export function convertResponse(
	merchant: service.api.MerchantApi.MerchantInfo,
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
		const decimals = isoly.Currency.decimalDigits(currency) ?? 0
		const newEvent: model.Event.Settle = {
			type: "settle",
			date: isoly.DateTime.now(),
			reference: input.settlement.id,
			amount: getAmount(transaction.amount, decimals),
			currency,
			period: {
				start: input.settlement.period?.start_date ?? "0001-01-01T00:00:00:000Z",
				end: input.settlement.period?.end_date ?? "0001-01-01T00:00:00:000Z",
			},
			fee: {
				total: getAmount(input.settlement.fees?.total ?? 0, decimals),
				sales: getAmount(input.settlement.fees?.sales ?? 0, decimals),
				refunds: getAmount(input.settlement.fees?.refunds ?? 0, decimals),
				authorisations: getAmount(input.settlement.fees?.authorisations ?? 0, decimals),
				credits: getAmount(input.settlement.fees?.credits ?? 0, decimals),
				interchange: getAmount(input.settlement.fees?.interchange ?? 0, decimals),
				scheme: getAmount(input.settlement.fees?.scheme ?? 0, decimals),
				minimumProcessing: getAmount(input.settlement.fees?.service ?? 0, decimals),
				service: getAmount(input.settlement.fees?.service ?? 0, decimals),
				wireTransfer: getAmount(input.settlement.fees?.wire_transfer ?? 0, decimals),
				chargebacks: getAmount(input.settlement.fees?.chargebacks ?? 0, decimals),
				retrievalRequests: getAmount(input.settlement.fees?.retrieval_requests ?? 0, decimals),
			},
			payout: {
				amount: getAmount(input.settlement.payout?.amount ?? 0, decimals),
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
