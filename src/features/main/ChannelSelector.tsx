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
import { Skeleton } from "@/components/ui/skeleton";
import { LSKeys } from "@/features/localstorage/keys";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import type { Channel } from "@/features/traq/model";
import { parseChannels } from "@/features/traq/parseChannels";
import { useTriggerRender } from "@/lib/useTriggerRender";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import { useFilter } from "./useFIlter";

function idNameTupleToFullName([_id, fullName]: [string, string]) {
	return fullName;
}

interface Props {
	channels: Channel[];
}
export function ChannelSelector({ channels }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useLocalStorage(LSKeys.PostChannel);

	const triggerRender = useTriggerRender();

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

		return tuples;
	}, [idToChannelMap, channelFullNameMap]);
	const nameToIdMap = useMemo(() => {
		const map = new Map<string, string>();
		for (const [id, name] of idNameTuples) {
			map.set(name, id);
		}
		return map;
	}, [idNameTuples]);

	const {
		filter,
		filteredItems: filteredIdNameTuples,
		setFilter,
	} = useFilter(idNameTuples, idNameTupleToFullName);

	const parentRef = useRef<HTMLDivElement>(null);
	const virtualizer = useVirtualizer({
		count: filteredIdNameTuples.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 32,
		overscan: 5,
	});

	const onOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			setFilter("");
		},
		[setFilter],
	);

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
				>
					{value === undefined ? (
						<Skeleton className="h-4 w-32" />
					) : value === null ? (
						"Select channel"
					) : (
						`#${channelFullNameMap.get(value) ?? "Unknown channel"}`
					)}
					<CaretSortIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent onAnimationStart={triggerRender}>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search channel"
						value={filter}
						onValueChange={setFilter}
					/>
					<CommandList ref={parentRef}>
						<CommandEmpty>No channels found.</CommandEmpty>
						{filteredIdNameTuples.length > 0 && (
							<div
								style={
									{
										"--height": `${virtualizer.getTotalSize()}px`,
									} as React.CSSProperties
								}
								className="h-[var(--height)] relative"
							>
								{virtualizer.getVirtualItems().map((virtualItem) => (
									<CommandItem
										key={filteredIdNameTuples[virtualItem.index][0]}
										value={filteredIdNameTuples[virtualItem.index][1]}
										onSelect={(name) =>
											handleSelect(nameToIdMap.get(name) ?? "")
										}
										style={
											{
												"--top": `${virtualItem.start}px`,
												"--height": `${virtualItem.size}px`,
											} as React.CSSProperties
										}
										className="absolute top-0 left-0 w-full h-[var(--height)] translate-y-[var(--top)]"
									>
										#{filteredIdNameTuples[virtualItem.index][1]}
									</CommandItem>
								))}
							</div>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
