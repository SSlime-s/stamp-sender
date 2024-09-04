"use client";

import { AuthImgClient } from "@/components/AuthImg/client";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { LSKeys } from "@/features/localstorage/keys";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import { TRAQ_BASE_URL } from "@/features/traq/consts";
import { deleteMessage } from "@/features/traq/deleteMessage";
import { fileUrl } from "@/features/traq/fileUrl";
import type { Channel, Stamp } from "@/features/traq/model";
import { postMessage } from "@/features/traq/postMessage";
import { FileIcon, PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { parseChannels } from "../traq/parseChannels";

interface Props {
	token: string;
	stamps: Stamp[];
	channels: Channel[];
}
export function SendStampButton({ token, stamps, channels }: Props) {
	const [busy, setBusy] = useState(false);
	const [channelId] = useLocalStorage(LSKeys.PostChannel);
	const [stampId] = useLocalStorage(LSKeys.PostStamp);
	const [effect] = useLocalStorage(LSKeys.PostStampEffect);

	const { idToChannelMap } = useMemo(() => {
		return parseChannels(channels);
	}, [channels]);

	const idToStampMap = useMemo(() => {
		return new Map(stamps.map((stamp) => [stamp.id, stamp]));
	}, [stamps]);
	const stamp = useMemo(() => {
		if (stampId === null || stampId === undefined) {
			return undefined;
		}

		return idToStampMap.get(stampId) ?? undefined;
	}, [idToStampMap, stampId]);

	const isNotifyAll = useMemo(() => {
		if (channelId === null || channelId === undefined) {
			return false;
		}

		const channel = idToChannelMap.get(channelId);
		return channel?.force ?? false;
	}, [channelId, idToChannelMap]);

	const send = useCallback(async () => {
		if (busy || !channelId || !stamp || isNotifyAll) {
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
	}, [isNotifyAll, busy, channelId, stamp, token, effect]);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					onClick={send}
					disabled={busy || isNotifyAll}
					variant="outline"
					className="w-auto h-auto rounded-full px-12 py-8 grid grid-flow-row gap-2 place-items-center aspect-square disabled:pointer-events-auto disabled:hover:bg-background"
				>
					{stampId === null ? (
						<FileIcon height={128} width={128} className="text-slate-300" />
					) : (
						<AuthImgClient
							token={token}
							src={fileUrl(stamp?.fileId ?? "")}
							alt={`:${stamp?.name ?? "Unknown stamp"}`}
							width={128}
							height={128}
						/>
					)}

					<span className="text-slate-400 grid grid-cols-[max-content_max-content] items-center gap-1">
						{stampId === null ? (
							<>未選択</>
						) : (
							<>
								送信
								<PaperPlaneIcon />
							</>
						)}
					</span>
				</Button>
			</TooltipTrigger>

			{isNotifyAll && (
				<TooltipContent className="rounded-lg">
					<p>全体通知チャンネルには送信できません</p>
				</TooltipContent>
			)}
		</Tooltip>
	);
}
