import { createHash } from "node:crypto";

import type { DeterministicCheckResult, NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";

export interface ReviewedTranscript {
  readonly variant: "baseline" | "treatment";
  readonly repetitionId: string;
  readonly transcriptDigest: string;
}

export interface ParentReviewReceipt {
  readonly route: "parent";
  readonly reviewer: ParentReviewerIdentity;
  readonly acknowledgedTranscripts: readonly ReviewedTranscript[];
  readonly reviewerDigest: string;
}

export interface ParentReviewerIdentity {
  readonly reviewerId: string;
  readonly runtime: "parent";
}

export interface CreateParentReviewReceiptProps {
  readonly reviewer: ParentReviewerIdentity;
  readonly selectedRepetitions: readonly ReviewedTranscript[];
  readonly acknowledgedTranscripts: readonly ReviewedTranscript[];
}

export interface BlindReviewPacketInput {
  readonly scenario: { readonly scenarioId: string };
  readonly hiddenRubric: string;
  readonly deterministicFacts: readonly ReviewDeterministicFact[];
  readonly baselineEvidence: readonly NormalizedRepetitionEvidence[];
  readonly treatmentEvidence: readonly NormalizedRepetitionEvidence[];
  readonly sourceFingerprint: ReviewSourceFingerprint;
  readonly runtimeFingerprint: ReviewRuntimeFingerprint;
}

export interface BlindReviewPacket {
  readonly scenario: { readonly scenarioId: string };
  readonly hiddenRubric: string;
  readonly deterministicFacts: readonly ReviewDeterministicFact[];
  readonly baselineEvidence: readonly NormalizedRepetitionEvidence[];
  readonly treatmentEvidence: readonly NormalizedRepetitionEvidence[];
  readonly sourceFingerprint: ReviewSourceFingerprint;
  readonly runtimeFingerprint: ReviewRuntimeFingerprint;
  readonly packetDigest: string;
}

export interface ReviewDeterministicFact {
  readonly repetitionId: string;
  readonly variant: "baseline" | "treatment";
  readonly outcome: "pass" | "behavior_fail" | "not_evaluated";
  readonly results: readonly DeterministicCheckResult[];
}

export interface ReviewSourceFingerprint {
  readonly pairSetFingerprint: string;
  readonly baseline: ReviewSelectedSourceFingerprint;
  readonly treatment: ReviewSelectedSourceFingerprint;
}

export interface ReviewSelectedSourceFingerprint {
  readonly mode: "none" | "current" | "previous_revision";
  readonly sourceDigest: string | null;
  readonly sourceRevision: string | null;
}

export interface ReviewRuntimeFingerprint {
  readonly runnerVersion: string;
  readonly subjectModel: string;
  readonly subjectReasoningEffort: string;
  readonly runtimeDigest: string;
}

export type ReviewRoute =
  | { readonly kind: "parent"; readonly reviewer: ParentReviewerIdentity }
  | {
      readonly kind: "blind";
      readonly freshContext: boolean;
      readonly reviewer: BlindReviewerIdentity;
    };

export interface BlindReviewerIdentity {
  readonly reviewerId: string;
  readonly provider: "claude" | "codex";
  readonly model: string;
  readonly modelCategory: "mini" | "balanced";
  readonly reasoningEffort: string;
  readonly runtime: "acpx";
}

export interface ReviewRoutePolicyResult {
  readonly allowed: boolean;
  readonly reason: string | null;
}

export interface ReviewCandidateResult {
  readonly outcome: ScenarioOutcome;
  readonly rationalization: string | null;
  readonly behaviorRisk: string | null;
  readonly smallestWordingChange: string | null;
  readonly retestTarget: string | null;
}

export interface ReviewReceipt {
  readonly route: ReviewRoute;
  readonly reviewer: BlindReviewerIdentity | ParentReviewerIdentity;
  readonly result: ReviewCandidateResult;
  readonly rubricDigest: string;
  readonly resultDigest: string;
  readonly reviewerDigest: string;
}

export interface CreateReviewReceiptProps {
  readonly risk: "standard" | "high";
  readonly route: ReviewRoute;
  readonly rubric: string;
  readonly result: ReviewCandidateResult;
}

export type ReviewDeterministicState =
  | "pass"
  | "objective_behavior_failure"
  | "missing_evidence"
  | "infrastructure_error";

export function createParentReviewReceipt(
  props: CreateParentReviewReceiptProps,
): ParentReviewReceipt {
  assertExactTranscriptCoverage(props.selectedRepetitions, props.acknowledgedTranscripts);
  return {
    route: "parent",
    reviewer: props.reviewer,
    acknowledgedTranscripts: sortTranscripts(props.acknowledgedTranscripts),
    reviewerDigest: digest(props.reviewer),
  };
}

export function buildBlindReviewPacket(input: BlindReviewPacketInput): BlindReviewPacket {
  const packetBase = {
    scenario: { scenarioId: input.scenario.scenarioId },
    hiddenRubric: input.hiddenRubric,
    deterministicFacts: sortDeterministicFacts(input.deterministicFacts),
    baselineEvidence: copyVariantEvidence(input.baselineEvidence, "baseline"),
    treatmentEvidence: copyVariantEvidence(input.treatmentEvidence, "treatment"),
    sourceFingerprint: copySourceFingerprint(input.sourceFingerprint),
    runtimeFingerprint: { ...input.runtimeFingerprint },
  } satisfies Omit<BlindReviewPacket, "packetDigest">;
  return { ...packetBase, packetDigest: digest(packetBase) };
}

export function validateReviewRoute(props: {
  readonly risk: "standard" | "high";
  readonly route: ReviewRoute;
}): ReviewRoutePolicyResult {
  if (props.risk === "standard") {
    if (props.route.kind === "parent") return { allowed: true, reason: null };
    if (!props.route.freshContext) return { allowed: false, reason: "blind review requires a fresh context" };
    return { allowed: true, reason: null };
  }
  if (
    props.route.kind === "blind" &&
    props.route.freshContext &&
    props.route.reviewer.provider === "claude" &&
    props.route.reviewer.model === "opus" &&
    props.route.reviewer.reasoningEffort === "high" &&
    props.route.reviewer.runtime === "acpx"
  ) {
    return { allowed: true, reason: null };
  }
  return { allowed: false, reason: "high-risk review requires fresh ACPX Claude Opus/high" };
}

export function createReviewReceipt(props: CreateReviewReceiptProps): ReviewReceipt {
  const policy = validateReviewRoute({ risk: props.risk, route: props.route });
  if (!policy.allowed) throw new Error(policy.reason ?? "review route is not allowed");
  const reviewer = props.route.reviewer;
  return {
    route: props.route,
    reviewer,
    result: { ...props.result },
    rubricDigest: digest(props.rubric),
    resultDigest: digest(props.result),
    reviewerDigest: digest(reviewer),
  };
}

export function applyDeterministicReviewPrecedence(props: {
  readonly semanticOutcome: ScenarioOutcome;
  readonly deterministicState: ReviewDeterministicState;
}): ScenarioOutcome {
  switch (props.deterministicState) {
    case "infrastructure_error":
      return "infrastructure_error";
    case "missing_evidence":
      return "not_evaluated";
    case "objective_behavior_failure":
      return "behavior_fail";
    case "pass":
      return props.semanticOutcome;
  }
}

function assertExactTranscriptCoverage(
  selectedRepetitions: readonly ReviewedTranscript[],
  acknowledgedTranscripts: readonly ReviewedTranscript[],
): void {
  const selected = transcriptMap(selectedRepetitions, "selected repetitions");
  const acknowledged = transcriptMap(acknowledgedTranscripts, "acknowledged transcripts");
  if (selected.size === 0 || selected.size !== acknowledged.size) {
    throw new Error("parent review must acknowledge every selected repetition transcript");
  }
  for (const [repetitionKey, transcriptDigest] of selected) {
    if (acknowledged.get(repetitionKey) !== transcriptDigest) {
      throw new Error("parent review must acknowledge every selected repetition transcript");
    }
  }
}

function transcriptMap(
  transcripts: readonly ReviewedTranscript[],
  label: string,
): ReadonlyMap<string, string> {
  const values = new Map<string, string>();
  for (const transcript of transcripts) {
    if (transcript.repetitionId === "" || transcript.transcriptDigest === "") {
      throw new Error(`${label} must contain non-empty repetition ids and transcript digests`);
    }
    const repetitionKey = `${transcript.variant}:${transcript.repetitionId}`;
    if (values.has(repetitionKey)) throw new Error(`${label} contain duplicate repetition ids`);
    values.set(repetitionKey, transcript.transcriptDigest);
  }
  return values;
}

function sortTranscripts(transcripts: readonly ReviewedTranscript[]): readonly ReviewedTranscript[] {
  return [...transcripts]
    .sort((left, right) => left.variant.localeCompare(right.variant) || left.repetitionId.localeCompare(right.repetitionId))
    .map((transcript) => ({ ...transcript }));
}

function sortDeterministicFacts(
  facts: readonly ReviewDeterministicFact[],
): readonly ReviewDeterministicFact[] {
  return [...facts]
    .sort((left, right) => left.variant.localeCompare(right.variant) || left.repetitionId.localeCompare(right.repetitionId))
    .map((fact) => ({ ...fact, results: [...fact.results] }));
}

function copyVariantEvidence(
  evidence: readonly NormalizedRepetitionEvidence[],
  variant: "baseline" | "treatment",
): readonly NormalizedRepetitionEvidence[] {
  return evidence
    .filter((item) => item.variant === variant)
    .sort((left, right) => left.repetitionId.localeCompare(right.repetitionId))
    .map((item) => ({
      ...item,
      toolObservations: item.toolObservations.map((observation) => ({ ...observation })),
      usageObservations: [...item.usageObservations],
      process: { ...item.process, infrastructureReasons: [...item.process.infrastructureReasons] },
      repositoryFacts: item.repositoryFacts,
      rationalizationExcerpts: [...item.rationalizationExcerpts],
    }));
}

function copySourceFingerprint(fingerprint: ReviewSourceFingerprint): ReviewSourceFingerprint {
  return {
    pairSetFingerprint: fingerprint.pairSetFingerprint,
    baseline: { ...fingerprint.baseline },
    treatment: { ...fingerprint.treatment },
  };
}

function digest(value: unknown): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}
