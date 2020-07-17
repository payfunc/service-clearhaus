import { Request } from "./Request"
import { Response } from "./Response"
import { Collection } from "../Collection"
import * as authly from "authly"

function connect(configuration: { url: string, key: string }): Collection<Request, Response> {
	const key = process.env[configuration.url.includes("test") ? "clearhausTestKey" : "clearhausLiveKey"]
	const signingKey = process.env[configuration.url.includes("test") ? "clearhausTestSigningKey" : "clearhausLiveSigningKey"]
	return new Collection(
		configuration.url + "/authorizations",
		configuration.key,
		key,
		signingKey ? authly.Algorithm.RS256(undefined, signingKey) : undefined)
}

export {
	Request,
	Response,
	connect,
}
