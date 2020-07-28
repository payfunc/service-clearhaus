import { default as fetch } from "node-fetch"
import * as gracely from "gracely"
import { Configuration } from "./Configuration"

export async function post<Request, Response>(configuration: Configuration, endpoint: string, request: Request): Promise<Response | gracely.Error> {
	const response = await fetch(configuration.url + "/" + endpoint, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8", "authorization": configuration.key }, body: JSON.stringify(request) }).catch(_ => undefined)
	return !response ? gracely.server.unavailable() : response.ok ? response.json() : gracely.server.backendFailure(response.headers.get("Content-Type")?.startsWith("application/json") ? await response.json() : await response.text())
}
