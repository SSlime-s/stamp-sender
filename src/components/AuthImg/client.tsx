"use client";

import type React from "react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { blobToURI } from "./blobToURI";

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

			if (res.status === 404) {
				return null;
			}

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
		return <AuthImgSkeleton />;
	}

	// biome-ignore lint/a11y/useAltText: alt は props に含まれている
	// biome-ignore lint/performance/noImgElement: 外部から取ってくるので img のままでいい
	return <img src={data} {...props} />;
}

export function AuthImgSkeleton() {
	return (
		<Skeleton
			style={
				{
					"--width": "128px",
					"--height": "128px",
				} as React.CSSProperties
			}
			className="h-[var(--height)] w-[var(--width)] rounded-2xl"
		/>
	);
}
