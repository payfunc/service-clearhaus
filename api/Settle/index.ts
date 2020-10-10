import * as gracely from "gracely"
import * as service from "../../index"
import { Connection } from "../MerchantApi/Connection"
import { Request as SettleRequest } from "./Request"
import { Response as SettleResponse } from "./Response"

export namespace Settle {
	export async function connect(
		configuration: service.api.MerchantApi.Configuration
	): Promise<Connection | gracely.Error> {
		const merchantApi = new Connection(configuration)
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
