import * as gracely from "gracely"
import * as authly from "authly"
import * as model from "@payfunc/model-card"
import { post as cardfuncPost } from "../Cardfunc"
import { Configuration } from "../Configuration"
import { Request as AuthorizationRequest } from "./Request"
import { Response as AuthorizationResponse } from "./Response"

export namespace Authorization {
	export async function post(
		configuration: Configuration,
		request: Request,
		token: authly.Token
	): Promise<Response | gracely.Error> {
		const endpointPath = model.Card.Token.verify(token)
			? `card/clearhaus/${token}/authorization`
			: `card/${token}/clearhaus/authorization`
		return cardfuncPost(configuration, endpointPath, request)
	}
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
