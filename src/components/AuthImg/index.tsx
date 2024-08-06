import type React from "react";
import { blobToURI } from "./blobToURI";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
	token: string;
	src: string;
	alt: string;
}
export async function AuthImg({ token, src, ...props }: Props) {
	const res = await fetch(src, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch image: ${res.status}`);
	}

	const blob = await res.blob();
	const url = await blobToURI(blob);

	// biome-ignore lint/a11y/useAltText: <explanation>
	return <img src={url} {...props} />;
}
