export type Method = "card" | "applepay" | "mobilepayonline"

export namespace Method {
	export function is(value: any | Method): value is Method {
		return value == "card" || value == "applepay" || value == "mobilepayonline"
	}
}
