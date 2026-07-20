import { existsSync } from "node:fs";
import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class InitError extends Error {
  exitCode: number;
  constructor(message: string, exitCode = 1) {
    super(message);
    this.name = "InitError";
    this.exitCode = exitCode;
  }
}

export interface InitOptions {
  cwd: string;
  force: boolean;
}

export interface InitResult {
  target: string;
  installTemplatesTarget: string;
}

export async function init({ cwd, force }: InitOptions): Promise<InitResult> {
  const target = resolve(cwd, "memory-bank");
  const installTemplatesTarget = resolve(target, ".install", "integrations");

  const memoryBankSource = resolve(__dirname, "../../templates/memory-bank");
  const integrationsSource = resolve(__dirname, "../../templates/integrations");

  if (existsSync(target) && !force) {
    throw new InitError(
      `memory-bank/ already exists in ${cwd}. Use --force to overwrite.`,
      1,
    );
  }

  if (!existsSync(memoryBankSource)) {
    throw new InitError(
      `Template directory missing in package (looked at ${memoryBankSource}). This is a bug — please report.`,
      2,
    );
  }

  if (!existsSync(integrationsSource)) {
    throw new InitError(
      `Integration templates missing in package (looked at ${integrationsSource}). This is a bug — please report.`,
      2,
    );
  }

  // Refresh both targets fully when --force, so stale leftovers don't survive.
  if (force) {
    await rm(target, { recursive: true, force: true });
  }

  await cp(memoryBankSource, target, { recursive: true });
  await cp(integrationsSource, installTemplatesTarget, { recursive: true });

  return { target, installTemplatesTarget };
}
