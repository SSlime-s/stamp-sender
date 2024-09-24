"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useFixtureInput } from "react-cosmos/client";
import { sendSuccessToast } from "./toast";

export default function ToastFixture() {
	const [message] = useFixtureInput("message", ":awoo:");
	const [messageId] = useFixtureInput(
		"messageId",
		"0192156f-8e25-74fb-a9a6-211dffe7687d",
	);
	const [createdAt] = useFixtureInput("createdAt", "2022-02-22T22:22:22.222Z");
	const [channelPath] = useFixtureInput("channelPath", "gps/times/SSlime/uu");

	const onDelete = async () => {};

	const send = useCallback(async () => {
		sendSuccessToast({
			message,
			messageId,
			createdAt,
			channelPath,
			onDelete,
		});
	}, [message, messageId, createdAt, channelPath]);

	return (
		<div className="grid place-items-center h-screen">
			<Button onClick={send}>Send toast</Button>
		</div>
	);
}
