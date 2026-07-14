import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { AcpxProcessExecution, ExecutableAcpxCommand } from "../runtime/acpx-command-executor.js";
import type { StructuredSemanticReviewPacket } from "./semantic-review-contract.js";
import { executeStructuredReview } from "./structured-review-runner.js";

const launcher = { executable: "/usr/local/bin/acpx", prefixArgs: [], source: "global" } as const;
const packet: StructuredSemanticReviewPacket = {
  instructions: {
    task: "classify_each_semantic_assertion",
    assertions: [{ assertionId: "behavior", criterion: "The behavior is present.", evidenceSurface: "response" }],
    outputContract: "strict_json_assertion_results",
  },
  untrustedEvidence: {
    boundary: "untrusted_quoted_evidence",
    repetitions: [{
      repetitionId: "treatment-1",
      variant: "treatment",
      response: { kind: "response", evidenceId: "response", text: "The behavior is present." },
      tools: [],
      artifacts: [],
      rationalizations: [],
    }],
  },
};

function execution(stdout = "", overrides: Partial<AcpxProcessExecution> = {}): AcpxProcessExecution {
  return {
    exitCode: 0,
    timedOut: false,
    cleanupComplete: true,
    stdout,
    stderr: "",
    supervisorReceipt: {
      outcome: "completed",
      exitCode: 0,
      signal: null,
      stdoutEof: true,
      stderrEof: true,
      cleanup: { processGroupId: 1, termSent: false, killSent: false },
    },
    ...overrides,
  };
}

function transcript(model: string): string {
  return [
    { result: { models: { currentModelId: model } } },
    { method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "reviewed" } } } },
    { result: { stopReason: "end_turn" } },
  ].map((message) => JSON.stringify(message)).join("\n");
}

async function reviewRoot(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "structured-review-runner-"));
}

describe("structured ACPX semantic-review runner", () => {
  it("uses one fresh Luna/xhigh command for standard review", async () => {
    const commands: ExecutableAcpxCommand[] = [];
    const controller = new AbortController();

    const result = await executeStructuredReview({
      reviewRoot: await reviewRoot(),
      packet,
      risk: "standard",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: controller.signal,
      execute: async (command) => {
        commands.push(command);
        return execution(transcript("gpt-5.6-luna[xhigh]"));
      },
    });

    expect(commands).toHaveLength(1);
    expect(commands[0]?.args).toEqual(expect.arrayContaining(["--model", "gpt-5.6-luna[xhigh]", "codex", "exec"]));
    expect(commands[0]?.signal).toBe(controller.signal);
    expect(result.runtimeProfile.verification.status).toBe("verified");
  });

  it("runs and closes a named Claude Opus/xhigh session for high-risk review", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    const result = await executeStructuredReview({
      reviewRoot: await reviewRoot(),
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution(command.args.includes("--file") ? transcript("claude-opus-4-7[xhigh]") : "");
      },
    });

    expect(commands.map((command) => command.args)).toEqual([
      expect.arrayContaining(["sessions", "new", "--name"]),
      expect.arrayContaining(["set", "effort", "xhigh"]),
      expect.arrayContaining(["claude", expect.stringMatching(/^pressure-review-/u), "--file"]),
      expect.arrayContaining(["sessions", "close"]),
    ]);
    expect(result.runtimeProfile.verification.status).toBe("verified");
  });

  it("closes the Claude session when its prompt fails", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    await expect(executeStructuredReview({
      reviewRoot: await reviewRoot(),
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution("", command.args.includes("--file") ? { exitCode: 1 } : {});
      },
    })).rejects.toThrow(/run Claude semantic review/u);

    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
  });

  it("closes the Claude session when effort configuration fails", async () => {
    const commands: ExecutableAcpxCommand[] = [];

    await expect(executeStructuredReview({
      reviewRoot: await reviewRoot(),
      packet,
      risk: "high",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async (command) => {
        commands.push(command);
        return execution("", command.args.includes("effort") ? { exitCode: 1 } : {});
      },
    })).rejects.toThrow(/set Claude review effort/u);

    expect(commands).toHaveLength(3);
    expect(commands.at(-1)?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
  });

  it("fails closed for unsuccessful standard review execution", async () => {
    await expect(executeStructuredReview({
      reviewRoot: await reviewRoot(),
      packet,
      risk: "standard",
      launcher,
      codexExecutable: "/usr/local/bin/codex",
      timeoutSeconds: 120,
      signal: new AbortController().signal,
      execute: async () => execution("", { timedOut: true }),
    })).rejects.toThrow(/run Luna semantic review/u);
  });
});
