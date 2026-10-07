import { assert, assertStringIncludes } from "jsr:@std/assert@1";
import { buildJudgePrompt } from "./judge-prompt.ts";
Deno.test("judge prompt labels request as context only and quotes evidence", () => {
  const text = buildJudgePrompt({
    request: "Do it",
    criterion: "Is it done?",
    evidence: ["answer"],
  });
  assertStringIncludes(text, "User's request (context only):");
  assertStringIncludes(text, "Evidence 1:\n<<<\nanswer\n>>>");
  assertStringIncludes(text, "Criterion:\nIs it done?");
  assert(!text.toLowerCase().includes("jev"));
  assert(!text.includes('"request"'));
});
