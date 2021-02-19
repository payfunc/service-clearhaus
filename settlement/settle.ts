import * as gracely from "gracely"
import * as isoly from "isoly"
import * as model from "@payfunc/model"
import * as service from "../index"

export async function settle(
	merchants: service.api.MerchantApi.Merchant[],
	configuration: service.api.MerchantApi.Configuration,
	startDate: isoly.DateTime,
	endDate: isoly.DateTime
): Promise<(service.api.MerchantApi.SettleAction | gracely.Error)[] | gracely.Error> {
	let result: (service.api.MerchantApi.SettleAction | gracely.Error)[] | gracely.Error
	const connection = await service.api.Settle.connect(configuration)
	if (gracely.Error.is(connection))
		result = connection
	else
		result = await Promise.all(
			merchants.map(async merchant => settleMerchant(merchant, connection, startDate, endDate))
		)
	return result
}

async function settleMerchant(
	merchant: service.api.MerchantApi.Merchant,
	connection: service.api.MerchantApi.Connection,
	startDate: isoly.DateTime,
	endDate: isoly.DateTime
): Promise<service.api.MerchantApi.SettleAction | gracely.Error> {
	let result: service.api.MerchantApi.SettleAction | gracely.Error
	const settlementsResponse = await connection.get(
		"/settlements",
		"payout.date:" + startDate.substring(0, 10) + ".." + endDate.substring(0, 10) + " mid:" + merchant.reference,
		undefined,
		undefined
	)
	if (gracely.Error.is(settlementsResponse))
		result = settlementsResponse
	else if (!service.api.Settle.Response.is(settlementsResponse))
		result = gracely.server.backendFailure("Unexpected response from merchant api.")
	else if (!settlementsResponse?._embedded?.["ch:settlements"])
		result = gracely.client.notFound()
	else {
		const settlementsList = await getTransactions(settlementsResponse._embedded?.["ch:settlements"], connection)
		result = gracely.Error.is(settlementsList)
			? settlementsList
			: settlementsList.reduce<service.api.MerchantApi.SettleAction>(
					(previous, s) => appendOrderAction(previous, convertResponse(s)),
					{ merchant, action: {} }
			  )
	}
	return result
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
	connection: service.api.MerchantApi.Connection
): Promise<service.api.MerchantApi.SettlementTransactions[] | gracely.Error> {
	let result: service.api.MerchantApi.SettlementTransactions[] | gracely.Error = []
	result = await settlements.reduce<Promise<service.api.MerchantApi.SettlementTransactions[] | gracely.Error>>(
		async (previous, current) => {
			let output = await previous
			if (!gracely.Error.is(output)) {
				let transactions: service.api.MerchantApi.Transaction[] = []
				let page = 1
				let partial: {
					transactions: service.api.MerchantApi.Transaction[] | gracely.Error
					continue: boolean
				}
				do {
					partial = await getTransactionsBySettlement(current, connection, page)
					if (gracely.Error.is(partial.transactions))
						output = partial.transactions
					else {
						transactions = transactions.concat(partial.transactions)
						if (partial.continue)
							page += 1
					}
				} while (!gracely.Error.is(partial.transactions) && partial.continue)
				if (!gracely.Error.is(output))
					output.push({ settlement: current, transactions })
			}
			return output
		},
		Promise.resolve(result)
	)
	return result
}

async function getTransactionsBySettlement(
	settlement: service.api.MerchantApi.Settlement,
	connection: service.api.MerchantApi.Connection,
	page: number
): Promise<{ transactions: service.api.MerchantApi.Transaction[] | gracely.Error; continue: boolean }> {
	let result: service.api.MerchantApi.Transaction[] | gracely.Error
	const transactionsResponse = await connection.get(
		"/settlements/" + settlement.id + "/transactions",
		undefined,
		page,
		50
	)
	if (gracely.Error.is(transactionsResponse))
		result = transactionsResponse
	else if (!service.api.Settle.Response.is(transactionsResponse))
		result = gracely.server.backendFailure("Unexpected response from merchant api.")
	else
		result = transactionsResponse?._embedded?.["ch:transactions"] ?? gracely.client.notFound()
	return { transactions: result, continue: !!transactionsResponse?._links?.next }
}

function getAmount(amount: number, decimals: number) {
	return amount / 10 ** decimals
}

function convertResponse(input: service.api.MerchantApi.SettlementTransactions): service.api.MerchantApi.OrderAction {
	return input.transactions.reduce<{ [orderId: string]: (model.Event.Settle | model.Event.Fail)[] }>(
		(previous, transaction) => {
			let newEvent: model.Event.Settle | model.Event.Fail
			const OrderId = transaction.reference ?? ""
			if (!transaction.settlement)
				newEvent = {
					type: "fail",
					original: "settle",
					error: gracely.server.backendFailure(
						"Transaction doesn't contain settlement information. Should only fetch transactions tied to settlement."
					),
					date: isoly.DateTime.now(),
				}
			else {
				const currency = isoly.Currency.is(transaction.currency) ? transaction.currency : "EUR"
				const decimals = isoly.Currency.decimalDigits(currency) ?? 0
				newEvent = {
					type: "settle",
					date: isoly.DateTime.now(),
					period: {
						start: input.settlement.period.start_date,
						end: input.settlement.period.end_date,
					},
					gross: getAmount(transaction.settlement?.amount_gross ?? 0, decimals),
					net: getAmount(transaction.settlement?.amount_net ?? 0, decimals),
					currency,
					fee: getAmount(transaction.settlement.fees ?? 0, decimals),
					descriptor: input.settlement.payout?.descriptor,
					reference: input.settlement.payout?.reference_number ?? "no reference found",
				}
				if (input.settlement.payout?.date)
					newEvent.payout = input.settlement.payout?.date
			}
			if (OrderId)
				if (Array.isArray(previous[OrderId]))
					previous[OrderId].push(newEvent)
				else
					previous[OrderId] = [newEvent]
			return previous
		},
		{}
	)
}
