"use client";

import useSWR from "swr";
import { blobToURI } from "./blobToURI";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  token: string;
  src: string;
  alt: string;
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
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  // biome-ignore lint/a11y/useAltText: <explanation>
  return <img src={data} {...props} />;
}
