import type { Metadata } from "next";
import { nextCosmosPage, nextCosmosStaticParams } from "react-cosmos-next";
// @ts-ignore: cosmos.imports はビルドしないと生成されない
import * as cosmosImports from "../../../../cosmos.imports";

export const metadata: Metadata = {
	title: "React Cosmos - Stamp Sender",
	description: "",
};

export const generateStaticParams = nextCosmosStaticParams(cosmosImports);

export default nextCosmosPage(cosmosImports);
