import { globSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const sourceDirectory = "tests/e2e/__fixtures__/src/";

export default defineConfig({
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        "dummy.html": path.resolve(
          import.meta.dirname,
          `${sourceDirectory}dummy.html`,
        ),
        ...globSync(`${sourceDirectory}**/*.ts`).reduce<Record<string, string>>(
          (result, relativePath) => {
            result[
              relativePath.replace(sourceDirectory, "").replace(/\.ts$/, ".js")
            ] = path.resolve(import.meta.dirname, relativePath);
            return result;
          },
          {},
        ),
      },
      // Set array in output because rollupOptions does not accept array
      output: [
        {
          typescriptTarget: "es2022",
          subDirectory: "",
        },
        {
          typescriptTarget: "es5",
          subDirectory: "es5/",
        },
      ].map(({ typescriptTarget, subDirectory }) => ({
        entryFileNames: ({ name }) => {
          const { dir, base } = path.parse(name);
          return dir ? `${dir}/${subDirectory}${base}` : "[name]";
        },
        plugins: [
          // Use custom plugin to replace placeholders
          // because @rollup/plugin-replace cannot be used as plugin for output
          {
            name: "replace",
            renderChunk: (code) =>
              Object.entries({
                __TYPESCRIPT_TARGET__: `"${typescriptTarget}"`,
              }).reduce(
                (code, [placeholder, value]) =>
                  code.replaceAll(placeholder, value),
                code,
              ),
          },
        ],
      })),
    },
    outDir: path.resolve(import.meta.dirname, "tests/e2e/__fixtures__/dist"),
  },
  publicDir: path.resolve(import.meta.dirname, "dist"),
  resolve: {
    alias: {
      "@@": import.meta.dirname,
    },
  },
});
