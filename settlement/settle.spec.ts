import * as dotenv from "dotenv"
dotenv.config()
import * as isoly from "isoly"
import * as service from "./index"

describe("settle test", () => {
	it("settle test", async () => {
		let configuration
		if (process.env.merchantApiUrl && process.env.merchantApiClientId && process.env.merchantApiClientSecret) {
			configuration = {
				url: process.env.merchantApiUrl,
				clientId: process.env.merchantApiClientId,
				clientSecret: process.env.merchantApiClientSecret,
			}
			const output = await service.settle(
				[
					{
						id: "abcdefgh",
						name: "Merchant A",
						reference: "9876543",
					},
					{
						id: "hgfedcba",
						name: "Merchant B",
						reference: "1234567",
					},
				],
				configuration,
				isoly.DateTime.create(
					new Date(isoly.DateTime.parse(isoly.DateTime.now()).valueOf() - 1000 * 60 * 60 * 24 * 120)
				),
				isoly.DateTime.now()
			)
			expect(output).toBeTruthy()
		}
	})
})
