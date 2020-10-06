import * as isoly from "isoly"
import { MerchantApi } from "./index"

export interface Transaction {
	id: string
	processed_at: isoly.DateTime
	amount: number
	currency: isoly.DateTime
	text_on_statement: string
	reference: string
	recurring?: boolean
	region?: string
	payment_method?: string
	status?: {
		code: number
	}
	card?: {
		bin: string
		country: string
		last4: string
		scheme: string
		type: string
		expire_year: string
		expire_month: string
	}
	settlement?: {
		date: string
		amount_gross: number
		amount_net: number
		fees: number
		currency: isoly.Currency
	}
	fraud?: {
		date: string
		type: string
	}
	_links?: {
		self?: MerchantApi.Link
		"ch:account"?: MerchantApi.Link
		"ch:settlement"?: MerchantApi.Link
		curies?: [MerchantApi.Link]
	}
	_embedded?: {
		trail?: any
		"ch:account"?: any
	}
}

export namespace Transaction {
	export function is(value: any | Transaction): value is Transaction {
		return typeof value == "object" && typeof value.id == "string" && typeof value.reference == "string"
	}
}
