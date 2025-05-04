import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth, signIn } from "@/features/auth";
import { getChannels } from "@/features/traq/getChannels";
import { getStamps } from "@/features/traq/getStamps";
import { Suspense } from "react";
import { ChannelSelector, ChannelSelectorSkeleton } from "./ChannelSelector";
import { EffectSelector } from "./EffectSelector";
import { SendStampButton } from "./SendStampButton";
import { StampSelector } from "./StampSelector";

export default async function Inner() {
	const session = await auth();

	if (session?.user === undefined) {
		return (
			<div className="grid place-items-center size-full">
				<div className="grid grid-flow-row place-items-center text-slate-600 text-2xl font-bold gap-2">
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
			<div className="grid gap-y-12 grid-flow-row place-items-center">
				<Suspense fallback={<ChannelSelectorSkeleton />}>
					<ChannelSelector channelsPromise={channelsPublicPromise} />
				</Suspense>
				<div className="grid gap-y-4 grid-flow-row place-items-center">
					<Suspense fallback={<div>Loading...</div>}>
						<SendStampButton
							stampsPromise={stampsPromise}
							channelsPromise={channelsPublicPromise}
							token={token}
						/>
					</Suspense>
					<Suspense fallback={<div>Loading...</div>}>
						<StampSelector stampsPromise={stampsPromise} />
					</Suspense>
				</div>
				<EffectSelector />
			</div>
		</TooltipProvider>
	);
}
