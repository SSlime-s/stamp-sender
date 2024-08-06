import { auth } from "@/features/auth";
import { getChannels } from "@/features/traq/getChannels";
import { parseChannels } from "@/features/traq/parseChannels";
import { ChannelSelector } from "./ChannelSelector";

export default async function Inner() {
	const session = await auth();

	if (session?.user === undefined) {
		return;
	}
	const token = session.user.accessToken;

	const response = await fetch("https://q.trap.jp/api/v3/users/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const userDetails = await response.json();

	const channels = await getChannels(session?.user.accessToken);
	const { channelTree } = parseChannels(channels.public);

	return (
		<>
			<ChannelSelector channels={channels.public} />
		</>
	);
}
