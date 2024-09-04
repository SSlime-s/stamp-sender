"use client";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { LSKeys } from "@/features/localstorage/keys";
import { useListLocalStorage } from "@/features/localstorage/useListLocalStorage";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import type { Stamp } from "@/features/traq/model";
import { useTriggerRender } from "@/lib/useTriggerRender";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import { useFilter } from "./useFIlter";

const HISTORY_MAX = 10;

function stampToName(stamp: Stamp) {
	return stamp.name;
}

interface Props {
	token: string;
	stamps: Stamp[];
}
export function StampSelector({ token, stamps }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useLocalStorage(LSKeys.PostStamp);
	const [history, setHistory] = useListLocalStorage(LSKeys.PostStampHistory);

	const triggerRender = useTriggerRender();

	const idToStampMap = useMemo(() => {
		return new Map(stamps.map((stamp) => [stamp.id, stamp]));
	}, [stamps]);

	const {
		filter,
		filteredItems: filteredStamps,
		setFilter,
	} = useFilter(stamps, stampToName);

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

	const parentRef = useRef<HTMLDivElement>(null);
	const virtualizer = useVirtualizer({
		count: filteredStamps.length,
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
		<div className="grid grid-flow-row place-items-center gap-4">
			<Popover open={isOpen} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={isOpen}
						aria-haspopup="listbox"
					>
						{value === undefined ? (
							<Skeleton className="h-4 w-16" />
						) : value === null ? (
							"Select stamp"
						) : (
							`:${idToStampMap.get(value)?.name ?? ""}:`
						)}
						<CaretSortIcon />
					</Button>
				</PopoverTrigger>

				<PopoverContent onAnimationStart={triggerRender}>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search stamp"
							value={filter}
							onValueChange={setFilter}
						/>
						<CommandList ref={parentRef}>
							<CommandEmpty>No stamps found.</CommandEmpty>
							{history.length > 0 && filter.length === 0 && (
								<>
									<CommandGroup heading="History">
										{history.map((stampId) => (
											<CommandItem
												key={stampId}
												value={idToStampMap.get(stampId)?.name ?? ""}
												onSelect={handleSelect}
											>
												:{idToStampMap.get(stampId)?.name ?? ""}:
											</CommandItem>
										))}
									</CommandGroup>
									<CommandSeparator />
								</>
							)}
							{filteredStamps.length > 0 && (
								<CommandGroup heading="Stamps">
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
												key={filteredStamps[virtualItem.index].id}
												value={filteredStamps[virtualItem.index].name}
												onSelect={(_name) =>
													handleSelect(filteredStamps[virtualItem.index].id)
												}
												style={
													{
														"--top": `${virtualItem.start}px`,
														"--height": `${virtualItem.size}px`,
													} as React.CSSProperties
												}
												className="absolute top-0 left-0 w-full h-[var(--height)] translate-y-[var(--top)]"
											>
												:{filteredStamps[virtualItem.index].name}:
											</CommandItem>
										))}
									</div>
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
