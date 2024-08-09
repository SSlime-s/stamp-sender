"use client";

import { AuthImgClient } from "@/components/AuthImg/client";
import { Button } from "@/components/ui/button";
import { fileUrl } from "@/features/traq/fileUrl";
import type { Stamp } from "@/features/traq/model";
import { postMessage } from "@/features/traq/postMessage";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useCallback, useMemo, useState } from "react";

interface Props {
	token: string;
	stamps: Stamp[];
}
export function SendStampButton({ token, stamps }: Props) {
	const [busy, setBusy] = useState(false);
	const [channelId] = useLocalStorage("post-channel");
	const [stampId] = useLocalStorage("post-stamp");

	const idToStampMap = useMemo(() => {
		return new Map(stamps.map((stamp) => [stamp.id, stamp]));
	}, [stamps]);
	const stamp = useMemo(() => {
		if (stampId === null) {
			return undefined;
		}

		return idToStampMap.get(stampId) ?? undefined;
	}, [idToStampMap, stampId]);

	const send = useCallback(async () => {
		if (busy || !channelId || !stamp) {
			return;
		}

		setBusy(true);

		try {
			await postMessage(token, channelId, `:${stamp.name}:`);
		} finally {
			setBusy(false);
		}
	}, [busy, channelId, stamp, token]);

	return (
		<Button
			onClick={send}
			disabled={busy}
			variant="outline"
			className="h-auto rounded-full p-12"
		>
			<AuthImgClient
				token={token}
				src={fileUrl(stamp?.fileId ?? "")}
				alt="送信"
				width={128}
				height={128}
			/>
		</Button>
	);
}
