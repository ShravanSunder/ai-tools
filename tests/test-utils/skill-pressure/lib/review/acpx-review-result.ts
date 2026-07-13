import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import type { ReviewCandidateResult } from "./review-packet.js";

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
  const outcome = structuredOutput.outcome;
  if (!isScenarioOutcome(outcome)) return { result: null, parseError: "review outcome is invalid" };
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
    result: { outcome, rationalization, behaviorRisk, smallestWordingChange, retestTarget },
    parseError: null,
  };
}

function isScenarioOutcome(value: unknown): value is ScenarioOutcome {
  return value === "pass" ||
    value === "behavior_fail" ||
    value === "inconclusive" ||
    value === "infrastructure_error" ||
    value === "not_evaluated";
}

function nullableString(value: unknown): string | null | undefined {
  return typeof value === "string" || value === null ? value : undefined;
}
