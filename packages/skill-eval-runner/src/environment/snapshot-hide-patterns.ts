import { join } from "node:path";
// `.skill-eval-hide` at the repository root names evaluation material (eval specs, eval
// changelogs, the runner source) that must not reach a subject's snapshot (U25).
// Supported gitignore subset: `#` comments, blank lines, a trailing `/` matches directories
// only, a leading or inner `/` anchors the pattern to the repository root (otherwise it
// matches a name at any depth), and `*` matches within one path segment.
export const snapshotHideFileName = ".skill-eval-hide";
export type SnapshotHidePattern = {
  readonly source: string;
  readonly matcher: RegExp;
  readonly directoryOnly: boolean;
  readonly matchesNameAtAnyDepth: boolean;
};
const globToRegExp = (glob: string): RegExp =>
  new RegExp(
    `^${
      glob.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
        .join("[^/]*")
    }$`,
  );
export function parseSnapshotHidePatterns(
  text: string,
): readonly SnapshotHidePattern[] {
  return text.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) =>
    line !== "" && !line.startsWith("#")
  ).map((line) => {
    if (line.startsWith("!")) {
      throw new Error(
        `${snapshotHideFileName}: negation is not supported: ${line}`,
      );
    }
    const directoryOnly = line.endsWith("/");
    const withoutTrailingSlash = directoryOnly ? line.slice(0, -1) : line;
    const anchored = withoutTrailingSlash.includes("/");
    const pattern = withoutTrailingSlash.replace(/^\//, "");
    return {
      source: line,
      matcher: globToRegExp(pattern),
      directoryOnly,
      matchesNameAtAnyDepth: !anchored,
    };
  });
}
export function isHiddenPath(
  patterns: readonly SnapshotHidePattern[],
  relativePath: string,
  isDirectory: boolean,
): boolean {
  const name = relativePath.split("/").at(-1) ?? relativePath;
  return patterns.some((pattern) =>
    (!pattern.directoryOnly || isDirectory) &&
    pattern.matcher.test(pattern.matchesNameAtAnyDepth ? name : relativePath)
  );
}
const removeMatchingPaths = async (
  snapshot: string,
  patterns: readonly SnapshotHidePattern[],
  relativeDirectory: string,
): Promise<void> => {
  const entries: Deno.DirEntry[] = [];
  for await (const entry of Deno.readDir(join(snapshot, relativeDirectory))) {
    entries.push(entry);
  }
  for (const entry of entries) {
    const relativePath = relativeDirectory
      ? `${relativeDirectory}/${entry.name}`
      : entry.name;
    if (isHiddenPath(patterns, relativePath, entry.isDirectory)) {
      await Deno.remove(join(snapshot, relativePath), { recursive: true });
    } else if (entry.isDirectory) {
      await removeMatchingPaths(snapshot, patterns, relativePath);
    }
  }
};
/**
 * Reads the hide list from the repository under test, not from the revision, so a base Run at
 * a commit that predates the list hides the same material as its head Runs.
 */
export async function removeHiddenPathsFromSnapshot(
  repoRoot: string,
  snapshot: string,
): Promise<void> {
  const hideText = await Deno.readTextFile(
    join(repoRoot, snapshotHideFileName),
  ).catch((error) => {
    if (error instanceof Deno.errors.NotFound) return "";
    throw error;
  });
  await removeMatchingPaths(
    snapshot,
    parseSnapshotHidePatterns(hideText),
    "",
  );
  await Deno.remove(join(snapshot, snapshotHideFileName)).catch((error) => {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  });
}
