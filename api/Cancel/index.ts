import * as authly from "authly"
import { Collection } from "../Collection"
import { Configuration } from "../Configuration"
import { Request as CancelRequest } from "./Request"
import { Response as CancelResponse } from "./Response"

export namespace Cancel {
	export function connect(configuration: Configuration, id: string): Collection<Request, Response> {
		return new Collection(
			configuration.url + "/authorizations/" + id + "/voids",
			configuration.key,
			configuration.signer,
			configuration.secret ? authly.Algorithm.RS256(undefined, configuration.secret) : undefined
		)
	}
	export type Request = CancelRequest
	export namespace Request {
		export const is = CancelRequest.is
	}
	export type Response = CancelResponse
	export namespace Response {
		export const is = CancelResponse.is
	}
}
