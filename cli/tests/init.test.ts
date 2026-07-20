import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { InitError, init } from "../src/commands/init.js";

let tmp: string;

beforeEach(async () => {
  tmp = await mkdtemp(join(tmpdir(), "dmb-test-"));
});

afterEach(async () => {
  await rm(tmp, { recursive: true, force: true });
});

describe("init", () => {
  it("creates memory-bank/ with expected entries", async () => {
    const result = await init({ cwd: tmp, force: false });

    expect(result.target).toBe(join(tmp, "memory-bank"));

    const entries = await readdir(result.target);
    expect(entries).toContain("_index.md");
    expect(entries).toContain("INSTALL.md");
    expect(entries).toContain("project");
    expect(entries).toContain("technical");
    expect(entries).toContain("tasks");
  });

  it("refuses to overwrite an existing memory-bank/ without --force", async () => {
    await init({ cwd: tmp, force: false });

    await expect(init({ cwd: tmp, force: false })).rejects.toBeInstanceOf(
      InitError,
    );
  });

  it("overwrites an existing memory-bank/ with --force", async () => {
    await init({ cwd: tmp, force: false });
    await expect(
      init({ cwd: tmp, force: true }),
    ).resolves.toBeDefined();
  });

  it("installs integration templates under memory-bank/.install/integrations/", async () => {
    const result = await init({ cwd: tmp, force: false });

    expect(result.installTemplatesTarget).toBe(
      join(tmp, "memory-bank", ".install", "integrations"),
    );

    const integrationDirs = await readdir(result.installTemplatesTarget);
    expect(integrationDirs).toEqual(
      expect.arrayContaining(["claude", "cursor", "codex", "gemini", "generic"]),
    );

    // Spot-check key template files made it through.
    const claudeRoot = join(result.installTemplatesTarget, "claude");
    const claudeEntries = await readdir(claudeRoot);
    expect(claudeEntries).toContain("CLAUDE-template.md");
    expect(claudeEntries).toContain("settings-template.json");

    const cursorRoot = join(result.installTemplatesTarget, "cursor");
    const cursorEntries = await readdir(cursorRoot);
    expect(cursorEntries).toContain("area-rule-template.mdc");
    expect(cursorEntries).toContain("hooks.json");

    const codexAgentsTemplate = await readFile(
      join(result.installTemplatesTarget, "codex", "AGENTS-template.md"),
      "utf8",
    );
    expect(codexAgentsTemplate.length).toBeGreaterThan(0);
  });

  it("refreshes .install/integrations/ when --force is used", async () => {
    const result = await init({ cwd: tmp, force: false });

    // Sentinel: drop a stale file into .install/integrations/ that wouldn't
    // exist after a clean install — --force should wipe it out.
    const stalePath = join(
      result.installTemplatesTarget,
      "stale-leftover.md",
    );
    await writeFile(stalePath, "stale", "utf8");
    expect((await stat(stalePath)).isFile()).toBe(true);

    await init({ cwd: tmp, force: true });

    await expect(stat(stalePath)).rejects.toMatchObject({ code: "ENOENT" });
  });
});
