import { assertEquals } from "jsr:@std/assert@1";
import {
  credentialWithheldMarker,
  withholdCredentialReferences,
} from "./credential-withholding.ts";
import type { Observation } from "../contracts/observation.ts";
// A stand-in string: no real credential file is read anywhere in this test.
const fakeCredential = "FAKE-CREDENTIAL-FIXTURE-0002";
const codexHome = "/tmp/skill-eval-agent-homes-fixture/codex-home";
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
Deno.test("only tool calls naming the credential have their input and output withheld", () => {
  const benign = recordedCall("ls", "ls docs", '{"command":"ls docs"}', "a.md");
  const result = withholdCredentialReferences([
    benign,
    recordedCall(
      "by-path",
      `cat ${codexHome}/auth.json`,
      `{"command":"cat ${codexHome}/auth.json"}`,
      fakeCredential,
    ),
    recordedCall(
      "by-variable",
      "printenv CODEX_HOME",
      '{"command":"printenv CODEX_HOME"}',
      codexHome,
    ),
    recordedCall(
      "by-output",
      "rg FIXTURE /",
      '{"command":"rg FIXTURE /"}',
      `${codexHome}/auth.json:${fakeCredential}`,
    ),
  ], [codexHome, "auth.json", "CODEX_HOME"]);
  assertEquals(result.withheldToolCallIds, [
    "by-path",
    "by-variable",
    "by-output",
  ]);
  assertEquals(result.toolCalls[0], benign);
  for (const withheld of result.toolCalls.slice(1)) {
    assertEquals(withheld.inputText, credentialWithheldMarker);
    assertEquals(withheld.outputText, credentialWithheldMarker);
  }
  assertEquals(JSON.stringify(result).includes(fakeCredential), false);
});
