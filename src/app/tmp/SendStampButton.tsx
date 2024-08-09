"use client";

import { AuthImgClient } from "@/components/AuthImg/client";
import { Button } from "@/components/ui/button";
import { fileUrl } from "@/features/traq/fileUrl";
import type { Stamp } from "@/features/traq/model";
import { postMessage } from "@/features/traq/postMessage";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import { useCallback, useMemo, useState } from "react";
import { LSKeys } from "@/features/localstorage/keys";

interface Props {
	token: string;
	stamps: Stamp[];
}
export function SendStampButton({ token, stamps }: Props) {
	const [busy, setBusy] = useState(false);
	const [channelId] = useLocalStorage(LSKeys.PostChannel);
	const [stampId] = useLocalStorage(LSKeys.PostStamp);
	const [effect] = useLocalStorage(LSKeys.PostStampEffect);

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
			const message =
				effect !== null ? `:${stamp.name}:${effect}` : `:${stamp.name}:`;
			await postMessage(token, channelId, message);
		} finally {
			setBusy(false);
		}
	}, [busy, channelId, stamp, token, effect]);

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
