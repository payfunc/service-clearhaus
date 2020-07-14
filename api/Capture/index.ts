import * as authly from "authly"
import { Collection } from "../Collection"
import { Request } from "./Request"
import { Response } from "./Response"

function connect(configuration: { url: string, key: string }, authorization: string): Collection<Request, Response> {
	return new Collection(
		`${ configuration.url }/authorizations/${ authorization }/captures`,
		configuration.key,
		process.env.clearhausKey,
		process.env.clearhausSigningKey ? authly.Algorithm.RS256(undefined, process.env.clearhausSigningKey) : undefined)
}

export {
	connect,
	Request,
	Response,
}
