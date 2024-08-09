import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/features/layout/Header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "awoo sender",
	description: "特定のチャンネルにスタンプだけを送るためのクライアント",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={cn(inter.className, "grid grid-rows-[max-content 1fr]")}>
				<Header />
				{children}
			</body>
		</html>
	);
}
