import { cancel as authorizationCancel } from "./cancel"
import { capture as authorizationCapture } from "./capture"
import { create as authorizationCreate } from "./create"
import { refund as authorizationRefund } from "./refund"

export namespace authorization {
	export const cancel = authorizationCancel
	export const capture = authorizationCapture
	export const create = authorizationCreate
	export const refund = authorizationRefund
}
