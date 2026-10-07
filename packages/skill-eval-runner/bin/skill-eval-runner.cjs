#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const { cpSync, mkdtempSync, rmSync, symlinkSync, existsSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const packageRoot = path.join(__dirname, "..");
const dependencyRoot = existsSync(path.join(packageRoot, "node_modules", "deno"))
  ? path.join(packageRoot, "node_modules")
  : path.dirname(packageRoot);
const deno = require.resolve("deno/bin.cjs");
const runtimeRoot = mkdtempSync(path.join(tmpdir(), "skill-eval-runner-cli-"));
try {
  cpSync(path.join(packageRoot, "src"), path.join(runtimeRoot, "src"), { recursive: true });
  cpSync(path.join(packageRoot, "package.json"), path.join(runtimeRoot, "package.json"));
  cpSync(path.join(packageRoot, "deno.json"), path.join(runtimeRoot, "deno.json"));
  const runtimeModules = path.join(runtimeRoot, "node_modules");
  require("node:fs").mkdirSync(path.join(runtimeModules, "@agentclientprotocol"), { recursive: true });
  for (const dependency of ["acpx", "deno", "yaml", "zod"]) {
    symlinkSync(path.join(dependencyRoot, dependency), path.join(runtimeModules, dependency), "dir");
  }
  symlinkSync(path.join(dependencyRoot, "@agentclientprotocol", "codex-acp"), path.join(runtimeModules, "@agentclientprotocol", "codex-acp"), "dir");
  const result = spawnSync(process.execPath, [deno, "run", "--allow-all", "--no-check", "--node-modules-dir=manual", path.join(runtimeRoot, "src", "cli.ts"), ...process.argv.slice(2)], { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(runtimeRoot, { recursive: true, force: true });
}
