import { globSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const sourceDirectory = "tests/__fixtures__/src/";

export default defineConfig({
  build: {
    // npx playwright install --dry-run
    target: ["chrome128", "safari18"],
    rollupOptions: {
      input: {
        "dummy.html": `${sourceDirectory}dummy.html`,
        ...globSync(`${sourceDirectory}**/*.ts`).reduce<Record<string, string>>(
          (result, relativePath) => {
            result[
              relativePath.replace(sourceDirectory, "").replace(/\.ts$/, ".js")
            ] = relativePath;
            return result;
          },
          {},
        ),
      },
      // Set array in output because rollupOptions does not accept array
      output: [
        {
          typescriptTarget: "es2021",
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
    outDir: "tests/__fixtures__/dist",
  },
  publicDir: "dist",
  resolve: {
    alias: {
      "@@": import.meta.dirname,
    },
  },
});
