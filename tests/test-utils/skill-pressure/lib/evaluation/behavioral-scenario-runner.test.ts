import { describe, expect, it } from "vitest";

import type { ReviewRepetitionCandidate } from "../review/review-packet.js";
import {
  resolveSubjectExecutionPolicy,
  reduceWithBlindReview,
  type DeterministicRepetitionEvaluation,
} from "./behavioral-scenario-runner.js";

function deterministic(
  variant: "baseline" | "treatment",
  outcome: DeterministicRepetitionEvaluation["outcome"] = "pass",
): readonly DeterministicRepetitionEvaluation[] {
  return Array.from({ length: 5 }, (_, index) => ({
    repetitionId: `${variant}-${index + 1}`,
    checkResults: [],
    outcome,
  }));
}

function reviewed(
  baselineOutcome: ReviewRepetitionCandidate["outcome"],
  treatmentOutcome: ReviewRepetitionCandidate["outcome"],
) {
  const repetitions = [
    ...Array.from({ length: 5 }, (_, index) => ({
      repetitionId: `baseline-${index + 1}`,
      variant: "baseline" as const,
      outcome: baselineOutcome,
      evidenceClass: baselineOutcome === "pass" ? "passing_control" as const : "demonstrated_failure" as const,
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      repetitionId: `treatment-${index + 1}`,
      variant: "treatment" as const,
      outcome: treatmentOutcome,
      evidenceClass: null,
    })),
  ];
  return {
    outcome: "pass" as const,
    reviewReceipt: {
      route: {
        kind: "blind" as const,
        freshContext: true,
        reviewer: {
          reviewerId: "reviewer",
          provider: "codex" as const,
          model: "gpt-5.6-luna",
          modelCategory: "mini" as const,
          reasoningEffort: "xhigh",
          runtime: "acpx" as const,
        },
      },
      reviewer: {
        reviewerId: "reviewer",
        provider: "codex" as const,
        model: "gpt-5.6-luna",
        modelCategory: "mini" as const,
        reasoningEffort: "xhigh",
        runtime: "acpx" as const,
      },
      result: {
        repetitions,
        rationalization: null,
        behaviorRisk: null,
        smallestWordingChange: null,
        retestTarget: null,
      },
      rubricDigest: "sha256:rubric",
      resultDigest: "sha256:result",
      reviewerDigest: "sha256:reviewer",
    },
    infrastructureReasons: [],
    parseError: null,
    runtime: {
      launcherDigest: "sha256:launcher",
      sessionId: "review-session",
      profile: {
        requested: { provider: "codex" as const, model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
        acceptedProviderReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
        providerReported: { model: "gpt-5.6-luna", reasoningEffort: "xhigh" },
        verification: { status: "verified" as const, reasonCode: null, reasons: [] },
      },
      transcriptDigest: "sha256:transcript",
      usageDigest: "sha256:usage",
      sessionLifecycle: {
        mode: "one_shot" as const,
        sessionName: null,
        create: "not_applicable" as const,
        setEffort: "not_applicable" as const,
        prompt: "completed" as const,
        close: "not_applicable" as const,
      },
    },
  };
}

describe("behavioral scenario final reduction", () => {
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

  it("passes an improvement only when reviewed baseline failures become treatment passes", () => {
    expect(reduceWithBlindReview({
      comparisonIntent: "improvement",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment"),
      automatedReview: reviewed("behavior_fail", "pass"),
    })).toMatchObject({ outcome: "pass", reasonCode: null });
  });

  it("passes a non-regression control only when both reviewed sides pass", () => {
    expect(reduceWithBlindReview({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment"),
      automatedReview: reviewed("pass", "pass"),
    })).toMatchObject({ outcome: "pass", reasonCode: null });
  });

  it("lets a deterministic treatment failure outrank a semantic pass", () => {
    expect(reduceWithBlindReview({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment", "behavior_fail"),
      automatedReview: reviewed("pass", "pass"),
    })).toMatchObject({ outcome: "behavior_fail", reasonCode: "treatment_behavior_failed" });
  });

  it("fails closed when review infrastructure or output is unavailable", () => {
    const valid = reviewed("pass", "pass");
    expect(reduceWithBlindReview({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment"),
      automatedReview: { ...valid, outcome: "infrastructure_error", reviewReceipt: null, infrastructureReasons: ["transport failed"] },
    })).toMatchObject({ outcome: "infrastructure_error", reasonCode: "infrastructure_error" });
    expect(reduceWithBlindReview({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment"),
      automatedReview: { ...valid, outcome: "not_evaluated", reviewReceipt: null, parseError: "invalid review" },
    })).toMatchObject({ outcome: "not_evaluated", reasonCode: "missing_evidence" });
  });

  it("preserves mixed semantic repetitions as inconclusive", () => {
    const review = reviewed("pass", "pass");
    const firstTreatment = review.reviewReceipt.result.repetitions.findIndex((item) => item.variant === "treatment");
    const repetitions = review.reviewReceipt.result.repetitions.map((item, index) =>
      index === firstTreatment ? { ...item, outcome: "behavior_fail" as const } : item,
    );
    expect(reduceWithBlindReview({
      comparisonIntent: "non_regression",
      expectedRepetitions: 5,
      baseline: deterministic("baseline"),
      treatment: deterministic("treatment"),
      automatedReview: {
        ...review,
        reviewReceipt: { ...review.reviewReceipt, result: { ...review.reviewReceipt.result, repetitions } },
      },
    })).toMatchObject({ outcome: "inconclusive", reasonCode: "mixed_treatment" });
  });
});
