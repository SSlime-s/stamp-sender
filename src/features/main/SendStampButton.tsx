"use client";

import { AuthImgClient } from "@/components/AuthImg/client";
import { Button } from "@/components/ui/button";
import { LSKeys } from "@/features/localstorage/keys";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import { TRAQ_BASE_URL } from "@/features/traq/consts";
import { deleteMessage } from "@/features/traq/deleteMessage";
import { fileUrl } from "@/features/traq/fileUrl";
import type { Stamp } from "@/features/traq/model";
import { postMessage } from "@/features/traq/postMessage";
import { TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

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
		if (stampId === null || stampId === undefined) {
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
			const { id, createdAt } = await postMessage(token, channelId, message);

			const deleteAction = async () => {
				await deleteMessage(token, id);
				toast.success(`「${message}」を削除しました`);
			};

			toast.success(`「${message}」を送信しました`, {
				description: (
					<Button variant="link" asChild>
						<Link
							href={`${TRAQ_BASE_URL}/messages/${id}`}
						>{`${new Date(createdAt).toLocaleString()}`}</Link>
					</Button>
				),
				action: {
					label: (
						<>
							削除 <TrashIcon />
						</>
					),
					onClick: deleteAction,
				},
			});
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
