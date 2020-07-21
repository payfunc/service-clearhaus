import { Request as AuthorizationRequest } from "./Request"
import { Response as AuthorizationResponse } from "./Response"

// tslint:disable-next-line: no-empty-interface
// export interface Authorization {
// }

export namespace Authorization {
	export type Request = AuthorizationRequest
	export namespace Request {
		export const is = AuthorizationRequest.is
	}
	export type Response = AuthorizationResponse
	export namespace Response {
		export const is = AuthorizationResponse.is
	}
}
