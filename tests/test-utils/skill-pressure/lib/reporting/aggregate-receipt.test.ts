import { createHash } from "node:crypto";
import { mkdir, mkdtemp, symlink, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  validateClaimedRequirementManifest,
  type ClaimedRequirementValidation,
} from "../authority/claimed-requirements.js";
import {
  calculateParentAcceptanceReceiptDigest,
} from "../authority/authority-receipts.js";
import {
  createV3AggregateReceipt,
  validateV3ScenarioExecutionForAggregate,
  type ValidatedV3ScenarioExecutionSummary,
  type V3ScenarioExecutionSummary,
} from "./aggregate-receipt.js";
import {
  createRunAcceptanceFixture,
  createValidatedPromotionFixture,
  fixtureAuthorityDigest,
} from "../test-fixtures.js";
import type { RuntimeProfileReceipt } from "../runtime/runtime-profile.js";
import type { V3BehavioralScenarioReceipt } from "../evaluation/v3-behavioral-scenario-execution.js";
import { calculateV3ScenarioEvidenceDigest } from "../evaluation/v3-behavioral-scenario-execution.js";
import { calculateV3ScenarioAuthorityRunDigest } from "../evaluation/v3-scenario-authority.js";
import { deriveScenarioExecutionBudget } from "../evaluation/scenario-execution-budget.js";

const registrySnapshotDigest = `sha256:${"c".repeat(64)}`;
let authorityFixtureSequence = 0;
const selection = (mode: "gate" | "diagnostic" | "focused", scenarioIds: readonly string[]) => ({
  mode,
  selectionDigest: fixtureAuthorityDigest("9"),
  selectedScenarios: scenarioIds.map((scenarioId) => ({ scenarioId, repetitions: 5 })),
  excludedStaleGateScenarioIds: [],
});

async function writeReceiptFixture(receiptPath: string, receipt: unknown): Promise<{ receiptPath: string; receiptDigest: string }> {
  const source = `${JSON.stringify(receipt, null, 2)}\n`;
  await writeFile(receiptPath, source, { flag: "wx" });
  return { receiptPath, receiptDigest: `sha256:${createHash("sha256").update(source).digest("hex")}` };
}
const VERIFIED_PROFILE: RuntimeProfileReceipt = {
  requested: { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  acceptedProviderReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  providerReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  verification: { status: "verified", reasonCode: null, reasons: [] },
};

function claimedRequirements(
  claimedRequirementIds: readonly string[],
  props: {
    readonly unknownRequirementIds?: readonly string[];
    readonly untracedRequirementIds?: readonly string[];
  } = {},
): ClaimedRequirementValidation {
  const unknownRequirementIds = props.unknownRequirementIds ?? [];
  const untracedRequirementIds = props.untracedRequirementIds ?? [];
  const knownRequirementIds = claimedRequirementIds.filter((requirementId) => !unknownRequirementIds.includes(requirementId));
  const calibratedGateRequirementIds = claimedRequirementIds.filter((requirementId) => !untracedRequirementIds.includes(requirementId));
  return validateClaimedRequirementManifest({
    manifest: { schemaVersion: 1, source: "proof_matrix", claimedRequirementIds },
    knownRequirementIds,
    calibratedGateRequirementIds,
  });
}

function summary(
  props: Partial<V3ScenarioExecutionSummary> & Pick<V3ScenarioExecutionSummary, "scenarioId">,
  claims: ClaimedRequirementValidation = claimedRequirements(["fixture-behavior"]),
): V3ScenarioExecutionSummary {
  return {
    scenarioId: props.scenarioId,
    scenarioReceiptDigest: props.scenarioReceiptDigest ?? `sha256:${"e".repeat(64)}`,
    runDigest: props.runDigest ?? `sha256:${"b".repeat(64)}`,
    claimedRequirementManifestDigest: props.claimedRequirementManifestDigest ?? claims.manifestDigest,
    parentAcceptanceReceiptDigest: "parentAcceptanceReceiptDigest" in props
      ? props.parentAcceptanceReceiptDigest ?? null
      : props.releaseAuthority === true ? `sha256:${"d".repeat(64)}` : null,
    parentAcceptanceSourceReceipt: props.parentAcceptanceSourceReceipt ??
      (props.releaseAuthority === true
        ? { receiptPath: "tests/test-utils/skill-pressure/config/authority-receipts/acceptance.json", receiptDigest: `sha256:${"f".repeat(64)}` }
        : null),
    calibrationSourceReceipt: props.calibrationSourceReceipt ??
      (props.evaluationRole === "gate"
        ? { receiptPath: "tests/test-utils/skill-pressure/config/authority-receipts/calibration.json", receiptDigest: `sha256:${"a".repeat(64)}` }
        : null),
    calibrationAuthorityReceiptDigest: props.calibrationAuthorityReceiptDigest ??
      (props.evaluationRole === "gate" ? `sha256:${"b".repeat(64)}` : null),
    calibrationFingerprintDigest: props.calibrationFingerprintDigest ??
      (props.evaluationRole === "gate" ? `sha256:${"c".repeat(64)}` : null),
    calibrationFreshnessInputs: props.calibrationFreshnessInputs ??
      (props.evaluationRole === "gate"
        ? {
            behaviorContractDigest: `sha256:${"1".repeat(64)}`,
            baselinePolicyDigest: `sha256:${"2".repeat(64)}`,
            runnerSemanticsDigest: `sha256:${"3".repeat(64)}`,
            subjectProfileDigest: `sha256:${"4".repeat(64)}`,
            reviewProfileDigest: `sha256:${"5".repeat(64)}`,
          }
        : null),
    registrySnapshotDigest: props.registrySnapshotDigest ?? registrySnapshotDigest,
    executionStatus: props.executionStatus ?? "executed",
    outcome: props.outcome ?? "pass",
    comparisonIntent: props.comparisonIntent ?? "improvement",
    reasonCode: props.reasonCode ?? null,
    receiptPath: props.receiptPath ?? `/tmp/${props.scenarioId}.json`,
    evaluationRole: props.evaluationRole ?? "diagnostic",
    calibrationStatus: props.calibrationStatus ?? "uncalibrated",
    demotedThisRun: props.demotedThisRun ?? false,
    timedOut: props.timedOut ?? false,
    accountingComplete: props.accountingComplete ?? true,
    behaviorRequirementIds: props.behaviorRequirementIds ?? [],
    releaseAuthority: props.releaseAuthority ?? false,
    authorityReasonCode: props.authorityReasonCode ?? null,
  };
}

async function validateSummaries(
  repositoryRoot: string,
  claims: ClaimedRequirementValidation,
  summaries: readonly V3ScenarioExecutionSummary[],
  options: {
    readonly attemptReceiptCount?: number;
    readonly duplicateAttemptReceipt?: boolean;
    readonly linkCalibrationSource?: boolean;
    readonly registryCalibrationPath?: string;
    readonly registryFreshness?: "fresh" | "stale" | "uncalibrated";
    readonly declaredRepetitions?: number;
    readonly evidenceDigestOverride?: `sha256:${string}`;
    readonly receiptBehaviorRequirementIds?: readonly string[];
    readonly attemptScenarioId?: string;
    readonly deleteProgressReceipt?: boolean;
    readonly useSymlinkedReceiptDirectory?: boolean;
    readonly crossVariantAttemptBinding?: boolean;
  } = {},
): Promise<readonly ValidatedV3ScenarioExecutionSummary[]> {
  const authorityRoot = "tests/test-utils/skill-pressure/config/authority-receipts";
  const fixtureSequence = authorityFixtureSequence++;
  await mkdir(path.join(repositoryRoot, authorityRoot), { recursive: true });
  return Promise.all(summaries.map(async (candidate, index) => {
    const behaviorContractDigest = fixtureAuthorityDigest(String((index % 9) + 1));
    const promotionEvidence = await Promise.all((["attempt", "cleanup"] as const).map(async (receiptKind) =>
      Promise.all((["baseline", "treatment"] as const).flatMap((variant) =>
        Array.from({ length: 5 }, async (_, repetitionIndex) => {
          const repetitionNumber = repetitionIndex + 1;
          const receiptPath = `${authorityRoot}/${candidate.scenarioId}-${fixtureSequence}-${index}-${variant}-${repetitionNumber}-${receiptKind}.json`;
          const reference = await writeReceiptFixture(path.join(repositoryRoot, receiptPath), {
            schemaVersion: 1,
            receiptKind,
            scenarioId: candidate.scenarioId,
            variant,
            repetitionNumber,
            attemptNumber: 1,
          });
          return { ...reference, receiptPath, scenarioId: candidate.scenarioId, variant, repetitionNumber, attemptNumber: 1 } as const;
        })))));
    const promotionAttemptEvidence = promotionEvidence[0];
    const promotionCleanupEvidence = promotionEvidence[1];
    if (promotionAttemptEvidence === undefined || promotionCleanupEvidence === undefined) {
      throw new Error("promotion fixture evidence is incomplete");
    }
    const calibration = candidate.evaluationRole === "gate"
      ? createValidatedPromotionFixture({
          scenarioId: candidate.scenarioId,
          behaviorContractDigest,
          claimedRequirementManifestDigest: claims.manifestDigest,
          attemptReceipts: promotionAttemptEvidence,
          cleanupReceipts: promotionCleanupEvidence,
        })
      : null;
    const calibrationPath = `${authorityRoot}/${candidate.scenarioId}-${fixtureSequence}-${index}-calibration.json`;
    const calibrationSource = calibration === null ? null : `${JSON.stringify(calibration.receipt, null, 2)}\n`;
    const calibrationSourceDigest = calibrationSource === null
      ? null
      : `sha256:${createHash("sha256").update(calibrationSource).digest("hex")}`;
    if (calibrationSource !== null) {
      if (options.linkCalibrationSource === true) {
        const externalPath = path.join(repositoryRoot, `${candidate.scenarioId}-${fixtureSequence}-external-calibration.json`);
        await writeFile(externalPath, calibrationSource, { flag: "wx" });
        await symlink(externalPath, path.join(repositoryRoot, calibrationPath));
      } else {
        await writeFile(path.join(repositoryRoot, calibrationPath), calibrationSource, { flag: "wx" });
      }
    }
    const physicalReceiptDirectory = await mkdtemp(path.join(tmpdir(), "aggregate-scenario-"));
    let receiptDirectory = physicalReceiptDirectory;
    if (options.useSymlinkedReceiptDirectory === true) {
      const linkedParent = await mkdtemp(path.join(tmpdir(), "aggregate-scenario-link-"));
      receiptDirectory = path.join(linkedParent, "receipts");
      await symlink(physicalReceiptDirectory, receiptDirectory);
    }
    const receiptCount = options.attemptReceiptCount ?? (candidate.accountingComplete ? 10 : 9);
    const attemptReceipts = await Promise.all(Array.from({ length: receiptCount }, (_, receiptIndex) => {
      const canonicalIndex = receiptIndex % 10;
      const variant = canonicalIndex < 5 ? "baseline" : "treatment";
      const repetitionNumber = (canonicalIndex % 5) + 1;
      const attemptNumber = Math.floor(receiptIndex / 10) + 1;
      return writeReceiptFixture(path.join(receiptDirectory, `attempt-${receiptIndex + 1}.json`), {
        schemaVersion: 1,
        scenarioId: options.attemptScenarioId ?? candidate.scenarioId,
        variant,
        repetitionNumber,
        attemptNumber,
        durableFacts: {},
        lastDurableStage: "attempt_receipt_published",
      });
    }));
    const repetitionReceipts = await Promise.all(attemptReceipts.slice(0, 10).map((attempt, receiptIndex) => {
      const variant = receiptIndex < 5 ? "baseline" : "treatment";
      const repetitionNumber = (receiptIndex % 5) + 1;
      const acceptedAttempt = options.crossVariantAttemptBinding === true && receiptIndex === 0
        ? attemptReceipts[5]!
        : attempt;
      return writeReceiptFixture(path.join(receiptDirectory, `repetition-${receiptIndex + 1}.json`), {
        schemaVersion: 1,
        scenarioId: candidate.scenarioId,
        variant,
        repetitionNumber,
        repetitionId: `${variant}-${repetitionNumber}`,
        acceptedAttemptReceiptPath: acceptedAttempt.receiptPath,
        acceptedAttemptReceiptDigest: acceptedAttempt.receiptDigest,
        lastDurableStage: "repetition_receipt_published",
      });
    }));
    const persistedAttemptReceipts = options.duplicateAttemptReceipt === true
      ? [...attemptReceipts.slice(0, -1), attemptReceipts[0]!]
      : attemptReceipts;
    const progressReceipt = await writeReceiptFixture(path.join(receiptDirectory, "progress-1.json"), {
      schemaVersion: 1,
      scenarioId: candidate.scenarioId,
      status: "completed",
      lastDurableStage: "scenario_completed",
      completedAttemptReceiptPaths: persistedAttemptReceipts.map((receipt) => receipt.receiptPath),
      reasonCode: null,
    });
    const comparisonValidation = { valid: true, reasons: [] } as const;
    const objectiveResults: V3BehavioralScenarioReceipt["objectiveResults"] = [];
    const semanticValidation = { valid: true, reason: null } as const;
    const semanticCandidate = {};
    const subjects: V3BehavioralScenarioReceipt["subjects"] = [];
    const reduction = {
      outcome: candidate.outcome,
      reasonCode: candidate.reasonCode,
      reasons: candidate.reasonCode === null ? [] : [candidate.reasonCode],
    } as V3BehavioralScenarioReceipt["reduction"];
    const evidenceDigest = calculateV3ScenarioEvidenceDigest({
      registrySnapshotDigest: candidate.registrySnapshotDigest,
      comparisonValidation,
      objectiveResults,
      semanticValidation,
      semanticCandidate,
      subjects,
      reviewerRuntimeProfile: VERIFIED_PROFILE,
      attemptReceipts: persistedAttemptReceipts,
      repetitionReceipts,
      progressReceipts: [progressReceipt],
      reduction,
    });
    const runDigest = calculateV3ScenarioAuthorityRunDigest({
      scenarioId: candidate.scenarioId,
      behaviorContractDigest,
      behaviorRequirementIds: candidate.behaviorRequirementIds,
      evaluationRole: candidate.evaluationRole,
      outcome: candidate.outcome,
      comparisonIntent: candidate.comparisonIntent,
      evidenceDigest,
    }, claims.manifestDigest);
    const acceptance = candidate.releaseAuthority && candidate.parentAcceptanceReceiptDigest !== null && calibration !== null
      ? createRunAcceptanceFixture({ calibration, runDigest, claimedRequirementManifestDigest: claims.manifestDigest })
      : null;
    const acceptancePath = `${authorityRoot}/${candidate.scenarioId}-${fixtureSequence}-${index}-acceptance.json`;
    const acceptanceSource = acceptance === null ? null : `${JSON.stringify(acceptance, null, 2)}\n`;
    const acceptanceSourceDigest = acceptanceSource === null
      ? null
      : `sha256:${createHash("sha256").update(acceptanceSource).digest("hex")}`;
    if (acceptanceSource !== null) {
      await writeFile(path.join(repositoryRoot, acceptancePath), acceptanceSource, { flag: "wx" });
    }
    const receipt = {
      schemaVersion: 3,
      scenarioId: candidate.scenarioId,
      behaviorIdentity: {
        behaviorContractDigest,
        behaviorRequirementIds: options.receiptBehaviorRequirementIds ?? candidate.behaviorRequirementIds,
        comparisonIntent: candidate.comparisonIntent,
        expectedRepetitions: options.declaredRepetitions ?? 5,
      },
      authoritySnapshot: {
        evaluationRole: candidate.evaluationRole,
        freshness: options.registryFreshness ?? (candidate.calibrationStatus === "calibrated" ? "fresh" : candidate.calibrationStatus),
        registrySnapshotDigest: candidate.registrySnapshotDigest,
        calibrationStatus: candidate.calibrationStatus,
        runDigest,
        evidenceDigest: options.evidenceDigestOverride ?? evidenceDigest,
        releaseAuthority: candidate.releaseAuthority,
        reasonCode: candidate.authorityReasonCode,
        parentAcceptanceReceiptDigest: acceptance === null
          ? null
          : calculateParentAcceptanceReceiptDigest(acceptance),
        parentAcceptanceSourceReceipt: acceptanceSourceDigest === null
          ? null
          : { receiptPath: acceptancePath, receiptDigest: acceptanceSourceDigest },
        calibrationSourceReceipt: calibrationSourceDigest === null
          ? null
          : { receiptPath: calibrationPath, receiptDigest: calibrationSourceDigest },
        calibrationAuthorityReceiptDigest: calibration?.authorityReceiptDigest ?? null,
        calibrationFingerprintDigest: calibration?.calibrationFingerprint.digest ?? null,
        calibrationFreshnessInputs: calibration?.receipt.calibrationFingerprint ?? null,
        demotedThisRun: candidate.demotedThisRun,
      },
      claimedRequirements: {
        source: claims.manifest.source,
        claimedRequirementIds: claims.manifest.claimedRequirementIds,
        manifestDigest: claims.manifestDigest,
        status: claims.status,
        unknownRequirementIds: claims.unknownRequirementIds,
        untracedRequirementIds: claims.untracedRequirementIds,
      },
      comparisonValidation,
      objectiveResults,
      semanticReview: { validation: semanticValidation, runtimeProfile: VERIFIED_PROFILE, candidate: semanticCandidate },
      runtimeProfiles: { subjects: [], reviewer: VERIFIED_PROFILE },
      subjects,
      executionBudget: deriveScenarioExecutionBudget({
        repetitions: 5,
        infrastructureRetries: 0,
        commandSlots: [{ commandType: "subject", acpxTimeoutMs: 1, executorOverheadMs: 0, terminationGraceMs: 1 }],
        fixtureSetupReserveMs: 0,
        scenarioCleanupReserveMs: 0,
        receiptFlushReserveMs: 1,
        schedulingMarginMs: 0,
        registeredScenarioCount: 1,
        jobs: 1,
        vitestEmergencyReserveMs: 1,
      }),
      attemptReceipts: persistedAttemptReceipts,
      repetitionReceipts,
      progressReceipts: [progressReceipt],
      reduction,
      lastDurableStage: "scenario_receipt_published",
    } as V3BehavioralScenarioReceipt;
    const receiptPath = path.join(receiptDirectory, "scenario-receipt.json");
    const receiptSource = `${JSON.stringify(receipt, null, 2)}\n`;
    await writeFile(receiptPath, receiptSource, { flag: "wx" });
    if (options.deleteProgressReceipt === true) await unlink(progressReceipt.receiptPath);
    return validateV3ScenarioExecutionForAggregate({
      scenarioId: candidate.scenarioId,
      repositoryRoot,
      registryRow: {
        scenarioId: candidate.scenarioId,
        behaviorContractDigest,
        evaluationRole: candidate.evaluationRole,
        freshness: options.registryFreshness ?? receipt.authoritySnapshot.freshness,
        validityReview: { receiptPath: "fixture-validity.json", receiptDigest: fixtureAuthorityDigest("8") },
        calibrationReceipt: calibrationSourceDigest === null
          ? null
          : { receiptPath: options.registryCalibrationPath ?? calibrationPath, receiptDigest: calibrationSourceDigest },
        authorityHistory: [],
      },
      expectedRepetitions: 5,
      executed: {
        receiptPath,
        receiptDigest: `sha256:${createHash("sha256").update(receiptSource).digest("hex")}`,
        receipt,
      },
    });
  }));
}

describe("skill pressure aggregate receipt", () => {
  it("reports exact v3 authority and outcome counts for an incomplete diagnostic run", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["release-authority", "traceability"]);
    const receipt = createV3AggregateReceipt({
      runId: "run-1",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 8,
      selectedScenarioIds: ["pass", "fail", "inconclusive", "not-evaluated", "stale", "timed-out", "missing"],
      claimedRequirements: claims,
      registrySnapshotDigest,
      selection: selection("diagnostic", ["pass", "fail", "inconclusive", "not-evaluated", "stale", "timed-out", "missing"]),
      invalid: [],
      results: await validateSummaries(repositoryRoot, claims, [
        summary({ scenarioId: "pass", behaviorRequirementIds: ["release-authority"] }, claims),
        summary({ scenarioId: "fail", outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" }, claims),
        summary({ scenarioId: "inconclusive", outcome: "inconclusive", reasonCode: "mixed_treatment" }, claims),
        summary({ scenarioId: "not-evaluated", outcome: "not_evaluated", reasonCode: "missing_evidence" }, claims),
        summary({ scenarioId: "stale", demotedThisRun: true }, claims),
        summary({
          scenarioId: "timed-out",
          executionStatus: "infrastructure_error",
          outcome: "infrastructure_error",
          reasonCode: "scenario_deadline",
          timedOut: true,
        }, claims),
      ]),
    });

    expect(receipt.counts).toEqual({
      discovered: 8,
      selected: 7,
      skipped: 1,
      invalid: 0,
      executed: 5,
      passed: 2,
      behaviorFailed: 1,
      inconclusive: 1,
      infrastructureError: 1,
      notEvaluated: 1,
      timedOut: 1,
      gate: 0,
      diagnostic: 6,
      calibrated: 0,
      staleCalibration: 0,
      demotedThisRun: 1,
      untracedBehaviorRequirement: 2,
      unknownBehaviorRequirement: 0,
      missing: 1,
      accountingIncomplete: 0,
      releaseAuthorityGranted: 0,
      releaseAuthorityWithheld: 6,
    });
    expect(receipt.missingScenarioIds).toEqual(["missing"]);
    expect(receipt.untracedBehaviorRequirementIds).toEqual(["release-authority", "traceability"]);
    expect(receipt.claimedRequirementInputDigest).toBe(claims.manifestDigest);
    expect(receipt.selectionMode).toBe("diagnostic");
    expect(receipt.selectionDigest).toBe(selection("diagnostic", []).selectionDigest);
    expect(receipt.excludedStaleGateScenarioIds).toEqual([]);
    expect(receipt.suite).toEqual({ kind: "diagnostic", terminalState: "failed", success: false });
    expect(receipt.receiptDigest).toMatch(/^sha256:/u);
    expect(Object.isFrozen(receipt)).toBe(true);
    expect(Object.isFrozen(receipt.results)).toBe(true);
    expect(Reflect.set(receipt, "runId", "mutated")).toBe(false);
  });

  it("completes a diagnostic run with behavioral findings without granting release authority", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["release-authority"]);
    const receipt = createV3AggregateReceipt({
      runId: "run-2",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 3,
      selectedScenarioIds: ["pass", "fail", "not-evaluated"],
      claimedRequirements: claims,
      registrySnapshotDigest,
      selection: selection("diagnostic", ["pass", "fail", "not-evaluated"]),
      invalid: [],
      results: await validateSummaries(repositoryRoot, claims, [
        summary({ scenarioId: "pass", behaviorRequirementIds: ["release-authority"] }, claims),
        summary({ scenarioId: "fail", outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" }, claims),
        summary({ scenarioId: "not-evaluated", outcome: "not_evaluated", reasonCode: "missing_evidence" }, claims),
      ]),
    });

    expect(receipt.suite).toEqual({
      kind: "diagnostic",
      terminalState: "completed_with_findings",
      success: true,
    });
    expect(receipt.counts.releaseAuthorityGranted).toBe(0);
    expect(receipt.counts.untracedBehaviorRequirement).toBe(1);
    expect(receipt.results.every((result) => !result.releaseAuthority)).toBe(true);
  });

  it("succeeds as a gate suite only for fresh calibrated release-authoritative passes", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["authority", "traceability"]);
    const receipt = createV3AggregateReceipt({
      runId: "run-3",
      suiteKind: "gate",
      discoveredScenarioCount: 2,
      selectedScenarioIds: ["alpha", "beta"],
      claimedRequirements: claims,
      registrySnapshotDigest,
      selection: selection("gate", ["alpha", "beta"]),
      invalid: [],
      results: await validateSummaries(repositoryRoot, claims, [
        summary({
          scenarioId: "alpha",
          evaluationRole: "gate",
          calibrationStatus: "calibrated",
          behaviorRequirementIds: ["authority"],
          releaseAuthority: true,
        }, claims),
        summary({
          scenarioId: "beta",
          comparisonIntent: "non_regression",
          evaluationRole: "gate",
          calibrationStatus: "calibrated",
          behaviorRequirementIds: ["traceability"],
          releaseAuthority: true,
        }, claims),
      ]),
    });

    expect(receipt.suite).toEqual({ kind: "gate", terminalState: "passed", success: true });
    expect(receipt.counts.releaseAuthorityGranted).toBe(2);
    expect(receipt.untracedBehaviorRequirementIds).toEqual([]);
  });

  it("fails a gate suite when an authoritative pass does not trace every claimed requirement", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["required-behavior"]);
    const receipt = createV3AggregateReceipt({
      runId: "untraced-gate",
      suiteKind: "gate",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirements: claims,
      registrySnapshotDigest,
      selection: selection("gate", ["scenario"]),
      invalid: [],
      results: await validateSummaries(repositoryRoot, claims, [summary({
        scenarioId: "scenario",
        evaluationRole: "gate",
        calibrationStatus: "calibrated",
        behaviorRequirementIds: ["unrelated-behavior"],
        releaseAuthority: true,
      }, claims)]),
    });

    expect(receipt.untracedBehaviorRequirementIds).toEqual(["required-behavior"]);
    expect(receipt.suite).toEqual({ kind: "gate", terminalState: "failed", success: false });
  });

  it("does not treat an empty gate selection as an authoritative pass", () => {
    const receipt = createV3AggregateReceipt({
      runId: "empty-gate",
      suiteKind: "gate",
      discoveredScenarioCount: 1,
      selectedScenarioIds: [],
      claimedRequirements: claimedRequirements(["fixture-behavior"]),
      registrySnapshotDigest,
      selection: selection("gate", []),
      invalid: [],
      results: [],
    });

    expect(receipt.suite).toEqual({ kind: "gate", terminalState: "failed", success: false });
  });

  it("fails diagnostics for invalid, infrastructure, missing, or incomplete accounting", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["fixture-behavior"]);
    const scenarios = [
      {
        name: "invalid discovery",
        invalid: [{ path: "invalid.md", reason: "scenario_contract" as const, detail: "invalid contract" }],
        results: [summary({ scenarioId: "scenario" })],
      },
      {
        name: "infrastructure failure",
        invalid: [],
        results: [summary({
          scenarioId: "scenario",
          executionStatus: "infrastructure_error",
          outcome: "infrastructure_error",
          reasonCode: "subject_transport_failure",
        })],
      },
      {
        name: "missing execution",
        invalid: [],
        results: [],
      },
      {
        name: "incomplete accounting",
        invalid: [],
        results: [summary({ scenarioId: "scenario", accountingComplete: false })],
      },
    ];

    for (const scenario of scenarios) {
      const receipt = createV3AggregateReceipt({
        runId: scenario.name,
        suiteKind: "diagnostic",
        discoveredScenarioCount: 1,
        selectedScenarioIds: ["scenario"],
        claimedRequirements: claims,
        registrySnapshotDigest,
        selection: selection("diagnostic", ["scenario"]),
        invalid: scenario.invalid,
        results: await validateSummaries(repositoryRoot, claims, scenario.results),
      });
      expect(receipt.suite, scenario.name).toEqual({ kind: "diagnostic", terminalState: "failed", success: false });
    }
  });

  it("rejects summaries that were not validated from persisted authority receipts", () => {
    expect(() => createV3AggregateReceipt({
      runId: "unvalidated-summary",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirements: claimedRequirements(["fixture-behavior"]),
      registrySnapshotDigest,
      selection: selection("diagnostic", ["scenario"]),
      invalid: [],
      results: [summary({ scenarioId: "scenario" })] as unknown as readonly ValidatedV3ScenarioExecutionSummary[],
    })).toThrow(/not validated from persisted authority receipts/u);

    const prototypeForged = Object.create(summary({ scenarioId: "scenario" })) as ValidatedV3ScenarioExecutionSummary;
    expect(() => createV3AggregateReceipt({
      runId: "prototype-forged-summary",
      suiteKind: "diagnostic",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirements: claimedRequirements(["fixture-behavior"]),
      registrySnapshotDigest,
      selection: selection("diagnostic", ["scenario"]),
      invalid: [],
      results: [prototypeForged],
    })).toThrow(/not validated from persisted authority receipts/u);
  });

  it("freezes validated summaries so authority facts cannot change after branding", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["fixture-behavior"]);
    const [validated] = await validateSummaries(repositoryRoot, claims, [summary({ scenarioId: "scenario" }, claims)]);

    expect(Object.isFrozen(validated)).toBe(true);
    expect(Reflect.set(validated!, "releaseAuthority", true)).toBe(false);
    expect(validated?.releaseAuthority).toBe(false);
  });

  it("rejects linked authority sources and calibration receipts that differ from the registry row", async () => {
    const claims = claimedRequirements(["fixture-behavior"]);
    const gate = summary({ scenarioId: "scenario", evaluationRole: "gate" }, claims);
    const linkedRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(linkedRepository, claims, [gate], {
      linkCalibrationSource: true,
    })).rejects.toThrow(/regular file without links|symlinked parent/u);

    const mismatchedRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(mismatchedRepository, claims, [gate], {
      registryCalibrationPath: "tests/test-utils/skill-pressure/config/authority-receipts/other-calibration.json",
    })).rejects.toThrow(/calibration source does not match its registry row/u);
  });

  it("accepts uniquely receipted retries and rejects duplicate attempt bindings", async () => {
    const claims = claimedRequirements(["fixture-behavior"]);
    const retriedRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const [retried] = await validateSummaries(
      retriedRepository,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { attemptReceiptCount: 11 },
    );
    expect(retried?.accountingComplete).toBe(true);

    const duplicateRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const [duplicate] = await validateSummaries(
      duplicateRepository,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { duplicateAttemptReceipt: true },
    );
    expect(duplicate?.accountingComplete).toBe(false);

    const crossVariantRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const [crossVariant] = await validateSummaries(
      crossVariantRepository,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { crossVariantAttemptBinding: true },
    );
    expect(crossVariant?.accountingComplete).toBe(false);
  });

  it("rejects release authority when a scenario claims same-run demotion", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["fixture-behavior"]);

    await expect(validateSummaries(repositoryRoot, claims, [summary({
      scenarioId: "scenario",
      evaluationRole: "gate",
      calibrationStatus: "calibrated",
      behaviorRequirementIds: ["fixture-behavior"],
      releaseAuthority: true,
      demotedThisRun: true,
    }, claims)])).rejects.toThrow(/demoted.*release authority/u);
  });

  it("rejects attempts from another scenario and missing progress evidence", async () => {
    const claims = claimedRequirements(["fixture-behavior"]);
    const wrongScenarioRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const [wrongScenario] = await validateSummaries(
      wrongScenarioRepository,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { attemptScenarioId: "another-scenario" },
    );
    expect(wrongScenario?.accountingComplete).toBe(false);

    const missingProgressRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(
      missingProgressRepository,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { deleteProgressReceipt: true },
    )).rejects.toThrow(/progress.*does not exist|ENOENT/u);
  });

  it("rejects a scenario receipt tree reached through a symlinked directory", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["fixture-behavior"]);

    await expect(validateSummaries(
      repositoryRoot,
      claims,
      [summary({ scenarioId: "scenario" }, claims)],
      { useSymlinkedReceiptDirectory: true },
    )).rejects.toThrow(/scenario receipt directory.*canonical/u);
  });

  it("rejects self-declared repetition counts and stale gate release authority", async () => {
    const claims = claimedRequirements(["fixture-behavior"]);
    const countRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(countRepository, claims, [summary({ scenarioId: "scenario" }, claims)], {
      declaredRepetitions: 0,
    })).rejects.toThrow(/repetition count does not match the selected contract/u);

    const staleRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(staleRepository, claims, [summary({
      scenarioId: "scenario",
      evaluationRole: "gate",
      calibrationStatus: "calibrated",
      releaseAuthority: true,
    }, claims)], {
      registryFreshness: "stale",
    })).rejects.toThrow(/calibration status does not match registry authority/u);
  });

  it("rejects persisted evidence and behavior trace mutations that do not match authority digests", async () => {
    const claims = claimedRequirements(["fixture-behavior"]);
    const evidenceRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(evidenceRepository, claims, [summary({ scenarioId: "scenario" }, claims)], {
      evidenceDigestOverride: fixtureAuthorityDigest("f"),
    })).rejects.toThrow(/evidence digest does not match persisted evidence/u);

    const traceRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(traceRepository, claims, [summary({
      scenarioId: "scenario",
      behaviorRequirementIds: ["fixture-behavior"],
    }, claims)], {
      receiptBehaviorRequirementIds: ["forged-behavior"],
    })).rejects.toThrow(/run digest does not match persisted authority inputs/u);
  });

  it("rejects diagnostic release authority and release authority without a calibrated gate pass", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const claims = claimedRequirements(["fixture-behavior"]);
    await expect(validateSummaries(repositoryRoot, claims, [
      summary({ scenarioId: "scenario", releaseAuthority: true }, claims),
    ])).rejects.toThrow(/cannot grant release authority/u);

    const uncalibratedRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    await expect(validateSummaries(uncalibratedRepository, claims, [
      summary({ scenarioId: "scenario", evaluationRole: "gate", releaseAuthority: true }, claims),
    ])).rejects.toThrow(/calibration status does not match registry authority/u);

    const missingAcceptanceRepository = await mkdtemp(path.join(tmpdir(), "aggregate-repository-"));
    const missingParentAcceptance = await validateSummaries(missingAcceptanceRepository, claims, [
      summary({
        scenarioId: "scenario",
        evaluationRole: "gate",
        calibrationStatus: "calibrated",
        behaviorRequirementIds: ["fixture-behavior"],
        releaseAuthority: true,
        parentAcceptanceReceiptDigest: null,
      }, claims),
    ]);
    expect(() => createV3AggregateReceipt({
      runId: "missing-parent-acceptance",
      suiteKind: "gate",
      discoveredScenarioCount: 1,
      selectedScenarioIds: ["scenario"],
      claimedRequirements: claims,
      registrySnapshotDigest,
      selection: selection("gate", ["scenario"]),
      invalid: [],
      results: missingParentAcceptance,
    })).toThrow(/parent-accepted/u);
  });
});
