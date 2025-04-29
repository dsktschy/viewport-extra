import { defineConfig } from "rollup";
import rollupPluginDelete from "rollup-plugin-delete";
import rollupPluginDts from "rollup-plugin-dts";

export default defineConfig(
  [{ subDirectory: "" }, { subDirectory: "es5/" }].map(({ subDirectory }) => ({
    input: ".types/viewport-extra.d.ts",
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
