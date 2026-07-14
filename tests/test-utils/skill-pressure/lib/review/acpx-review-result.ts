import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { RepetitionOutcome } from "../reduction/outcome-reducer.js";
import type { ReviewCandidateResult, ReviewRepetitionCandidate } from "./review-packet.js";

export interface AcpxStructuredReviewResult {
  readonly structuredOutput: Readonly<Record<string, unknown>> | null;
  readonly visibleResponse: string;
  readonly parseError: string | null;
}

export interface ParsedReviewCandidateResult {
  readonly result: ReviewCandidateResult | null;
  readonly parseError: string | null;
}

export function parseAcpxStructuredReview(
  transcript: AcpxTranscriptFacts,
): AcpxStructuredReviewResult {
  if (transcript.visibleResponse === "") {
    return { structuredOutput: null, visibleResponse: "", parseError: "review response is empty" };
  }
  try {
    const parsed: unknown = JSON.parse(transcript.visibleResponse);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {
        structuredOutput: null,
        visibleResponse: transcript.visibleResponse,
        parseError: "review response is not a JSON object",
      };
    }
    return {
      structuredOutput: parsed as Readonly<Record<string, unknown>>,
      visibleResponse: transcript.visibleResponse,
      parseError: null,
    };
  } catch {
    return {
      structuredOutput: null,
      visibleResponse: transcript.visibleResponse,
      parseError: "review response is not valid JSON",
    };
  }
}

export function parseReviewCandidateResult(
  structuredOutput: Readonly<Record<string, unknown>> | null,
): ParsedReviewCandidateResult {
  if (structuredOutput === null) return { result: null, parseError: "review response has no structured object" };
  const repetitions = parseRepetitions(structuredOutput.repetitions);
  if (repetitions === null) return { result: null, parseError: "review repetitions are invalid" };
  const rationalization = nullableString(structuredOutput.rationalization);
  const behaviorRisk = nullableString(structuredOutput.behaviorRisk);
  const smallestWordingChange = nullableString(structuredOutput.smallestWordingChange);
  const retestTarget = nullableString(structuredOutput.retestTarget);
  if (
    rationalization === undefined ||
    behaviorRisk === undefined ||
    smallestWordingChange === undefined ||
    retestTarget === undefined
  ) {
    return { result: null, parseError: "review rationale fields must be strings or null" };
  }
  return {
    result: { repetitions, rationalization, behaviorRisk, smallestWordingChange, retestTarget },
    parseError: null,
  };
}

function parseRepetitions(value: unknown): readonly ReviewRepetitionCandidate[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const repetitions: ReviewRepetitionCandidate[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) return null;
    const candidate = item as Readonly<Record<string, unknown>>;
    if (
      typeof candidate.repetitionId !== "string" || candidate.repetitionId === "" ||
      (candidate.variant !== "baseline" && candidate.variant !== "treatment") ||
      !isRepetitionOutcome(candidate.outcome) ||
      !isEvidenceClass(candidate.evidenceClass)
    ) return null;
    repetitions.push({
      repetitionId: candidate.repetitionId,
      variant: candidate.variant,
      outcome: candidate.outcome,
      evidenceClass: candidate.evidenceClass,
    });
  }
  return repetitions;
}

function isRepetitionOutcome(value: unknown): value is RepetitionOutcome {
  return value === "pass" || value === "behavior_fail" || value === "not_evaluated";
}

function isEvidenceClass(
  value: unknown,
): value is ReviewRepetitionCandidate["evidenceClass"] {
  return value === null ||
    value === "demonstrated_failure" ||
    value === "classified_proof_gap" ||
    value === "passing_control";
}

function nullableString(value: unknown): string | null | undefined {
  return typeof value === "string" || value === null ? value : undefined;
}
