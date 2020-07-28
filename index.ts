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
import { Method as apiMethod } from "./api/Method"
import { Status as apiStatus } from "./api/Status"
import { cancel as authorizationCancel } from "./authorization/cancel"
import { capture as authorizationCapture } from "./authorization/capture"
import { create as authorizationCreate } from "./authorization/create" 
import { refund as authorizationRefund } from "./authorization/refund"

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
			export const isError = AuthorizationResponse.isError
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
	export type Method = apiMethod
	export namespace Method {
		export const is = apiMethod.is
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
