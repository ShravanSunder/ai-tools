import { describe, expect, it } from "vitest";

import { collectAcpxTranscript } from "./acpx-transcript-collector.js";

describe("ACPX transcript collector", () => {
  it("collects model, session, response, and tool facts without grading them", () => {
    const stdout = [
      { method: "session/new", params: { mcpServers: [] } },
      { result: { sessionId: "session-1", models: { currentModelId: "gpt-5.6-luna[xhigh]" } } },
      { method: "session/prompt" },
      { method: "session/update", params: { update: { sessionUpdate: "tool_call", toolCallId: "read-1", rawInput: { path: "SKILL.md" } } } },
      { method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "first " } } } },
      { method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "second" } } } },
      { result: { usage: { inputTokens: 10, outputTokens: 5 }, stopReason: "end_turn" } },
    ].map((message) => JSON.stringify(message)).join("\n");

    const facts = collectAcpxTranscript(stdout);

    expect(facts).toMatchObject({
      sessionId: "session-1",
      resolvedModel: "gpt-5.6-luna",
      reasoningEffort: "xhigh",
      stopReason: "end_turn",
      promptCount: 1,
      mcpServerCount: 0,
      visibleResponse: "first second",
      parseErrors: [],
      transportErrors: [],
      diagnosticErrors: [],
    });
    expect(facts.toolObservations[0]?.payload).toContain("SKILL.md");
    expect(facts.usageObservations).toEqual(['{"inputTokens":10,"outputTokens":5}']);
  });

  it("retains malformed and provider error facts as infrastructure evidence", () => {
    const facts = collectAcpxTranscript([
      "not-json",
      JSON.stringify({ error: { message: "provider unavailable" } }),
    ].join("\n"));

    expect(facts.parseErrors).toEqual(["line 1 is not valid JSON"]);
    expect(facts.transportErrors).toEqual(["provider unavailable"]);
  });

  it("recognizes transport failures emitted as ordinary agent message chunks", () => {
    const facts = collectAcpxTranscript([
      JSON.stringify({ method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "stream disconnected before completion: error sending request for url" } } } }),
      JSON.stringify({ result: { stopReason: "end_turn" } }),
    ].join("\n"));

    expect(facts.stopReason).toBe("end_turn");
    expect(facts.diagnosticErrors).toEqual(expect.arrayContaining([
      expect.stringMatching(/stream disconnected/),
      expect.stringMatching(/error sending request/),
    ]));
  });

  it("redacts split response secrets and tool payloads before returning persistable facts", () => {
    const secret = "token-super-secret-value";
    const facts = collectAcpxTranscript([
      JSON.stringify({ method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "token-super-" } } } }),
      JSON.stringify({ method: "session/update", params: { update: { sessionUpdate: "agent_message_chunk", content: { text: "secret-value" } } } }),
      JSON.stringify({ method: "session/update", params: { update: { sessionUpdate: "tool_call", rawInput: { value: secret } } } }),
    ].join("\n"), { secrets: [secret], excerptLimit: 100 });

    expect(JSON.stringify(facts)).not.toContain(secret);
    expect(facts.visibleResponse).toBe("[REDACTED]");
    expect(facts.toolObservations[0]?.payload).toContain("[REDACTED]");
  });
});
