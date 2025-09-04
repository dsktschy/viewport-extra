import { globSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const srcDir = "tests/e2e/__fixtures__/src/";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "dummy.html": path.resolve(import.meta.dirname, `${srcDir}dummy.html`),
        ...globSync(`${srcDir}**/*.ts`).reduce<Record<string, string>>(
          (result, relativePath) => {
            result[relativePath.replace(srcDir, "").replace(/\.ts$/, ".js")] =
              path.resolve(import.meta.dirname, relativePath);
            return result;
          },
          {},
        ),
      },
      output: {
        entryFileNames: "[name]",
      },
    },
    outDir: path.resolve(import.meta.dirname, "tests/e2e/__fixtures__/dist"),
    commonjsOptions: {
      include: ["dist/cjs/**/*.js"],
    },
  },
  publicDir: path.resolve(import.meta.dirname, "dist"),
  resolve: {
    alias: {
      "@@": import.meta.dirname,
    },
  },
});
