import * as gracely from "gracely"
import { MerchantApi } from "../MerchantApi"
import { Request as SettleRequest } from "./Request"
import { Response as SettleResponse } from "./Response"
// import { Collection } from "../Collection"
// import * as authly from "authly"
// import { Configuration } from "../Configuration"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface Settle {}

export namespace Settle {
	export async function connect(configuration: MerchantApi.Configuration): Promise<MerchantApi | gracely.Error> {
		const merchantApi = new MerchantApi(configuration)
		const connected = await merchantApi
			.getToken()
			.catch(e => gracely.server.backendFailure("service-clearhaus", "Failed to connect to Clearhaus Merchant api."))
		return gracely.Error.is(connected) ? connected : merchantApi
	}
	export type Request = SettleRequest
	export namespace Request {
		export const is = SettleRequest.is
	}
	export type Response = SettleResponse
	export namespace Response {
		export const is = SettleResponse.is
	}
}
