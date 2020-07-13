import { Request } from "./Request"
import { Response } from "./Response"
import { Collection } from "../Collection"
import * as authly from "authly"

function connect(configuration: {url: string, key: string }, id: string): Collection<Request, Response> {
	return new Collection(
		configuration.url + "/authorizations/" + id + "/voids",
		configuration.key,
		process.env.clearhausKey,
		process.env.clearhausSigningKey ? authly.Algorithm.RS256(undefined, process.env.clearhausSigningKey) : undefined)
}

export {
	connect,
	Request,
	Response,
}
