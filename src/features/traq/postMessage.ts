import * as v from "valibot";
import { TRAQ_API_BASE_URL } from "./consts";
import { MessageSchema } from "./model";

export async function postMessage(
	token: string,
	channelId: string,
	content: string,
) {
	const res = await fetch(
		`${TRAQ_API_BASE_URL}/channels/${channelId}/messages`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content, embed: false }),
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to post message: ${res.status}`);
	}

	const message = await res.json();
	return v.parse(MessageSchema, message);
}
