import { auth } from "@/features/auth";
import { getChannels } from "@/features/traq/getChannels";
import { parseChannels } from "@/features/traq/parseChannels";
import { ChannelSelector } from "./ChannelSelector";
import { TRAQ_API_BASE_URL } from "@/features/traq/consts";
import { AuthImg } from "@/components/AuthImg";
import { StampSelector } from "./StampSelector";
import { getStamps } from "@/features/traq/getStamps";
import { SendStampButton } from "./SendStampButton";

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

	const channels = await getChannels(token);
	const { channelTree } = parseChannels(channels.public);

	const stamps = await getStamps(token);

	return (
		<>
			<ChannelSelector channels={channels.public} />
			<AuthImg
				src={`${TRAQ_API_BASE_URL}/files/6c11b3c2-52c7-476f-88e6-3136c5700d26`}
				alt="awoo"
				token={token}
				width={32}
				height={32}
			/>
			<StampSelector stamps={stamps} token={token} />
			<SendStampButton stamps={stamps} token={token} />
		</>
	);
}
