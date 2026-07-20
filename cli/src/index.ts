#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { InitError, init } from "./commands/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getVersion(): Promise<string> {
  const pkgPath = resolve(__dirname, "../package.json");
  const raw = await readFile(pkgPath, "utf8");
  return JSON.parse(raw).version as string;
}

function printHelp(): void {
  console.log(`
dmb — Directed Memory Bank installer

Usage:
  npx directed-memory-bank init        Create memory-bank/ in current directory
  npx directed-memory-bank --version   Show version
  npx directed-memory-bank --help      Show this help

Flags:
  --force    Overwrite existing memory-bank/ directory

After install, open your AI tool and say:
  "follow memory-bank/INSTALL.md to set up my DMB"
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "--version" || command === "-v") {
    console.log(await getVersion());
    return;
  }

  if (command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === undefined || command === "init") {
    const force = args.includes("--force");
    try {
      const result = await init({ cwd: process.cwd(), force });
      console.log(`memory-bank/ created at ${result.target}`);
      console.log("");
      console.log("Next: open your AI tool in this directory and say:");
      console.log('  "follow memory-bank/INSTALL.md to set up my DMB"');
      console.log("");
      console.log("More: https://github.com/pmikutel/directed-memory-bank");
    } catch (err) {
      if (err instanceof InitError) {
        console.error(`error: ${err.message}`);
        process.exit(err.exitCode);
      }
      throw err;
    }
    return;
  }

  console.error(`unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
