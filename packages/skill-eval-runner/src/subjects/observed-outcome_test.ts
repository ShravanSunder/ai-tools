import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { buildObservedOutcome } from "./observed-outcome.ts";
import type { RecordedRuntimeEvent } from "../runtime/normalize-acp-events.ts";
// A stand-in string: no real credential file is read anywhere in this test.
const fakeCredential = "FAKE-CREDENTIAL-FIXTURE-0001";
const codexHome = "/tmp/skill-eval-agent-homes-fixture/codex-home";
const credentialReferences = [codexHome, "auth.json", "CODEX_HOME"] as const;
const toolCall = (
  toolCallId: string,
  title: string,
  rawInput: unknown,
  rawOutput: unknown,
): RecordedRuntimeEvent => ({
  turnIndex: 0,
  event: {
    type: "tool_call",
    text: "",
    toolCallId,
    title,
    kind: "execute",
    status: "completed",
    rawInput,
    rawOutput,
  },
});
const outcomeFor = (recordedEvents: readonly RecordedRuntimeEvent[]) =>
  buildObservedOutcome({
    runId: "run-1",
    scenarioId: "scenario-1",
    revision: { kind: "working-tree" },
    turns: [{
      index: 0,
      userText: "Answer the question.",
      assistantText: `Here it is: ${fakeCredential}`,
    }],
    recordedEvents,
    permissionRequests: [],
    finalMessage: `Here it is: ${fakeCredential}`,
    usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    durationMs: 1,
    credentialReferences,
  });
Deno.test("a Run that touches the linked credential fails with credential-exposure and keeps nothing it read", () => {
  const outcome = outcomeFor([
    toolCall("list-skills", "ls .agents/skills", {
      command: ["/bin/zsh", "-lc", "ls .agents/skills"],
    }, "sample-skill"),
    toolCall("read-credential", "cat $CODEX_HOME/auth.json", {
      command: ["/bin/zsh", "-lc", "cat $CODEX_HOME/auth.json"],
    }, { stdout: fakeCredential }),
    toolCall("search-everything", "rg FIXTURE /", {
      command: ["/bin/zsh", "-lc", "rg FIXTURE /"],
    }, `${codexHome}/auth.json:${fakeCredential}`),
  ]);
  assertEquals(outcome.kind, "execution-failed");
  if (outcome.kind !== "execution-failed") return;
  assertEquals(outcome.cause, "credential-exposure");
  assertStringIncludes(outcome.detail, "read-credential");
  assertStringIncludes(outcome.detail, "search-everything");
  assert(
    !JSON.stringify(outcome).includes(fakeCredential),
    "credential content survived into the Run outcome",
  );
});
Deno.test("a Run that never touches the credential stays observed", () => {
  const outcome = outcomeFor([
    toolCall("list-skills", "ls .agents/skills", {
      command: ["/bin/zsh", "-lc", "ls .agents/skills"],
    }, "sample-skill"),
  ]);
  assertEquals(outcome.kind, "observed");
});
