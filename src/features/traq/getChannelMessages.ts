import * as v from "valibot";
import { TRAQ_API_BASE_URL } from "./consts";
import { MessageSchema } from "./model";

export async function getChannelMessages(token: string, channelId: string) {
	const res = await fetch(
		`${TRAQ_API_BASE_URL}/channels/${channelId}/messages`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch messages: ${res.status}`);
	}

	const messages = await res.json();
	return v.parse(v.array(MessageSchema), messages);
}
