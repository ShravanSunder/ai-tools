import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import {
  isHiddenPath,
  parseSnapshotHidePatterns,
} from "./snapshot-hide-patterns.ts";
Deno.test("hide patterns skip comments and blanks and follow gitignore anchoring", () => {
  const patterns = parseSnapshotHidePatterns(
    "# why\n\npackages/runner/\ndocs/2026-10-*/\nNOTES.eval\n",
  );
  assertEquals(patterns.length, 3);
  assertEquals(isHiddenPath(patterns, "packages/runner", true), true);
  assertEquals(isHiddenPath(patterns, "packages/runner", false), false);
  assertEquals(isHiddenPath(patterns, "other/packages/runner", true), false);
  assertEquals(isHiddenPath(patterns, "docs/2026-10-07-misses", true), true);
  assertEquals(isHiddenPath(patterns, "docs/2026-09-07-misses", true), false);
  assertEquals(isHiddenPath(patterns, "a/b/NOTES.eval", false), true);
});
Deno.test("hide patterns reject negation instead of silently ignoring it", () => {
  assertThrows(() => parseSnapshotHidePatterns("docs/\n!docs/keep.md\n"));
});
