"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Channel } from "@/features/traq/model";
import { parseChannels } from "@/features/traq/parseChannels";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";

interface Props {
	channels: Channel[];
}
export function ChannelSelector({ channels }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useLocalStorage("post-channel");

	const { idToChannelMap, channelFullNameMap } = useMemo(() => {
		return parseChannels(channels);
	}, [channels]);

	const handleSelect = useCallback(
		(channelId: string) => {
			if (channelId === value) {
				return;
			}
			if (!channelFullNameMap.has(channelId)) {
				return;
			}

			setValue(channelId);
			setIsOpen(false);
		},
		[value, channelFullNameMap, setValue],
	);

	const idNameTuples = useMemo(() => {
		const tuples = Array.from(channelFullNameMap.entries()).filter(([id]) => {
			return idToChannelMap.get(id)?.archived === false;
		});
		tuples.sort((a, b) => a[1].localeCompare(b[1]));

		return tuples;
	}, [idToChannelMap, channelFullNameMap]);
	const nameToIdMap = useMemo(() => {
		const map = new Map<string, string>();
		for (const [id, name] of idNameTuples) {
			map.set(name, id);
		}
		return map;
	}, [idNameTuples]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
				>
					{value === null
						? "Select channel"
						: `#${channelFullNameMap.get(value) ?? "Unknown channel"}`}
					<CaretSortIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search channel" />
					<CommandList>
						<CommandEmpty>No channels found.</CommandEmpty>
						{idNameTuples.map(([id, fullName]) => (
							<CommandItem
								key={id}
								value={fullName}
								onSelect={(name) => handleSelect(nameToIdMap.get(name) ?? "")}
							>
								#{fullName}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
