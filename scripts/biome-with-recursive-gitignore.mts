/**
 * Run biome check with adding paths in all .gitignore to files.ignore
 * Because biome does not use .gitignore in child directories
 */
import childProcess from "node:child_process";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import JSONC from "jsonc-parser";

const { values: args, positionals: targetPathList } = parseArgs({
  options: {
    write: { type: "boolean", default: false },
    "no-errors-on-unmatched": { type: "boolean", default: false },
    "config-path": { type: "string" },
  },
  allowPositionals: true,
});
const ignoredPathSet = new Set<string>();
for await (const gitignorePath of fsPromises.glob("**/*/.gitignore")) {
  const gitignoreDirname = path.dirname(gitignorePath);
  const gitignoreContent = await fsPromises.readFile(gitignorePath, "utf-8");
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
const projectRootPath = path.resolve(import.meta.dirname, "..");
const relativeCustomConfigPath = args["config-path"];
const biomeConfigPath = (
  relativeCustomConfigPath
    ? () => {
        const customConfigPath = path.resolve(
          projectRootPath,
          relativeCustomConfigPath,
        );
        return fs.existsSync(customConfigPath) ? customConfigPath : "";
      }
    : () => {
        const defaultJsonConfigPath = path.resolve(
          projectRootPath,
          "biome.json",
        );
        const defaultJsoncConfigPath = path.resolve(
          projectRootPath,
          "biome.jsonc",
        );
        return fs.existsSync(defaultJsonConfigPath)
          ? defaultJsonConfigPath
          : fs.existsSync(defaultJsoncConfigPath)
            ? defaultJsoncConfigPath
            : "";
      }
)();
if (!biomeConfigPath) throw new Error("Biome config not found");
const temporaryBiomeConfigPath = path.resolve(projectRootPath, ".biome.jsonc");
await fsPromises.copyFile(biomeConfigPath, temporaryBiomeConfigPath);
const biomeConfig = JSONC.parse(
  await fsPromises.readFile(temporaryBiomeConfigPath, "utf-8"),
) as { files?: { ignore?: string[] } };
biomeConfig.files = {
  ...(biomeConfig.files ?? {}),
  ignore: [...(biomeConfig.files?.ignore ?? []), ...ignoredPathSet],
};
await fsPromises.writeFile(
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
      ...targetPathList.map((targetPath) =>
        path.resolve(projectRootPath, targetPath),
      ),
    ],
    { stdio: "inherit" },
  )
  .on("error", async (error) => {
    await fsPromises.rm(temporaryBiomeConfigPath);
    throw error;
  })
  .on("exit", async (code) => {
    await fsPromises.rm(temporaryBiomeConfigPath);
    process.exit(code ?? 0);
  });
