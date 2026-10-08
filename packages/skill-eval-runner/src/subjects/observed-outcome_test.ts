import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { buildObservedOutcome } from "./observed-outcome.ts";
import type { RecordedRuntimeEvent } from "../runtime/normalize-acp-events.ts";
// A stand-in string: no real credential file is read anywhere in this test.
const fakeCredential = "FAKE-CREDENTIAL-FIXTURE-0001";
const givenCodexHome = "/tmp/skill-eval-agent-homes-fixture/codex-home";
const resolvedCodexHome =
  "/private/tmp/skill-eval-agent-homes-fixture/codex-home";
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
const shellCall = (
  toolCallId: string,
  command: string,
  rawOutput: unknown,
): RecordedRuntimeEvent =>
  toolCall(toolCallId, command, {
    command: ["/bin/zsh", "-lc", command],
  }, rawOutput);
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
    subjectCodexHomePaths: [givenCodexHome, resolvedCodexHome],
  });
for (
  const [route, command] of [
    ["the Codex home's name", "cat $HOME/../codex-home/auth.json"],
    ["the resolved path", `cat ${resolvedCodexHome}/auth.json`],
    ["the given path", `cat ${givenCodexHome}/auth.json`],
  ] as const
) {
  Deno.test(`a credential read through ${route} fails the Run with credential-exposure and keeps nothing it read`, () => {
    const outcome = outcomeFor([
      shellCall("list-skills", "ls .agents/skills", "sample-skill"),
      shellCall("read-credential", command, { stdout: fakeCredential }),
    ]);
    assertEquals(outcome.kind, "execution-failed");
    if (outcome.kind !== "execution-failed") return;
    assertEquals(outcome.cause, "credential-exposure");
    assertStringIncludes(
      outcome.detail,
      `read-credential ${JSON.stringify(command)}`,
    );
    assert(!outcome.detail.includes("list-skills"), outcome.detail);
    assert(
      !JSON.stringify(outcome).includes(fakeCredential),
      "credential content survived into the Run outcome",
    );
  });
}
Deno.test("reading a repository file that mentions auth.json and CODEX_HOME stays observed", () => {
  const outcome = outcomeFor([
    shellCall(
      "read-sidecar",
      "cat agent_sidecar/run-agent-sidecar.sh",
      'export CODEX_HOME="$runtime_home"\nln -s "$host_home/auth.json" "$CODEX_HOME/auth.json"',
    ),
  ]);
  assertEquals(outcome.kind, "observed");
});
