/**
 * .ts extension cannot be used due to type errors caused by plugins
 * https://github.com/rollup/plugins/issues/1541
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "rollup";
import rollupPluginDelete from "rollup-plugin-delete";
import rollupPluginDts from "rollup-plugin-dts";
import packageJson from "./package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importTypesPath = path.resolve(
  __dirname,
  packageJson.exports["."].import.types,
);
const requireTypesPath = path.resolve(
  __dirname,
  packageJson.exports["."].require.types,
);

export default defineConfig({
  input: path.resolve(__dirname, ".types/viewport-extra.d.ts"),
  output: [
    {
      file: importTypesPath,
      format: "es",
      exports: "named",
    },
    {
      file: requireTypesPath,
      format: "cjs",
      exports: "named",
    },
  ],
  plugins: [
    rollupPluginDelete({
      targets: [importTypesPath, requireTypesPath],
    }),
    rollupPluginDts(),
  ],
});
