import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth, signIn } from "@/features/auth";
import { getChannels } from "@/features/traq/getChannels";
import { getStamps } from "@/features/traq/getStamps";
import { ChannelSelector, ChannelSelectorSkeleton } from "./ChannelSelector";
import { EffectSelector } from "./EffectSelector";
import { SendStampButton, SendStampButtonSkeleton } from "./SendStampButton";
import { StampSelector, StampSelectorSkeleton } from "./StampSelector";

export default async function Inner() {
	const session = await auth();

	if (session?.user === undefined) {
		return (
			<div className="grid size-full place-items-center">
				<div className="grid grid-flow-row place-items-center gap-2 font-bold text-2xl text-slate-600">
					<p>Please Sign In</p>
					<form
						action={async () => {
							"use server";

							await signIn("traq");
						}}
					>
						<Button type="submit">Sign in</Button>
					</form>
				</div>
			</div>
		);
	}
	const token = session.user.accessToken;

	const channelsPromise = getChannels(token);
	const channelsPublicPromise = channelsPromise.then(
		(channels) => channels.public,
	);

	const stampsPromise = getStamps(token);

	return (
		<TooltipProvider>
			<div className="grid grid-flow-row place-items-center gap-y-12">
				<Suspense fallback={<ChannelSelectorSkeleton />}>
					<ChannelSelector channelsPromise={channelsPublicPromise} />
				</Suspense>
				<div className="grid grid-flow-row place-items-center gap-y-4">
					<Suspense fallback={<SendStampButtonSkeleton />}>
						<SendStampButton
							stampsPromise={stampsPromise}
							channelsPromise={channelsPublicPromise}
							token={token}
						/>
					</Suspense>
					<Suspense fallback={<StampSelectorSkeleton />}>
						<StampSelector stampsPromise={stampsPromise} />
					</Suspense>
				</div>
				<EffectSelector />
			</div>
		</TooltipProvider>
	);
}
