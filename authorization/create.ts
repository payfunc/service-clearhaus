import * as gracely from "gracely"
import * as authly from "authly"
import * as model from "@payfunc/model"
import * as api from "../api"
import * as clearhaus from "../index"

export async function create(
	key: authly.Token,
	merchant: model.Key,
	request: clearhaus.api.Authorization.Request,
	token: authly.Token
): Promise<clearhaus.api.Authorization.Response | gracely.Error> {
	return !merchant.card || merchant.card.acquirer.protocol != "clearhaus"
		? gracely.client.unauthorized()
		: api.Authorization.post({ url: merchant.card.url, key }, request, token)
}
