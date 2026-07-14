import { mkdtemp, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import type { AcpxProcessExecution } from "../runtime/acpx-command-executor.js";
import { executeAutomatedBlindReview, type ExecuteBlindReviewProps } from "./acpx-blind-review-runner.js";

function reviewExecution(props: {
  readonly model: string;
  readonly reasoningEffort: string;
  readonly sessionId?: string;
  readonly response?: string;
  readonly usage?: boolean;
}): AcpxProcessExecution {
  const response = props.response ?? JSON.stringify({
    repetitions: [
      { repetitionId: "red-1", variant: "baseline", outcome: "behavior_fail", evidenceClass: "demonstrated_failure" },
      { repetitionId: "green-1", variant: "treatment", outcome: "pass", evidenceClass: null },
    ],
    rationalization: null,
    behaviorRisk: null,
    smallestWordingChange: null,
    retestTarget: null,
  });
  return {
    exitCode: 0,
    timedOut: false,
    cleanupComplete: true,
    stderr: "",
    supervisorReceipt: {
      outcome: "completed",
      exitCode: 0,
      signal: null,
      stdoutEof: true,
      stderrEof: true,
      cleanup: { processGroupId: 101, termSent: false, killSent: false },
    },
    stdout: [
      { method: "session/new", params: { mcpServers: [] } },
      { result: { sessionId: props.sessionId ?? "review-session", models: { currentModelId: `${props.model}[${props.reasoningEffort}]` } } },
      { method: "session/prompt" },
      { method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: response } } } },
      ...(props.usage === false
        ? []
        : [{
            method: "session/update",
            params: {
              update: {
                sessionUpdate: "usage_update",
                _meta: { usage: { input_tokens: 10, output_tokens: 5 } },
              },
            },
          }]),
      { result: { stopReason: "end_turn" } },
    ].map((message) => JSON.stringify(message)).join("\n"),
  };
}

async function props(risk: "standard" | "high"): Promise<ExecuteBlindReviewProps> {
  const evidence = (repetitionId: string, variant: "baseline" | "treatment") => ({
    repetitionId,
    variant,
    visibleResponse: `${variant} response`,
    toolObservations: [],
    usageObservations: [],
    process: { outcome: "executed" as const, exitCode: 0, timedOut: false, cleanupComplete: true, infrastructureReasons: [] },
    repositoryFacts: {
      files: [],
      changes: { files: [], pathChanges: [], deletedPaths: [], omissions: [] },
      artifacts: [],
      omissions: [],
    },
    rationalizationExcerpts: [],
  });
  return {
    reviewRoot: await mkdtemp(path.join(tmpdir(), "skill-pressure-review-")),
    scenario: {
      scenarioId: "workflow/pressure-proof",
      hiddenRubric: "Confirm every required proof gate before acting.",
      risk,
    },
    deterministicFacts: [{
      repetitionId: "red-1",
      variant: "baseline",
      outcome: "behavior_fail",
      results: [{ checkId: "proof", outcome: "behavior_fail", reason: "proof was skipped" }],
    }, {
      repetitionId: "green-1",
      variant: "treatment",
      outcome: "pass",
      results: [],
    }],
    baselineEvidence: [evidence("red-1", "baseline")],
    treatmentEvidence: [evidence("green-1", "treatment")],
    sourceFingerprint: {
      pairSetFingerprint: "sha256:pair",
      baseline: { mode: "none", sourceDigest: null, sourceRevision: null },
      treatment: { mode: "current", sourceDigest: "sha256:skill", sourceRevision: null },
    },
    runtimeFingerprint: {
      runnerVersion: "skill-pressure-repetition-v2",
      subjectModel: "gpt-5.6-luna",
      subjectReasoningEffort: "xhigh",
      runtimeDigest: "sha256:runtime",
    },
    launcher: { executable: "/opt/acpx", prefixArgs: [], source: "global" },
    codexExecutable: "/opt/codex",
    timeoutSeconds: 120,
    subjectSessionIds: ["subject-session"],
    redactionSecrets: [],
  };
}

describe("automated ACPX blind review", () => {
  it("uses a sealed isolated Luna/xhigh review packet and leaves a cleanup receipt", async () => {
    const input = await props("standard");
    let observedArgs: readonly string[] = [];
    let observedCwd = "";
    const receipt = await executeAutomatedBlindReview({
      ...input,
      execute: async (command) => {
        observedArgs = command.args;
        observedCwd = command.cwd;
        const prompt = await readFile(command.args.at(-1) ?? "", "utf8");
        expect(command.cwd).toContain(input.reviewRoot);
        expect(prompt).toContain("Confirm every required proof gate");
        expect(prompt).not.toContain("authoring discussion");
        expect(prompt).not.toContain("expected conclusion");
        expect(prompt).not.toContain("other reviewer reasoning");
        expect(await readFile(path.join(command.cwd, "mcp.json"), "utf8")).toBe('{"mcpServers":[]}\n');
        return reviewExecution({ model: "gpt-5.6-luna", reasoningEffort: "xhigh" });
      },
    });

    expect(observedArgs).toContain("gpt-5.6-luna[xhigh]");
    expect(receipt.outcome).toBe("pass");
    expect(receipt.reviewReceipt?.reviewer).toMatchObject({ provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "xhigh" });
    expect(receipt.runtime.profile).toMatchObject({
      requested: { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
      providerReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
      verification: { status: "verified", reasonCode: null },
    });
    expect(receipt.cleanup).toEqual({ reviewCwdRemoved: true, cleanupError: null });
    expect(receipt.runtime.sessionId).toBe("review-session");
    expect(receipt.runtime.usageDigest).toMatch(/^sha256:/u);
    expect(await readdir(input.reviewRoot)).toEqual([]);
    await expect(stat(observedCwd)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("routes high-risk review to one fresh exact Claude Opus/xhigh ACPX command", async () => {
    const input = await props("high");
    const observedCommands: Array<{ readonly args: readonly string[]; readonly environment: Readonly<Record<string, string>> }> = [];
    const receipt = await executeAutomatedBlindReview({
      ...input,
      execute: async (command) => {
        observedCommands.push({ args: command.args, environment: command.environment });
        expect(command.environment).toEqual({ ACPX_CLAUDE_INCLUDE_USER_SETTINGS: "1" });
        return reviewExecution({ model: "claude-opus-4-7", reasoningEffort: "xhigh", sessionId: "fresh-opus-session" });
      },
    });

    expect(observedCommands).toHaveLength(4);
    expect(observedCommands[0]?.args).toEqual(expect.arrayContaining(["--model", "opus", "sessions", "new"]));
    expect(observedCommands[1]?.args).toEqual(expect.arrayContaining(["set", "effort", "xhigh"]));
    expect(observedCommands[2]?.args).toEqual(expect.arrayContaining(["claude", "-s", expect.stringMatching(/^pressure-review-/u), "--file"]));
    expect(observedCommands[3]?.args).toEqual(expect.arrayContaining(["sessions", "close"]));
    expect(receipt.outcome).toBe("pass");
    expect(receipt.command).toMatchObject({ provider: "claude", model: "opus", reasoningEffort: "xhigh", oneFreshExecution: true });
    expect(receipt.reviewReceipt?.reviewer).toMatchObject({ model: "claude-opus-4-7", reasoningEffort: "xhigh" });
    expect(receipt.reviewReceipt?.route).toMatchObject({ kind: "blind", freshContext: true });
    expect(receipt.runtime.sessionLifecycle).toMatchObject({
      mode: "named_session",
      create: "completed",
      setEffort: "completed",
      prompt: "completed",
      close: "completed",
    });
  });

  it("never passes malformed reviewer output or missing usage evidence", async () => {
    const malformed = await executeAutomatedBlindReview({
      ...(await props("standard")),
      execute: async () => reviewExecution({ model: "gpt-5.6-luna", reasoningEffort: "xhigh", response: "pass" }),
    });
    const missingUsage = await executeAutomatedBlindReview({
      ...(await props("standard")),
      execute: async () => reviewExecution({ model: "gpt-5.6-luna", reasoningEffort: "xhigh", usage: false }),
    });
    const incompleteCoverage = await executeAutomatedBlindReview({
      ...(await props("standard")),
      execute: async () => reviewExecution({
        model: "gpt-5.6-luna",
        reasoningEffort: "xhigh",
        response: JSON.stringify({
          repetitions: [{
            repetitionId: "red-1",
            variant: "baseline",
            outcome: "behavior_fail",
            evidenceClass: "demonstrated_failure",
          }],
          rationalization: null,
          behaviorRisk: null,
          smallestWordingChange: null,
          retestTarget: null,
        }),
      }),
    });

    expect(malformed).toMatchObject({ outcome: "not_evaluated", reviewReceipt: null, parseError: "review response is not valid JSON" });
    expect(missingUsage).toMatchObject({ outcome: "infrastructure_error", reviewReceipt: null });
    expect(missingUsage.infrastructureReasons).toContain("ACPX review usage evidence is missing");
    expect(incompleteCoverage).toMatchObject({
      outcome: "not_evaluated",
      reviewReceipt: null,
      parseError: "review candidate must cover every selected repetition exactly once",
    });
  });

  it("closes a high-risk named session when effort configuration fails", async () => {
    const commands: string[][] = [];
    let callIndex = 0;
    const receipt = await executeAutomatedBlindReview({
      ...(await props("high")),
      execute: async (command) => {
        commands.push([...command.args]);
        callIndex += 1;
        const execution = reviewExecution({ model: "claude-opus-4-7", reasoningEffort: "xhigh" });
        return callIndex === 2 ? { ...execution, exitCode: 2 } : execution;
      },
    });

    expect(receipt.outcome).toBe("infrastructure_error");
    expect(commands).toHaveLength(3);
    expect(commands[2]).toEqual(expect.arrayContaining(["sessions", "close"]));
  });
});
