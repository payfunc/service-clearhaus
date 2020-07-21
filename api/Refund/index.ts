import { Request as RefundRequest } from "./Request"
import { Response as RefundResponse } from "./Response"
import { Collection } from "../Collection"
import * as authly from "authly"

export namespace Refund {
	export function connect(configuration: {url: string, key: string }, id: string): Collection<Request, Response> {
		return new Collection(
			configuration.url + "/authorizations/" + id + "/refunds",
			configuration.key,
			process.env.clearhausKey,
			process.env.clearhausSigningKey ? authly.Algorithm.RS256(undefined, process.env.clearhausSigningKey) : undefined)
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
