/**
 * Remove absolute paths in source maps
 * They are included when target option of tsup is es5
 */
import fs from "node:fs/promises";
import tsupConfig from "../tsup.config.mjs";

if (!Array.isArray(tsupConfig)) process.exit(0);
for (const outDir of new Set(
  tsupConfig.map(({ outDir }) => outDir ?? "dist"),
)) {
  for await (const mapPath of fs.glob(`${outDir}/*.map`)) {
    const map = JSON.parse(await fs.readFile(mapPath, "utf8")) as {
      sources: string[];
    };
    map.sources = map.sources.filter((source) => !source.startsWith("/"));
    await fs.writeFile(mapPath, JSON.stringify(map));
  }
}
