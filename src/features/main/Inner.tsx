import { auth } from "@/features/auth";
import { getChannels } from "@/features/traq/getChannels";
import { getStamps } from "@/features/traq/getStamps";
import { ChannelSelector } from "./ChannelSelector";
import { EffectSelector } from "./EffectSelector";
import { SendStampButton } from "./SendStampButton";
import { StampSelector } from "./StampSelector";

export default async function Inner() {
	const session = await auth();

	if (session?.user === undefined) {
		return;
	}
	const token = session.user.accessToken;

	const [channels, stamps] = await Promise.all([
		getChannels(token),
		getStamps(token),
	]);

	return (
		<>
			<div className="grid gap-y-12 grid-flow-row place-items-center">
				<ChannelSelector channels={channels.public} />
				<div className="grid gap-y-4 grid-flow-row place-items-center">
					<SendStampButton
						stamps={stamps}
						channels={channels.public}
						token={token}
					/>
					<StampSelector stamps={stamps} />
				</div>
				<EffectSelector />
			</div>
		</>
	);
}
