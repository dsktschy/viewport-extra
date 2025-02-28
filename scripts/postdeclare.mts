/**
 * Reproduce behavior of viewport-extra@2
 */
import fs from "node:fs/promises";
import path from "node:path";
import tsupConfig from "../tsup.config.mjs";

if (!Array.isArray(tsupConfig)) process.exit(0);
await fs.rm("types", { recursive: true, force: true });
await fs.mkdir("types");
for (const options of tsupConfig) {
  if (!Array.isArray(options.entry)) continue;
  for (const entryItem of options.entry) {
    const basenameWithoutExtension = path.basename(entryItem, ".ts");
    if (options.format === "esm") {
      await fs.rename(
        `${options.outDir}/${basenameWithoutExtension}.d.mts`,
        `${options.outDir}/${basenameWithoutExtension}.d.ts`,
      );
      await fs.copyFile(
        `${options.outDir}/${basenameWithoutExtension}.d.ts`,
        `types/${basenameWithoutExtension}.d.ts`,
      );
    }
    if (options.format === "iife" && !options.minify)
      await fs.rm(`${options.outDir}/${basenameWithoutExtension}.d.ts`);
  }
}
