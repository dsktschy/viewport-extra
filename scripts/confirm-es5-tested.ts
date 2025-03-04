/**
 * Prompt to confirm that artifacts have been tested in environments that don't support ES2015
 */
import readline from "node:readline/promises";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    message: { type: "string", default: "" },
  },
});
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  // https://github.com/nodejs/node/issues/30510
  terminal: false,
});
const answer = await readlineInterface.question(
  "Have you tested whether the artifacts work in environments that don't support ES2015? (y/N): ",
);
if (args.message) console.log(`\n${args.message}`);
readlineInterface.close();
if (answer.trim().toLowerCase() !== "y") process.exit(1);
