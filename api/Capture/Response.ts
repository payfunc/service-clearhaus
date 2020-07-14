import { Status } from "../Status"

export interface Response {
	id: string
	status: { code: Status }
	amount: number
	processed_at: string
}
