import { join } from "node:path";
// `.skill-eval-hide` at the repository root names evaluation material (eval specs, eval
// changelogs, the runner source) that must not reach a subject's snapshot (U25).
// Supported gitignore subset: `#` comments, blank lines, a trailing `/` matches directories
// only, a leading or inner `/` anchors the pattern to the repository root (otherwise it
// matches a name at any depth), and `*` matches within one path segment. Every other
// gitignore token is rejected, because mis-reading one would hide less than the author wrote.
export const snapshotHideFileName = ".skill-eval-hide";
export type SnapshotHidePattern = {
  readonly source: string;
  readonly matcher: RegExp;
  readonly directoryOnly: boolean;
  readonly matchesNameAtAnyDepth: boolean;
};
export type SnapshotHideList =
  | { kind: "valid"; patterns: readonly SnapshotHidePattern[] }
  | { kind: "invalid"; errors: readonly string[] };
const unsupportedSyntaxReason = (line: string): string | undefined => {
  if (line.startsWith("!")) return "negation (!) is not supported";
  if (line.includes("**")) {
    return "** is not supported; * matches within one path segment";
  }
  if (line.includes("?")) return "? is not supported";
  if (line.includes("[") || line.includes("]")) {
    return "character classes ([ ]) are not supported";
  }
  if (line.includes("\\")) return "backslash escapes are not supported";
  return undefined;
};
const globToRegExp = (glob: string): RegExp =>
  new RegExp(
    `^${
      glob.split("*").map((part) => part.replace(/[.+^${}()|]/g, "\\$&"))
        .join("[^/]*")
    }$`,
  );
export function parseSnapshotHidePatterns(text: string): SnapshotHideList {
  const patterns: SnapshotHidePattern[] = [];
  const errors: string[] = [];
  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    if (line === "" || line.startsWith("#")) return;
    const unsupported = unsupportedSyntaxReason(line);
    if (unsupported) {
      errors.push(
        `${snapshotHideFileName}:${index + 1}: ${line}: ${unsupported}`,
      );
      return;
    }
    const directoryOnly = line.endsWith("/");
    const withoutTrailingSlash = directoryOnly ? line.slice(0, -1) : line;
    const anchored = withoutTrailingSlash.includes("/");
    patterns.push({
      source: line,
      matcher: globToRegExp(withoutTrailingSlash.replace(/^\//, "")),
      directoryOnly,
      matchesNameAtAnyDepth: !anchored,
    });
  });
  return errors.length > 0
    ? { kind: "invalid", errors }
    : { kind: "valid", patterns };
}
/**
 * Reads the hide list from the repository under test, not from the revision, so a base Run at
 * a commit that predates the list hides the same material as its head Runs. A missing file
 * hides nothing extra.
 */
export async function readSnapshotHideList(
  repoRoot: string,
): Promise<SnapshotHideList> {
  const hideText = await Deno.readTextFile(
    join(repoRoot, snapshotHideFileName),
  ).catch((error) => {
    if (error instanceof Deno.errors.NotFound) return "";
    throw error;
  });
  return parseSnapshotHidePatterns(hideText);
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
/** The first path of the skill directory (or its SKILL.md) that the patterns would hide. */
export function hiddenSkillPath(
  patterns: readonly SnapshotHidePattern[],
  relativeSkillDir: string,
): string | undefined {
  const segments = relativeSkillDir.split("/").filter(Boolean);
  for (let depth = 1; depth <= segments.length; depth++) {
    const directory = segments.slice(0, depth).join("/");
    if (isHiddenPath(patterns, directory, true)) return directory;
  }
  const skillFile = [...segments, "SKILL.md"].join("/");
  return isHiddenPath(patterns, skillFile, false) ? skillFile : undefined;
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
export async function removeHiddenPathsFromSnapshot(
  snapshot: string,
  patterns: readonly SnapshotHidePattern[],
): Promise<void> {
  await removeMatchingPaths(snapshot, patterns, "");
  await Deno.remove(join(snapshot, snapshotHideFileName)).catch((error) => {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  });
}
