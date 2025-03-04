/**
 * Change extension of type declaration files
 * Because tsup ignores dts property of outExtension option
 * https://github.com/egoist/tsup/issues/939
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { Format } from "tsup";
import pkg from "../package.json" with { type: "json" };
import tsupConfig from "../tsup.config.js";

if (!Array.isArray(tsupConfig)) process.exit(0);
const esmFlag = pkg.type === "module";
const createDefaultOutExtensions = (format: Format, minify: boolean) =>
  ({
    esm: esmFlag ? { js: ".js", dts: ".d.ts" } : { js: ".mjs", dts: ".d.mts" },
    cjs: esmFlag ? { js: ".cjs", dts: ".d.cts" } : { js: ".js", dts: ".d.ts" },
    iife: minify ? { js: ".global.min.js" } : { js: ".global.js" },
  })[format];
for (const options of tsupConfig) {
  const { entry, format, outDir, outExtension, minify } = options;
  if (!entry) continue;
  const entryList = Array.isArray(entry) ? entry : Object.keys(entry);
  const formatList = Array.isArray(format) ? format : [format];
  const safeOutDir = outDir ?? "dist";
  for (const entry of entryList) {
    const stem = path.parse(entry).name;
    for (const format of formatList) {
      if (!format) continue;
      const defaultDtsExtension = createDefaultOutExtensions(
        format,
        !!minify,
      ).dts;
      const dtsExtension = outExtension
        ? outExtension({
            format,
            options: {
              format: [format],
              tsconfigResolvePaths: {},
              entry: [entry],
              outDir: safeOutDir,
            },
          }).dts
        : defaultDtsExtension;
      if (!dtsExtension || dtsExtension === defaultDtsExtension) continue;
      await fs.rename(
        `${safeOutDir}/${stem}${defaultDtsExtension}`,
        `${safeOutDir}/${stem}${dtsExtension}`,
      );
    }
  }
}
