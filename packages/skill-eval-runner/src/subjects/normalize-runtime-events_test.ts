import { assertEquals } from "jsr:@std/assert@1";
import { normalizeRuntimeEvents } from "./normalize-runtime-events.ts";
Deno.test("merges repeated ACPX tool updates by id", () => {
  const events = normalizeRuntimeEvents([
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "r1",
        title: "Read file",
        kind: "read",
        status: "pending",
        rawInput: { path: "sample-skill/SKILL.md" },
      },
    },
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "r1",
        title: "Read file sample-skill/SKILL.md",
        kind: "read",
        status: "completed",
        rawOutput: "ok",
      },
    },
  ]);
  assertEquals(events.length, 1);
  assertEquals(events[0].status, "completed");
  assertEquals(events[0].inputText, '{"path":"sample-skill/SKILL.md"}');
  assertEquals(events[0].outputText, "ok");
});
