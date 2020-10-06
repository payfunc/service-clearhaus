import { ApiToken } from "./ApiToken"

export interface Configuration {
	url: string
	clientId: string
	clientSecret: string
	accessToken?: ApiToken
}

export namespace Configuration {
	export function is(value: any | Configuration): value is Configuration {
		return (
			typeof value == "object" &&
			typeof value.clientId == "string" &&
			typeof value.clientSecret == "string" &&
			(value.accessToken == undefined || ApiToken.is(value.accessToken))
		)
	}
}
