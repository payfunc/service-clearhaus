import { api } from "../../index"

describe("Authorization Request.", () => {
	it("simple request", () => {
		expect(api.Authorization.Request.is({
			"amount": 0,
			"currency": "SEK",
			"recurring": true,
		})).toBeTruthy()
	})
})
