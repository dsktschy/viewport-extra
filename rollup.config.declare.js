import { defineConfig } from "rollup";
import rollupPluginDelete from "rollup-plugin-delete";
import rollupPluginDts from "rollup-plugin-dts";

export default defineConfig(
  [
    {
      input: ".types/entries/viewport-extra.d.ts",
      subDirectory: "",
    },
    {
      input: ".types/entries/viewport-extra.d.ts",
      subDirectory: "es5/",
    },
    {
      input: ".types/entries/immediate/viewport-extra.d.ts",
      subDirectory: "immediate/",
    },
    {
      input: ".types/entries/immediate/viewport-extra.d.ts",
      subDirectory: "immediate/es5/",
    },
  ].map(({ input, subDirectory }) => ({
    input,
    output: [
      {
        file: `dist/${subDirectory}viewport-extra.d.mts`,
        format: "es",
        exports: "named",
      },
      {
        file: `dist/${subDirectory}viewport-extra.d.cts`,
        format: "cjs",
        exports: "named",
      },
    ],
    plugins: [
      rollupPluginDelete({
        targets: [
          `dist/${subDirectory}viewport-extra.d.mts`,
          `dist/${subDirectory}viewport-extra.d.cts`,
        ],
      }),
      rollupPluginDts(),
    ],
  })),
);
