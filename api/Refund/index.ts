import * as authly from "authly"
import { Collection } from "../Collection"
import { Configuration } from "../Configuration"
import { Request as RefundRequest } from "./Request"
import { Response as RefundResponse } from "./Response"

export namespace Refund {
	export function connect(configuration: Configuration.Clearhaus, id: string): Collection<Request, Response> {
		return new Collection(
			configuration.url + "/authorizations/" + id + "/refunds",
			configuration.key,
			configuration.signer,
			configuration.secret ? authly.Algorithm.RS256(undefined, configuration.secret) : undefined
		)
	}
	export type Request = RefundRequest
	export namespace Request {
		export const is = RefundRequest.is
	}
	export type Response = RefundResponse
	export namespace Response {
		export const is = RefundResponse.is
	}
}
