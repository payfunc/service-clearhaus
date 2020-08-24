import * as gracely from "gracely"

export type Status =
	| 20000 // Approved
	| 40000 // General input error
	| 40110 // Invalid card number
	| 40111 // Unsupported card scheme
	| 40120 // Invalid CSC
	| 40130 // Invalid expire date
	| 40135 // Card expired
	| 40140 // Invalid currency
	| 40150 // Invalid text on statement
	| 40190 // Invalid transaction
	| 40200 // Clearhaus rule violation
	| 40300 // 3-D Secure problem
	| 40310 // 3-D Secure authentication failure
	| 40400 // Backend problem
	| 40410 // Declined by issuer or card scheme
	| 40411 // Card restricted
	| 40412 // Card lost or stolen
	| 40413 // Insufficient funds
	| 40414 // Suspnumberected fraud
	| 40415 // Amount limit exceeded
	| 40416 // Additional authentication required
	| 40420 // Merchant blocked by cardholder
	| 50000 // Clearhaus error

export namespace Status {
	export function is(value: Status | any): value is Status {
		return (
			typeof value == "number" &&
			(value == 20000 ||
				value == 40000 ||
				value == 40110 ||
				value == 40111 ||
				value == 40120 ||
				value == 40130 ||
				value == 40135 ||
				value == 40140 ||
				value == 40150 ||
				value == 40190 ||
				value == 40200 ||
				value == 40300 ||
				value == 40310 ||
				value == 40400 ||
				value == 40410 ||
				value == 40411 ||
				value == 40412 ||
				value == 40413 ||
				value == 40414 ||
				value == 40415 ||
				value == 40416 ||
				value == 40420 ||
				value == 50000)
		)
	}
	export function asError(status: { code: Status; message?: string }): gracely.Error {
		let result: gracely.Error
		switch (status.code) {
			case 40000:
				result = gracely.client.invalidContent("model.Authorization.Creatable", "General input error.", status.message)
				break
			case 40110:
				result = gracely.client.malformedContent("card.pan", "string", "Invalid card number.", status.message)
				break
			case 40111:
				result = gracely.client.malformedContent("card.pan", "string", "Unsupported card scheme.", status.message)
				break
			case 40120:
				result = gracely.client.malformedContent("card.csc", "string", "Invalid CSC code.", status.message)
				break
			case 40130:
				result = gracely.client.malformedContent(
					"card.expires",
					"[number, number]",
					"Invalid expire date.",
					status.message
				)
				break
			case 40135:
				result = gracely.client.malformedContent("card.pan", "string", "Card expired.", status.message)
				break
			case 40140:
				result = gracely.client.malformedContent("currency", "isoly.Currency", "Invalid currency.", status.message)
				break
			case 40150:
				result = gracely.client.malformedContent("description", "string", "Invalid text on statement.", status.message)
				break
			case 40190:
				result = gracely.client.invalidContent("model.Authorization.Creatable", "Invalid transaction.", status.message)
				break
			case 40200:
				result = gracely.client.invalidContent(
					"model.Authorization.Creatable",
					"Acquirer rule violation.",
					status.message
				)
				break
			case 40300:
				result = gracely.client.malformedContent("card.pares", "string", "3-D Secure problem.", status.message)
				break
			case 40310:
				result = gracely.client.malformedContent(
					"card.pares",
					"string",
					"3-D Secure authentication failure.",
					status.message
				)
				break
			case 40400:
				result = gracely.server.backendFailure("Clearhaus", "Acquirer backend problem.", status.message)
				break
			case 40410:
				result = gracely.client.malformedContent(
					"card.pan",
					"string",
					"Declined by issuer or card scheme.",
					status.message
				)
				break
			case 40411:
				result = gracely.client.malformedContent("card.pan", "string", "Card restricted.", status.message)
				break
			case 40412:
				result = gracely.client.malformedContent("card.pan", "string", "Card lost or stolen.", status.message)
				break
			case 40413:
				result = gracely.client.malformedContent("amount", "number", "Insufficient funds.", status.message)
				break
			case 40414:
				result = gracely.client.malformedContent("card.pan", "string", "Suspected fraud.", status.message)
				break
			case 40415:
				result = gracely.client.malformedContent("amount", "number", "Amount limit exceeded.", status.message)
				break
			case 40416:
				result = gracely.client.malformedContent(
					"card.pares",
					"string",
					"Additional authentication required.",
					status.message
				)
				break
			case 40420:
				result = gracely.client.malformedContent(
					"card.pan",
					"string",
					"Merchant blocked by cardholder.",
					status.message
				)
				break
			case 50000:
				result = gracely.server.backendFailure("Clearhaus", "Unknown acquirer error.", status.message)
				break
			default:
				result = gracely.server.backendFailure(
					"Clearhaus",
					`Unknown acquirer problem with status code ${status.code}`,
					status.message
				)
				break
		}
		return result
	}
}
