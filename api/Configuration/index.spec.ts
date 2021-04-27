import * as model from "@payfunc/model"
import { Configuration } from "./index"

describe("Configuration tests", () => {
	it("Configuration from test", () => {
		const key: model.Key = {
			iss: "http://localhost:7071",
			iat: 1594814869,
			sub: "testtest",
			agent: "testtest",
			type: "test",
			name: "testtest",
			card: {
				id: "test",
				url: "http://localhost:7082",
				descriptor: "test transaction",
				country: "SE",
				acquirer: {
					protocol: "clearhaus",
					key: "abcd-clearhaus-key",
					url: "https://www.clearhaus.url",
					bin: {
						mastercard: "1234",
						visa: "1234",
					},
				},
				mid: "1234",
				mcc: "1234",
				emv3d: [],
			},
			url: "www.example.com",
			aud: "public",
			token: "eyJ.example.signature",
		}
		expect(Configuration.from(key, "psp-key", "xample")).toEqual({
			card: {
				url: "http://localhost:7082",
				key: "eyJ.example.signature",
			},
			clearhaus: {
				url: "https://www.clearhaus.url",
				key: "abcd-clearhaus-key",
				signer: "psp-key",
				secret: "xample",
			},
		})
	})
})
