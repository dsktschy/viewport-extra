import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import typescriptEslintParser from "@typescript-eslint/parser";
import eslintPluginCompat from "eslint-plugin-compat";
import { defineConfig } from "eslint/config";
import tsconfigJson from "./tsconfig.json" with { type: "json" };

const { languageOptions, plugins, rules } =
  eslintPluginCompat.configs["flat/recommended"];

export default defineConfig([
  {
    files: tsconfigJson.include,
    // Apply only root .gitignore as minimum necessary for now to improve performance
    ignores: includeIgnoreFile(
      fileURLToPath(new URL(".gitignore", import.meta.url)),
    ).ignores,
    languageOptions: {
      ...languageOptions,
      parser: typescriptEslintParser,
    },
    plugins,
    rules,
    settings: {
      targets: ["fully supports es5", "not fully supports es6"],
      lintAllEsApis: true,
    },
  },
]);
