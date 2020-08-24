import { default as fetch, Response as FetchResponse } from "node-fetch"
import formUrlEncoded from "form-urlencoded"
import * as authly from "authly"
import * as gracely from "gracely"

export class Collection<Request, Response> {
	private readonly headers: { [key: string]: string }
	constructor(
		private readonly url: string,
		key: string,
		private signer?: string,
		private algorithm?: authly.Algorithm
	) {
		this.headers = {
			Authorization: `Basic ${new Buffer(key + ":").toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/vnd.clearhaus-gateway.hal+json; version=0.10.0; charset=utf-8",
		}
	}
	async create(resource: Request): Promise<Response | gracely.Error> {
		const body = formUrlEncoded(resource)
		if (this.signer && this.algorithm) {
			const signature = await this.algorithm.sign(body)
			const hexadecimalSignature = authly.Identifier.toHexadecimal(signature)
			this.headers.Signature = `${this.signer} RS256-hex ${hexadecimalSignature}`
		}
		const response = await fetch(this.url, { method: "POST", headers: this.headers, body })
		return response.ok ? response.json() : this.getError(response)
	}
	async list(): Promise<Response[] | gracely.Error> {
		const response = await fetch(this.url, { method: "GET", headers: this.headers })
		return response.ok ? response.json() : this.getError(response)
	}
	async get(id: string): Promise<Response | gracely.Error> {
		const response = await fetch(this.url + "/" + id, { method: "GET", headers: this.headers })
		return response.ok ? response.json() : this.getError(response)
	}
	private async getError(response: FetchResponse): Promise<gracely.Error> {
		return gracely.server.backendFailure({
			status: response.status,
			body: response.headers.get("Content-Type")?.includes("json") ? await response.json() : await response.text(),
		})
	}
}
