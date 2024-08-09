"use client";

import useSWR from "swr";
import { blobToURI } from "./blobToURI";
import { Skeleton } from "@/components/ui/skeleton";
import type React from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
	token: string;
	src: string;
	alt: string;
	width?: number;
	height?: number;
}
export function AuthImgClient({ token, src, ...props }: Props) {
	const { data, error } = useSWR(
		src,
		async (src) => {
			const res = await fetch(src, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				throw new Error(`Failed to fetch image: ${res.status}`);
			}

			const blob = await res.blob();
			return blobToURI(blob);
		},
		{
			revalidateOnFocus: false,
		},
	);

	if (error) {
		throw error;
	}

	if (!data) {
		return (
			<Skeleton
				style={
					{
						"--width": `${props.width ?? 128}px`,
						"--height": `${props.height ?? 128}px`,
					} as React.CSSProperties
				}
				className="h-[var(--height)] w-[var(--width)] rounded-2xl"
			/>
		);
	}

	// biome-ignore lint/a11y/useAltText: <explanation>
	return <img src={data} {...props} />;
}
