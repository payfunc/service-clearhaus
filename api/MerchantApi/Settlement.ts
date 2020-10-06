import { Link } from "./Link"

export interface Settlement {
	embedded: {
		"ch:account": any
	}
	_links: {
		self?: Link
		"ch:account"?: Link
		"ch:transactions"?: Link
		[property: string]: Link | undefined
	}
	currency: "SEK"
	fees: {
		total: number
		sales?: number
		refunds?: number
		authorisations?: number
		credits?: number
		interchange?: number
		scheme?: number
		minimum_processing?: number
		service?: number
		wire_transfer?: number
		chargebacks?: number
		retrieval_requests?: number
	}
	id: string
	payout?: {
		amount: number
		date: string
		reference_number: string
		descriptor: string
	}
	period?: {
		start_date: string
		end_date: string
	}
	settled?: boolean
	summary?: {
		sales: number
		credits: number
		refunds: number
		chargebacks: number
		fees: number
		other_postings: number
		net: number
	}
}

export namespace Settlement {
	export function is(value: any | Settlement): value is Settlement {
		return typeof value == "object" && typeof value.id == "string"
	}
}
