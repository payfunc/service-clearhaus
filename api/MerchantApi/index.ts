import { ApiToken as MerchantApiToken } from "./ApiToken"
import { Configuration as MerchantApiConfiguration } from "./Configuration"
import { Connection as MerchantApiConnection } from "./Connection"
import { Link as MerchantApiLink } from "./Link"
import { OrderAction as MerchantApiOrderAction } from "./OrderAction"
import { SettleAction as MerchantApiSettleAction } from "./SettleAction"
import { Settlement as MerchantApiSettlement } from "./Settlement"
import { SettlementTransactions as MerchantApiSettlementTransactions } from "./SettlementTransactions"
import { Transaction as MerchantApiTransaction } from "./Transaction"

export namespace MerchantApi {
	export type ApiToken = MerchantApiToken
	export namespace ApiToken {
		export const is = MerchantApiToken.is
	}
	export type Configuration = MerchantApiConfiguration
	export namespace Configuration {
		export const is = MerchantApiConfiguration.is
	}
	export type Connection = MerchantApiConnection
	export type Link = MerchantApiLink
	export namespace Link {
		export const is = MerchantApiLink.is
	}
	export type OrderAction = MerchantApiOrderAction
	export namespace OrderAction {
		export const is = MerchantApiOrderAction.is
	}
	export type SettleAction = MerchantApiSettleAction
	export namespace SettleAction {
		export const is = MerchantApiSettleAction.is
	}
	export type Settlement = MerchantApiSettlement
	export namespace Settlement {
		export const is = MerchantApiSettlement.is
	}
	export type SettlementTransactions = MerchantApiSettlementTransactions
	export namespace SettlementTransactions {
		export const is = MerchantApiSettlementTransactions.is
	}
	export type Transaction = MerchantApiTransaction
	export namespace Transaction {
		export const is = MerchantApiTransaction.is
	}
}
