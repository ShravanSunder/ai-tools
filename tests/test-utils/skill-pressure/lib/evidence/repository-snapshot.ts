import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { ExpectedArtifact } from "../contracts/contract-types.js";

export interface RepositorySnapshotEntry {
  readonly path: string;
  readonly kind: "file" | "directory";
  readonly contentDigest: string | null;
  readonly contentExcerpt: string | null;
  readonly contentByteLength?: number;
  readonly contentUnavailableReason?: string;
  /** Evaluation-only content is installed as a non-enumerable field by the collector. */
  readonly contentForEvaluation?: string | null;
}

export interface RepositorySnapshotOmission {
  readonly path: string;
  readonly reason: string;
}

export interface RepositorySnapshot {
  readonly repositoryDirectory: string;
  readonly entries: readonly RepositorySnapshotEntry[];
  readonly omissions: readonly RepositorySnapshotOmission[];
}

export interface CollectRepositorySnapshotProps {
  readonly repositoryDirectory: string;
  readonly excerptLimit?: number;
}

export interface RepositoryFileChange extends RepositorySnapshotEntry {
  readonly kind: "file";
  readonly change: "added" | "modified";
}

export interface RepositoryChangeFacts {
  readonly files: readonly RepositoryFileChange[];
  readonly pathChanges: readonly RepositoryPathChange[];
  readonly deletedPaths: readonly string[];
  readonly omissions: readonly RepositorySnapshotOmission[];
}

export interface RepositoryPathChange {
  readonly path: string;
  readonly kind: RepositorySnapshotEntry["kind"];
  readonly change: "added" | "modified" | "deleted";
}

export interface RepositoryEvidence {
  readonly files: readonly RepositorySnapshotEntry[];
  readonly changes: RepositoryChangeFacts;
  readonly artifacts: readonly ExpectedArtifactFact[];
  readonly omissions: readonly RepositorySnapshotOmission[];
}

export interface ExpectedArtifactFact {
  readonly artifactId: string;
  readonly path: string;
  readonly expectedKind: ExpectedArtifact["fileType"];
  readonly status: "observed" | "missing" | "not_evaluated";
  readonly kind: RepositorySnapshotEntry["kind"] | null;
  readonly contentDigest: string | null;
  readonly contentExcerpt: string | null;
  readonly contentByteLength: number | null;
  readonly contentUnavailableReason: string | null;
  /** Evaluation-only content is deliberately absent from serialized receipts. */
  readonly contentForEvaluation?: string | null;
  readonly reason: string | null;
}

const DEFAULT_EXCERPT_LIMIT = 2_000;
export const MAX_ARTIFACT_EVALUATION_CONTENT_BYTES = 1_000_000;
const EXCLUDED_TOP_LEVEL_DIRECTORIES = new Set([".git", ".codex"]);
const EXCLUDED_TOP_LEVEL_FILES = new Set([
  ".skill-pressure-prompt.md",
  ".skill-pressure-mcp.json",
  "AGENTS.md",
]);

export async function collectRepositorySnapshot(
  props: CollectRepositorySnapshotProps,
): Promise<RepositorySnapshot> {
  const repositoryDirectory = path.resolve(props.repositoryDirectory);
  const entries: RepositorySnapshotEntry[] = [];
  const omissions: RepositorySnapshotOmission[] = [];
  await collectDirectory({
    repositoryDirectory,
    relativeDirectory: "",
    excerptLimit: props.excerptLimit ?? DEFAULT_EXCERPT_LIMIT,
    evaluationContentCeiling: MAX_ARTIFACT_EVALUATION_CONTENT_BYTES,
    entries,
    omissions,
  });
  return {
    repositoryDirectory,
    entries: entries.sort(comparePath),
    omissions: omissions.sort(comparePath),
  };
}

export function diffRepositorySnapshots(props: {
  readonly before: RepositorySnapshot;
  readonly after: RepositorySnapshot;
}): RepositoryChangeFacts {
  const beforeEntries = new Map(props.before.entries.map((entry) => [entry.path, entry]));
  const afterEntries = new Map(props.after.entries.map((entry) => [entry.path, entry]));
  const files: RepositoryFileChange[] = [];
  const pathChanges: RepositoryPathChange[] = [];
  const deletedPaths: string[] = [];

  for (const [entryPath, afterEntry] of afterEntries) {
    const beforeEntry = beforeEntries.get(entryPath);
    if (beforeEntry === undefined) {
      pathChanges.push({ path: entryPath, kind: afterEntry.kind, change: "added" });
      if (afterEntry.kind === "file") files.push({ ...afterEntry, kind: "file", change: "added" });
    } else if (beforeEntry.kind !== afterEntry.kind || beforeEntry.contentDigest !== afterEntry.contentDigest) {
      pathChanges.push({ path: entryPath, kind: afterEntry.kind, change: "modified" });
      if (afterEntry.kind === "file") files.push({ ...afterEntry, kind: "file", change: "modified" });
    }
  }
  for (const entryPath of beforeEntries.keys()) {
    if (!afterEntries.has(entryPath)) {
      const beforeEntry = beforeEntries.get(entryPath);
      if (beforeEntry !== undefined) pathChanges.push({ path: entryPath, kind: beforeEntry.kind, change: "deleted" });
      deletedPaths.push(entryPath);
    }
  }

  return {
    files: files.sort(comparePath),
    pathChanges: pathChanges.sort(comparePath),
    deletedPaths: deletedPaths.sort((left, right) => left.localeCompare(right)),
    omissions: [...props.before.omissions, ...props.after.omissions]
      .sort((left, right) => left.path.localeCompare(right.path) || left.reason.localeCompare(right.reason)),
  };
}

export function deriveExpectedArtifactFacts(props: {
  readonly postRunSnapshot: RepositorySnapshot;
  readonly expectedArtifacts: readonly ExpectedArtifact[];
}): readonly ExpectedArtifactFact[] {
  const entries = new Map(props.postRunSnapshot.entries.map((entry) => [entry.path, entry]));
  const omissions = new Map(props.postRunSnapshot.omissions.map((omission) => [omission.path, omission]));
  return [...props.expectedArtifacts]
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId))
    .map((artifact) => {
      const entry = entries.get(artifact.path);
      if (entry !== undefined) {
        return entry.kind === artifact.fileType
          ? observedArtifact(artifact, entry)
          : unavailableArtifact(artifact, `expected ${artifact.fileType}, observed ${entry.kind}`);
      }
      const omission = omissions.get(artifact.path);
      return omission === undefined
        ? missingArtifact(artifact)
        : unavailableArtifact(artifact, omission.reason);
    });
}

export function createRepositoryEvidence(props: {
  readonly beforeRunSnapshot: RepositorySnapshot;
  readonly postRunSnapshot: RepositorySnapshot;
  readonly expectedArtifacts: readonly ExpectedArtifact[];
}): RepositoryEvidence {
  return {
    files: props.postRunSnapshot.entries,
    changes: diffRepositorySnapshots({ before: props.beforeRunSnapshot, after: props.postRunSnapshot }),
    artifacts: deriveExpectedArtifactFacts({
      postRunSnapshot: props.postRunSnapshot,
      expectedArtifacts: props.expectedArtifacts,
    }),
    omissions: props.postRunSnapshot.omissions,
  };
}

async function collectDirectory(props: {
  readonly repositoryDirectory: string;
  readonly relativeDirectory: string;
  readonly excerptLimit: number;
  readonly evaluationContentCeiling: number;
  readonly entries: RepositorySnapshotEntry[];
  readonly omissions: RepositorySnapshotOmission[];
}): Promise<void> {
  const absoluteDirectory = path.join(props.repositoryDirectory, props.relativeDirectory);
  const directoryEntries = await readdir(absoluteDirectory, { withFileTypes: true });
  for (const directoryEntry of directoryEntries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relativePath = props.relativeDirectory === ""
      ? directoryEntry.name
      : path.posix.join(props.relativeDirectory, directoryEntry.name);
    if (isRunnerOwned(relativePath)) continue;
    const absolutePath = path.join(props.repositoryDirectory, relativePath);
    if (directoryEntry.isSymbolicLink()) {
      props.omissions.push({ path: relativePath, reason: "unsupported file kind: symlink" });
      continue;
    }
    if (directoryEntry.isDirectory()) {
      props.entries.push({ path: relativePath, kind: "directory", contentDigest: null, contentExcerpt: null });
      await collectDirectory({ ...props, relativeDirectory: relativePath });
      continue;
    }
    if (!directoryEntry.isFile()) {
      props.omissions.push({ path: relativePath, reason: "unsupported file kind: unknown" });
      continue;
    }
    const metadata = await lstat(absolutePath);
    if (metadata.nlink > 1) {
      props.omissions.push({ path: relativePath, reason: "unsupported file kind: hardlink" });
      continue;
    }
    const content = await readFile(absolutePath);
    const contentByteLength = content.byteLength;
    const contentUnavailableReason = contentByteLength > props.evaluationContentCeiling
      ? `artifact content exceeds the ${props.evaluationContentCeiling}-byte evaluation ceiling`
      : undefined;
    const entry: RepositorySnapshotEntry = {
      path: relativePath,
      kind: "file",
      contentDigest: `sha256:${createHash("sha256").update(content).digest("hex")}`,
      contentExcerpt: content.toString("utf8").slice(0, props.excerptLimit),
      contentByteLength,
      ...(contentUnavailableReason === undefined ? {} : { contentUnavailableReason }),
    };
    setEvaluationContent(entry, contentUnavailableReason === undefined ? content.toString("utf8") : null);
    props.entries.push(entry);
  }
}

function isRunnerOwned(relativePath: string): boolean {
  const [firstSegment] = relativePath.split("/", 1);
  if (firstSegment === undefined) return false;
  return EXCLUDED_TOP_LEVEL_DIRECTORIES.has(firstSegment) ||
    (relativePath === firstSegment && EXCLUDED_TOP_LEVEL_FILES.has(relativePath));
}

function observedArtifact(artifact: ExpectedArtifact, entry: RepositorySnapshotEntry): ExpectedArtifactFact {
  const contentUnavailableReason = entry.kind === "file"
    ? entry.contentUnavailableReason ?? (entry.contentForEvaluation === undefined
      ? "artifact content was unavailable for evaluation"
      : null)
    : "artifact is not a regular file";
  const fact: ExpectedArtifactFact = {
    artifactId: artifact.artifactId,
    path: artifact.path,
    expectedKind: artifact.fileType,
    status: "observed",
    kind: entry.kind,
    contentDigest: entry.contentDigest,
    contentExcerpt: entry.contentExcerpt,
    contentByteLength: entry.contentByteLength ?? null,
    contentUnavailableReason,
    reason: null,
  };
  setEvaluationContent(fact, entry.contentForEvaluation ?? null);
  return fact;
}

function missingArtifact(artifact: ExpectedArtifact): ExpectedArtifactFact {
  return {
    artifactId: artifact.artifactId,
    path: artifact.path,
    expectedKind: artifact.fileType,
    status: "missing",
    kind: null,
    contentDigest: null,
    contentExcerpt: null,
    contentByteLength: null,
    contentUnavailableReason: null,
    reason: "artifact path was absent from the post-run snapshot",
  };
}

function unavailableArtifact(artifact: ExpectedArtifact, reason: string): ExpectedArtifactFact {
  return {
    artifactId: artifact.artifactId,
    path: artifact.path,
    expectedKind: artifact.fileType,
    status: "not_evaluated",
    kind: null,
    contentDigest: null,
    contentExcerpt: null,
    contentByteLength: null,
    contentUnavailableReason: reason,
    reason,
  };
}

function setEvaluationContent<TEntry extends { readonly contentForEvaluation?: string | null }>(
  entry: TEntry,
  contentForEvaluation: string | null,
): TEntry {
  Object.defineProperty(entry, "contentForEvaluation", {
    configurable: false,
    enumerable: false,
    value: contentForEvaluation,
    writable: false,
  });
  return entry;
}

function comparePath(left: { readonly path: string }, right: { readonly path: string }): number {
  return left.path.localeCompare(right.path);
}
