import { describe, expect, test } from "vitest";
import { normalizeAcpxEventLines } from "./normalize-acpx-events.js";

describe("normalizeAcpxEventLines", () => {
  test("recognizes source inspection performed through an ACP execute tool", () => {
    const toolCallId = "exec-source-read";
    const rawEvents = [
      JSON.stringify({
        method: "session/update",
        params: {
          update: {
            sessionUpdate: "tool_call",
            toolCallId,
            status: "in_progress",
            kind: "execute",
            title:
              "pwd && sed -n '1,260p' plugins/example/skills/example/SKILL.md",
            rawInput: {
              command:
                "pwd && sed -n '1,260p' plugins/example/skills/example/SKILL.md",
              cwd: "/repo",
            },
          },
        },
      }),
      JSON.stringify({
        method: "session/update",
        params: {
          update: {
            sessionUpdate: "tool_call_update",
            toolCallId,
            status: "completed",
            rawOutput: {
              formatted_output: "# Example skill",
            },
          },
        },
      }),
    ].join("\n");

    expect(normalizeAcpxEventLines(rawEvents)).toEqual([
      expect.objectContaining({
        capability: "source-read",
        exitCode: 0,
      }),
    ]);
  });

  test("does not treat an arbitrary execute tool as a source read", () => {
    const rawEvents = JSON.stringify({
      method: "session/update",
      params: {
        update: {
          sessionUpdate: "tool_call",
          toolCallId: "exec-build",
          status: "completed",
          kind: "execute",
          title: "pnpm run build",
          rawInput: { command: "pnpm run build", cwd: "/repo" },
          rawOutput: { formatted_output: "build complete" },
        },
      },
    });

    expect(normalizeAcpxEventLines(rawEvents)).toEqual([
      expect.objectContaining({ capability: "other" }),
    ]);
  });
});
