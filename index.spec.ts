import * as service from "./index"

describe("service-clearhaus", () => {
	it("test accessibility", () => {
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
		const authorizationFunctions = [service.authorization.cancel, service.authorization.capture, service.authorization.refund]
	})
})
