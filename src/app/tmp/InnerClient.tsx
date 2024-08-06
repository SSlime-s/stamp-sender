"use client";

import type { Channel } from "@/features/traq/model";
import { ChannelSelector } from "./ChannelSelector";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface Props {
	channels: Channel[];
}
export function InnerClient({ channels }: Props) {
	const [value, setValue] = useLocalStorage("post-channel");

	return (
		<ChannelSelector channels={channels} value={value} onChange={setValue} />
	);
}
