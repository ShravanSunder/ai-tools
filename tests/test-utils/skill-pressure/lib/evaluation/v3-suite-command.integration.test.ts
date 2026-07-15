import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  calculateEvaluationRegistrySnapshotDigest,
  type EvaluationRegistry,
} from "../authority/evaluation-registry.js";
import { calculateParentAcceptanceReceiptDigest } from "../authority/authority-receipts.js";
import type { RuntimeProfileReceipt } from "../runtime/runtime-profile.js";
import {
  createClaimedRequirementValidationFixture,
  createRunAcceptanceFixture,
  createValidatedCurrentBaselineFixture,
  fixtureAuthorityDigest,
} from "../test-fixtures.js";
import { executeV3SuiteCommand } from "./v3-suite-command.js";
import {
  type ExecutedV3BehavioralScenario,
  type V3BehavioralScenarioReceipt,
} from "./v3-behavioral-scenario-execution.js";
import { deriveScenarioExecutionBudget } from "./scenario-execution-budget.js";
import { calculateV3ScenarioEvidenceDigest } from "./v3-behavioral-scenario-execution.js";
import { calculateV3ScenarioAuthorityRunDigest } from "./v3-scenario-authority.js";
import { calculateV3SuiteSelectionDigest, selectV3SuiteScenarios } from "./v3-suite-selection.js";

const CLAIMED = createClaimedRequirementValidationFixture({
  claimedRequirementIds: ["behavior-one"],
});
const SUITE_PREFLIGHT = {
  receiptPath: "/tmp/skill-pressure-suite-preflight.json",
  receiptDigest: `sha256:${"f".repeat(64)}`,
} as const;
const COMMAND_REPOSITORY_ROOT = await mkdtemp(path.join(tmpdir(), "v3-command-repository-"));
const AUTHORITY_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const CALIBRATION_PATH = `${AUTHORITY_ROOT}/gate-calibration.json`;
await mkdir(path.join(COMMAND_REPOSITORY_ROOT, AUTHORITY_ROOT), { recursive: true });
const CALIBRATION = createValidatedCurrentBaselineFixture({
  scenarioId: "gate",
  behaviorContractDigest: fixtureAuthorityDigest("b"),
  claimedRequirementManifestDigest: CLAIMED.manifestDigest,
});
const CALIBRATION_SOURCE = `${JSON.stringify(CALIBRATION.receipt, null, 2)}\n`;
const CALIBRATION_SOURCE_DIGEST = `sha256:${createHash("sha256").update(CALIBRATION_SOURCE).digest("hex")}`;
await writeFile(path.join(COMMAND_REPOSITORY_ROOT, CALIBRATION_PATH), CALIBRATION_SOURCE, {
  flag: "wx",
});

const REGISTRY: EvaluationRegistry = {
  schemaVersion: 1,
  scenarios: [
    {
      scenarioId: "gate",
      behaviorContractDigest: fixtureAuthorityDigest("b"),
      evaluationRole: "gate",
      freshness: "fresh",
      validityReview: {
        receiptPath: "gate-validity.json",
        receiptDigest: fixtureAuthorityDigest("c"),
      },
      calibrationReceipt: {
        receiptPath: CALIBRATION_PATH,
        receiptDigest: CALIBRATION_SOURCE_DIGEST,
      },
    },
    {
      scenarioId: "diagnostic",
      behaviorContractDigest: fixtureAuthorityDigest("e"),
      evaluationRole: "diagnostic",
      freshness: "uncalibrated",
      validityReview: {
        receiptPath: "diagnostic-validity.json",
        receiptDigest: fixtureAuthorityDigest("f"),
      },
      calibrationReceipt: null,
    },
  ],
};

const CANDIDATES = [
  { scenarioId: "gate", risk: "standard" as const, repetitions: 3 },
  { scenarioId: "diagnostic", risk: "standard" as const, repetitions: 3 },
];

const VERIFIED_PROFILE: RuntimeProfileReceipt = {
  requested: { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "high" },
  acceptedProviderReported: { model: "gpt-5.6-luna", reasoningEffort: "high" },
  providerReported: { model: "gpt-5.6-luna", reasoningEffort: "high" },
  verification: { status: "verified", reasonCode: null, reasons: [] },
};

async function executedScenario(props: {
  readonly scenarioId: "gate" | "diagnostic";
  readonly outcome: "pass" | "behavior_fail";
  readonly releaseAuthority?: boolean;
}): Promise<ExecutedV3BehavioralScenario> {
  const gate = props.scenarioId === "gate";
  const receiptDirectory = await mkdtemp(path.join(tmpdir(), "v3-scenario-command-"));
  const writeFixture = async (fileName: string, receipt: unknown) => {
    const receiptPath = path.join(receiptDirectory, fileName);
    const source = `${JSON.stringify(receipt, null, 2)}\n`;
    await writeFile(receiptPath, source, { flag: "wx" });
    return {
      receiptPath,
      receiptDigest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
    };
  };
  const attemptReceipts = await Promise.all(
    Array.from({ length: 6 }, (_, index) => {
      const variant = index < 3 ? "baseline" : "treatment";
      const repetitionNumber = (index % 3) + 1;
      return writeFixture(`attempt-${index + 1}.json`, {
        schemaVersion: 1,
        scenarioId: props.scenarioId,
        variant,
        repetitionNumber,
        attemptNumber: 1,
        durableFacts: {},
        repetition: {
          evidence: { usageObservations: ['{"inputTokens":10,"outputTokens":5}'] },
        },
        lastDurableStage: "attempt_receipt_published",
      });
    }),
  );
  const repetitionReceipts = await Promise.all(
    attemptReceipts.map((attempt, index) => {
      const variant = index < 3 ? "baseline" : "treatment";
      const repetitionNumber = (index % 3) + 1;
      return writeFixture(`repetition-${index + 1}.json`, {
        schemaVersion: 1,
        scenarioId: props.scenarioId,
        variant,
        repetitionNumber,
        repetitionId: `${variant}-${repetitionNumber}`,
        acceptedAttemptReceiptPath: attempt.receiptPath,
        acceptedAttemptReceiptDigest: attempt.receiptDigest,
        lastDurableStage: "repetition_receipt_published",
      });
    }),
  );
  const progressReceipt = await writeFixture("progress-1.json", {
    schemaVersion: 1,
    scenarioId: props.scenarioId,
    status: "completed",
    lastDurableStage: "reduction_completed",
    completedAttemptReceiptPaths: attemptReceipts.map((receipt) => receipt.receiptPath),
    reasonCode: null,
  });
  const reviewerPromptReceipt = await writeFixture("reviewer-prompt.json", {
    schemaVersion: 1,
    scenarioId: props.scenarioId,
    risk: "standard",
    namedSessionIdentity: null,
    providerSessionIdentity: "codex-session-fixture",
    command: {
      commandType: "reviewer_prompt",
      exitCode: 0,
      timedOut: false,
      processClosed: true,
      streamsDrained: true,
      cleanupComplete: true,
      termSent: false,
      killSent: false,
    },
  });
  const reviewerLifecycle = {
    risk: "standard",
    state: "completed",
    lifecycleComplete: true,
    failureCommandType: null,
    namedSessionIdentity: null,
    providerSessionIdentity: "codex-session-fixture",
    usageObserved: true,
    commandReceipts: [{ commandType: "reviewer_prompt", ...reviewerPromptReceipt }],
  } as const;
  const comparisonValidation = { valid: true, reasons: [] } as const;
  const objectiveResults: V3BehavioralScenarioReceipt["objectiveResults"] = [];
  const semanticValidation = { valid: true, reason: null } as const;
  const semanticCandidate = {};
  const subjects: V3BehavioralScenarioReceipt["subjects"] = [];
  const reduction: V3BehavioralScenarioReceipt["reduction"] =
    props.outcome === "pass"
      ? { outcome: "pass" as const, reasonCode: null, reasons: [] }
      : {
          outcome: "behavior_fail" as const,
          reasonCode: "treatment_behavior_failed",
          reasons: ["fixture failure"],
        };
  const executionBudget = deriveScenarioExecutionBudget({
    repetitions: 3,
    infrastructureRetries: 0,
    acceptedCaps: {
      maxModelPrompts: 10,
      maxAcpxCommands: 10,
      maxRetries: 0,
      maxObservedTokens: 1_000_000,
    },
    commandSlots: [
      { commandType: "subject", acpxTimeoutMs: 1, executorOverheadMs: 0, terminationGraceMs: 1 },
    ],
    fixtureSetupReserveMs: 0,
    scenarioCleanupReserveMs: 0,
    receiptFlushReserveMs: 1,
    schedulingMarginMs: 0,
    registeredScenarioCount: 1,
    jobs: 1,
    vitestEmergencyReserveMs: 1,
  });
  const executionPreflight = await writeFixture("execution-graph-preflight.json", {
    schemaVersion: 1,
    scenarioId: props.scenarioId,
    executionGraph: executionBudget.executionGraph,
    acceptedCaps: executionBudget.acceptedCaps,
    status: "accepted_before_launch",
  });
  const executionAccounting = {
    preflightReceipt: executionPreflight,
    observed: {
      modelPrompts: executionBudget.executionGraph.maximumModelPrompts,
      acpxCommands: executionBudget.executionGraph.maximumAcpxCommands,
      retries: 0,
      observedTokens: 100,
    },
  } as const;
  const registrySnapshotDigest = calculateEvaluationRegistrySnapshotDigest(REGISTRY);
  const evidenceDigest = calculateV3ScenarioEvidenceDigest({
    registrySnapshotDigest,
    comparisonValidation,
    objectiveResults,
    semanticValidation,
    semanticCandidate,
    subjects,
    reviewerRuntimeProfile: VERIFIED_PROFILE,
    reviewerLifecycle,
    attemptReceipts,
    repetitionReceipts,
    progressReceipts: [progressReceipt],
    executionBudget,
    executionAccounting,
    reduction,
  });
  const behaviorContractDigest = gate ? fixtureAuthorityDigest("b") : fixtureAuthorityDigest("e");
  const runDigest = calculateV3ScenarioAuthorityRunDigest(
    {
      scenarioId: props.scenarioId,
      behaviorContractDigest,
      behaviorRequirementIds: ["behavior-one"],
      evaluationRole: gate ? "gate" : "diagnostic",
      outcome: reduction.outcome,
      comparisonIntent: "non_regression",
      evidenceDigest,
    },
    CLAIMED.manifestDigest,
  );
  const acceptance =
    props.releaseAuthority === true
      ? createRunAcceptanceFixture({
          calibration: CALIBRATION,
          runDigest,
          claimedRequirementManifestDigest: CLAIMED.manifestDigest,
        })
      : null;
  const acceptancePath = `${AUTHORITY_ROOT}/${path.basename(receiptDirectory)}-acceptance.json`;
  const acceptanceSource = acceptance === null ? null : `${JSON.stringify(acceptance, null, 2)}\n`;
  const acceptanceSourceDigest =
    acceptanceSource === null
      ? null
      : `sha256:${createHash("sha256").update(acceptanceSource).digest("hex")}`;
  if (acceptanceSource !== null) {
    await writeFile(path.join(COMMAND_REPOSITORY_ROOT, acceptancePath), acceptanceSource, {
      flag: "wx",
    });
  }
  const receipt = {
    schemaVersion: 3,
    scenarioId: props.scenarioId,
    behaviorIdentity: {
      behaviorContractDigest,
      behaviorRequirementIds: ["behavior-one"],
      comparisonIntent: "non_regression",
      expectedRepetitions: 3,
    },
    authoritySnapshot: {
      evaluationRole: gate ? "gate" : "diagnostic",
      freshness: gate ? "fresh" : "uncalibrated",
      registrySnapshotDigest,
      calibrationStatus: gate ? "calibrated" : "uncalibrated",
      runDigest,
      evidenceDigest,
      releaseAuthority: props.releaseAuthority ?? false,
      reasonCode:
        props.releaseAuthority === true
          ? null
          : gate
            ? "non_passing_gate_outcome"
            : "diagnostic_result",
      parentAcceptanceReceiptDigest:
        acceptance === null ? null : calculateParentAcceptanceReceiptDigest(acceptance),
      parentAcceptanceSourceReceipt:
        props.releaseAuthority === true
          ? { receiptPath: acceptancePath, receiptDigest: acceptanceSourceDigest! }
          : null,
      calibrationSourceReceipt: gate
        ? { receiptPath: CALIBRATION_PATH, receiptDigest: CALIBRATION_SOURCE_DIGEST }
        : null,
      calibrationAuthorityReceiptDigest: gate ? CALIBRATION.authorityReceiptDigest : null,
      calibrationFingerprintDigest: gate ? CALIBRATION.calibrationFingerprint.digest : null,
      calibrationFreshnessInputs: gate ? CALIBRATION.receipt.calibrationFingerprint : null,
      demotedThisRun: false,
    },
    claimedRequirements: {
      source: CLAIMED.manifest.source,
      claimedRequirementIds: CLAIMED.manifest.claimedRequirementIds,
      manifestDigest: CLAIMED.manifestDigest,
      status: CLAIMED.status,
      unknownRequirementIds: CLAIMED.unknownRequirementIds,
      untracedRequirementIds: CLAIMED.untracedRequirementIds,
    },
    comparisonValidation,
    objectiveResults,
    semanticReview: {
      validation: semanticValidation,
      runtimeProfile: VERIFIED_PROFILE,
      candidate: semanticCandidate,
    },
    reviewerLifecycle,
    runtimeProfiles: {
      subjects: Array.from({ length: 6 }, () => VERIFIED_PROFILE),
      reviewer: VERIFIED_PROFILE,
    },
    subjects,
    executionBudget,
    executionAccounting,
    attemptReceipts,
    repetitionReceipts,
    progressReceipts: [progressReceipt],
    reduction,
    lastDurableStage: "scenario_receipt_published",
  } as const satisfies V3BehavioralScenarioReceipt;
  const receiptPath = path.join(receiptDirectory, "scenario-receipt.json");
  const source = `${JSON.stringify(receipt, null, 2)}\n`;
  await writeFile(receiptPath, source, { flag: "wx" });
  return {
    receiptPath,
    receiptDigest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
    receipt,
  };
}

async function persistAggregate(receipt: unknown): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "v3-command-smoke-"));
  const receiptPath = path.join(directory, "aggregate-receipt.json");
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
  return receiptPath;
}

describe("v3 fake-backed command smoke", () => {
  it("returns nonzero for a behavioral gate failure and still creates an aggregate", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "gate-failure",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () =>
        executedScenario({ scenarioId: "gate", outcome: "behavior_fail" }),
      persistAggregate,
    });

    expect(result.exitCode).toBe(1);
    expect(result.aggregate.suite).toEqual({
      kind: "gate",
      terminalState: "failed",
      success: false,
    });
    expect(JSON.parse(await readFile(result.aggregateReceiptPath, "utf8"))).toMatchObject({
      runId: "gate-failure",
    });
  });

  it("returns zero with completed_with_findings for a complete diagnostic behavioral failure", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "diagnostic",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "diagnostic-finding",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () =>
        executedScenario({ scenarioId: "diagnostic", outcome: "behavior_fail" }),
      persistAggregate,
    });

    expect(result.exitCode).toBe(0);
    expect(result.aggregate.suite).toEqual({
      kind: "diagnostic",
      terminalState: "completed_with_findings",
      success: true,
    });
  });

  it("returns nonzero and records missing accounting when selected execution is absent", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "diagnostic",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "missing-diagnostic",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () => null,
      persistAggregate,
    });

    expect(result.exitCode).toBe(1);
    expect(result.aggregate.counts.missing).toBe(1);
    expect(result.aggregate.suite.terminalState).toBe("failed");
  });

  it("fails when an authoritative command selects no executable scenarios", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      risk: "high",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "empty-gate",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () => {
        throw new Error("no scenario should execute");
      },
      persistAggregate,
    });

    expect(result.aggregate.counts.selected).toBe(0);
    expect(result.exitCode).toBe(1);
  });

  it("rejects registry drift between selection and command execution", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const driftedRegistry: EvaluationRegistry = {
      ...REGISTRY,
      scenarios: REGISTRY.scenarios.map((row) =>
        row.scenarioId === "gate" ? { ...row, freshness: "stale" as const } : row,
      ),
    };

    await expect(
      executeV3SuiteCommand({
        runId: "registry-drift",
        repositoryRoot: COMMAND_REPOSITORY_ROOT,
        discoveredScenarioCount: CANDIDATES.length,
        invalid: [],
        selection,
        registrySnapshot: driftedRegistry,
        executionGraphPreflightReceipt: SUITE_PREFLIGHT,
        executeScenario: async () =>
          executedScenario({ scenarioId: "gate", outcome: "pass", releaseAuthority: true }),
        persistAggregate,
      }),
    ).rejects.toThrow(/registry snapshot digest does not match/u);
  });

  it("rejects a mutated selection receipt before invoking a scenario", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    await expect(
      executeV3SuiteCommand({
        runId: "mutated-selection",
        repositoryRoot: COMMAND_REPOSITORY_ROOT,
        discoveredScenarioCount: CANDIDATES.length,
        invalid: [],
        selection: { ...selection, aggregateSuiteKind: "diagnostic" },
        registrySnapshot: REGISTRY,
        executionGraphPreflightReceipt: SUITE_PREFLIGHT,
        executeScenario: async () => {
          throw new Error("scenario executor must not run");
        },
        persistAggregate,
      }),
    ).rejects.toThrow(/selection digest does not match|selector-produced/u);
  });

  it("rejects a recomputed selection that omits an eligible gate", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const forgedBase = {
      ...selection,
      selectedScenarioIds: [] as readonly string[],
      selectedScenarios: [] as readonly {
        readonly scenarioId: string;
        readonly repetitions: number;
      }[],
    };
    const { selectionDigest: _oldDigest, ...forgedWithoutDigest } = forgedBase;

    await expect(
      executeV3SuiteCommand({
        runId: "recomputed-partial-selection",
        repositoryRoot: COMMAND_REPOSITORY_ROOT,
        discoveredScenarioCount: CANDIDATES.length,
        invalid: [],
        selection: {
          ...forgedWithoutDigest,
          selectionDigest: calculateV3SuiteSelectionDigest(forgedWithoutDigest),
        },
        registrySnapshot: REGISTRY,
        executionGraphPreflightReceipt: SUITE_PREFLIGHT,
        executeScenario: async () => {
          throw new Error("scenario executor must not run");
        },
        persistAggregate,
      }),
    ).rejects.toThrow(/selector-produced/u);
  });

  it("does not trust an authoritative summary when the persisted scenario receipt changed", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "tampered-scenario-receipt",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () => {
        const executed = await executedScenario({
          scenarioId: "gate",
          outcome: "pass",
          releaseAuthority: true,
        });
        await writeFile(executed.receiptPath, "{}\n");
        return executed;
      },
      persistAggregate,
    });

    expect(result.exitCode).toBe(1);
    expect(result.aggregate.counts.missing).toBe(1);
    expect(result.aggregate.counts.releaseAuthorityGranted).toBe(0);
  });

  it("preserves claimed-ID and parent-acceptance traceability for an authoritative gate pass", async () => {
    const selection = selectV3SuiteScenarios({
      mode: "gate",
      candidates: CANDIDATES,
      registry: REGISTRY,
      claimedRequirements: CLAIMED,
    });
    const result = await executeV3SuiteCommand({
      runId: "gate-pass",
      repositoryRoot: COMMAND_REPOSITORY_ROOT,
      discoveredScenarioCount: CANDIDATES.length,
      invalid: [],
      selection,
      registrySnapshot: REGISTRY,
      executionGraphPreflightReceipt: SUITE_PREFLIGHT,
      executeScenario: async () =>
        executedScenario({ scenarioId: "gate", outcome: "pass", releaseAuthority: true }),
      persistAggregate,
    });

    expect(result.exitCode).toBe(0);
    expect(result.aggregate.claimedRequirementInputDigest).toBe(CLAIMED.manifestDigest);
    expect(result.aggregate.untracedBehaviorRequirementIds).toEqual([]);
    expect(result.aggregate.results[0]).toMatchObject({
      claimedRequirementManifestDigest: CLAIMED.manifestDigest,
      parentAcceptanceReceiptDigest: expect.stringMatching(/^sha256:/u),
      releaseAuthority: true,
    });
  });
});
