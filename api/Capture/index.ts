import * as authly from "authly"
import { Collection } from "../Collection"
import { Configuration } from "../Configuration"
import { Request as CaptureRequest } from "./Request"
import { Response as CaptureResponse } from "./Response"

export namespace Capture {
	export function connect(configuration: Configuration, authorization: string): Collection<Request, Response> {
		return new Collection(
			`${configuration.url}/authorizations/${authorization}/captures`,
			configuration.key,
			process.env.clearhausKey,
			process.env.clearhausSigningKey ? authly.Algorithm.RS256(undefined, process.env.clearhausSigningKey) : undefined
		)
	}
	export type Request = CaptureRequest
	export namespace Request {
		export const is = CaptureRequest.is
	}
	export type Response = CaptureResponse
	export namespace Response {
		export const is = CaptureResponse.is
	}
}
