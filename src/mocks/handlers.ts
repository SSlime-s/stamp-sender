import { TRAQ_API_BASE_URL } from "@/features/traq/consts";
import type { Message } from "@/features/traq/model";
import { http, HttpResponse } from "msw";

export const handlers = [
	http.post(
		`${TRAQ_API_BASE_URL}/channels/:channelId/messages`,
		async ({ request, params }) => {
			const { channelId } = params;
			const body = await request.json();

			console.log(`POST /channels/${channelId}/messages`, body);

			return HttpResponse.json({
				id: "00000000-0000-0000-0000-000000000000",
				userId: "00000000-0000-0000-0000-000000000000",
				channelId: channelId as string,
				content: (body as Record<string, string>).content ?? "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				pinned: false,
				stamps: [],
				threadId: null,
			} satisfies Message);
		},
	),
	http.delete(
		`${TRAQ_API_BASE_URL}/messages/:messageId`,
		async ({ params }) => {
			const { messageId } = params;

			console.log(`DELETE /messages/${messageId}`);

			return HttpResponse.text();
		},
	),

	http.post("https://tmp.net", async ({ request }) => {
		const body = await request.json();

		console.log("POST https://tmp.net", body);

		return HttpResponse.json({
			message: "success",
		});
	}),
];
