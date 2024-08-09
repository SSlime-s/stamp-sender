import * as v from "valibot";
import { TRAQ_API_BASE_URL } from "./consts";
import { StampScheme } from "./model";

export async function getStamps(token: string) {
	const res = await fetch(`${TRAQ_API_BASE_URL}/stamps`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const stamps = await res.json();
	return v.parse(v.array(StampScheme), stamps);
}
