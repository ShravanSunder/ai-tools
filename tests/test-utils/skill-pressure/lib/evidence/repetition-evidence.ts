import type { AcpxToolObservation } from "../collector/acpx-transcript-collector.js";
import type { DeterministicCheck } from "../contracts/contract-types.js";
import type { SubjectRepetitionReceipt } from "../evaluation/subject-repetition.js";
import type { RepositoryEvidence, RepositorySnapshotEntry } from "./repository-snapshot.js";

export type DeterministicCheckOutcome = "pass" | "behavior_fail" | "not_evaluated";

export interface NormalizeRepetitionEvidenceProps {
  readonly receipt: SubjectRepetitionReceipt;
  readonly rationalizationExcerpts?: readonly string[];
  readonly responseLimit?: number;
  readonly observationLimit?: number;
  readonly rationalizationLimit?: number;
}

export interface NormalizedRepetitionEvidence {
  readonly repetitionId: string;
  readonly variant: SubjectRepetitionReceipt["variant"];
  readonly visibleResponse: string;
  readonly toolObservations: readonly AcpxToolObservation[];
  readonly usageObservations: readonly string[];
  readonly process: {
    readonly outcome: SubjectRepetitionReceipt["status"];
    readonly exitCode: number;
    readonly timedOut: boolean;
    readonly cleanupComplete: boolean;
    readonly infrastructureReasons: readonly string[];
  };
  readonly repositoryFacts: RepositoryEvidence;
  readonly rationalizationExcerpts: readonly string[];
}

export interface RepositoryPathCheck {
  readonly checkId: string;
  readonly requirement: "required" | "forbidden";
  readonly path: string;
}

export interface DeterministicCheckResult {
  readonly checkId: string;
  readonly outcome: DeterministicCheckOutcome;
  readonly reason: string;
}

export function reduceDeterministicCheckResults(
  results: readonly DeterministicCheckResult[],
): DeterministicCheckOutcome {
  if (results.some((result) => result.outcome === "not_evaluated")) {
    return "not_evaluated";
  }
  return results.some((result) => result.outcome === "behavior_fail") ? "behavior_fail" : "pass";
}

const DEFAULT_RESPONSE_LIMIT = 8_000;
const DEFAULT_OBSERVATION_LIMIT = 200;
const DEFAULT_RATIONALIZATION_LIMIT = 20;
const DEFAULT_EXCERPT_LIMIT = 2_000;

export function normalizeRepetitionEvidence(
  props: NormalizeRepetitionEvidenceProps,
): NormalizedRepetitionEvidence {
  const responseLimit = props.responseLimit ?? DEFAULT_RESPONSE_LIMIT;
  const observationLimit = props.observationLimit ?? DEFAULT_OBSERVATION_LIMIT;
  const rationalizationLimit = props.rationalizationLimit ?? DEFAULT_RATIONALIZATION_LIMIT;
  const repositoryFacts = normalizeRepositoryEvidence(props.receipt.repositoryEvidence);

  return {
    repetitionId: props.receipt.repetitionId,
    variant: props.receipt.variant,
    visibleResponse: bound(props.receipt.transcript.visibleResponse, responseLimit),
    toolObservations: props.receipt.transcript.toolObservations.slice(0, observationLimit).map((observation) => ({
      eventId: observation.eventId,
      payload: bound(observation.payload, DEFAULT_EXCERPT_LIMIT),
    })),
    usageObservations: props.receipt.transcript.usageObservations
      .slice(0, observationLimit)
      .map((observation) => bound(observation, DEFAULT_EXCERPT_LIMIT)),
    process: {
      outcome: props.receipt.status,
      exitCode: props.receipt.process.exitCode,
      timedOut: props.receipt.process.timedOut,
      cleanupComplete: props.receipt.process.cleanupComplete,
      infrastructureReasons: props.receipt.infrastructureReasons.map((reason) => bound(reason, DEFAULT_EXCERPT_LIMIT)),
    },
    repositoryFacts,
    rationalizationExcerpts: (props.rationalizationExcerpts ?? [])
      .slice(0, rationalizationLimit)
      .map((excerpt) => bound(excerpt, DEFAULT_EXCERPT_LIMIT)),
  };
}

export function evaluateRepositoryPathChecks(
  evidence: NormalizedRepetitionEvidence,
  checks: readonly RepositoryPathCheck[],
): readonly DeterministicCheckResult[] {
  const observedPaths = new Set(evidence.repositoryFacts.files.map((file) => file.path));
  const omissions = new Map(evidence.repositoryFacts.omissions.map((omission) => [omission.path, omission.reason]));
  return checks.map((check) => {
    const omissionReason = omissions.get(check.path);
    if (omissionReason !== undefined) {
      return { checkId: check.checkId, outcome: "not_evaluated", reason: omissionReason };
    }
    const exists = observedPaths.has(check.path);
    if (check.requirement === "required") {
      return exists
        ? { checkId: check.checkId, outcome: "pass", reason: "required repository path exists" }
        : { checkId: check.checkId, outcome: "behavior_fail", reason: "required repository path is absent" };
    }
    return exists
      ? { checkId: check.checkId, outcome: "behavior_fail", reason: "forbidden repository path exists" }
      : { checkId: check.checkId, outcome: "pass", reason: "forbidden repository path is absent" };
  });
}

export function evaluateDeterministicChecks(
  evidence: NormalizedRepetitionEvidence,
  checks: readonly DeterministicCheck[],
): readonly DeterministicCheckResult[] {
  return checks.map((check) => evaluateDeterministicCheck(evidence, check));
}

function evaluateDeterministicCheck(
  evidence: NormalizedRepetitionEvidence,
  check: DeterministicCheck,
): DeterministicCheckResult {
  if (check.fact === "tool_observations") {
    return evaluateTextCheck(check, evidence.toolObservations.map((observation) => observation.payload).join("\n"));
  }
  if (check.fact.startsWith("path:")) {
    const relativePath = check.fact.slice("path:".length);
    const omission = evidence.repositoryFacts.omissions.find((item) => item.path === relativePath);
    if (omission !== undefined) return notEvaluated(check, omission.reason);
    const entry = evidence.repositoryFacts.files.find((item) => item.path === relativePath);
    return evaluateOptionalFact(
      check,
      entry?.contentForEvaluation ?? null,
      entry !== undefined,
      "repository path",
      entry?.contentUnavailableReason ?? null,
    );
  }
  const artifactId = check.fact.slice("artifact:".length);
  const artifact = evidence.repositoryFacts.artifacts.find((item) => item.artifactId === artifactId);
  if (artifact === undefined) return notEvaluated(check, `artifact ${artifactId} was not declared`);
  return evaluateArtifactCheck(check, artifact);
}

function evaluateOptionalFact(
  check: DeterministicCheck,
  content: string | null,
  exists: boolean,
  label: string,
  contentUnavailableReason: string | null = null,
): DeterministicCheckResult {
  if (check.operator === "exists") {
    return exists ? passed(check, `${label} exists`) : failed(check, `${label} is absent`);
  }
  if (check.operator === "absent") {
    return exists ? failed(check, `${label} exists`) : passed(check, `${label} is absent`);
  }
  if (!exists) return failed(check, `${label} is absent`);
  if (contentUnavailableReason !== null) return notEvaluated(check, contentUnavailableReason);
  if (content === null) return notEvaluated(check, `${label} has no text content`);
  return evaluateTextCheck(check, content);
}

function evaluateArtifactCheck(
  check: DeterministicCheck,
  artifact: NormalizedRepetitionEvidence["repositoryFacts"]["artifacts"][number],
): DeterministicCheckResult {
  const label = `artifact ${artifact.artifactId}`;
  const exists = artifact.status === "observed";
  if (check.operator === "exists" || check.operator === "absent") {
    return evaluateOptionalFact(check, null, exists, label);
  }
  if (!exists) {
    return artifact.status === "not_evaluated"
      ? notEvaluated(check, artifact.reason ?? "artifact was not evaluated")
      : failed(check, `${label} is absent`);
  }
  if (check.operator === "equals") {
    if (check.expected !== "file" && check.expected !== "directory") {
      return notEvaluated(check, "artifact kind comparison requires file or directory expected value");
    }
    return artifact.kind === check.expected
      ? passed(check, "artifact kind comparison passed")
      : failed(check, "artifact kind comparison failed");
  }
  return evaluateOptionalFact(
    check,
    artifact.contentForEvaluation ?? null,
    true,
    label,
    artifact.contentUnavailableReason,
  );
}

function evaluateTextCheck(check: DeterministicCheck, actual: string): DeterministicCheckResult {
  if (check.operator === "exists") {
    return actual.trim() === "" ? failed(check, "text fact is empty") : passed(check, "text fact exists");
  }
  if (check.operator === "absent") {
    return actual.trim() === "" ? passed(check, "text fact is absent") : failed(check, "text fact exists");
  }
  if (typeof check.expected !== "string") return notEvaluated(check, "text comparison requires a string expected value");
  const matched = check.operator === "equals"
    ? actual === check.expected
    : check.operator === "contains"
      ? actual.includes(check.expected)
      : check.operator === "excludes"
        ? !actual.includes(check.expected)
      : check.operator === "not_matches"
        ? !matchesPattern(check.expected, actual)
        : matchesPattern(check.expected, actual);
  return matched
    ? passed(check, `${check.operator} comparison passed`)
    : failed(check, `${check.operator} comparison failed`);
}

function matchesPattern(pattern: string, actual: string): boolean {
  try {
    return compilePattern(pattern).test(actual);
  } catch {
    return false;
  }
}

function compilePattern(pattern: string): RegExp {
  const inlineFlags = /^\(\?([is]+)\)/u.exec(pattern);
  const flags = new Set(["u", ...(inlineFlags?.[1] ?? "")]);
  return new RegExp(inlineFlags === null ? pattern : pattern.slice(inlineFlags[0].length), [...flags].join(""));
}

function passed(check: DeterministicCheck, reason: string): DeterministicCheckResult {
  return { checkId: check.checkId, outcome: "pass", reason };
}

function failed(check: DeterministicCheck, reason: string): DeterministicCheckResult {
  return { checkId: check.checkId, outcome: "behavior_fail", reason };
}

function notEvaluated(check: DeterministicCheck, reason: string): DeterministicCheckResult {
  return { checkId: check.checkId, outcome: "not_evaluated", reason };
}

function normalizeRepositoryEvidence(evidence: RepositoryEvidence): RepositoryEvidence {
  return {
    files: normalizeSnapshotEntries(evidence.files),
    changes: {
      files: evidence.changes.files.map((file) => ({ ...normalizeSnapshotEntry(file), change: file.change })),
      pathChanges: [...evidence.changes.pathChanges].sort((left, right) => left.path.localeCompare(right.path)),
      deletedPaths: [...evidence.changes.deletedPaths].sort((left, right) => left.localeCompare(right)),
      omissions: normalizeOmissions(evidence.changes.omissions),
    },
    artifacts: [...evidence.artifacts]
      .sort((left, right) => left.artifactId.localeCompare(right.artifactId) || left.path.localeCompare(right.path))
      .map(normalizeArtifactFact),
    omissions: normalizeOmissions(evidence.omissions),
  };
}

function normalizeSnapshotEntries(facts: readonly RepositorySnapshotEntry[]): readonly RepositorySnapshotEntry[] {
  return [...facts]
    .sort((left, right) => left.path.localeCompare(right.path) || left.kind.localeCompare(right.kind))
    .map(normalizeSnapshotEntry);
}

function normalizeSnapshotEntry<TEntry extends RepositorySnapshotEntry>(fact: TEntry): TEntry {
  const normalized = { ...fact, contentExcerpt: fact.contentExcerpt === null ? null : bound(fact.contentExcerpt, DEFAULT_EXCERPT_LIMIT) };
  return setEvaluationContent(normalized, fact.contentForEvaluation ?? null) as TEntry;
}

function normalizeArtifactFact(
  artifact: NormalizedRepetitionEvidence["repositoryFacts"]["artifacts"][number],
): NormalizedRepetitionEvidence["repositoryFacts"]["artifacts"][number] {
  const normalized = {
    ...artifact,
    contentExcerpt: artifact.contentExcerpt === null ? null : bound(artifact.contentExcerpt, DEFAULT_EXCERPT_LIMIT),
  };
  return setEvaluationContent(normalized, artifact.contentForEvaluation ?? null);
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

function normalizeOmissions(omissions: RepositoryEvidence["omissions"]): RepositoryEvidence["omissions"] {
  return [...omissions].sort((left, right) => left.path.localeCompare(right.path) || left.reason.localeCompare(right.reason));
}

function bound(value: string, limit: number): string {
  return value.slice(0, limit);
}
