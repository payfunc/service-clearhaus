// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Request {}

export namespace Request {
	export function is(value: any | Request): value is Request {
		return typeof value == "object"
	}
}
