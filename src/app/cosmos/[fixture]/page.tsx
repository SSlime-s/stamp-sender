import { nextCosmosPage, nextCosmosStaticParams } from "react-cosmos-next";
// @ts-ignore: cosmos.imports はビルドしないと生成されない
import * as cosmosImports from "../../../../cosmos.imports";

export const generateStaticParams = nextCosmosStaticParams(cosmosImports);

export default nextCosmosPage(cosmosImports);
