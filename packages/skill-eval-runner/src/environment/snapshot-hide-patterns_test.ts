import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import {
  isHiddenPath,
  parseSnapshotHidePatterns,
} from "./snapshot-hide-patterns.ts";
Deno.test("hide patterns skip comments and blanks and follow gitignore anchoring", () => {
  const parsed = parseSnapshotHidePatterns(
    "# why\n\npackages/runner/\ndocs/2026-10-*/\nNOTES.eval\n",
  );
  assertEquals(parsed.kind, "valid");
  if (parsed.kind !== "valid") return;
  const patterns = parsed.patterns;
  assertEquals(patterns.length, 3);
  assertEquals(isHiddenPath(patterns, "packages/runner", true), true);
  assertEquals(isHiddenPath(patterns, "packages/runner", false), false);
  assertEquals(isHiddenPath(patterns, "other/packages/runner", true), false);
  assertEquals(isHiddenPath(patterns, "docs/2026-10-07-misses", true), true);
  assertEquals(isHiddenPath(patterns, "docs/2026-09-07-misses", true), false);
  assertEquals(isHiddenPath(patterns, "a/b/NOTES.eval", false), true);
});
Deno.test("hide patterns reject every unsupported gitignore token with its line", () => {
  const unsupportedLines = [
    "!docs/keep.md",
    "**/eval-notes.md",
    "docs/spec-?.md",
    "docs/[ab]-spec.md",
    "docs/a]b.md",
    "\\#literal-hash.md",
  ] as const;
  const parsed = parseSnapshotHidePatterns(
    ["# header", "docs/ok/", ...unsupportedLines].join("\n"),
  );
  assertEquals(parsed.kind, "invalid");
  if (parsed.kind !== "invalid") return;
  assertEquals(parsed.errors.length, unsupportedLines.length);
  unsupportedLines.forEach((line, index) => {
    const error = parsed.errors[index];
    assertStringIncludes(error, `.skill-eval-hide:${index + 3}:`);
    assertStringIncludes(error, line);
    assert(error.includes("not supported"), error);
  });
});
