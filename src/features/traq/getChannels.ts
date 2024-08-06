import * as v from "valibot";
import { ChannelScheme } from "./model";
import { TRAQ_API_BASE_URL } from "./consts";

const ChannelResponseScheme = v.object({
	public: v.array(ChannelScheme),
	dm: v.optional(
		v.array(
			v.object({
				id: v.pipe(v.string(), v.uuid()),
				userId: v.pipe(v.string(), v.uuid()),
			}),
		),
	),
});

export async function getChannels(token: string) {
	const res = await fetch(`${TRAQ_API_BASE_URL}/channels`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch channels: ${res.status}`);
	}

	const channels = await res.json();
	return v.parse(ChannelResponseScheme, channels);
}
