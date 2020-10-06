import { MerchantApi } from "../MerchantApi"

export interface Response {
	count?: number
	page?: number
	per_page?: number
	_links?: {
		self?: MerchantApi.Link
		curies?: [MerchantApi.Link]
	}
	_embedded?: {
		"ch:transactions"?: any[]
		"ch:settlements"?: MerchantApi.Settlement[]
	}
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return typeof value == "object"
	}
}
