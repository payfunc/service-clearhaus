import { Status } from "../Status"

export interface Response {
	id: string
	status: { code: Status }
	amount: number
	processed_at: string
	text_on_statement?: string
}

export namespace Response {
	export function is(value: any | Response): value is Response {
		return (
			typeof value == "object" &&
			typeof value.id == "string" &&
			typeof value.status == "object" &&
			Status.is(value.status.code) &&
			typeof value.amount == "number" &&
			typeof value.processed_at == "string" &&
			typeof value.text_on_statement == "string"
		)
	}
}
