import * as dotenv from "dotenv"
dotenv.config()
import { Merchant } from "@cardfunc/model"
import * as service from "./index"

describe("settle test", async () => {
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
						card: {
							mid: "2015885",
						},
					} as Merchant.Key,
					{
						card: {
							mid: "2016160",
						},
					} as Merchant.Key,
				],
				configuration
			)
			expect(output).toBeTruthy()
		}
	})
})
