import { describe, expect, it } from "vitest";
import { parseAgentJsonResponse } from "./parse-agent-json-response.js";

describe("parseAgentJsonResponse", () => {
  it("parses a JSON-only response", () => {
    const response = '{"status":"complete"}';

    const result = parseAgentJsonResponse(response);

    expect(result).toEqual({ status: "complete" });
  });

  it("parses JSON in a fenced response", () => {
    const response = '```json\n{"status":"complete"}\n```';

    const result = parseAgentJsonResponse(response);

    expect(result).toEqual({ status: "complete" });
  });

  it("parses one trailing JSON object after explanatory prose", () => {
    const response = [
      "I inspected the requested skill and preserved the user boundary.",
      '{"status":"complete","boundary_preserved":true}',
    ].join("\n\n");

    const result = parseAgentJsonResponse(response);

    expect(result).toEqual({
      status: "complete",
      boundary_preserved: true,
    });
  });

  it("rejects malformed trailing JSON", () => {
    const response = 'Explanation followed by {"status":"complete"';

    expect(() => parseAgentJsonResponse(response)).toThrow(
      "Agent did not return JSON.",
    );
  });

  it("rejects JSON followed by non-whitespace text", () => {
    const response = '{"status":"complete"}\nThis text came afterward.';

    expect(() => parseAgentJsonResponse(response)).toThrow(
      "Agent did not return JSON.",
    );
  });
});
