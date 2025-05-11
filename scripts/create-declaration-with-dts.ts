/**
 * Executes tsc --declaration with JavaScript API
 * because type checking during execution with CLI
 * ignores global declarations that are not imported
 */
import fsPromises from "node:fs/promises";
import { parseArgs } from "node:util";
import typescript from "typescript";

const {
  values: { "output-directory": outputDirectory },
  positionals: targetPatternList,
} = parseArgs({
  options: {
    "output-directory": { type: "string", default: "" },
  },
  allowPositionals: true,
});
if (!outputDirectory)
  throw new Error("Missing required option: --output-directory");
const targetPathSet = new Set<string>();
for (const targetPattern of targetPatternList) {
  for await (const targetPath of fsPromises.glob(targetPattern)) {
    targetPathSet.add(targetPath);
  }
}
const emitResult = typescript
  .createProgram([...targetPathSet], {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: outputDirectory,
    resolveJsonModule: true,
  })
  .emit();
if (emitResult.diagnostics.length)
  throw new Error("typescript.createProgram failed");
