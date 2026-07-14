import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { EvaluationRegistryRow } from "../authority/evaluation-registry.js";
import { parseV3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import type { AttemptDurableFacts } from "../reporting/attempt-receipt.js";
import type { RuntimeProfileReceipt } from "../runtime/runtime-profile.js";
import type { StructuredSemanticReviewPacket } from "../review/semantic-review-contract.js";
import { deriveScenarioExecutionBudget } from "./scenario-execution-budget.js";
import {
  executeV3BehavioralScenario,
  type V3SubjectExecutionRequest,
} from "./v3-behavioral-scenario-execution.js";

const VERIFIED_LUNA_PROFILE: RuntimeProfileReceipt = {
  requested: { provider: "codex", model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  acceptedProviderReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  providerReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
  verification: { status: "verified", reasonCode: null, reasons: [] },
};

const VERIFIED_OPUS_PROFILE: RuntimeProfileReceipt = {
  requested: { provider: "claude", model: "claude-opus-4-7", reasoningEffort: "xhigh" },
  acceptedProviderReported: { model: "claude-opus-4-7", reasoningEffort: "xhigh" },
  providerReported: { model: "claude-opus-4-7", reasoningEffort: "xhigh" },
  verification: { status: "verified", reasonCode: null, reasons: [] },
};

function v3Contract(
  comparisonIntent: "improvement" | "non_regression",
  risk: "standard" | "high" = "standard",
) {
  return parseV3BehaviorContract({
    schema_version: 3,
    scenario_id: `integration-${comparisonIntent.replace("_", "-")}`,
    owner_plugin: "workflow",
    owner_skill: "fixture-skill",
    skill_type: "discipline",
    effect_surfaces: ["response", "artifacts", "tools"],
    prompt: "Create reports/result.md and briefly report completion.",
    semantic_assertions: [{
      assertion_id: "completion-is-clear",
      criterion: "The response clearly reports completion.",
      evidence_surface: "response",
    }],
    behavior_requirement_ids: ["fixture-behavior"],
    baseline: comparisonIntent === "improvement" ? "no_skill" : "previous_revision",
    ...(comparisonIntent === "non_regression" ? { baseline_revision: "a".repeat(40) } : {}),
    comparison_intent: comparisonIntent,
    repetitions: 5,
    risk,
    fixture_requirements: [],
    allowed_tools: ["write"],
    allowed_write_paths: ["reports/result.md"],
    required_tool_observations: ["write"],
    forbidden_tool_observations: [],
    deterministic_checks: [{
      check_id: "result-exists",
      fact: "artifact:result",
      operator: "contains",
      expected: "ACCEPTED",
    }],
    expected_artifacts: [{
      artifact_id: "result",
      path: "reports/result.md",
      file_type: "file",
      content_contract: "EXPECTED_CONTENT_SENTINEL",
    }],
  });
}

function registryRow(contract: ReturnType<typeof v3Contract>): EvaluationRegistryRow {
  return {
    scenarioId: contract.scenarioId,
    behaviorContractDigest: contract.behaviorContractDigest,
    evaluationRole: "diagnostic",
    freshness: "uncalibrated",
    validityReview: { receiptPath: "validity.json", receiptDigest: `sha256:${"b".repeat(64)}` },
    calibrationReceipt: null,
    authorityHistory: [],
  };
}

const COMPLETE_DURABLE_FACTS: AttemptDurableFacts = {
  processClosed: true,
  streamsDrained: true,
  outputRedacted: true,
  snapshotsCollected: true,
  cleanupFactsCollected: true,
};

function evidence(props: {
  readonly repetitionId: string;
  readonly variant: "baseline" | "treatment";
  readonly content: string;
}): NormalizedRepetitionEvidence {
  return {
    repetitionId: props.repetitionId,
    variant: props.variant,
    visibleResponse: "Completed the requested report.",
    toolObservations: [],
    usageObservations: [],
    process: { outcome: "executed", exitCode: 0, timedOut: false, cleanupComplete: true, infrastructureReasons: [] },
    repositoryFacts: {
      files: [{ path: "reports/result.md", kind: "file", contentDigest: "sha256:content", contentExcerpt: props.content }],
      changes: {
        files: [{ path: "reports/result.md", kind: "file", change: "added", contentDigest: "sha256:content", contentExcerpt: props.content }],
        pathChanges: [{ path: "reports/result.md", kind: "file", change: "added" }],
        deletedPaths: [],
        omissions: [],
      },
      artifacts: [{
        artifactId: "result",
        path: "reports/result.md",
        expectedKind: "file",
        status: "observed",
        kind: "file",
        contentDigest: "sha256:content",
        contentExcerpt: props.content,
        contentByteLength: Buffer.byteLength(props.content),
        contentUnavailableReason: null,
        contentForEvaluation: props.content,
        reason: null,
      }],
      omissions: [],
    },
    rationalizationExcerpts: [],
  };
}

function semanticResult(
  packet: StructuredSemanticReviewPacket,
  classification: "pass" | "behavior_fail" | "inconclusive" = "pass",
): string {
  return JSON.stringify({
    assertions: packet.untrustedEvidence.repetitions.flatMap((repetition) =>
      packet.instructions.assertions.map((assertion) => ({
        repetitionId: repetition.repetitionId,
        variant: repetition.variant,
        assertionId: assertion.assertionId,
        classification,
        evidenceAnchor: { kind: "response", evidenceId: "response", startOffset: 0, endOffset: 9 },
      })),
    ),
    rationalizations: [],
    smallestProposedRetest: null,
  });
}

function budget() {
  return deriveScenarioExecutionBudget({
    repetitions: 5,
    infrastructureRetries: 0,
    commandSlots: [
      { commandType: "subject", acpxTimeoutMs: 1, executorOverheadMs: 0, terminationGraceMs: 1 },
      { commandType: "reviewer_prompt", acpxTimeoutMs: 1, executorOverheadMs: 0, terminationGraceMs: 1 },
    ],
    fixtureSetupReserveMs: 0,
    scenarioCleanupReserveMs: 0,
    receiptFlushReserveMs: 1,
    schedulingMarginMs: 0,
    registeredScenarioCount: 1,
    jobs: 1,
    vitestEmergencyReserveMs: 1,
  });
}

async function runIntegratedFixture(props: {
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly forceTreatmentObjectiveFailure?: boolean;
  readonly semanticClassification?: "pass" | "behavior_fail" | "inconclusive";
  readonly registryFreshness?: "fresh" | "stale";
  readonly duplicateSessionIds?: boolean;
  readonly baselineRevisionOverride?: string;
  readonly acceptDifferentRepetition?: boolean;
  readonly risk?: "standard" | "high";
  readonly reviewerProfile?: RuntimeProfileReceipt;
  readonly executeSubjects?: (request: V3SubjectExecutionRequest) => Promise<never>;
  readonly scenarioDeadlineMs?: number;
}) {
  const contract = v3Contract(props.comparisonIntent, props.risk);
  const outputDirectory = await mkdtemp(path.join(tmpdir(), "v3-runner-integration-"));
  let subjectRequest: V3SubjectExecutionRequest | null = null;
  const execution = executeV3BehavioralScenario({
    contract,
    registrySnapshot: {
      schemaVersion: 1,
      scenarios: [{
        ...registryRow(contract),
        ...(props.registryFreshness === undefined ? {} : {
          evaluationRole: "gate" as const,
          freshness: props.registryFreshness,
        }),
      }],
    },
    executionBudget: budget(),
    configuredScenarioDeadlineMs: props.scenarioDeadlineMs ?? 5_000,
    configuredVitestTimeoutMs: (props.scenarioDeadlineMs ?? 5_000) + 1,
    outputDirectory,
    redactionSecrets: [],
    executeSubjects: props.executeSubjects ?? (async (request) => {
      subjectRequest = request;
      const createVariant = async (variant: "baseline" | "treatment") => {
        const values = [];
        for (let index = 0; index < 5; index += 1) {
          const content = variant === "baseline" && props.comparisonIntent === "improvement"
            ? "REJECTED"
            : variant === "treatment" && props.forceTreatmentObjectiveFailure === true
              ? "REJECTED"
              : "ACCEPTED";
          const item = {
            evidence: evidence({ repetitionId: `${variant}-${index + 1}`, variant, content }),
            runtimeProfile: VERIFIED_LUNA_PROFILE,
            durableFacts: COMPLETE_DURABLE_FACTS,
            comparisonIdentity: {
              sessionId: props.duplicateSessionIds === true ? "duplicate-session" : `${variant}-session-${index + 1}`,
              repositoryIdentity: `${variant}-repository-${index + 1}`,
              commonInputDigest: "sha256:common-input",
              promptDigest: "sha256:prompt",
              fixtureDigest: "sha256:fixture",
              sourceDigest: variant === "baseline" && props.comparisonIntent === "improvement"
                ? null
                : `sha256:${variant}-source`,
              sourceRevision: variant === "baseline" && props.comparisonIntent === "non_regression"
                ? props.baselineRevisionOverride ?? "a".repeat(40)
                : null,
            },
          };
          const attemptReceiptPath = await request.persistAttempt({
            variant,
            repetitionNumber: index + 1,
            attemptNumber: 1,
            repetition: props.acceptDifferentRepetition === true
              ? { ...item, evidence: { ...item.evidence, visibleResponse: "different accepted evidence" } }
              : item,
          });
          await request.persistAcceptedRepetition({
            variant,
            repetitionNumber: index + 1,
            repetition: item,
            attemptReceiptPath,
          });
          values.push(item);
        }
        return values;
      };
      return { baseline: await createVariant("baseline"), treatment: await createVariant("treatment") };
    }),
    executeSemanticReview: async ({ packet }) => ({
      visibleResponse: semanticResult(packet, props.semanticClassification),
      runtimeProfile: props.reviewerProfile ?? VERIFIED_LUNA_PROFILE,
    }),
  });
  return { result: await execution, subjectRequest };
}

describe("reachable v3 behavioral scenario execution", () => {
  it.each(["improvement", "non_regression"] as const)(
    "traverses the complete fake-backed %s path without leaking grader inputs to subjects",
    async (comparisonIntent) => {
      const { result, subjectRequest } = await runIntegratedFixture({ comparisonIntent });

      expect(result.receipt.reduction).toMatchObject({ outcome: "pass", reasonCode: null });
      expect(result.receipt.behaviorIdentity.behaviorContractDigest).toMatch(/^sha256:/u);
      expect(result.receipt.authoritySnapshot.evaluationRole).toBe("diagnostic");
      expect(result.receipt.objectiveResults).toHaveLength(10);
      expect(result.receipt.semanticReview.validation).toEqual({ valid: true, reason: null });
      expect(result.receipt.attemptReceiptPaths).toHaveLength(10);
      expect(result.receipt.repetitionReceiptPaths).toHaveLength(10);
      expect(result.receipt.runtimeProfiles.subjects).toHaveLength(10);
      expect(result.receipt.runtimeProfiles.reviewer.verification.status).toBe("verified");
      expect(result.receiptPath).toMatch(/scenario-receipt\.json$/u);
      expect(subjectRequest).not.toBeNull();
      const serializedSubjectRequest = JSON.stringify(subjectRequest);
      expect(serializedSubjectRequest).not.toContain("semanticAssertions");
      expect(serializedSubjectRequest).not.toContain("behaviorRequirementIds");
      expect(serializedSubjectRequest).not.toContain("comparisonIntent");
      expect(serializedSubjectRequest).not.toContain("evaluationRole");
      expect(serializedSubjectRequest).not.toContain("expectedOutcome");
      expect(serializedSubjectRequest).not.toContain("EXPECTED_CONTENT_SENTINEL");
      expect(serializedSubjectRequest).not.toContain("ACCEPTED");
    },
  );

  it("lets an objective treatment failure defeat semantic approval", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "non_regression",
      forceTreatmentObjectiveFailure: true,
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "behavior_fail",
      reasonCode: "treatment_behavior_failed",
    });
  });

  it("preserves semantic inconclusive instead of applying comparison intent", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "non_regression",
      semanticClassification: "inconclusive",
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "inconclusive",
      reasonCode: "semantic_inconclusive",
    });
  });

  it("does not let stale authority hide an observed treatment failure", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "non_regression",
      forceTreatmentObjectiveFailure: true,
      registryFreshness: "stale",
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "behavior_fail",
      reasonCode: "treatment_behavior_failed",
    });
    expect(result.receipt.authoritySnapshot.releaseAuthority).toBe(false);
  });

  it("rejects a non-comparable repetition set before semantic review", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "non_regression",
      duplicateSessionIds: true,
    });
    expect(result.receipt.comparisonValidation).toEqual({
      valid: false,
      reasons: ["ACPX session ids are not unique"],
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "infrastructure_error",
      reasonCode: "comparison_mismatch",
    });
    expect(result.receipt.semanticReview.validation.valid).toBe(false);
  });

  it("rejects a non-regression baseline that does not match the immutable contract revision", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "non_regression",
      baselineRevisionOverride: "c".repeat(40),
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "infrastructure_error",
      reasonCode: "comparison_mismatch",
    });
    expect(result.receipt.comparisonValidation.reasons).toContain(
      "previous-revision baseline does not match the immutable contract revision",
    );
  });

  it("binds an accepted repetition to the exact durable attempt evidence", async () => {
    await expect(runIntegratedFixture({
      comparisonIntent: "improvement",
      acceptDifferentRepetition: true,
    })).rejects.toThrow(/does not match its durable attempt receipt/u);
  });

  it("rejects a verified reviewer receipt from the wrong exact profile", async () => {
    const { result } = await runIntegratedFixture({
      comparisonIntent: "improvement",
      reviewerProfile: VERIFIED_OPUS_PROFILE,
    });
    expect(result.receipt.reduction).toMatchObject({
      outcome: "infrastructure_error",
      reasonCode: "runtime_profile_unverified",
    });
  });

  it("requires exact ACPX Claude Opus/xhigh review for high-risk scenarios", async () => {
    const wrongProfile = await runIntegratedFixture({
      comparisonIntent: "improvement",
      risk: "high",
    });
    expect(wrongProfile.result.receipt.reduction).toMatchObject({
      outcome: "infrastructure_error",
      reasonCode: "runtime_profile_unverified",
    });

    const exactProfile = await runIntegratedFixture({
      comparisonIntent: "improvement",
      risk: "high",
      reviewerProfile: VERIFIED_OPUS_PROFILE,
    });
    expect(exactProfile.result.receipt.reduction).toMatchObject({ outcome: "pass", reasonCode: null });
  });

  it("refuses to persist an attempt whose durability facts were not observed", async () => {
    await expect(runIntegratedFixture({
      comparisonIntent: "improvement",
      executeSubjects: async (request) => {
        const repetition = {
          evidence: evidence({ repetitionId: "baseline-1", variant: "baseline", content: "REJECTED" }),
          runtimeProfile: VERIFIED_LUNA_PROFILE,
          durableFacts: { ...COMPLETE_DURABLE_FACTS, streamsDrained: false },
          comparisonIdentity: {
            sessionId: "baseline-session-1",
            repositoryIdentity: "baseline-repository-1",
            commonInputDigest: "sha256:common-input",
            promptDigest: "sha256:prompt",
            fixtureDigest: "sha256:fixture",
            sourceDigest: "sha256:baseline-source",
            sourceRevision: null,
          },
        };
        await request.persistAttempt({
          variant: "baseline",
          repetitionNumber: 1,
          attemptNumber: 1,
          repetition,
        });
        throw new Error("unreachable");
      },
    })).rejects.toThrow(/streamsDrained/u);
  });

  it("preserves partial attempt and progress receipts when the scenario deadline fires", async () => {
    let completedAttemptPath = "";
    const { result } = await runIntegratedFixture({
      comparisonIntent: "improvement",
      executeSubjects: async (request) => {
        const repetition = {
          evidence: evidence({ repetitionId: "baseline-1", variant: "baseline", content: "REJECTED" }),
          runtimeProfile: VERIFIED_LUNA_PROFILE,
          durableFacts: COMPLETE_DURABLE_FACTS,
          comparisonIdentity: {
            sessionId: "baseline-session-1",
            repositoryIdentity: "baseline-repository-1",
            commonInputDigest: "sha256:common-input",
            promptDigest: "sha256:prompt",
            fixtureDigest: "sha256:fixture",
            sourceDigest: "sha256:baseline-source",
            sourceRevision: null,
          },
        };
        completedAttemptPath = await request.persistAttempt({
          variant: "baseline",
          repetitionNumber: 1,
          attemptNumber: 1,
          repetition,
        });
        await new Promise<void>((_resolve, reject) => {
          request.signal.addEventListener("abort", () => reject(new Error("scenario aborted")), { once: true });
        });
        throw new Error("unreachable");
      },
      scenarioDeadlineMs: 25,
    });

    expect(result.receipt.reduction).toMatchObject({ outcome: "infrastructure_error", reasonCode: "scenario_deadline" });
    expect(result.receipt.attemptReceiptPaths).toContain(completedAttemptPath);
    expect(result.receipt.progressReceiptPaths.length).toBeGreaterThan(1);
    expect(result.receipt.lastDurableStage).toBe("scenario_receipt_published");
  });
});
