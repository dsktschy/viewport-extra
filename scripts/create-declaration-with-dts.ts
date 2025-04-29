/**
 * Executes tsc --declaration with JavaScript API
 * because type checking during execution with CLI
 * ignores global declarations that are not imported
 */
import { parseArgs } from "node:util";
import typescript from "typescript";

const {
  values: { "output-directory": outputDirectory },
  positionals: targetPathList,
} = parseArgs({
  options: {
    "output-directory": { type: "string", default: "" },
  },
  allowPositionals: true,
});
if (!outputDirectory)
  throw new Error("Missing required option: --output-directory");
const emitResult = typescript
  .createProgram(targetPathList, {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: outputDirectory,
    resolveJsonModule: true,
  })
  .emit();
if (emitResult.diagnostics.length)
  throw new Error("typescript.createProgram failed");
