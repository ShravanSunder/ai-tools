import type {
  ObjectiveArtifactDeclaration,
  ObjectiveCheckDefinition,
  ObjectiveCheckOutcome,
  ObjectiveCheckPlan,
} from "../contracts/objective-check-types.js";
import type { AcpxToolObservation } from "../collector/acpx-transcript-collector.js";
import {
  MAX_ARTIFACT_EVALUATION_CONTENT_BYTES,
  type ExpectedArtifactFact,
  type RepositoryEvidence,
} from "./repository-snapshot.js";

export interface ObjectiveCheckResult {
  readonly checkId: string;
  readonly outcome: ObjectiveCheckOutcome;
  readonly reason: string;
}

export interface EvaluateObjectiveCheckPlanProps {
  readonly plan: ObjectiveCheckPlan;
  readonly repositoryEvidence: RepositoryEvidence;
  readonly toolObservations: readonly AcpxToolObservation[];
}

const IDENTIFIER = /^[a-z0-9][a-z0-9-]*$/u;
const NORMALIZED_RELATIVE_PATH = /^(?!\/)(?!.*\\)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)(?!.*\/$).+$/u;

export function createObjectiveCheckPlan(props: ObjectiveCheckPlan): ObjectiveCheckPlan {
  const artifactIds = new Set<string>();
  const artifactPaths = new Set<string>();
  const artifactDeclarations = new Map<string, ObjectiveArtifactDeclaration>();
  for (const artifact of props.declaredArtifacts) {
    assertIdentifier(artifact.artifactId, "artifact id");
    assertNormalizedRelativePath(artifact.path, "declared artifact path");
    if (artifactIds.has(artifact.artifactId)) throw new Error(`duplicate artifact id: ${artifact.artifactId}`);
    if (artifactPaths.has(artifact.path)) throw new Error(`duplicate declared artifact path: ${artifact.path}`);
    artifactIds.add(artifact.artifactId);
    artifactPaths.add(artifact.path);
    artifactDeclarations.set(artifact.artifactId, artifact);
  }

  const checkIds = new Set<string>();
  for (const check of props.checks) {
    assertIdentifier(check.checkId, "check id");
    if (checkIds.has(check.checkId)) throw new Error(`duplicate objective check id: ${check.checkId}`);
    checkIds.add(check.checkId);
    validateObjectiveCheck(check, artifactDeclarations, artifactPaths);
  }

  return {
    declaredArtifacts: props.declaredArtifacts.map((artifact) => ({ ...artifact })),
    checks: props.checks.map((check) => ({ ...check, owner: { ...check.owner } })),
  };
}

export function evaluateObjectiveCheckPlan(
  props: EvaluateObjectiveCheckPlanProps,
): readonly ObjectiveCheckResult[] {
  assertCollectedArtifactIdentities(props.repositoryEvidence.artifacts);
  const artifacts = new Map(props.repositoryEvidence.artifacts.map((artifact) => [artifact.artifactId, artifact]));
  const files = new Map(props.repositoryEvidence.files.map((file) => [file.path, file]));
  const omissions = new Map(props.repositoryEvidence.omissions.map((omission) => [omission.path, omission.reason]));

  return props.plan.checks.map((check) => {
    if (check.owner.kind === "artifact_id") {
      const artifactId = check.owner.artifactId;
      const declaration = props.plan.declaredArtifacts.find((artifact) => artifact.artifactId === artifactId);
      return evaluateArtifactCheck(check, artifacts.get(artifactId), declaration);
    }
    if (check.owner.kind === "direct_path") {
      const omission = omissions.get(check.owner.path);
      if (omission !== undefined) return notEvaluated(check, omission);
      return evaluateDirectPathCheck(check, files.has(check.owner.path));
    }
    return evaluateToolCheck(check, props.toolObservations.map((observation) => observation.payload).join("\n"));
  });
}

function validateObjectiveCheck(
  check: ObjectiveCheckDefinition,
  artifactDeclarations: ReadonlyMap<string, ObjectiveArtifactDeclaration>,
  artifactPaths: ReadonlySet<string>,
): void {
  if (check.owner.kind === "artifact_id") {
    assertIdentifier(check.owner.artifactId, "artifact check owner id");
    const declaration = artifactDeclarations.get(check.owner.artifactId);
    if (declaration === undefined) {
      throw new Error(`objective artifact check references undeclared artifact id: ${check.owner.artifactId}`);
    }
    if (!["exists", "kind_equals", "content_equals", "content_contains", "content_matches", "content_excludes", "content_excludes_pattern"].includes(check.operator)) {
      throw new Error("artifact_id checks require an artifact operator");
    }
    if (check.operator === "kind_equals" && check.expected !== "file" && check.expected !== "directory") {
      throw new Error("kind_equals requires file or directory expected value");
    }
    if (check.operator === "exists" && check.expected !== undefined) {
      throw new Error("exists does not accept expected values");
    }
    if (check.operator.startsWith("content_") && typeof check.expected !== "string") {
      throw new Error("content checks require a string expected value");
    }
    if (check.operator.startsWith("content_") && declaration.fileType === "directory") {
      throw new Error("directory artifacts cannot own content checks");
    }
    if ((check.operator === "content_matches" || check.operator === "content_excludes_pattern") &&
      (typeof check.expected !== "string" || !isBoundedSafePattern(check.expected))) {
      throw new Error("content pattern checks require a valid bounded pattern");
    }
    return;
  }
  if (check.owner.kind === "direct_path") {
    assertNormalizedRelativePath(check.owner.path, "direct path check");
    if (artifactPaths.has(check.owner.path)) {
      throw new Error("direct path checks cannot target a declared artifact path");
    }
    if (check.operator !== "exists" && check.operator !== "absent") {
      throw new Error("direct path checks support only undeclared existence or absence");
    }
    if (check.expected !== undefined) throw new Error("direct path checks do not accept expected values");
    return;
  }
  if (!["equals", "contains", "excludes", "matches", "not_matches"].includes(check.operator) || typeof check.expected !== "string") {
    throw new Error("tool observation checks require a text operator and string expected value");
  }
  if ((check.operator === "matches" || check.operator === "not_matches") && !isBoundedSafePattern(check.expected)) {
    throw new Error("tool observation pattern checks require a valid bounded pattern");
  }
}

function evaluateArtifactCheck(
  check: ObjectiveCheckDefinition,
  artifact: ExpectedArtifactFact | undefined,
  declaration: ObjectiveArtifactDeclaration | undefined,
): ObjectiveCheckResult {
  if (artifact === undefined || declaration === undefined) return notEvaluated(check, "artifact fact was not collected");
  if (artifact.path !== declaration.path || artifact.expectedKind !== declaration.fileType) {
    return notEvaluated(check, "artifact fact does not match its declared artifact identity");
  }
  const label = `artifact ${artifact.artifactId}`;
  if (check.operator === "exists") {
    return artifact.status === "observed" ? passed(check, `${label} exists`) : artifact.status === "missing"
      ? failed(check, `${label} is absent`)
      : notEvaluated(check, artifact.reason ?? `${label} was not evaluated`);
  }
  if (artifact.status === "missing") return failed(check, `${label} is absent`);
  if (artifact.status === "not_evaluated") return notEvaluated(check, artifact.reason ?? `${label} was not evaluated`);
  if (check.operator === "kind_equals") {
    return artifact.kind === check.expected
      ? passed(check, "artifact kind comparison passed")
      : failed(check, "artifact kind comparison failed");
  }
  if (artifact.contentUnavailableReason !== null || artifact.contentForEvaluation === undefined || artifact.contentForEvaluation === null) {
    return notEvaluated(check, artifact.contentUnavailableReason ?? "artifact content was unavailable for evaluation");
  }
  if (artifact.contentByteLength === null) {
    return notEvaluated(check, "artifact content byte length was unavailable for evaluation");
  }
  if (artifact.contentByteLength > MAX_ARTIFACT_EVALUATION_CONTENT_BYTES) {
    return notEvaluated(check, `artifact content exceeds the ${MAX_ARTIFACT_EVALUATION_CONTENT_BYTES}-byte evaluation ceiling`);
  }
  return evaluateText(check, artifact.contentForEvaluation);
}

function evaluateDirectPathCheck(check: ObjectiveCheckDefinition, exists: boolean): ObjectiveCheckResult {
  if (check.operator === "exists") return exists ? passed(check, "undeclared path exists") : failed(check, "undeclared path is absent");
  return exists ? failed(check, "undeclared forbidden path exists") : passed(check, "undeclared forbidden path is absent");
}

function evaluateToolCheck(check: ObjectiveCheckDefinition, observations: string): ObjectiveCheckResult {
  return evaluateText(check, observations);
}

function evaluateText(check: ObjectiveCheckDefinition, actual: string): ObjectiveCheckResult {
  const expected = typeof check.expected === "string" ? check.expected : null;
  if (expected === null) return notEvaluated(check, "text check expected value was invalid");
  let matched: boolean;
  if (check.operator === "content_equals" || check.operator === "equals") {
    matched = actual === expected;
  } else if (check.operator === "content_contains" || check.operator === "contains") {
    matched = actual.includes(expected);
  } else if (check.operator === "content_excludes" || check.operator === "excludes") {
    matched = !actual.includes(expected);
  } else {
    const patternMatched = safePatternMatch(expected, actual);
    if (patternMatched === null) return notEvaluated(check, "text pattern was invalid at evaluation time");
    matched = check.operator === "content_matches" || check.operator === "matches"
      ? patternMatched
      : !patternMatched;
  }
  return matched ? passed(check, `${check.operator} comparison passed`) : failed(check, `${check.operator} comparison failed`);
}

function safePatternMatch(pattern: string, actual: string): boolean | null {
  try {
    const inlineFlags = /^\(\?([is]+)\)/u.exec(pattern);
    const flags = new Set(["u", ...(inlineFlags?.[1] ?? "")]);
    return new RegExp(inlineFlags === null ? pattern : pattern.slice(inlineFlags[0].length), [...flags].join("")).test(actual);
  } catch {
    return null;
  }
}

function assertCollectedArtifactIdentities(artifacts: readonly ExpectedArtifactFact[]): void {
  const artifactIds = new Set<string>();
  const artifactPaths = new Set<string>();
  for (const artifact of artifacts) {
    if (artifactIds.has(artifact.artifactId)) {
      throw new Error(`duplicate collected artifact id: ${artifact.artifactId}`);
    }
    if (artifactPaths.has(artifact.path)) {
      throw new Error(`duplicate collected artifact path: ${artifact.path}`);
    }
    artifactIds.add(artifact.artifactId);
    artifactPaths.add(artifact.path);
  }
}

function isBoundedSafePattern(pattern: string): boolean {
  if (pattern.length === 0 || pattern.length > 512) return false;
  if (/(^|[^\\])[+*]/u.test(pattern) || /\\[1-9]/u.test(pattern) || /\(\?<([=!])/u.test(pattern)) return false;
  for (const match of pattern.matchAll(/\{(\d+)(?:,(\d*))?\}/gu)) {
    const upperBound = match[2] === undefined ? Number(match[1]) : Number(match[2]);
    if (!Number.isFinite(upperBound) || upperBound > 1_000) return false;
  }
  try {
    const inlineFlags = /^\(\?([is]+)\)/u.exec(pattern);
    const flags = new Set(["u", ...(inlineFlags?.[1] ?? "")]);
    new RegExp(inlineFlags === null ? pattern : pattern.slice(inlineFlags[0].length), [...flags].join(""));
    return true;
  } catch {
    return false;
  }
}

function assertIdentifier(value: string, label: string): void {
  if (!IDENTIFIER.test(value)) throw new Error(`${label} must be a normalized identifier`);
}

function assertNormalizedRelativePath(value: string, label: string): void {
  if (!NORMALIZED_RELATIVE_PATH.test(value)) throw new Error(`${label} must be a normalized POSIX relative path`);
}

function passed(check: ObjectiveCheckDefinition, reason: string): ObjectiveCheckResult {
  return { checkId: check.checkId, outcome: "pass", reason };
}

function failed(check: ObjectiveCheckDefinition, reason: string): ObjectiveCheckResult {
  return { checkId: check.checkId, outcome: "behavior_fail", reason };
}

function notEvaluated(check: ObjectiveCheckDefinition, reason: string): ObjectiveCheckResult {
  return { checkId: check.checkId, outcome: "not_evaluated", reason };
}
