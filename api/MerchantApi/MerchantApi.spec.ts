import * as dotenv from "dotenv"
dotenv.config()
import * as gracely from "gracely"
import { Connection as MerchantApiConnection } from "./Connection"

describe.skip("MerchantApi tests", () => {
	let merchantApi: MerchantApiConnection
	it("getToken() twice and check that is it the same", async () => {
		if (process.env.merchantApiUrl && process.env.merchantApiClientId && process.env.merchantApiClientSecret) {
			merchantApi = new MerchantApiConnection({
				url: process.env.merchantApiUrl,
				clientId: process.env.merchantApiClientId,
				clientSecret: process.env.merchantApiClientSecret,
			})
			const token1 = await merchantApi.getToken()
			expect(gracely.Error.is(token1)).toBeFalsy()
			const token2 = await merchantApi.getToken()
			expect(!gracely.Error.is(token1) && token1.token).toEqual(!gracely.Error.is(token2) && token2.token)
		} else
			fail()
	})
	it("get()", async () => {
		expect(
			gracely.Error.is(
				await merchantApi.get(
					"settlements",
					"period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567",
					1,
					2
				)
			)
		).toBeFalsy()
		expect(
			gracely.Error.is(
				await merchantApi.get(
					"settlements",
					"period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567",
					1,
					undefined
				)
			)
		).toBeFalsy()
		expect(
			gracely.Error.is(
				await merchantApi.get(
					"settlements",
					"period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567",
					undefined,
					undefined
				)
			)
		).toBeFalsy()
		expect(gracely.Error.is(await merchantApi.get("settlements", undefined, undefined, undefined))).toBeFalsy()
	})
	it("createQueryString()", async () => {
		expect(merchantApi.createQueryString("", 1, 2)).toEqual("?page=1&per_page=2")
		expect(merchantApi.createQueryString("", undefined, 2)).toEqual("?per_page=2")
		expect(merchantApi.createQueryString("", 1, undefined)).toEqual("?page=1")
		expect(merchantApi.createQueryString(undefined, undefined, undefined)).toEqual("")
		expect(
			merchantApi.createQueryString("period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567", 1, 2)
		).toEqual("?query=period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567&page=1&per_page=2")
		expect(
			merchantApi.createQueryString("period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567", 1, undefined)
		).toEqual("?query=period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567&page=1")
		expect(
			merchantApi.createQueryString(
				"period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567",
				undefined,
				undefined
			)
		).toEqual("?query=period.start_date:2020-03-26 period.end_date:2020-03-29 mid:1234567")
	})
})
