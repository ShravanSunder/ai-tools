import { describe, expect, it } from "vitest";

import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { SubjectRepetitionReceipt } from "./subject-repetition.js";
import {
  runScenarioRepetitions,
  selectBaselineSkillSource,
  type RunScenarioRepetitionsProps,
} from "./repetition-coordinator.js";

function transcript(sessionId: string): AcpxTranscriptFacts {
  return {
    sessionId,
    resolvedModel: "gpt-5.6-luna",
    reasoningEffort: "xhigh",
    stopReason: "end_turn",
    promptCount: 1,
    mcpServerCount: 0,
    visibleResponse: "Operator-facing answer",
    toolObservations: [],
    usageObservations: ['{"inputTokens":10,"outputTokens":5}'],
    diagnosticErrors: [],
    parseErrors: [],
    transportErrors: [],
  };
}

function receipt(props: {
  readonly sequence: number;
  readonly variant: "baseline" | "treatment";
  readonly sessionId?: string;
  readonly commonInputDigest?: string;
  readonly sourceDigest?: string | null;
  readonly status?: "executed" | "infrastructure_error";
}): SubjectRepetitionReceipt {
  const sourceDigest = props.sourceDigest === undefined
    ? props.variant === "baseline" ? null : "sha256:current-skill"
    : props.sourceDigest;
  return {
    runnerVersion: "skill-pressure-repetition-v2",
    repetitionId: `repetition-${props.sequence}`,
    scenarioId: "shortcut-pressure",
    variant: props.variant,
    repositoryDirectory: `/tmp/repository-${props.sequence}`,
    repositoryIdentity: `sha256:repository-${props.sequence}`,
    commonInputDigest: props.commonInputDigest ?? "sha256:common-input",
    promptDigest: "sha256:prompt",
    fixtureDigest: "sha256:fixture",
    sourceDigest,
    sourceMode: props.variant === "baseline" ? "none" : "current",
    sourceRevision: null,
    installReceipt: null,
    requestedModel: "gpt-5.6-luna",
    requestedReasoningEffort: "xhigh",
    permissionMode: "approve-reads",
    allowedTools: [],
    allowedWritePaths: [],
    writePolicy: { status: "pass", unauthorizedPaths: [] },
    runtimeIdentity: {
      launcher: { executable: "/opt/acpx", prefixArgs: [], source: "global" },
      launcherDigest: "sha256:acpx",
      launcherVersion: "0.12.0",
      codexExecutable: "/opt/codex",
      codexDigest: "sha256:codex",
      codexVersion: "codex-cli 0.144.3",
    },
    disabledAmbientSkills: [],
    repositoryEvidence: {
      files: [],
      changes: { files: [], pathChanges: [], deletedPaths: [], omissions: [] },
      artifacts: [],
      omissions: [],
    },
    transcript: transcript(props.sessionId ?? `session-${props.sequence}`),
    transcriptDigest: `sha256:transcript-${props.sequence}`,
    process: {
      exitCode: props.status === "infrastructure_error" ? 3 : 0,
      timedOut: false,
      cleanupComplete: true,
      stderrDigest: "sha256:stderr",
      stderrExcerpt: "",
      supervisorReceipt: {
        outcome: "completed",
        exitCode: props.status === "infrastructure_error" ? 3 : 0,
        signal: null,
        stdoutEof: true,
        stderrEof: true,
        cleanup: { processGroupId: props.sequence, termSent: false, killSent: false },
      },
    },
    durationMs: 10,
    status: props.status ?? "executed",
    infrastructureReasons: props.status === "infrastructure_error" ? ["ACPX exited 3"] : [],
  };
}

function props(
  run: NonNullable<RunScenarioRepetitionsProps["runRepetition"]>,
  repetitions = 5,
): RunScenarioRepetitionsProps {
  return {
    repetitions,
    baselineSource: { mode: "none" },
    treatmentSource: { mode: "current", directory: "/tmp/current-skill" },
    repetitionProps: {
      runRoot: "/tmp/runs",
      scenarioId: "shortcut-pressure",
      prompt: "Do the pressured task.",
      fixtureFiles: [],
      expectedArtifacts: [],
      allowedTools: [],
      allowedWritePaths: [],
      skillName: "test-skill",
      launcher: { executable: "/opt/acpx", prefixArgs: [], source: "global" },
      codexExecutable: "/opt/codex",
      runtimeIdentity: {
        launcher: { executable: "/opt/acpx", prefixArgs: [], source: "global" },
        launcherDigest: "sha256:acpx",
        launcherVersion: "0.12.0",
        codexExecutable: "/opt/codex",
        codexDigest: "sha256:codex",
        codexVersion: "codex-cli 0.144.3",
      },
      model: "gpt-5.6-luna",
      reasoningEffort: "xhigh",
      permissionMode: "approve-reads",
      disabledAmbientSkillPaths: [],
      timeoutSeconds: 120,
      redactionSecrets: [],
    },
    runRepetition: run,
  };
}

describe("scenario repetition coordinator", () => {
  it("constructs a pinned previous-revision baseline source without a fallback", () => {
    expect(selectBaselineSkillSource({
      baseline: "previous_revision",
      baselineRevision: "0123456789abcdef0123456789abcdef01234567",
      repositoryRoot: "/tmp/source-repository",
      skillRelativePath: "plugins/workflow/skills/changed-skill",
    })).toEqual({
      mode: "previous_revision",
      repositoryRoot: "/tmp/source-repository",
      revision: "0123456789abcdef0123456789abcdef01234567",
      skillRelativePath: "plugins/workflow/skills/changed-skill",
    });
    expect(() => selectBaselineSkillSource({
      baseline: "previous_revision",
      baselineRevision: null,
      repositoryRoot: "/tmp/source-repository",
      skillRelativePath: "plugins/workflow/skills/changed-skill",
    })).toThrow(/immutable 40-character Git revision/);
  });

  it("requires at least five fresh baseline and treatment repetitions", async () => {
    await expect(runScenarioRepetitions(props(async () => receipt({ sequence: 1, variant: "baseline" }), 4)))
      .rejects.toThrow(/at least five/);
  });

  it("returns an executed receipt for five comparable fresh pairs", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(props(async (input) => receipt({
      sequence: ++sequence,
      variant: input.variant,
    })));

    expect(result.status).toBe("executed");
    expect(result.infrastructureReasons).toEqual([]);
    expect(result.baseline).toHaveLength(5);
    expect(result.treatment).toHaveLength(5);
    expect(new Set([...result.baseline, ...result.treatment].map((item) => item.transcript.sessionId)).size).toBe(10);
    expect(result.pairSetFingerprint).toMatch(/^sha256:/u);
  });

  it("fails closed when a session is reused across repetitions", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(props(async (input) => receipt({
      sequence: ++sequence,
      variant: input.variant,
      sessionId: "reused-session",
    })));

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toContain("ACPX session ids are not unique across repetitions");
  });

  it("fails closed when common inputs drift between repetitions", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(props(async (input) => receipt({
      sequence: ++sequence,
      variant: input.variant,
      commonInputDigest: sequence === 7 ? "sha256:drifted-input" : "sha256:common-input",
    })));

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toContain("common inputs differ across repetitions");
  });

  it("fails closed on source drift and any repetition infrastructure error", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(props(async (input) => {
      sequence += 1;
      return receipt({
        sequence,
        variant: input.variant,
        ...(input.variant === "treatment" && sequence > 6
          ? { sourceDigest: "sha256:changed-current-skill" }
          : {}),
        ...(sequence === 9 ? { status: "infrastructure_error" } : {}),
      });
    }));

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toEqual(expect.arrayContaining([
      "treatment source digest differs across repetitions",
      "one or more repetitions contain an infrastructure error",
    ]));
  });

  it("retries only infrastructure failures and preserves every attempt receipt", async () => {
    let sequence = 0;
    let failedOnce = false;
    const result = await runScenarioRepetitions({
      ...props(async (input) => {
        sequence += 1;
        if (!failedOnce && input.variant === "baseline") {
          failedOnce = true;
          return receipt({ sequence, variant: input.variant, status: "infrastructure_error" });
        }
        return receipt({ sequence, variant: input.variant });
      }),
      infrastructureRetries: 1,
    });

    expect(result.status).toBe("executed");
    expect(result.attempts[0]?.receipts).toHaveLength(2);
    expect(result.attempts[0]?.receipts.map((item) => item.status)).toEqual([
      "infrastructure_error",
      "executed",
    ]);
    expect(result.baseline[0]?.repetitionId).toBe(result.attempts[0]?.selectedRepetitionId);
  });
});
