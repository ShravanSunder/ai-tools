import { describe, expect, it, vi } from "vitest";

import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { RunSubjectRepetitionProps, SubjectRepetitionReceipt } from "./subject-repetition.js";
import {
  runScenarioRepetitions,
  selectBaselineSkillSource,
  type RunScenarioRepetitionsProps,
} from "./repetition-coordinator.js";

function transcript(sessionId: string): AcpxTranscriptFacts {
  return {
    sessionId,
    resolvedModel: "gpt-5.6-luna",
    reasoningEffort: "high",
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
  const sourceDigest =
    props.sourceDigest === undefined
      ? props.variant === "baseline"
        ? null
        : "sha256:current-skill"
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
    requestedReasoningEffort: "high",
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
  repetitions = 3,
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
      reasoningEffort: "high",
      permissionMode: "approve-reads",
      disabledAmbientSkillPaths: [],
      timeoutSeconds: 120,
      redactionSecrets: [],
    },
    runRepetition: run,
  };
}

describe("scenario repetition coordinator", () => {
  it("runs each variant as a concurrent wave and returns deterministic ordered receipts", async () => {
    const activeByVariant = new Map<string, number>();
    const peakByVariant = new Map<string, number>();
    const calls: string[] = [];
    let sequence = 0;
    const result = await runScenarioRepetitions({
      ...props(async (input) => {
        const active = (activeByVariant.get(input.variant) ?? 0) + 1;
        activeByVariant.set(input.variant, active);
        peakByVariant.set(input.variant, Math.max(peakByVariant.get(input.variant) ?? 0, active));
        calls.push(input.repetitionId);
        await new Promise((resolve) => setTimeout(resolve, input.variant === "baseline" ? 5 : 1));
        activeByVariant.set(input.variant, active - 1);
        return receipt({ sequence: ++sequence, variant: input.variant });
      }, 3),
    });

    expect(peakByVariant).toEqual(new Map([
      ["baseline", 3],
      ["treatment", 3],
    ]));
    expect(calls.every((call) => call.startsWith("baseline-") || call.startsWith("treatment-"))).toBe(true);
    expect(result.attempts.map((attempt) => `${attempt.variant}-${attempt.repetitionNumber}`)).toEqual([
      "baseline-1",
      "baseline-2",
      "baseline-3",
      "treatment-1",
      "treatment-2",
      "treatment-3",
    ]);
    expect(result.baseline).toHaveLength(3);
    expect(result.treatment).toHaveLength(3);
  });

  it("accepts exactly three repetitions per variant", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(
      props(async (input) => receipt({ sequence: ++sequence, variant: input.variant }), 3),
    );

    expect(result.status).toBe("executed");
  });

  it("does not launch the treatment wave after the runner aborts during baseline", async () => {
    const abortController = new AbortController();
    const launched: string[] = [];
    const runRepetition = vi.fn(async (input: RunSubjectRepetitionProps) => {
      launched.push(input.repetitionId);
      abortController.abort();
      return receipt({ sequence: launched.length, variant: input.variant, status: "infrastructure_error" });
    });

    await expect(runScenarioRepetitions({
      ...props(runRepetition, 3),
      infrastructureRetries: 1,
      repetitionProps: { ...props(runRepetition, 3).repetitionProps, signal: abortController.signal },
    })).rejects.toThrow(/refusing retry/u);
    expect(launched.every((repetitionId) => repetitionId.startsWith("baseline-"))).toBe(true);
  });

  it("constructs a pinned previous-revision baseline source without a fallback", () => {
    expect(
      selectBaselineSkillSource({
        baseline: "previous_revision",
        baselineRevision: "0123456789abcdef0123456789abcdef01234567",
        repositoryRoot: "/tmp/source-repository",
        skillRelativePath: "plugins/workflow/skills/changed-skill",
      }),
    ).toEqual({
      mode: "previous_revision",
      repositoryRoot: "/tmp/source-repository",
      revision: "0123456789abcdef0123456789abcdef01234567",
      skillRelativePath: "plugins/workflow/skills/changed-skill",
    });
    expect(() =>
      selectBaselineSkillSource({
        baseline: "previous_revision",
        baselineRevision: null,
        repositoryRoot: "/tmp/source-repository",
        skillRelativePath: "plugins/workflow/skills/changed-skill",
      }),
    ).toThrow(/immutable 40-character Git revision/);
  });

  it.each([2, 4, 5])("rejects non-canonical repetition count %i before launch", async (repetitions) => {
    const runRepetition = vi.fn(async () => receipt({ sequence: 1, variant: "baseline" }));
    await expect(runScenarioRepetitions(props(runRepetition, repetitions)))
      .rejects.toThrow(/exactly three/);
    expect(runRepetition).not.toHaveBeenCalled();
  });

  it("returns an executed receipt for three comparable fresh pairs", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(
      props(async (input) =>
        receipt({
          sequence: ++sequence,
          variant: input.variant,
        }),
      ),
    );

    expect(result.status).toBe("executed");
    expect(result.infrastructureReasons).toEqual([]);
    expect(result.baseline).toHaveLength(3);
    expect(result.treatment).toHaveLength(3);
    expect(
      new Set([...result.baseline, ...result.treatment].map((item) => item.transcript.sessionId))
        .size,
    ).toBe(6);
    expect(result.pairSetFingerprint).toMatch(/^sha256:/u);
  });

  it("settles the complete baseline batch before treatment and preserves batch order", async () => {
    let sequence = 0;
    const starts: string[] = [];
    const resolvers = new Map<string, () => void>();
    const execution = runScenarioRepetitions({
      ...props(async (input) => new Promise<SubjectRepetitionReceipt>((resolve) => {
        starts.push(`${input.variant}-${input.repetitionId.split("-")[1]}`);
        resolvers.set(input.repetitionId, () => resolve(receipt({
          sequence: ++sequence,
          variant: input.variant,
        })));
      })),
    });

    expect(starts).toEqual(["baseline-1", "baseline-2", "baseline-3"]);
    expect(starts).not.toContain("treatment-1");

    resolvers.get("baseline-1-attempt-1")?.();
    resolvers.get("baseline-2-attempt-1")?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(starts).not.toContain("treatment-1");

    resolvers.get("baseline-3-attempt-1")?.();
    await vi.waitFor(() => expect(starts).toContain("treatment-1"));
    expect(starts.slice(3)).toEqual(["treatment-1", "treatment-2", "treatment-3"]);

    resolvers.get("treatment-1-attempt-1")?.();
    resolvers.get("treatment-2-attempt-1")?.();
    resolvers.get("treatment-3-attempt-1")?.();
    const result = await execution;

    expect(result.attempts.map((attempt) => `${attempt.variant}-${attempt.repetitionNumber}`)).toEqual([
      "baseline-1",
      "baseline-2",
      "baseline-3",
      "treatment-1",
      "treatment-2",
      "treatment-3",
    ]);
  });

  it("fails closed when a session is reused across repetitions", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(
      props(async (input) =>
        receipt({
          sequence: ++sequence,
          variant: input.variant,
          sessionId: "reused-session",
        }),
      ),
    );

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toContain(
      "ACPX session ids are not unique across repetitions",
    );
  });

  it("fails closed when common inputs drift between repetitions", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(
      props(async (input) =>
        receipt({
          sequence: ++sequence,
          variant: input.variant,
          commonInputDigest: sequence === 4 ? "sha256:drifted-input" : "sha256:common-input",
        }),
      ),
    );

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toContain("common inputs differ across repetitions");
  });

  it("fails closed on source drift and any repetition infrastructure error", async () => {
    let sequence = 0;
    const result = await runScenarioRepetitions(
      props(async (input) => {
        sequence += 1;
        return receipt({
          sequence,
          variant: input.variant,
          ...(input.variant === "treatment" && sequence === 4
            ? { sourceDigest: "sha256:changed-current-skill" }
            : {}),
          ...(sequence === 5 ? { status: "infrastructure_error" } : {}),
        });
      }),
    );

    expect(result.status).toBe("infrastructure_error");
    expect(result.infrastructureReasons).toEqual(
      expect.arrayContaining([
        "treatment source digest differs across repetitions",
        "one or more repetitions contain an infrastructure error",
      ]),
    );
  });

  it("retries only infrastructure failures and preserves every attempt receipt", async () => {
    let sequence = 0;
    let failedOnce = false;
    const launches: Array<{ attemptNumber: number; retry: boolean }> = [];
    const attemptIdentities: string[] = [];
    const result = await runScenarioRepetitions({
      ...props(async (input) => {
        attemptIdentities.push(input.repetitionId);
        sequence += 1;
        if (!failedOnce && input.variant === "baseline") {
          failedOnce = true;
          return receipt({ sequence, variant: input.variant, status: "infrastructure_error" });
        }
        return receipt({ sequence, variant: input.variant });
      }),
      infrastructureRetries: 1,
      beforeAttempt: ({ attemptNumber, retry }) => launches.push({ attemptNumber, retry }),
    });

    expect(result.status).toBe("executed");
    expect(result.attempts[0]?.receipts).toHaveLength(2);
    expect(result.attempts[0]?.receipts.map((item) => item.status)).toEqual([
      "infrastructure_error",
      "executed",
    ]);
    expect(result.baseline[0]?.repetitionId).toBe(result.attempts[0]?.selectedRepetitionId);
    expect(launches.slice(0, 4)).toEqual([
      { attemptNumber: 1, retry: false },
      { attemptNumber: 1, retry: false },
      { attemptNumber: 1, retry: false },
      { attemptNumber: 2, retry: true },
    ]);
    expect(attemptIdentities).toEqual([
      "baseline-1-attempt-1",
      "baseline-2-attempt-1",
      "baseline-3-attempt-1",
      "baseline-1-attempt-2",
      "treatment-1-attempt-1",
      "treatment-2-attempt-1",
      "treatment-3-attempt-1",
    ]);
  });

  it("persists failed attempts before retrying and records their immutable receipt paths", async () => {
    let sequence = 0;
    let failedOnce = false;
    const persistedStatuses: string[] = [];
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
      persistAttemptReceipt: async ({ receipt: attemptReceipt, attemptNumber }) => {
        persistedStatuses.push(attemptReceipt.status);
        return `/tmp/attempt-${attemptNumber}-${attemptReceipt.repetitionId}.json`;
      },
    });

    expect(persistedStatuses.slice(0, 2)).toEqual(["infrastructure_error", "executed"]);
    expect(result.attempts[0]?.durableAttemptReceiptPaths).toHaveLength(2);
  });

  it("converts setup or process-launch exceptions into durable retryable attempts", async () => {
    let sequence = 0;
    let threwOnce = false;
    const persistedStatuses: string[] = [];
    const runRepetition = async (input: RunSubjectRepetitionProps): Promise<SubjectRepetitionReceipt> => {
      if (!threwOnce && input.variant === "baseline") {
        threwOnce = true;
        throw new Error("spawn failed before ACPX produced a receipt");
      }
      sequence += 1;
      return receipt({ sequence, variant: input.variant });
    };

    const result = await runScenarioRepetitions({
      ...props(runRepetition),
      infrastructureRetries: 1,
      persistAttemptReceipt: async ({ receipt: attemptReceipt, attemptNumber }) => {
        persistedStatuses.push(attemptReceipt.status);
        return `/tmp/exception-attempt-${attemptNumber}-${attemptReceipt.repetitionId}.json`;
      },
    });

    expect(result.status).toBe("executed");
    expect(persistedStatuses.slice(0, 2)).toEqual(["infrastructure_error", "executed"]);
    expect(result.attempts[0]?.receipts[0]).toMatchObject({
      status: "infrastructure_error",
      process: { cleanupComplete: false },
    });
    expect(result.attempts[0]?.receipts[0]?.infrastructureReasons).toContain(
      "repetition setup or process launch failed: spawn failed before ACPX produced a receipt",
    );
  });

  it("refuses a retry after the runner-owned abort signal fires", async () => {
    const abortController = new AbortController();
    const runRepetition = vi.fn(async (input: RunSubjectRepetitionProps) => {
      abortController.abort();
      return receipt({ sequence: 1, variant: input.variant, status: "infrastructure_error" });
    });

    await expect(
      runScenarioRepetitions({
        ...props(runRepetition),
        infrastructureRetries: 1,
        repetitionProps: {
          ...props(runRepetition).repetitionProps,
          signal: abortController.signal,
        },
      }),
    ).rejects.toThrow(/refusing retry/u);
    expect(runRepetition).toHaveBeenCalledTimes(1);
  });

  it("does not accept a final successful attempt after cancellation fires during durable persistence", async () => {
    const abortController = new AbortController();
    let sequence = 0;
    const runRepetition = vi.fn(async (input: RunSubjectRepetitionProps) =>
      receipt({
        sequence: ++sequence,
        variant: input.variant,
      }),
    );

    await expect(
      runScenarioRepetitions({
        ...props(runRepetition),
        repetitionProps: {
          ...props(runRepetition).repetitionProps,
          signal: abortController.signal,
        },
        persistAttemptReceipt: async ({ variant, repetitionNumber, attemptNumber }) => {
          if (variant === "treatment" && repetitionNumber === 3 && attemptNumber === 1)
            abortController.abort();
          return `/tmp/${variant}-${repetitionNumber}-${attemptNumber}.json`;
        },
      }),
    ).rejects.toThrow(/abort.*durable/u);
    expect(runRepetition).toHaveBeenCalledTimes(6);
  });
});
