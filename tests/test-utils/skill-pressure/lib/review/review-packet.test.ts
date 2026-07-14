import { describe, expect, it } from "vitest";

import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import {
  applyDeterministicReviewPrecedence,
  buildBlindReviewPacket,
  createParentReviewReceipt,
  createReviewReceipt,
  validateReviewRoute,
  type BlindReviewPacketInput,
  type ReviewCandidateResult,
} from "./review-packet.js";

const baselineEvidence = [evidence("red-1", "baseline"), evidence("red-2", "baseline")];
const treatmentEvidence = [evidence("green-1", "treatment"), evidence("green-2", "treatment")];

function evidence(
  repetitionId: string,
  variant: "baseline" | "treatment",
): NormalizedRepetitionEvidence {
  return {
    repetitionId,
    variant,
    visibleResponse: `${variant} response for ${repetitionId}`,
    toolObservations: [],
    usageObservations: [],
    process: {
      outcome: "executed",
      exitCode: 0,
      timedOut: false,
      cleanupComplete: true,
      infrastructureReasons: [],
    },
    repositoryFacts: {
      files: [],
      changes: { files: [], pathChanges: [], deletedPaths: [], omissions: [] },
      artifacts: [],
      omissions: [],
    },
    rationalizationExcerpts: [],
  };
}

function packetInput(): BlindReviewPacketInput {
  return {
    scenario: { scenarioId: "workflow/pressure-proof" },
    hiddenRubric: "Confirm every required proof gate before acting.",
    deterministicFacts: [
      { repetitionId: "red-1", variant: "baseline", outcome: "behavior_fail", results: [] },
      { repetitionId: "red-2", variant: "baseline", outcome: "behavior_fail", results: [] },
      { repetitionId: "green-1", variant: "treatment", outcome: "pass", results: [] },
      { repetitionId: "green-2", variant: "treatment", outcome: "pass", results: [] },
    ],
    baselineEvidence,
    treatmentEvidence,
    sourceFingerprint: {
      pairSetFingerprint: "sha256:pair",
      baseline: { mode: "none", sourceDigest: null, sourceRevision: null },
      treatment: { mode: "current", sourceDigest: "sha256:current", sourceRevision: null },
    },
    runtimeFingerprint: {
      runnerVersion: "skill-pressure-repetition-v1",
      subjectModel: "gpt-5.6-luna",
      subjectReasoningEffort: "xhigh",
      runtimeDigest: "sha256:runtime",
    },
  };
}

function candidateResult(): ReviewCandidateResult {
  return {
    repetitions: [
      { repetitionId: "red-1", variant: "baseline", outcome: "behavior_fail", evidenceClass: "demonstrated_failure" },
      { repetitionId: "red-2", variant: "baseline", outcome: "behavior_fail", evidenceClass: "classified_proof_gap" },
      { repetitionId: "green-1", variant: "treatment", outcome: "pass", evidenceClass: null },
      { repetitionId: "green-2", variant: "treatment", outcome: "pass", evidenceClass: null },
    ],
    rationalization: "The task looked obvious, so the baseline skipped the evidence check.",
    behaviorRisk: "Future changes could be treated as obvious and bypass proof.",
    smallestWordingChange: "Require evidence before acting under urgency.",
    retestTarget: "workflow/pressure-proof",
  };
}

describe("parent review receipt", () => {
  it("accepts a receipt that acknowledges every selected RED and GREEN transcript", () => {
    expect(createParentReviewReceipt({
      reviewer: { reviewerId: "parent-1", runtime: "parent" },
      selectedRepetitions: [
        { variant: "baseline", repetitionId: "red-1", transcriptDigest: "sha256:red-1" },
        { variant: "baseline", repetitionId: "red-2", transcriptDigest: "sha256:red-2" },
        { variant: "treatment", repetitionId: "green-1", transcriptDigest: "sha256:green-1" },
        { variant: "treatment", repetitionId: "green-2", transcriptDigest: "sha256:green-2" },
      ],
      acknowledgedTranscripts: [
        { variant: "treatment", repetitionId: "green-2", transcriptDigest: "sha256:green-2" },
        { variant: "baseline", repetitionId: "red-1", transcriptDigest: "sha256:red-1" },
        { variant: "treatment", repetitionId: "green-1", transcriptDigest: "sha256:green-1" },
        { variant: "baseline", repetitionId: "red-2", transcriptDigest: "sha256:red-2" },
      ],
    }).acknowledgedTranscripts).toHaveLength(4);
  });

  it("rejects partial parent transcript acknowledgement", () => {
    expect(() => createParentReviewReceipt({
      reviewer: { reviewerId: "parent-1", runtime: "parent" },
      selectedRepetitions: [
        { variant: "baseline", repetitionId: "red-1", transcriptDigest: "sha256:red-1" },
        { variant: "treatment", repetitionId: "green-1", transcriptDigest: "sha256:green-1" },
      ],
      acknowledgedTranscripts: [{ variant: "baseline", repetitionId: "red-1", transcriptDigest: "sha256:red-1" }],
    })).toThrow("every selected repetition transcript");
  });
});

describe("blind review packet", () => {
  it("contains only the review facts and bounded RED/GREEN evidence", () => {
    const input = {
      ...packetInput(),
      authoringDiscussion: "The author believes this should pass.",
      expectedConclusion: "pass",
      otherReviewerReasoning: "A previous reviewer voted pass.",
    };
    const packet = buildBlindReviewPacket(input);
    const serialized = JSON.stringify(packet);

    expect(packet.baselineEvidence).toHaveLength(2);
    expect(packet.treatmentEvidence).toHaveLength(2);
    expect(packet).toMatchObject({
      scenario: { scenarioId: "workflow/pressure-proof" },
      hiddenRubric: "Confirm every required proof gate before acting.",
      sourceFingerprint: { pairSetFingerprint: "sha256:pair" },
      runtimeFingerprint: { subjectModel: "gpt-5.6-luna" },
    });
    expect(serialized).not.toContain("author believes");
    expect(serialized).not.toContain("expectedConclusion");
    expect(serialized).not.toContain("previous reviewer");
  });
});

describe("review routing and receipts", () => {
  it("allows a parent or fresh mini/balanced blind reviewer for standard risk", () => {
    expect(validateReviewRoute({
      risk: "standard",
      route: { kind: "parent", reviewer: { reviewerId: "parent-1", runtime: "parent" } },
    }).allowed).toBe(true);
    expect(validateReviewRoute({
      risk: "standard",
      route: {
        kind: "blind",
        freshContext: true,
        reviewer: { reviewerId: "mini-1", provider: "codex", model: "gpt-5.6-luna", modelCategory: "mini", reasoningEffort: "medium", runtime: "acpx" },
      },
    }).allowed).toBe(true);
  });

  it("rejects a high-risk reviewer profile that is not fresh Claude Opus/xhigh", () => {
    expect(validateReviewRoute({
      risk: "high",
      route: {
        kind: "blind",
        freshContext: true,
        reviewer: { reviewerId: "balanced-1", provider: "codex", model: "gpt-5.6-terra", modelCategory: "balanced", reasoningEffort: "high", runtime: "acpx" },
      },
    })).toMatchObject({ allowed: false, reason: "high-risk review requires fresh ACPX Claude Opus/xhigh" });
  });

  it("records the review candidate and all required digests", () => {
    const receipt = createReviewReceipt({
      risk: "high",
      route: {
        kind: "blind",
        freshContext: true,
        reviewer: { reviewerId: "opus-1", provider: "claude", model: "claude-opus-4-7", modelCategory: "balanced", reasoningEffort: "xhigh", runtime: "acpx" },
      },
      rubric: "Confirm every required proof gate before acting.",
      result: candidateResult(),
    });

    expect(receipt).toMatchObject({
      result: candidateResult(),
      reviewer: { reviewerId: "opus-1", model: "claude-opus-4-7", reasoningEffort: "xhigh" },
    });
    expect(receipt.rubricDigest).toMatch(/^sha256:/u);
    expect(receipt.resultDigest).toMatch(/^sha256:/u);
    expect(receipt.reviewerDigest).toMatch(/^sha256:/u);
  });

  it.each(["pass", "behavior_fail", "inconclusive"] as const)(
    "preserves the allowed %s candidate outcome when deterministic facts pass",
    (outcome) => {
      expect(applyDeterministicReviewPrecedence({
        semanticOutcome: outcome,
        deterministicState: "pass",
      })).toBe(outcome);
    },
  );
});

describe("deterministic precedence", () => {
  it.each([
    ["infrastructure error", "infrastructure_error", "infrastructure_error"],
    ["missing evidence", "missing_evidence", "not_evaluated"],
    ["objective failure", "objective_behavior_failure", "behavior_fail"],
  ] as const)("does not let a semantic pass override %s", (_label, deterministicState, expectedOutcome) => {
    expect(applyDeterministicReviewPrecedence({
      semanticOutcome: "pass",
      deterministicState,
    })).toBe(expectedOutcome);
  });

  it("preserves a semantic pass when deterministic facts pass", () => {
    expect(applyDeterministicReviewPrecedence({
      semanticOutcome: "pass",
      deterministicState: "pass",
    })).toBe("pass");
  });
});
