"use client";

import { AuthImg } from "@/components/AuthImg";
import { AuthImgClient } from "@/components/AuthImg/client";
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
import { fileUrl } from "@/features/traq/fileUrl";
import type { Channel, Stamp } from "@/features/traq/model";
import { parseChannels } from "@/features/traq/parseChannels";
import { useListLocalStorage } from "@/lib/useListLocalStorage";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";

const HISTORY_MAX = 10;

interface Props {
	stamps: Stamp[];
	token: string;
}
export function StampSelector({ stamps, token }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useLocalStorage("post-stamp");
	const [history, setHistory] = useListLocalStorage("post-stamp-history");

	const idToStampMap = useMemo(() => {
		return new Map(stamps.map((stamp) => [stamp.id, stamp]));
	}, [stamps]);

	const nameToStampMap = useMemo(() => {
		const entries = stamps.map((stamp) => [stamp.name, stamp] as const);
		entries.sort((a, b) => a[0].localeCompare(b[0]));

		return new Map(entries);
	}, [stamps]);

	const handleSelect = useCallback(
		(stampId: string) => {
			if (stampId === value) {
				return;
			}

			setValue(stampId);

			const nextHistory = history.filter((id) => id !== stampId);
			nextHistory.unshift(stampId);
			setHistory(nextHistory.slice(0, HISTORY_MAX));

			setIsOpen(false);
		},
		[value, history, setValue, setHistory],
	);

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
						? "Select stamp"
						: `:${idToStampMap.get(value)?.name ?? ""}:`}
					<CaretSortIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search stamp" />
					<CommandList>
						<CommandEmpty>No channels found.</CommandEmpty>
						{Array.from(nameToStampMap.entries()).map(([name, stamp]) => (
							<CommandItem
								key={stamp.id}
								value={name}
								onSelect={(_name) => handleSelect(stamp.id)}
							>
								{/* <AuthImgClient
									src={fileUrl(stamp.fileId)}
									alt={stamp.name}
									token={token}
									title={stamp.name}
								/> */}
								:{stamp.name}:
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
