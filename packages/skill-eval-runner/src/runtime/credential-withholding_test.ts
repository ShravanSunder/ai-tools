import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import {
  credentialWithheldMarker,
  describeWithheldToolCalls,
  withholdCredentialReferences,
} from "./credential-withholding.ts";
import type { Observation } from "../contracts/observation.ts";
// A stand-in string: no real credential file is read anywhere in this test.
const fakeCredential = "FAKE-CREDENTIAL-FIXTURE-0002";
const givenCodexHome = "/tmp/skill-eval-agent-homes-fixture/codex-home";
const resolvedCodexHome =
  "/private/tmp/skill-eval-agent-homes-fixture/codex-home";
const codexHomePaths = [givenCodexHome, resolvedCodexHome] as const;
const recordedCall = (
  id: string,
  title: string,
  inputText: string,
  outputText: string,
): Observation["toolCalls"][number] => ({
  id,
  turnIndex: 0,
  kind: "execute",
  title,
  status: "completed",
  inputText,
  outputText,
});
Deno.test("repository text that mentions auth.json, CODEX_HOME or a codex-home-like name is not a credential read", () => {
  const benignCalls = [
    recordedCall(
      "read-sidecar",
      "cat agent_sidecar/run-agent-sidecar.sh",
      '{"command":"cat agent_sidecar/run-agent-sidecar.sh"}',
      'export CODEX_HOME="$runtime_home"\nln -s "$host_home/auth.json" "$CODEX_HOME/auth.json"',
    ),
    recordedCall(
      "read-changelog",
      "rg source-proof docs/changelog",
      '{"command":"rg source-proof docs/changelog"}',
      "CODEX_HOME=tmp/codex-home-source-proof codex plugin add",
    ),
  ];
  const result = withholdCredentialReferences(benignCalls, codexHomePaths);
  assertEquals(result.withheld, []);
  assertEquals(result.toolCalls, benignCalls);
});
Deno.test("tool calls naming the Codex home by name, resolved path or given path have their input and output withheld", () => {
  const benign = recordedCall("ls", "ls docs", '{"command":"ls docs"}', "a.md");
  const result = withholdCredentialReferences([
    benign,
    recordedCall(
      "by-name",
      "cat $HOME/../codex-home/auth.json",
      '{"command":"cat $HOME/../codex-home/auth.json"}',
      fakeCredential,
    ),
    recordedCall(
      "by-resolved-path",
      `cat ${resolvedCodexHome}/auth.json`,
      `{"command":"cat ${resolvedCodexHome}/auth.json"}`,
      fakeCredential,
    ),
    recordedCall(
      "by-given-path-in-output",
      "rg FIXTURE /tmp",
      '{"command":"rg FIXTURE /tmp"}',
      `${givenCodexHome}/auth.json:${fakeCredential}`,
    ),
  ], codexHomePaths);
  assertEquals(result.withheld.map((call) => call.id), [
    "by-name",
    "by-resolved-path",
    "by-given-path-in-output",
  ]);
  assertEquals(result.toolCalls[0], benign);
  for (const withheld of result.toolCalls.slice(1)) {
    assertEquals(withheld.inputText, credentialWithheldMarker);
    assertEquals(withheld.outputText, credentialWithheldMarker);
  }
  assertEquals(JSON.stringify(result).includes(fakeCredential), false);
});
Deno.test("the withheld description names each call's id and capped title, never its content", () => {
  const longTitle = `cat ${givenCodexHome}/auth.json ${"x".repeat(200)}`;
  const description = describeWithheldToolCalls([
    { id: "by-name", title: "cat $HOME/../codex-home/auth.json" },
    { id: "long", title: longTitle },
  ]);
  assertStringIncludes(
    description,
    'by-name "cat $HOME/../codex-home/auth.json"',
  );
  const shownLongTitle: unknown = JSON.parse(description.split("; long ")[1]);
  assert(typeof shownLongTitle === "string");
  assert(shownLongTitle.length <= 120, shownLongTitle);
});
