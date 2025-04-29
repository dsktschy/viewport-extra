import rollupPluginReplace from "@rollup/plugin-replace";
import rollupPluginTerser from "@rollup/plugin-terser";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import rollupPluginDelete from "rollup-plugin-delete";
import packageJson from "./package.json" with { type: "json" };
import tsconfigJson from "./tsconfig.json" with { type: "json" };

// Copyright
const banner = `/*!
 * Viewport Extra v${packageJson.version}
 * (c) dsktschy
 * Released under the MIT License.
 */`;

// Global variable name for iife
const name = "ViewportExtra";

export default defineConfig(
  [
    {
      typescriptTarget: "es2022",
      subDirectory: "",
    },
    {
      typescriptTarget: "es5",
      subDirectory: "es5/",
    },
  ].map(({ typescriptTarget, subDirectory }) => ({
    input: "src/viewport-extra.ts",
    output: [
      {
        file: `dist/${subDirectory}viewport-extra.mjs`,
        format: "es",
        exports: "named",
        sourcemap: true,
        banner,
      },
      {
        file: `dist/${subDirectory}viewport-extra.cjs`,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        banner,
      },
      {
        file: `dist/${subDirectory}viewport-extra.js`,
        format: "iife",
        exports: "named",
        sourcemap: true,
        banner,
        name,
      },
      {
        file: `dist/${subDirectory}viewport-extra.min.js`,
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
          `dist/${subDirectory}viewport-extra.mjs`,
          `dist/${subDirectory}viewport-extra.mjs.map`,
          `dist/${subDirectory}viewport-extra.cjs`,
          `dist/${subDirectory}viewport-extra.cjs.map`,
          `dist/${subDirectory}viewport-extra.js`,
          `dist/${subDirectory}viewport-extra.js.map`,
          `dist/${subDirectory}viewport-extra.min.js`,
        ],
      }),
      rollupPluginReplace({
        preventAssignment: true,
        __TYPESCRIPT_TARGET__: `"${typescriptTarget}"`,
      }),
      rollupPluginTypescript({
        target: typescriptTarget,
        include: [
          ...tsconfigJson.include.map((pattern) => `src/${pattern}`),
          "globals.d.ts",
        ],
        // Exit on error if not watching
        // https://github.com/rollup/plugins/issues/258#issuecomment-848402026
        noEmitOnError: !process.env.ROLLUP_WATCH,
      }),
    ],
  })),
);
