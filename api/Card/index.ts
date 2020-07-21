import { Request as CardRequest } from "./Request"
import { Response as CardResponse } from "./Response"

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
