import { describe, expect, it } from "vitest";
import {
  parseAgentJsonResponse,
  parseExactAgentJsonResponse,
} from "./parse-agent-json-response.js";

describe("parseExactAgentJsonResponse", () => {
  it("parses a JSON-only response", () => {
    expect(parseExactAgentJsonResponse('{"status":"complete"}')).toEqual({
      status: "complete",
    });
  });

  it("rejects commentary before otherwise valid JSON", () => {
    const response = 'I completed the task.\n{"status":"complete"}';

    expect(() => parseExactAgentJsonResponse(response)).toThrow(
      "Agent response must contain only JSON.",
    );
  });

  it("rejects fenced JSON", () => {
    const response = '```json\n{"status":"complete"}\n```';

    expect(() => parseExactAgentJsonResponse(response)).toThrow(
      "Agent response must contain only JSON.",
    );
  });
});

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
