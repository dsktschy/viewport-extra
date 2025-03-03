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
    format: ["esm", "cjs", "iife"],
    minify: false,
    entry: ["src/viewport-extra.ts"],
    outDir: "dist",
    outExtension: ({ format }) =>
      ({
        esm: { js: ".mjs", dts: ".d.mts" },
        cjs: { js: ".cjs", dts: ".d.cts" },
        iife: { js: ".js" },
      })[format],
    sourcemap: true,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
  },
  {
    format: "iife",
    minify: true,
    entry: ["src/viewport-extra.ts"],
    outDir: "dist",
    outExtension: () => ({ js: ".min.js" }),
    sourcemap: false,
    clean: true,
    target: "es5",
    globalName,
    banner: { js: jsBanner },
  },
]);
