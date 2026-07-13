import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";

export interface AcpxStructuredReviewResult {
  readonly structuredOutput: Readonly<Record<string, unknown>> | null;
  readonly visibleResponse: string;
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
