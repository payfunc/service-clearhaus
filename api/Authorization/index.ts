import * as authly from "authly"
import * as gracely from "gracely"
import { Request as AuthorizationRequest } from "./Request"
import { Response as AuthorizationResponse } from "./Response"
import { post as cardfuncPost } from "../Cardfunc"
import { Configuration } from "../Configuration"

export namespace Authorization {
	export async function post(configuration: Configuration, request: Request, token: authly.Token): Promise<Response | gracely.Error> {
		return cardfuncPost(configuration, `card/${ token }/clearhaus/authorization`, request)
	}
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
