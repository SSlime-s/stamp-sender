"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LSKeys } from "@/features/localstorage/keys";
import { useLocalStorage } from "@/features/localstorage/useLocalStorage";
import { cn } from "@/lib/utils";
import { useCallback, useId } from "react";

interface EffectItem {
	value: string;
	label: string;
}
const EFFECTS = [
	{
		value: "small",
		label: ".small",
	},
	{
		value: "",
		label: "なし",
	},
	{
		value: "large",
		label: ".large",
	},
	{
		value: "ex-large",
		label: ".ex-large",
	},
] as const satisfies EffectItem[];

export function EffectSelector() {
	const [effect, setEffect] = useLocalStorage(LSKeys.PostStampEffect);

	const resolvedEffect = effect ?? "";

	const onChange = useCallback(
		(value: string) => {
			if (value === "") {
				setEffect(null);
				return;
			}

			setEffect(value);
		},
		[setEffect],
	);

	const idPrefix = useId();

	return (
		<RadioGroup
			defaultValue={resolvedEffect}
			onValueChange={onChange}
			className="flex flex-wrap justify-center"
		>
			{EFFECTS.map(({ value, label }) => (
				<div key={value}>
					<RadioGroupItem
						key={value}
						value={value}
						className="sr-only"
						id={`${idPrefix}-${value}`}
					/>
					<Label
						className={cn(
							buttonVariants({
								variant: resolvedEffect === value ? "default" : "outline",
							}),
							"rounded-xl cursor-pointer",
						)}
						htmlFor={`${idPrefix}-${value}`}
					>
						{label}
					</Label>
				</div>
			))}
		</RadioGroup>
	);
}
