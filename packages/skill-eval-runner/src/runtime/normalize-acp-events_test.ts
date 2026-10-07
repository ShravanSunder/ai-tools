import { assertEquals } from "jsr:@std/assert@1";
import { normalizeRuntimeEvents } from "./normalize-acp-events.ts";
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
Deno.test("generic completion updates preserve specific command titles", async () => {
  const { normalizeRuntimeEvents } = await import(
    "../runtime/normalize-acp-events.ts"
  );
  const events = normalizeRuntimeEvents([
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "read",
        title: "cat sample.md",
        kind: "execute",
        status: "pending",
      },
    },
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "read",
        title: "tool call",
        kind: "execute",
        status: "completed",
      },
    },
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "sub",
        title: "Start subagent helper",
        kind: "other",
        status: "pending",
      },
    },
    {
      turnIndex: 0,
      event: {
        type: "tool_call",
        text: "",
        toolCallId: "sub",
        title: "tool call",
        kind: "other",
        status: "completed",
      },
    },
  ]);
  assertEquals(events.map((event) => event.title), [
    "cat sample.md",
    "Start subagent helper",
  ]);
});
