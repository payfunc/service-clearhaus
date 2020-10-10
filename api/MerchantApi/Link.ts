export interface Link {
	href: string
	templated?: boolean
	name?: string
}

export namespace Link {
	export function is(value: any | Link): value is Link {
		return (
			typeof value == "object" &&
			typeof value.href == "string" &&
			(value.templated == undefined || typeof value.templated == "boolean") &&
			(value.name == undefined || typeof value.name == "string")
		)
	}
}
