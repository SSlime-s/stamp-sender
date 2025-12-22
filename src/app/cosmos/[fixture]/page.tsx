import type { Metadata } from "next";
import { nextCosmosPage, nextCosmosStaticParams } from "react-cosmos-next";
// biome-ignore lint/suspicious/noTsIgnore: ビルド前後で生成の有無が変わるので固定でない
// @ts-ignore: cosmos.imports はビルドしないと生成されない
import * as cosmosImports from "../../../../cosmos.imports";

export const metadata: Metadata = {
	title: "React Cosmos - Stamp Sender",
	description: "",
};

export const generateStaticParams = nextCosmosStaticParams(cosmosImports);

export default nextCosmosPage(cosmosImports);
