/**
 * Reproduce behavior of viewport-extra@2
 */
import fs from "node:fs/promises";
import path from "node:path";
import tsupConfig from "../tsup.config.mjs";

if (!Array.isArray(tsupConfig)) process.exit(0);
for (const options of tsupConfig) {
  if (!Array.isArray(options.entry)) continue;
  for (const entryItem of options.entry) {
    const basenameWithoutExtension = path.basename(entryItem, ".ts");
    if (typeof options.outExtension === "function") {
      const { js: outExtension } = (
        options.outExtension as () => ReturnType<
          Exclude<typeof options.outExtension, undefined>
        >
      )();
      const outPath = `${options.outDir}/${basenameWithoutExtension}${outExtension ?? ""}`;
      if (options.sourcemap) {
        const mapPath = `${outPath}.map`;
        const map = JSON.parse(await fs.readFile(mapPath, "utf8")) as {
          sources: string[];
        };
        map.sources = map.sources.filter((source) => !source.startsWith("/"));
        await fs.writeFile(mapPath, JSON.stringify(map));
        if (options.format === "iife")
          await fs.rename(
            mapPath,
            `${options.outDir}/viewport-extra${outExtension ?? ""}.map`,
          );
      }
      if (options.format === "iife")
        await fs.rename(
          outPath,
          `${options.outDir}/viewport-extra${outExtension ?? ""}`,
        );
    }
  }
}
