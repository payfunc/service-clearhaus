import * as service from "../../index"

export type SettlementTransactions = {
	settlement: service.api.MerchantApi.Settlement
	transactions: service.api.MerchantApi.Transaction[]
}

export namespace SettlementTransactions {
	export function is(value: any | SettlementTransactions): value is SettlementTransactions {
		return (
			typeof value == "object" &&
			service.api.MerchantApi.Settlement.is(value.settlement) &&
			Array.isArray(value.transactions) &&
			value.transactions.every(service.api.MerchantApi.Transaction.is)
		)
	}
}
