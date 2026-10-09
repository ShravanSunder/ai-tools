import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import { lintSkills } from "./lint-skills.ts";
Deno.test("lint checks frontmatter and references", async () => {
  const dir = new URL(
    "../../test-fixtures/sample-repo/plugins/sample-plugin/skills/sample-skill/",
    import.meta.url,
  ).pathname;
  const findings = await lintSkills(dir, ["forbidden-word"]);
  assert(findings.findings.every((f) => f.rule !== "frontmatter-description"));
});
Deno.test("resolves a references path owned by another named skill", async () => {
  const fixture =
    new URL("../../test-fixtures/cross-skill-lint/", import.meta.url).pathname;
  const result = await lintSkills(fixture);
  const referenceFindings = result.findings.filter((finding) =>
    finding.rule === "reference-exists"
  );
  assertEquals(referenceFindings.length, 1);
  assertStringIncludes(referenceFindings[0].message, "references/missing.md");
});
