import { Request as CancelRequest } from "./Request"
import { Response as CancelResponse } from "./Response"
import { Collection } from "../Collection"
import * as authly from "authly"

export namespace Cancel {
	export function connect(configuration: {url: string, key: string }, id: string): Collection<Request, Response> {
		return new Collection(
			configuration.url + "/authorizations/" + id + "/voids",
			configuration.key,
			process.env.clearhausKey,
			process.env.clearhausSigningKey ? authly.Algorithm.RS256(undefined, process.env.clearhausSigningKey) : undefined)
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
