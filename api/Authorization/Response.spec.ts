import * as gracely from "gracely"
import { Request } from "./Request"
import { Response } from "./Response"
import * as model from "@payfunc/model"

jest.setTimeout(10000)
describe("test from()", () => {
	it("test from()", async () => {
		const request: Request = {
			"amount": 123,
			"currency": "SEK",
			"recurring": false
		}
		const response: Response = {
			"id": "123456-1234-1234-1234-123412341234",
			"status": {
				"code": 20000
			},
			"processed_at": "2020-07-23T14:19:06+00:00",
			"amount": 123,
			"currency": "SEK",
			"text_on_statement": "certitrade-1",
			"recurring": false,
			"threed_secure": false,
			"3dsecure": {},
			"csc": {
				"present": true,
				"matches": true
			},
			"_links": {
				"captures": {
					"href": "/authorizations/123456-1234-1234-1234-123412341234/captures"
				},
				"voids": {
					"href": "/authorizations/123456-1234-1234-1234-123412341234/voids"
				},
				"refunds": {
					"href": "/authorizations/123456-1234-1234-1234-123412341234/refunds"
				}
			}
		}
		const output: model.Payment.Card | gracely.Error = await Response.from(request, response, "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJkZnVuYyIsImlhdCI6MTU5NTU4OTQzNDc3MSwiYXVkIjoiZGV2ZWxvcG1lbnQiLCJzY2hlbWUiOiJ2aXNhIiwiaWluIjoiNDIwMDAwIiwibGFzdDQiOiIwMDAwIiwiZXhwaXJlcyI6WzEyLDg4XSwidHlwZSI6InNpbmdsZSB1c2UiLCJjYXJkIjoiQ0dwb2JXb2wifQ.pefNiYbV1pvABra9RfnLdI2Js9GgewpkR8aWpmY16LiHjCjZhVCAObY3KVGF1ygrh8fD_qaQgm1-FNNC2cdvHApfne1hdP8dTNhQoKnM9g5IGPC1sNb2wNK8Gpqst0qby9-kXL2ZaxqOY6LT_ljTnFvEvh9f1zHMFBw83PLgihgMi9SLtalhzfGgfKbwMn9UOzncJezVynbXOBUAk_TNk5PHlHagzJupXMsw2wurNC7w8jki1HIHQZid0NbqRR5XXzWAtTOBDOAuCF5QFLzTg4p00m-SOFnEu4QSYU6irv9vxprQu8wo_kkUPA62VX0nk_E99zxv34n3EjN0pFj6Mg")
		expect(model.Payment.Card.is(output)).toBeTruthy()
		const exampleOutput: model.Payment.Card = {
			amount: 1.23,
			card: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJkZnVuYyIsImlhdCI6MTU5NTU4OTQzNDc3MSwiYXVkIjoiZGV2ZWxvcG1lbnQiLCJzY2hlbWUiOiJ2aXNhIiwiaWluIjoiNDIwMDAwIiwibGFzdDQiOiIwMDAwIiwiZXhwaXJlcyI6WzEyLDg4XSwidHlwZSI6InNpbmdsZSB1c2UiLCJjYXJkIjoiQ0dwb2JXb2wifQ.pefNiYbV1pvABra9RfnLdI2Js9GgewpkR8aWpmY16LiHjCjZhVCAObY3KVGF1ygrh8fD_qaQgm1-FNNC2cdvHApfne1hdP8dTNhQoKnM9g5IGPC1sNb2wNK8Gpqst0qby9-kXL2ZaxqOY6LT_ljTnFvEvh9f1zHMFBw83PLgihgMi9SLtalhzfGgfKbwMn9UOzncJezVynbXOBUAk_TNk5PHlHagzJupXMsw2wurNC7w8jki1HIHQZid0NbqRR5XXzWAtTOBDOAuCF5QFLzTg4p00m-SOFnEu4QSYU6irv9vxprQu8wo_kkUPA62VX0nk_E99zxv34n3EjN0pFj6Mg",
			created: "2020-07-23T14:19:06+00:00",
			currency: "SEK",
			expires: [12, 88],
			iin: "420000",
			last4: "0000",
			reference: "123456-1234-1234-1234-123412341234",
			scheme: "visa",
			service: "clearhaus",
			status: "created",
			type: "card",
		}
		expect(model.Payment.Card.is(exampleOutput)).toBeTruthy()
	})
})
