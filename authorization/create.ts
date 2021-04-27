import * as gracely from "gracely"
import * as authly from "authly"
import * as api from "../api"
import { Configuration } from "../api/Configuration"
import * as clearhaus from "../index"

export async function create(
	configuration: Configuration.Card,
	request: clearhaus.api.Authorization.Request,
	token: authly.Token
): Promise<clearhaus.api.Authorization.Response | gracely.Error> {
	return api.Authorization.post(configuration, request, token)
}
