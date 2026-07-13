import { describe, expect, it } from "vitest";

import { runSupervisedProcess } from "./process-group-supervisor.js";

function extractDescendantProcessId(output: string): number {
  const match = /descendant:(\d+)/.exec(output);
  if (match?.[1] === undefined) {
    throw new Error(`descendant process id missing from output: ${output}`);
  }
  return Number(match[1]);
}

async function processEventuallyStops(processId: number): Promise<boolean> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      process.kill(processId, 0);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "ESRCH") {
        return true;
      }
      throw error;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 20));
  }
  return false;
}

describe("process group supervisor", () => {
  it("terminates an ignoring process group, drains inherited pipes, and leaves no descendant", async () => {
    const source = [
      "const { spawn } = require('node:child_process');",
      "process.on('SIGTERM', () => {});",
      "const child = spawn(process.execPath, ['-e', \"process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);\"], { stdio: 'inherit' });",
      "process.stdout.write(`descendant:${child.pid}\\n`);",
      "setInterval(() => {}, 1000);",
    ].join("\n");

    const result = await runSupervisedProcess({
      command: process.execPath,
      args: ["-e", source],
      cwd: process.cwd(),
      environment: process.env,
      timeoutMs: 100,
      terminationGraceMs: 100,
    });

    const descendantProcessId = extractDescendantProcessId(result.stdout);
    expect(result.receipt.outcome).toBe("timed_out");
    expect(result.receipt.stdoutEof).toBe(true);
    expect(result.receipt.stderrEof).toBe(true);
    expect(result.receipt.cleanup.termSent).toBe(true);
    expect(result.receipt.cleanup.killSent).toBe(true);
    expect(await processEventuallyStops(descendantProcessId)).toBe(true);
  });

  it("cancels a process group through the same TERM-to-KILL receipt path", async () => {
    const abortController = new AbortController();
    const resultPromise = runSupervisedProcess({
      command: process.execPath,
      args: ["-e", "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);"],
      cwd: process.cwd(),
      environment: process.env,
      timeoutMs: 5_000,
      terminationGraceMs: 20,
      signal: abortController.signal,
    });
    setTimeout(() => abortController.abort(), 20);

    const result = await resultPromise;
    expect(result.receipt.outcome).toBe("cancelled");
    expect(result.receipt.cleanup.termSent).toBe(true);
    expect(result.receipt.stdoutEof).toBe(true);
    expect(result.receipt.stderrEof).toBe(true);
  });
});
