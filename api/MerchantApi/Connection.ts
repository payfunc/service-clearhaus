import * as gracely from "gracely"
import * as isoly from "isoly"
import formUrlEncoded from "form-urlencoded"
import { default as fetch, Response as FetchResponse } from "node-fetch"
import { ApiToken as MerchantApiToken } from "./ApiToken"
import { Configuration as MerchantApiConfiguration } from "./Configuration"

export class Connection {
	private readonly url: string
	private readonly clientId: string
	private readonly clientSecret: string
	private accessToken?: MerchantApiToken
	constructor(configuration: MerchantApiConfiguration) {
		this.url = configuration.url
		this.clientId = configuration.clientId
		this.clientSecret = configuration.clientSecret
		if (configuration.accessToken)
			this.accessToken = configuration.accessToken
	}
	tokenExpired(): boolean {
		return !this.accessToken || (this.accessToken.expires && this.accessToken.expires > isoly.DateTime.now())
			? true
			: false
	}
	async getToken(): Promise<MerchantApiToken | gracely.Error> {
		let result: MerchantApiToken | gracely.Error
		if (this.tokenExpired()) {
			const response = await this.createToken()
			if (gracely.Error.is(response))
				result = response
			else if (
				typeof response == "object" &&
				typeof response.access_token == "string" &&
				typeof response.expires_in == "number"
			) {
				result = this.accessToken = {
					token: response.access_token,
					expires: isoly.DateTime.create(new Date(Date.now() - response.expires_in)),
				}
			} else
				result = gracely.server.backendFailure(
					"Response from createToken not a gracely error or object with access_token and expires_in"
				)
		} else if (this.accessToken)
			result = this.accessToken
		else
			result = gracely.server.backendFailure("Unexpected behaviour: No error or token returned from getToken")
		return result
	}
	async createToken(): Promise<any | gracely.Error> {
		const body = formUrlEncoded({ audience: this.url, grant_type: "client_credentials" })
		const response = await fetch(this.url + "/oauth/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64")}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		})
		return response.ok ? response.json() : this.getError(response)
	}
	async get(
		path: string,
		query: string | undefined,
		page: number | undefined,
		perPage: number | undefined
	): Promise<any | gracely.Error> {
		let result: any | gracely.Error
		const validToken = await this.getToken()
		if (!path.startsWith("/"))
			path = "/" + path
		const queries: string = this.createQueryString(query, page, perPage)
		if (!gracely.Error.is(validToken)) {
			const response = await fetch(this.url + path + queries, {
				method: "GET",
				headers: { Authorization: validToken.token },
			})
			result = response.ok ? response.json() : this.getError(response)
		}
		return result
	}
	createQueryString(query: string | undefined, page: number | undefined, perPage: number | undefined): string {
		return Object.entries({
			query: query,
			page: page?.toString(),
			per_page: perPage?.toString(),
		}).reduce((s, q) => {
			return !q[1] ? s : s + ((s == "" ? "?" : "&") + q[0] + "=" + q[1])
		}, "")
	}
	private async getError(response: FetchResponse): Promise<gracely.Error> {
		return gracely.server.backendFailure({
			status: response.status,
			body: response.headers.get("Content-Type")?.includes("json") ? await response.json() : await response.text(),
		})
	}
}
