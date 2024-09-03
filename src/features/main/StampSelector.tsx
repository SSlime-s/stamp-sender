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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";

const HISTORY_MAX = 10;

interface Props {
	token: string;
	stamps: Stamp[];
}
export function StampSelector({ token, stamps }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useLocalStorage(LSKeys.PostStamp);
	const [history, setHistory] = useListLocalStorage(LSKeys.PostStampHistory);

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
		<div className="grid grid-flow-row place-items-center gap-4">
			<Popover open={isOpen} onOpenChange={setIsOpen}>
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

				<PopoverContent>
					<Command>
						<CommandInput placeholder="Search stamp" />
						<CommandList>
							<CommandEmpty>No stamps found.</CommandEmpty>
							{history.length > 0 && (
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
							<CommandGroup heading="Stamps">
								{Array.from(nameToStampMap.entries()).map(([name, stamp]) => (
									<CommandItem
										key={stamp.id}
										value={name}
										onSelect={(_name) => handleSelect(stamp.id)}
									>
										:{stamp.name}:
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
