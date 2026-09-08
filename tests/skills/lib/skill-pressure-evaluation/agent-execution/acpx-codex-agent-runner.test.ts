import { describe, expect, test } from "vitest";
import {
  buildAcpxBaseArguments,
  createAcpxCodexAgentRunner,
  extractAcpxAssistantMessages,
  extractAcpxAssistantText,
  type AcpxProcessRequest,
} from "./acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import { parseExactAgentJsonResponse } from "./parse-agent-json-response.js";

const subjectSetup = {
  model: "gpt-5.6-luna",
  reasoningEffort: "high",
  timeoutSeconds: 90,
  permissionMode: "approve-reads",
} satisfies AcpxCodexAgentSetup;

describe("buildAcpxBaseArguments", () => {
  test("keeps model, permissions, and timeout in runner setup", () => {
    expect(
      buildAcpxBaseArguments({ repoRoot: "/repo", setup: subjectSetup }),
    ).toEqual([
      "--agent",
      "npx -y @agentclientprotocol/codex-acp@1.6.2",
      "--cwd",
      "/repo",
      "--model",
      "gpt-5.6-luna",
      "--approve-reads",
      "--non-interactive-permissions",
      "fail",
      "--no-terminal",
      "--timeout",
      "90",
    ]);
  });
});

describe("extractAcpxAssistantText", () => {
  test("joins ACPX assistant message chunks", () => {
    const rawEvents = [
      JSON.stringify({
        method: "session/update",
        params: {
          update: {
            sessionUpdate: "agent_message_chunk",
            content: { type: "text", text: "Progress update." },
            _meta: { codex: { phase: "commentary" } },
          },
        },
      }),
      JSON.stringify({
        method: "session/update",
        params: {
          update: {
            sessionUpdate: "agent_message_chunk",
            content: { type: "text", text: "{\"ok\":" },
            _meta: { codex: { phase: "final_answer" } },
          },
        },
      }),
      JSON.stringify({
        method: "session/update",
        params: {
          update: {
            sessionUpdate: "agent_message_chunk",
            content: { type: "text", text: "true}" },
            _meta: { codex: { phase: "final_answer" } },
          },
        },
      }),
    ].join("\n");

    expect(extractAcpxAssistantText(rawEvents)).toBe('{"ok":true}');
  });

  test("joins chunks from the last observed message id only", () => {
    const rawEvents = [
      createAgentMessageChunkEvent("first", '{"ok":false}'),
      createAgentMessageChunkEvent("last", '{"ok":true}'),
    ].join("\n");

    expect(extractAcpxAssistantText(rawEvents)).toBe('{"ok":true}');
    expect(extractAcpxAssistantMessages(rawEvents)).toEqual([
      '{"ok":false}',
      '{"ok":true}',
    ]);
  });

  test("selects the message id that started last when chunks interleave", () => {
    const rawEvents = [
      createAgentMessageChunkEvent("first", "first-"),
      createAgentMessageChunkEvent("last", "last-"),
      createAgentMessageChunkEvent("first", "message"),
      createAgentMessageChunkEvent("last", "message"),
    ].join("\n");

    expect(extractAcpxAssistantText(rawEvents)).toBe("last-message");
  });

  test("leaves malformed last message content for strict JSON rejection", () => {
    const rawEvents = [
      createAgentMessageChunkEvent("first", '{"ok":true}'),
      createAgentMessageChunkEvent("last", '{"ok":false'),
    ].join("\n");

    expect(() =>
      parseExactAgentJsonResponse(extractAcpxAssistantText(rawEvents)),
    ).toThrow("Agent response must contain only JSON.");
  });
});

function createAgentMessageChunkEvent(
  messageId: string,
  text: string,
): string {
  return JSON.stringify({
    method: "session/update",
    params: {
      update: {
        sessionUpdate: "agent_message_chunk",
        messageId,
        content: { type: "text", text },
        _meta: { codex: { phase: "final_answer" } },
      },
    },
  });
}

describe("createAcpxCodexAgentRunner", () => {
  test("associates all final messages with their explicit request", async () => {
    const runner = createAcpxCodexAgentRunner({
      repoRoot: "/repo",
      adapterConfiguration: {},
      processRunner: async (request) => {
        if (request.stdin === "initial prompt") {
          return {
            stdout: [
              createAgentMessageChunkEvent("initial-first", '{"part":1}'),
              createAgentMessageChunkEvent("initial-last", '{"part":2}'),
            ].join("\n"),
            stderr: "",
          };
        }
        if (request.stdin === "explicit follow-up") {
          return {
            stdout: createAgentMessageChunkEvent("follow-up", '{"part":3}'),
            stderr: "",
          };
        }
        return { stdout: "", stderr: "" };
      },
    });

    const result = await runner({
      namePrefix: "subject",
      prompt: "initial prompt",
      followUpPrompts: ["explicit follow-up"],
      setup: subjectSetup,
    });

    expect(result.turnMessageTexts).toEqual([
      ['{"part":1}', '{"part":2}'],
      ['{"part":3}'],
    ]);
    expect(result.turnTexts).toEqual(['{"part":2}', '{"part":3}']);
    expect(result.finalText).toBe('{"part":3}');
  });

  test("creates a fresh configured ACPX session and closes it", async () => {
    const requests: AcpxProcessRequest[] = [];
    const controller = new AbortController();
    const runner = createAcpxCodexAgentRunner({
      repoRoot: "/repo",
      adapterConfiguration: {
        config: {
          approvals_reviewer: "auto_review",
          features: { hooks: true, multi_agent: false },
          model_providers: {
            "test-router": {
              base_url: "http://localhost:9876/v1",
              name: "Test Router",
              wire_api: "responses",
            },
          },
          service_tier: "priority",
        },
        modelProvider: "test-router",
      },
      processRunner: async (request) => {
        requests.push(request);
        if (request.stdin === "test prompt") {
          return {
            stdout: JSON.stringify({
              method: "session/update",
              params: {
                update: {
                  sessionUpdate: "agent_message_chunk",
                  content: { type: "text", text: "result" },
                  _meta: { codex: { phase: "final_answer" } },
                },
              },
            }),
            stderr: "",
          };
        }
        return { stdout: "", stderr: "" };
      },
    });

    const result = await runner({
      namePrefix: "subject",
      prompt: "test prompt",
      signal: controller.signal,
      setup: subjectSetup,
    });

    expect(result.finalText).toBe("result");
    expect(requests).toHaveLength(4);
    expect(requests[0]?.args).toContain("new");
    expect(requests[1]?.args).toEqual(
      expect.arrayContaining(["set", "reasoning_effort", "high"]),
    );
    expect(requests[2]?.args).toEqual(
      expect.arrayContaining(["--format", "json", "--json-strict"]),
    );
    expect(requests[3]?.args).toContain("close");
    expect(requests.every((request) => !request.args.includes("codex"))).toBe(true);
    expect(requests[2]?.args).toContain("prompt");
    expect(requests.every((request) => request.environment["INITIAL_AGENT_MODE"] === "read-only")).toBe(true);
    expect(
      requests
        .slice(0, 3)
        .every((request) => request.signal === controller.signal),
    ).toBe(true);
    expect(requests[3]?.signal).toBeUndefined();
    const configuredSession: unknown = JSON.parse(requests[2]?.environment["CODEX_CONFIG"] ?? "null");
    expect(configuredSession).toEqual({
        model_providers: {
          "test-router": {
            base_url: "http://localhost:9876/v1",
            name: "Test Router",
            wire_api: "responses",
          },
        },
        service_tier: "priority",
        approvals_reviewer: "user",
        features: { hooks: false, multi_agent: false },
    });
    expect(requests[2]?.environment["MODEL_PROVIDER"]).toBe("test-router");
    expect(requests[2]?.environment["CODEX_PATH"]).toBeUndefined();
  });

  test("attempts session cleanup when cancellation interrupts session creation", async () => {
    const requests: AcpxProcessRequest[] = [];
    const runner = createAcpxCodexAgentRunner({
      repoRoot: "/repo",
      adapterConfiguration: {},
      processRunner: async (request) => {
        requests.push(request);
        if (request.args.includes("new")) {
          throw new Error("The operation was aborted");
        }
        return { stdout: "", stderr: "" };
      },
    });

    await expect(
      runner({
        namePrefix: "subject",
        prompt: "test prompt",
        setup: subjectSetup,
      }),
    ).rejects.toThrow("The operation was aborted");

    expect(requests).toHaveLength(2);
    expect(requests[0]?.args).toContain("new");
    expect(requests[1]?.args).toContain("close");
    expect(requests[1]?.signal).toBeUndefined();
  });
});
