import { Request as AuthorizationRequest } from "./api/Authorization/Request"
import { Response as AuthorizationResponse } from "./api/Authorization/Response"
import { Cancel as apiCancel } from "./api/Cancel"
import { Request as CancelRequest } from "./api/Cancel/Request"
import { Response as CancelResponse } from "./api/Cancel/Response"
import { Capture as apiCapture } from "./api/Capture"
import { Request as CaptureRequest } from "./api/Capture/Request"
import { Response as CaptureResponse } from "./api/Capture/Response"
import { Request as CardRequest } from "./api/Card/Request"
import { Response as CardResponse } from "./api/Card/Response"
import { Refund as apiRefund } from "./api/Refund"
import { Request as RefundRequest } from "./api/Refund/Request"
import { Response as RefundResponse } from "./api/Refund/Response"
import { MerchantApi as apiMerchantApi } from "./api/MerchantApi"
import { Method as apiMethod } from "./api/Method"
import { Request as settleRequest } from "./api/Settle/Request"
import { Response as settleResponse } from "./api/Settle/Response"
import { Settle as apiSettle } from "./api/Settle"
import { Status as apiStatus } from "./api/Status"
import { cancel as authorizationCancel } from "./authorization/cancel"
import { capture as authorizationCapture } from "./authorization/capture"
import { create as authorizationCreate } from "./authorization/create"
import { refund as authorizationRefund } from "./authorization/refund"
import {
	addendSettleAction as settlementAddendSettleAction,
	convertResponse as settlementConvertResponse,
	settle as settlementSettle,
} from "./settlement"

export namespace api {
	export namespace Authorization {
		export type Request = AuthorizationRequest
		export namespace Request {
			export const is = AuthorizationRequest.is
		}
		export type Response = AuthorizationResponse
		export namespace Response {
			export const is = AuthorizationResponse.is
			export const from = AuthorizationResponse.from
		}
	}
	export namespace Cancel {
		export const connect = apiCancel.connect
		export type Request = CancelRequest
		export namespace Request {
			export const is = CancelRequest.is
		}
		export type Response = CancelResponse
		export namespace Response {
			export const is = CancelResponse.is
		}
	}
	export namespace Capture {
		export const connect = apiCapture.connect
		export type Request = CaptureRequest
		export namespace Request {
			export const is = CaptureRequest.is
		}
		export type Response = CaptureResponse
		export namespace Response {
			export const is = CaptureResponse.is
		}
	}
	export namespace Card {
		export type Request = CardRequest
		export namespace Request {
			export const is = CardRequest.is
		}
		export type Response = CardResponse
		export namespace Response {
			export const is = CardResponse.is
		}
	}
	export namespace Refund {
		export const connect = apiRefund.connect
		export type Request = RefundRequest
		export namespace Request {
			export const is = RefundRequest.is
		}
		export type Response = RefundResponse
		export namespace Response {
			export const is = RefundResponse.is
		}
	}
	export namespace MerchantApi {
		export type Connection = apiMerchantApi.Connection
		export type ApiToken = apiMerchantApi.ApiToken
		export namespace ApiToken {
			export const is = apiMerchantApi.ApiToken.is
		}
		export type Configuration = apiMerchantApi.Configuration
		export namespace Configuration {
			export const is = apiMerchantApi.Configuration.is
		}
		export type Link = apiMerchantApi.Link
		export namespace Link {
			export const is = apiMerchantApi.Link.is
		}
		export type OrderAction = apiMerchantApi.OrderAction
		export namespace OrderAction {
			export const is = apiMerchantApi.OrderAction.is
		}
		export type SettleAction = apiMerchantApi.SettleAction
		export namespace SettleAction {
			export const is = apiMerchantApi.SettleAction.is
		}
		export type Settlement = apiMerchantApi.Settlement
		export namespace Settlement {
			export const is = apiMerchantApi.Settlement.is
		}
		export type SettlementTransactions = apiMerchantApi.SettlementTransactions
		export namespace SettlementTransactions {
			export const is = apiMerchantApi.SettlementTransactions.is
		}
		export type Transaction = apiMerchantApi.Transaction
		export namespace Transaction {
			export const is = apiMerchantApi.Transaction.is
		}
	}
	export type Method = apiMethod
	export namespace Method {
		export const is = apiMethod.is
	}
	export namespace Settle {
		export const connect = apiSettle.connect
		export namespace Request {
			export const is = settleRequest.is
		}
		export namespace Response {
			export const is = settleResponse.is
		}
	}
	export type Status = apiStatus
	export namespace Status {
		export const asError = apiStatus.asError
		export const is = apiStatus.is
	}
}
export namespace authorization {
	export const cancel = authorizationCancel
	export const capture = authorizationCapture
	export const create = authorizationCreate
	export const refund = authorizationRefund
}
export namespace settlement {
	export const addendSettleAction = settlementAddendSettleAction
	export const convertResponse = settlementConvertResponse
	export const settle = settlementSettle
}
