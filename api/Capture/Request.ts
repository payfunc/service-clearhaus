export interface Request {
	amount?: number
	text_on_statement?: string
}

export namespace Request {
	export function is(value: any | Request): value is Request {
		return (
			typeof value == "object" &&
			(value.amount == undefined || typeof value.amount == "number") &&
			(value.text_on_statement == undefined || typeof value.text_on_statement == "string")
		)
	}
}
