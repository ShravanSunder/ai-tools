import { assert } from "jsr:@std/assert@1";
import { lintSkills } from "./lint-skills.ts";
Deno.test("lint checks frontmatter and references", async () => {
  const dir =
    new URL("../../test-fixtures/sample-skill/", import.meta.url).pathname;
  const findings = await lintSkills(dir, ["forbidden-word"]);
  assert(findings.every((f) => f.rule !== "frontmatter-description"));
});
