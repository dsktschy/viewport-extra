import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

const globalName = "ViewportExtra";
const jsBanner = `/*!
 * Viewport Extra v${pkg.version}
 * (c) dsktschy
 * Released under the MIT License.
 */`;

export default defineConfig([
  {
    format: "esm",
    minify: false,
    entry: ["src/index.ts"],
    outDir: "dist/esm",
    outExtension: () => ({ js: ".js" }),
    sourcemap: true,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
    footer: undefined,
  },
  {
    format: "cjs",
    minify: false,
    entry: ["src/index.ts"],
    outDir: "dist/cjs",
    outExtension: () => ({ js: ".js" }),
    sourcemap: true,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
    footer: {
      js: "module.exports = module.exports.default;\nmodule.exports.default = module.exports;",
    },
  },
  {
    format: "iife",
    minify: false,
    entry: ["src/index.ts"],
    outDir: "dist/iife",
    outExtension: () => ({ js: ".js" }),
    sourcemap: false,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
    footer: {
      js: "ViewportExtra = ViewportExtra.default;ViewportExtra.default = ViewportExtra;",
    },
  },
  {
    format: "iife",
    minify: true,
    entry: ["src/index.ts"],
    outDir: "dist/iife",
    outExtension: () => ({ js: ".min.js" }),
    sourcemap: true,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
    footer: {
      js: "ViewportExtra = ViewportExtra.default;ViewportExtra.default = ViewportExtra;",
    },
  },
]);
