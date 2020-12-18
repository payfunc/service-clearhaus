import * as api from "./api"
import * as service from "./index"

describe("service-clearhaus", () => {
	it("test accessibility", () => {
		// const onlyInternal = service.api.Authorization.post <- error if uncommented, as it should be
		service.api.Authorization.Request.is({})
		service.api.Authorization.Response.is({})
		service.api.Cancel.Request.is({})
		service.api.Cancel.Response.is({})
		service.api.Card.Request.is({})
		service.api.Card.Response.is({})
		service.api.Capture.Request.is({})
		service.api.Capture.Response.is({})
		service.api.Refund.Request.is({})
		service.api.Refund.Response.is({})
		expect(service.api.Method.is("card")).toBeTruthy()
		service.api.Status.is({})
		expect(service.api.Status.asError({ code: 40110 }).status).toEqual(400)
		const authorizationFunctions = [
			service.authorization.cancel,
			service.authorization.capture,
			service.authorization.refund,
		]
	})
	it("test internal accessibility", () => {
		api.Authorization.Request.is({})
		api.Authorization.Response.is({})
		api.Cancel.Request.is({})
		api.Cancel.Response.is({})
		api.Card.Request.is({})
		api.Card.Response.is({})
		api.Capture.Request.is({})
		api.Capture.Response.is({})
		api.Refund.Request.is({})
		api.Refund.Response.is({})
		expect(api.Method.is("card")).toBeTruthy()
		api.Status.is({})
		expect(api.Status.asError({ code: 40110 }).status).toEqual(400)
	})
})
