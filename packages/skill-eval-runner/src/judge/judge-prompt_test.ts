import { assert, assertStringIncludes } from "jsr:@std/assert@1";
import { buildJudgePrompt } from "./judge-prompt.ts";
Deno.test("judge prompt contains only request criterion and evidence", () => {
  const text = buildJudgePrompt({
    request: "Do it",
    criterion: "Is it done?",
    evidence: ["answer"],
  });
  assertStringIncludes(text, "Do it");
  assertStringIncludes(text, "Is it done?");
  assertStringIncludes(text, "answer");
  assert(!text.includes("jev"));
});
