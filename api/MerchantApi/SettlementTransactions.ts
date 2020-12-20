import { Settlement } from "./Settlement"
import { Transaction } from "./Transaction"

export type SettlementTransactions = {
	settlement: Settlement
	transactions: Transaction[]
}

export namespace SettlementTransactions {
	export function is(value: any | SettlementTransactions): value is SettlementTransactions {
		return (
			typeof value == "object" &&
			Settlement.is(value.settlement) &&
			Array.isArray(value.transactions) &&
			value.transactions.every(Transaction.is)
		)
	}
}
