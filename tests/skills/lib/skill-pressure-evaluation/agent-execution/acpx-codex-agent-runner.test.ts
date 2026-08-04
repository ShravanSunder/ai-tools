import { describe, expect, test } from "vitest";
import {
  buildAcpxBaseArguments,
  createAcpxCodexAgentRunner,
  extractAcpxAssistantText,
  type AcpxProcessRequest,
} from "./acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";

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
});

describe("createAcpxCodexAgentRunner", () => {
  test("creates a fresh configured ACPX session and closes it", async () => {
    const requests: AcpxProcessRequest[] = [];
    const controller = new AbortController();
    const runner = createAcpxCodexAgentRunner({
      repoRoot: "/repo",
      adapterConfiguration: {
        config: {
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
    expect(
      requests
        .slice(0, 3)
        .every((request) => request.signal === controller.signal),
    ).toBe(true);
    expect(requests[3]?.signal).toBeUndefined();
    expect(requests[2]?.environment["CODEX_CONFIG"]).toBe(
      JSON.stringify({
        model_providers: {
          "test-router": {
            base_url: "http://localhost:9876/v1",
            name: "Test Router",
            wire_api: "responses",
          },
        },
        service_tier: "priority",
      }),
    );
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
