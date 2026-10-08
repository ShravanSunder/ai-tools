import { assertEquals } from "jsr:@std/assert@1";
import type { AcpRuntimeEvent } from "npm:acpx@0.19.4/runtime";
import { judgeAnswerFromSession } from "./judge-session-answer.ts";
import { judgeCodexConfig } from "./acpx-judge.ts";
// A stand-in string: no real credential file is read anywhere in this test.
const fakeCredential = "FAKE-CREDENTIAL-FIXTURE-0003";
const judgeCodexHome = "/tmp/skill-eval-judge-codex-home-fixture";
const decidedReply = (rationale: string): AcpRuntimeEvent => ({
  type: "text_delta",
  text: JSON.stringify({
    kind: "decided",
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale,
  }),
  stream: "output",
  messageId: "m1",
});
const judgeToolCall = (
  command: string,
  rawOutput: string,
): AcpRuntimeEvent => ({
  type: "tool_call",
  text: "",
  toolCallId: "judge-call-1",
  title: command,
  kind: "execute",
  status: "completed",
  rawInput: { command: ["/bin/zsh", "-lc", command] },
  rawOutput,
});
Deno.test("a judge session that touches its linked login is undecidable and its reply is dropped", () => {
  const answer = judgeAnswerFromSession({
    events: [
      judgeToolCall(
        "cat $HOME/../skill-eval-judge-codex-home-fixture/auth.json",
        fakeCredential,
      ),
      decidedReply(`the login is ${fakeCredential}`),
    ],
    completed: true,
    judgeCodexHomePaths: [judgeCodexHome],
  });
  assertEquals(answer, {
    kind: "undecidable",
    reason: "judge-credential-exposure",
  });
});
Deno.test("a judge session that reads ordinary text keeps its decided reply", () => {
  const answer = judgeAnswerFromSession({
    events: [
      judgeToolCall("cat notes.md", "mentions CODEX_HOME and auth.json"),
      decidedReply("clear"),
    ],
    completed: true,
    judgeCodexHomePaths: [judgeCodexHome],
  });
  assertEquals(answer, {
    kind: "decided",
    result: "pass",
    evidenceQuote: "Useful answer",
    rationale: "clear",
  });
});
Deno.test("judge shell commands do not inherit CODEX_HOME", () =>
  assertEquals(judgeCodexConfig.shell_environment_policy.exclude, [
    "CODEX_HOME",
  ]));
