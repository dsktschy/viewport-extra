/**
 * Run biome check with adding paths in all .gitignore to files.ignore
 * Because biome does not use .gitignore in child directories
 */
import childProcess from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import JSONC from "jsonc-parser";

const { values: args, positionals: targetPathList } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    "no-errors-on-unmatched": { type: "boolean", default: false },
  },
  allowPositionals: true,
});
const ignoredPathSet = new Set<string>();
for await (const gitignorePath of fs.glob("**/*/.gitignore")) {
  const gitignoreDirname = path.dirname(gitignorePath);
  const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
  for (const line of gitignoreContent.split("\n")) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    ignoredPathSet.add(
      path.join(
        gitignoreDirname,
        trimmedLine.startsWith("/") ? "" : "**",
        trimmedLine.replace(/^\//, ""),
      ),
    );
  }
}
const biomeConfigPath = path.resolve("biome.jsonc");
const temporaryBiomeConfigPath = path.resolve(".biome.jsonc");
await fs.copyFile(biomeConfigPath, temporaryBiomeConfigPath);
const biomeConfig = JSONC.parse(
  await fs.readFile(temporaryBiomeConfigPath, "utf-8"),
) as { files?: { ignore?: string[] } };
biomeConfig.files = {
  ...(biomeConfig.files ?? {}),
  ignore: [...(biomeConfig.files?.ignore ?? []), ...ignoredPathSet],
};
await fs.writeFile(
  temporaryBiomeConfigPath,
  `${JSON.stringify(biomeConfig)}\n`,
);
childProcess
  .spawn(
    "npx",
    [
      ...`biome check --config-path=${temporaryBiomeConfigPath}`.split(" "),
      ...(args.write ? ["--write"] : []),
      ...(args["no-errors-on-unmatched"] ? ["--no-errors-on-unmatched"] : []),
      ...targetPathList.map((targetPath) => path.resolve(targetPath)),
    ],
    { stdio: "inherit" },
  )
  .on("error", (error) => {
    console.error(error);
  })
  .on("exit", async (code) => {
    await fs.rm(temporaryBiomeConfigPath);
    process.exit(code ?? 0);
  });
