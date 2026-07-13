import type { AcpxToolObservation } from "../collector/acpx-transcript-collector.js";
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

export interface ResponsePatternCheck {
  readonly checkId: string;
  readonly requirement: "required" | "forbidden";
  readonly pattern: string;
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

export function evaluateResponsePatternChecks(
  evidence: NormalizedRepetitionEvidence,
  checks: readonly ResponsePatternCheck[],
): readonly DeterministicCheckResult[] {
  return checks.map((check) => {
    const matched = new RegExp(check.pattern, "u").test(evidence.visibleResponse);
    if (check.requirement === "required") {
      return matched
        ? { checkId: check.checkId, outcome: "pass", reason: "required response pattern matched" }
        : { checkId: check.checkId, outcome: "behavior_fail", reason: "required response pattern was absent" };
    }
    return matched
      ? { checkId: check.checkId, outcome: "behavior_fail", reason: "forbidden response pattern matched" }
      : { checkId: check.checkId, outcome: "pass", reason: "forbidden response pattern was absent" };
  });
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
      .map((artifact) => ({
        ...artifact,
        contentExcerpt: artifact.contentExcerpt === null ? null : bound(artifact.contentExcerpt, DEFAULT_EXCERPT_LIMIT),
      })),
    omissions: normalizeOmissions(evidence.omissions),
  };
}

function normalizeSnapshotEntries(facts: readonly RepositorySnapshotEntry[]): readonly RepositorySnapshotEntry[] {
  return [...facts]
    .sort((left, right) => left.path.localeCompare(right.path) || left.kind.localeCompare(right.kind))
    .map(normalizeSnapshotEntry);
}

function normalizeSnapshotEntry<TEntry extends RepositorySnapshotEntry>(fact: TEntry): TEntry {
  return { ...fact, contentExcerpt: fact.contentExcerpt === null ? null : bound(fact.contentExcerpt, DEFAULT_EXCERPT_LIMIT) };
}

function normalizeOmissions(omissions: RepositoryEvidence["omissions"]): RepositoryEvidence["omissions"] {
  return [...omissions].sort((left, right) => left.path.localeCompare(right.path) || left.reason.localeCompare(right.reason));
}

function bound(value: string, limit: number): string {
  return value.slice(0, limit);
}
