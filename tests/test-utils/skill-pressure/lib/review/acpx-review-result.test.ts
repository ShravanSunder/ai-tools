import { describe, expect, it } from "vitest";

import type { AcpxTranscriptFacts } from "../collector/acpx-transcript-collector.js";
import { parseAcpxStructuredReview } from "./acpx-review-result.js";

function transcript(visibleResponse: string): AcpxTranscriptFacts {
  return {
    sessionId: "review-1",
    resolvedModel: "opus",
    reasoningEffort: "high",
    stopReason: "end_turn",
    promptCount: 1,
    mcpServerCount: 0,
    visibleResponse,
    toolObservations: [],
    usageObservations: [],
    diagnosticErrors: [],
    parseErrors: [],
    transportErrors: [],
  };
}

describe("ACPX structured review result", () => {
  it("parses the blind review object without assigning final truth", () => {
    expect(parseAcpxStructuredReview(transcript('{"verdict":"pass"}'))).toEqual({
      structuredOutput: { verdict: "pass" },
      visibleResponse: '{"verdict":"pass"}',
      parseError: null,
    });
  });

  it("reports malformed reviewer output", () => {
    expect(parseAcpxStructuredReview(transcript("pass"))).toMatchObject({
      structuredOutput: null,
      parseError: "review response is not valid JSON",
    });
  });
});
