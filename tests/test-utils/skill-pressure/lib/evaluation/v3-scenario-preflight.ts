import type {
  ObjectiveArtifactDeclaration,
  ObjectiveCheckDefinition,
  ObjectiveCheckOperator,
  ObjectiveCheckOwner,
  ObjectiveCheckPlan,
} from "../contracts/objective-check-types.js";
import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import { createObjectiveCheckPlan } from "../evidence/objective-artifact-checks.js";
import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";

export interface V3ComparisonIdentity {
  readonly sessionId: string | null;
  readonly repositoryIdentity: string;
  readonly commonInputDigest: string;
  readonly promptDigest: string;
  readonly fixtureDigest: string;
  readonly sourceDigest: string | null;
  readonly sourceRevision: string | null;
}

export interface V3ComparableRepetition {
  readonly evidence: Pick<NormalizedRepetitionEvidence, "repetitionId" | "variant">;
  readonly comparisonIdentity: V3ComparisonIdentity;
}

export interface V3ComparableSubjectSet {
  readonly baseline: readonly V3ComparableRepetition[];
  readonly treatment: readonly V3ComparableRepetition[];
}

export function createObjectiveCheckPlanFromContract(contract: V3BehaviorContract): ObjectiveCheckPlan {
  const declaredArtifacts = contract.expectedArtifacts.map((artifact) => ({
    artifactId: artifact.artifactId,
    path: artifact.path,
    fileType: artifact.fileType,
  } satisfies ObjectiveArtifactDeclaration));
  const checks = contract.deterministicChecks.map((check) => {
    const owner: ObjectiveCheckOwner = check.fact === "tool_observations"
      ? { kind: "tool_observations" }
      : check.fact.startsWith("artifact:")
        ? { kind: "artifact_id", artifactId: check.fact.slice("artifact:".length) }
        : { kind: "direct_path", path: check.fact.slice("path:".length) };
    const operator = mapObjectiveOperator(owner, check.operator);
    if (check.expected !== undefined && typeof check.expected !== "string") {
      throw new Error(`objective check ${check.checkId} requires a string expected value`);
    }
    return {
      checkId: check.checkId,
      owner,
      operator,
      ...(check.expected === undefined ? {} : { expected: check.expected }),
    } satisfies ObjectiveCheckDefinition;
  });
  return createObjectiveCheckPlan({ declaredArtifacts, checks });
}

export function validateV3ComparisonSet(props: {
  readonly contract: V3BehaviorContract;
  readonly subjects: V3ComparableSubjectSet;
  readonly attemptReceiptPaths: readonly string[];
  readonly repetitionReceiptPaths: readonly string[];
}): { readonly valid: boolean; readonly reasons: readonly string[] } {
  const reasons: string[] = [];
  const all = [...props.subjects.baseline, ...props.subjects.treatment];
  if (
    props.subjects.baseline.length !== props.contract.repetitions ||
    props.subjects.treatment.length !== props.contract.repetitions
  ) reasons.push("baseline and treatment repetition counts do not match the behavior contract");
  if (props.subjects.baseline.some((item) => item.evidence.variant !== "baseline") ||
    props.subjects.treatment.some((item) => item.evidence.variant !== "treatment")) {
    reasons.push("repetition variants do not match their comparison lanes");
  }
  requireUniqueValues(all.map((item) => item.evidence.repetitionId), "repetition ids", reasons);
  requireUniqueValues(all.map((item) => item.comparisonIdentity.repositoryIdentity), "repository identities", reasons);
  const sessionIds = all.map((item) => item.comparisonIdentity.sessionId);
  if (sessionIds.some((sessionId) => sessionId === null)) reasons.push("one or more ACPX session ids are missing");
  else requireUniqueValues(sessionIds, "ACPX session ids", reasons);
  requireSingleValue(all.map((item) => item.comparisonIdentity.commonInputDigest), "common input digests", reasons);
  requireSingleValue(all.map((item) => item.comparisonIdentity.promptDigest), "prompt digests", reasons);
  requireSingleValue(all.map((item) => item.comparisonIdentity.fixtureDigest), "fixture digests", reasons);
  requireSingleValue(props.subjects.baseline.map((item) => item.comparisonIdentity.sourceDigest), "baseline source digests", reasons);
  requireSingleValue(props.subjects.baseline.map((item) => item.comparisonIdentity.sourceRevision), "baseline source revisions", reasons);
  requireSingleValue(props.subjects.treatment.map((item) => item.comparisonIdentity.sourceDigest), "treatment source digests", reasons);
  requireSingleValue(props.subjects.treatment.map((item) => item.comparisonIdentity.sourceRevision), "treatment source revisions", reasons);
  const baselineSourceDigests = new Set(props.subjects.baseline.map((item) => item.comparisonIdentity.sourceDigest));
  const baselineSourceRevisions = new Set(props.subjects.baseline.map((item) => item.comparisonIdentity.sourceRevision));
  if (props.contract.baseline === "no_skill") {
    if (baselineSourceDigests.size !== 1 || !baselineSourceDigests.has(null) ||
      baselineSourceRevisions.size !== 1 || !baselineSourceRevisions.has(null)) {
      reasons.push("no-skill baseline must not carry a source digest or revision");
    }
  } else if (
    baselineSourceDigests.has(null) ||
    baselineSourceRevisions.size !== 1 ||
    !baselineSourceRevisions.has(props.contract.baselineRevision)
  ) {
    reasons.push("previous-revision baseline does not match the immutable contract revision");
  }
  if (props.subjects.treatment.some((item) =>
    item.comparisonIdentity.sourceDigest === null || item.comparisonIdentity.sourceRevision !== null)) {
    reasons.push("current treatment must carry a source digest without a source revision");
  }
  if (props.attemptReceiptPaths.length < all.length) reasons.push("one or more accepted attempts lack durable attempt receipts");
  if (props.repetitionReceiptPaths.length !== all.length) reasons.push("one or more accepted repetitions lack durable repetition receipts");
  return { valid: reasons.length === 0, reasons: [...new Set(reasons)] };
}

function mapObjectiveOperator(
  owner: ObjectiveCheckOwner,
  operator: V3BehaviorContract["deterministicChecks"][number]["operator"],
): ObjectiveCheckOperator {
  if (owner.kind === "artifact_id") {
    const artifactOperators = {
      equals: "content_equals",
      contains: "content_contains",
      excludes: "content_excludes",
      matches: "content_matches",
      not_matches: "content_excludes_pattern",
      exists: "exists",
    } as const;
    const mapped = operator === "absent" ? undefined : artifactOperators[operator];
    if (mapped === undefined) throw new Error("declared artifacts do not support absent checks");
    return mapped;
  }
  return operator;
}

function requireUniqueValues(values: readonly unknown[], label: string, reasons: string[]): void {
  if (new Set(values).size !== values.length) reasons.push(`${label} are not unique`);
}

function requireSingleValue(values: readonly unknown[], label: string, reasons: string[]): void {
  if (new Set(values).size !== 1) reasons.push(`${label} differ across repetitions`);
}
