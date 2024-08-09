import { TRAQ_API_BASE_URL } from "./consts";

export async function deleteMessage(token: string, messageId: string) {
	const res = await fetch(`${TRAQ_API_BASE_URL}/messages/${messageId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to post message: ${res.status}`);
	}
}
