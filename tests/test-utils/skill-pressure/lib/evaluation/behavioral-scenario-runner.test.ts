import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { writeAttemptReceipt } from "../reporting/attempt-receipt.js";
import { deriveAttemptDurableFacts, resolveSubjectExecutionPolicy } from "./behavioral-scenario-runner.js";

describe("behavioral scenario subject policy", () => {
  it("persists a retryable attempt when setup fails before a process exists", async () => {
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "prelaunch-attempt-"));
    const process = {
      exitCode: 1,
      timedOut: false,
      cleanupComplete: true,
      stderrDigest: "sha256:failure",
      stderrExcerpt: "spawn failed",
      supervisorReceipt: {
        outcome: "completed" as const,
        exitCode: null,
        signal: null,
        stdoutEof: true,
        stderrEof: true,
        cleanup: { processGroupId: null, termSent: false, killSent: false },
      },
    };

    const durableFacts = deriveAttemptDurableFacts({ process });
    await expect(writeAttemptReceipt({
      receiptDirectory,
      fileName: "baseline-1-attempt-1.json",
      durableFacts,
      receipt: { scenarioId: "setup-failure", process },
      secrets: [],
    })).resolves.toMatchObject({
      receipt: { durableFacts: { processClosed: true, streamsDrained: true } },
    });
  });

  it("enables disposable-repository writes only for path-bounded scenarios", () => {
    expect(resolveSubjectExecutionPolicy({ allowedTools: [], allowedWritePaths: [] })).toEqual({
      permissionMode: "approve-reads",
      allowedTools: [],
      allowedWritePaths: [],
    });
    expect(resolveSubjectExecutionPolicy({
      allowedTools: ["write"],
      allowedWritePaths: ["reports/result.md"],
    })).toEqual({
      permissionMode: "approve-all",
      allowedTools: ["write"],
      allowedWritePaths: ["reports/result.md"],
    });
  });
});
