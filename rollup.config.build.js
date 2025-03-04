/**
 * .ts extension cannot be used due to type errors caused by plugins
 * https://github.com/rollup/plugins/issues/1541
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import rollupPluginTerser from "@rollup/plugin-terser";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import rollupPluginDelete from "rollup-plugin-delete";
import packageJson from "./package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copyright
const banner = `/*!
 * Viewport Extra v${packageJson.version}
 * (c) dsktschy
 * Released under the MIT License.
 */`;

// Global variable name for iife
const name = "ViewportExtra";

const importDefaultPath = path.resolve(
  __dirname,
  packageJson.exports["."].import.default,
);
const requireDefaultPath = path.resolve(
  __dirname,
  packageJson.exports["."].require.default,
);
const jsdelivrPath = path.resolve(__dirname, packageJson.jsdelivr);
const nonMinifiedJsdelivrPath = jsdelivrPath.replace(/\.min\.js$/, ".js");

export default defineConfig({
  input: path.resolve(__dirname, "src/viewport-extra.ts"),
  output: [
    {
      file: importDefaultPath,
      format: "es",
      exports: "named",
      sourcemap: true,
      banner,
    },
    {
      file: requireDefaultPath,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      banner,
    },
    {
      file: nonMinifiedJsdelivrPath,
      format: "iife",
      exports: "named",
      sourcemap: true,
      banner,
      name,
    },
    {
      file: jsdelivrPath,
      format: "iife",
      exports: "named",
      sourcemap: false,
      name,
      plugins: [
        rollupPluginTerser({
          format: {
            // Copyright of tslib is not required
            // https://github.com/microsoft/tslib/pull/96
            comments: false,
            preamble: banner,
          },
        }),
      ],
    },
  ],
  plugins: [
    rollupPluginDelete({
      targets: [
        importDefaultPath,
        `${importDefaultPath}.map`,
        requireDefaultPath,
        `${requireDefaultPath}.map`,
        nonMinifiedJsdelivrPath,
        `${nonMinifiedJsdelivrPath}.map`,
        jsdelivrPath,
      ],
    }),
    rollupPluginTypescript({
      target: "es5",
      filterRoot: "./src",
      // Exit on error if not watching
      // https://github.com/rollup/plugins/issues/258#issuecomment-848402026
      noEmitOnError: !process.env.ROLLUP_WATCH,
    }),
  ],
});
