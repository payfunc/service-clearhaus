// import * as service from "./index"
import { api } from "./index"

describe("service-clearhaus", () => {
	it("test accessibility", () => {
		api.Authorization.Request.is({})
		api.Authorization.Response.is({})
		api.Cancel.Request.is({})
		api.Cancel.Response.is({})
		api.Capture.Request.is({})
		api.Capture.Response.is({})
		api.Refund.Request.is({})
		api.Refund.Response.is({})
	})
})
