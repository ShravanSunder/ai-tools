import { chmod, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { executeAcpxCommand, resolveAcpxLauncher, type ExecutableAcpxCommand } from "./acpx-command-executor.js";

describe("ACPX command contract", () => {
  it("requires the disposable working directory to be explicit", () => {
    const command = {
      executable: "/opt/homebrew/bin/acpx",
      args: ["codex", "exec", "prompt"],
      cwd: "/tmp/skill-pressure/run-1",
      environment: {},
    } satisfies ExecutableAcpxCommand;

    expect(command.cwd).toBe("/tmp/skill-pressure/run-1");
  });

  it("captures process output without a shell", async () => {
    const result = await executeAcpxCommand({
      executable: process.execPath,
      args: ["-e", "process.stdout.write('out'); process.stderr.write('err')"],
      cwd: process.cwd(),
      environment: {},
    });

    expect(result).toEqual({
      exitCode: 0,
      timedOut: false,
      cleanupComplete: true,
      stdout: "out",
      stderr: "err",
      supervisorReceipt: expect.objectContaining({
        outcome: "completed",
        stdoutEof: true,
        stderrEof: true,
      }),
    });
  });

  it("enforces the runner deadline and cleans up the process group", async () => {
    const source = [
      "const { spawn } = require('node:child_process');",
      "process.on('SIGTERM', () => {});",
      "spawn(process.execPath, ['-e', \"process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);\"], { stdio: 'inherit' });",
      "setInterval(() => {}, 1000);",
    ].join("\n");
    const result = await executeAcpxCommand({
      executable: process.execPath,
      args: ["-e", source],
      cwd: process.cwd(),
      environment: {},
      timeoutMs: 50,
      terminationGraceMs: 50,
    });

    expect(result).toMatchObject({ exitCode: 3, timedOut: true, cleanupComplete: true });
    expect(result.supervisorReceipt).toMatchObject({
      outcome: "timed_out",
      stdoutEof: true,
      stderrEof: true,
      cleanup: { termSent: true, killSent: expect.any(Boolean) },
    });
  });

  it("prefers global acpx, then pnpm dlx, then npx", async () => {
    const executableRoot = await mkdtemp(path.join(tmpdir(), "acpx-launcher-"));
    const pnpmPath = path.join(executableRoot, "pnpm");
    const npxPath = path.join(executableRoot, "npx");
    await writeFile(pnpmPath, "#!/bin/sh\n");
    await writeFile(npxPath, "#!/bin/sh\n");
    await chmod(pnpmPath, 0o700);
    await chmod(npxPath, 0o700);

    await expect(resolveAcpxLauncher(executableRoot)).resolves.toEqual({
      executable: pnpmPath,
      prefixArgs: ["dlx", "acpx"],
      source: "pnpm-dlx",
    });

    const acpxPath = path.join(executableRoot, "acpx");
    await writeFile(acpxPath, "#!/bin/sh\n");
    await chmod(acpxPath, 0o700);
    await expect(resolveAcpxLauncher(executableRoot)).resolves.toEqual({
      executable: acpxPath,
      prefixArgs: [],
      source: "global",
    });
  });
});
