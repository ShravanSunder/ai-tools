import type { NormalizedRepetitionEvidence } from "../evidence/repetition-evidence.js";

export type SemanticAssertionClassification = "pass" | "behavior_fail" | "inconclusive";
export type SemanticEvidenceSurface = "response" | "tools" | `artifact:${string}`;
export type SemanticReviewOutcome = "pass" | "behavior_fail" | "inconclusive" | "not_evaluated";

export interface SemanticAssertionDefinition {
  readonly assertionId: string;
  readonly criterion: string;
  readonly evidenceSurface: SemanticEvidenceSurface;
}

export interface BuildStructuredSemanticReviewPacketProps {
  readonly assertions: readonly SemanticAssertionDefinition[];
  readonly evidence: readonly NormalizedRepetitionEvidence[];
  readonly redactionSecrets: readonly string[];
  readonly maxEvidenceTextLength?: number;
}

export interface StructuredSemanticReviewPacket {
  readonly instructions: {
    readonly task: "classify_each_semantic_assertion";
    readonly assertions: readonly SemanticAssertionDefinition[];
    readonly outputContract: "strict_json_assertion_results";
  };
  readonly untrustedEvidence: {
    readonly boundary: "untrusted_quoted_evidence";
    readonly repetitions: readonly UntrustedRepetitionEvidence[];
  };
}

export interface UntrustedRepetitionEvidence {
  readonly repetitionId: string;
  readonly variant: "baseline" | "treatment";
  readonly response: QuotedEvidence;
  readonly tools: readonly QuotedEvidence[];
  readonly artifacts: readonly QuotedEvidence[];
  readonly rationalizations: readonly QuotedEvidence[];
}

export interface QuotedEvidence {
  readonly kind: "response" | "tool" | "artifact" | "rationalization";
  readonly evidenceId: string;
  readonly text: string;
}

export interface SemanticEvidenceAnchor {
  readonly kind: "response" | "tool" | "artifact";
  readonly evidenceId: string;
  readonly startOffset: number;
  readonly endOffset: number;
}

export interface SemanticAssertionResult {
  readonly repetitionId: string;
  readonly variant: "baseline" | "treatment";
  readonly assertionId: string;
  readonly classification: SemanticAssertionClassification;
  readonly evidenceAnchor: SemanticEvidenceAnchor;
}

export interface StructuredSemanticReviewCandidate {
  readonly assertions: readonly SemanticAssertionResult[];
  readonly rationalizations: readonly string[];
  readonly smallestProposedRetest: string | null;
}

export interface ParseStructuredSemanticReviewCandidateResult {
  readonly candidate: StructuredSemanticReviewCandidate | null;
  readonly parseError: string | null;
}

export interface SemanticCandidateValidationResult {
  readonly valid: boolean;
  readonly reason: string | null;
}

const DEFAULT_MAX_EVIDENCE_TEXT_LENGTH = 2_000;
const MAX_REVIEW_REPETITIONS = 40;
const MAX_TOOL_EVIDENCE_PER_REPETITION = 200;
const MAX_ARTIFACT_EVIDENCE_PER_REPETITION = 100;
const MAX_RATIONALIZATION_EVIDENCE_PER_REPETITION = 20;
const MAX_REVIEW_PACKET_BYTES = 1_000_000;

export function buildStructuredSemanticReviewPacket(
  props: BuildStructuredSemanticReviewPacketProps,
): StructuredSemanticReviewPacket {
  assertAssertions(props.assertions);
  assertEvidenceBudgets(props.evidence);
  const repetitions = props.evidence.map((item) => createUntrustedEvidence({
    evidence: item,
    redactionSecrets: props.redactionSecrets,
    maxEvidenceTextLength: props.maxEvidenceTextLength ?? DEFAULT_MAX_EVIDENCE_TEXT_LENGTH,
  }));
  assertRepetitionIdentities(repetitions);
  const packet: StructuredSemanticReviewPacket = {
    instructions: {
      task: "classify_each_semantic_assertion",
      assertions: props.assertions.map((assertion) => ({ ...assertion })),
      outputContract: "strict_json_assertion_results",
    },
    untrustedEvidence: {
      boundary: "untrusted_quoted_evidence",
      repetitions,
    },
  };
  if (Buffer.byteLength(JSON.stringify(packet), "utf8") > MAX_REVIEW_PACKET_BYTES) {
    throw new Error("semantic review evidence packet exceeds its aggregate byte budget");
  }
  return packet;
}

export function parseStructuredSemanticReviewCandidate(
  visibleResponse: string,
): ParseStructuredSemanticReviewCandidateResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(visibleResponse);
  } catch {
    return { candidate: null, parseError: "review response is not valid JSON" };
  }
  if (!isRecord(parsed) || !hasExactKeys(parsed, ["assertions", "rationalizations", "smallestProposedRetest"])) {
    return { candidate: null, parseError: "review response has unknown or missing fields" };
  }
  if (!Array.isArray(parsed.assertions) || !Array.isArray(parsed.rationalizations) || !isNullableString(parsed.smallestProposedRetest)) {
    return { candidate: null, parseError: "review response has invalid field types" };
  }
  const assertions = parsed.assertions.map(parseAssertionResult);
  if (assertions.some((assertion) => assertion === null) || parsed.rationalizations.some((item) => typeof item !== "string")) {
    return { candidate: null, parseError: "review response has invalid assertion results" };
  }
  return {
    candidate: {
      assertions: assertions as SemanticAssertionResult[],
      rationalizations: [...parsed.rationalizations],
      smallestProposedRetest: parsed.smallestProposedRetest,
    },
    parseError: null,
  };
}

export function validateStructuredSemanticReviewCandidate(props: {
  readonly packet: StructuredSemanticReviewPacket;
  readonly candidate: StructuredSemanticReviewCandidate;
}): SemanticCandidateValidationResult {
  const expected = new Set<string>();
  for (const repetition of props.packet.untrustedEvidence.repetitions) {
    for (const assertion of props.packet.instructions.assertions) {
      expected.add(assertionKey(repetition.variant, repetition.repetitionId, assertion.assertionId));
    }
  }
  const actual = new Set<string>();
  for (const result of props.candidate.assertions) {
    const key = assertionKey(result.variant, result.repetitionId, result.assertionId);
    if (!expected.has(key)) return { valid: false, reason: `unknown or extra assertion result: ${key}` };
    if (actual.has(key)) return { valid: false, reason: `duplicate assertion result: ${key}` };
    const anchorValidation = validateAnchor(props.packet, result);
    if (anchorValidation !== null) return { valid: false, reason: anchorValidation };
    actual.add(key);
  }
  for (const key of expected) {
    if (!actual.has(key)) return { valid: false, reason: `missing assertion result: ${key}` };
  }
  return { valid: true, reason: null };
}

export function applyObjectiveSemanticPrecedence(props: {
  readonly objectiveOutcome: "pass" | "behavior_fail" | "not_evaluated";
  readonly classifications: readonly SemanticAssertionClassification[];
}): SemanticReviewOutcome {
  if (props.objectiveOutcome !== "pass") return props.objectiveOutcome;
  if (props.classifications.some((classification) => classification === "behavior_fail")) return "behavior_fail";
  if (props.classifications.some((classification) => classification === "inconclusive")) return "inconclusive";
  return "pass";
}

function createUntrustedEvidence(props: {
  readonly evidence: NormalizedRepetitionEvidence;
  readonly redactionSecrets: readonly string[];
  readonly maxEvidenceTextLength: number;
}): UntrustedRepetitionEvidence {
  const quote = (
    kind: QuotedEvidence["kind"],
    evidenceId: string,
    text: string,
    maxLength = props.maxEvidenceTextLength,
  ): QuotedEvidence => ({
    kind,
    evidenceId,
    text: boundAndRedact(text, props.redactionSecrets, maxLength),
  });
  return {
    repetitionId: props.evidence.repetitionId,
    variant: props.evidence.variant,
    response: quote("response", "response", props.evidence.visibleResponse),
    tools: props.evidence.toolObservations.map((observation) => quote("tool", observation.eventId, observation.payload)),
    artifacts: props.evidence.repositoryFacts.artifacts.map((artifact) => quote(
      "artifact",
      artifact.artifactId,
      artifact.contentForEvaluation ??
        artifact.contentExcerpt ??
        artifact.contentUnavailableReason ??
        artifact.reason ??
        "",
      MAX_REVIEW_PACKET_BYTES,
    )),
    rationalizations: props.evidence.rationalizationExcerpts.map((excerpt, index) => quote("rationalization", `rationalization-${index + 1}`, excerpt)),
  };
}

function validateAnchor(packet: StructuredSemanticReviewPacket, result: SemanticAssertionResult): string | null {
  const repetition = packet.untrustedEvidence.repetitions.find((item) => item.repetitionId === result.repetitionId && item.variant === result.variant);
  const assertion = packet.instructions.assertions.find((item) => item.assertionId === result.assertionId);
  if (repetition === undefined || assertion === undefined) return "assertion anchor references unknown packet evidence";
  const expectedKind = assertion.evidenceSurface === "response"
    ? "response"
    : assertion.evidenceSurface === "tools"
      ? "tool"
      : "artifact";
  if (result.evidenceAnchor.kind !== expectedKind) return "assertion anchor does not match its declared evidence surface";
  if (expectedKind === "response" && result.evidenceAnchor.evidenceId !== "response") return "response anchor must target the response quote";
  if (expectedKind === "artifact" && result.evidenceAnchor.evidenceId !== assertion.evidenceSurface.slice("artifact:".length)) {
    return "artifact anchor does not match its declared artifact id";
  }
  const quotes = expectedKind === "response"
    ? [repetition.response]
    : expectedKind === "tool"
      ? repetition.tools
      : repetition.artifacts;
  const quote = quotes.find((item) => item.evidenceId === result.evidenceAnchor.evidenceId);
  if (quote === undefined) return "assertion anchor references absent quoted evidence";
  if (!Number.isInteger(result.evidenceAnchor.startOffset) || !Number.isInteger(result.evidenceAnchor.endOffset) ||
    result.evidenceAnchor.startOffset < 0 || result.evidenceAnchor.endOffset <= result.evidenceAnchor.startOffset ||
    result.evidenceAnchor.endOffset > quote.text.length) {
    return "assertion anchor offsets fall outside quoted evidence";
  }
  return null;
}

function parseAssertionResult(value: unknown): SemanticAssertionResult | null {
  if (!isRecord(value) || !hasExactKeys(value, ["repetitionId", "variant", "assertionId", "classification", "evidenceAnchor"])) return null;
  if (typeof value.repetitionId !== "string" || value.repetitionId === "" ||
    (value.variant !== "baseline" && value.variant !== "treatment") ||
    typeof value.assertionId !== "string" || value.assertionId === "" ||
    !isClassification(value.classification) || !isAnchor(value.evidenceAnchor)) return null;
  return {
    repetitionId: value.repetitionId,
    variant: value.variant,
    assertionId: value.assertionId,
    classification: value.classification,
    evidenceAnchor: value.evidenceAnchor,
  };
}

function assertAssertions(assertions: readonly SemanticAssertionDefinition[]): void {
  if (assertions.length === 0) throw new Error("semantic review requires at least one assertion");
  const assertionIds = new Set<string>();
  for (const assertion of assertions) {
    if (assertion.assertionId === "" || assertion.criterion === "" || !isEvidenceSurface(assertion.evidenceSurface)) {
      throw new Error("semantic assertion is invalid");
    }
    if (assertionIds.has(assertion.assertionId)) throw new Error(`duplicate semantic assertion id: ${assertion.assertionId}`);
    assertionIds.add(assertion.assertionId);
  }
}

function assertRepetitionIdentities(repetitions: readonly UntrustedRepetitionEvidence[]): void {
  const identities = new Set<string>();
  for (const repetition of repetitions) {
    const identity = `${repetition.variant}:${repetition.repetitionId}`;
    if (repetition.repetitionId === "" || identities.has(identity)) throw new Error(`duplicate or invalid repetition identity: ${identity}`);
    identities.add(identity);
  }
}

function boundAndRedact(value: string, secrets: readonly string[], limit: number): string {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("max evidence text length must be a positive integer");
  let redacted = value;
  for (const secret of secrets) {
    if (secret !== "") redacted = redacted.split(secret).join("[REDACTED]");
  }
  return redacted.slice(0, limit);
}

function assertionKey(variant: string, repetitionId: string, assertionId: string): string {
  return JSON.stringify([variant, repetitionId, assertionId]);
}

function assertEvidenceBudgets(evidence: readonly NormalizedRepetitionEvidence[]): void {
  if (evidence.length > MAX_REVIEW_REPETITIONS) {
    throw new Error("semantic review evidence packet exceeds its repetition budget");
  }
  for (const repetition of evidence) {
    if (repetition.toolObservations.length > MAX_TOOL_EVIDENCE_PER_REPETITION) {
      throw new Error("semantic review evidence packet exceeds its tool-item budget");
    }
    if (repetition.repositoryFacts.artifacts.length > MAX_ARTIFACT_EVIDENCE_PER_REPETITION) {
      throw new Error("semantic review evidence packet exceeds its artifact-item budget");
    }
    if (repetition.rationalizationExcerpts.length > MAX_RATIONALIZATION_EVIDENCE_PER_REPETITION) {
      throw new Error("semantic review evidence packet exceeds its rationalization-item budget");
    }
    assertUniqueEvidenceIds(
      repetition.toolObservations.map((observation) => observation.eventId),
      `tool evidence for ${repetition.variant}:${repetition.repetitionId}`,
    );
    assertUniqueEvidenceIds(
      repetition.repositoryFacts.artifacts.map((artifact) => artifact.artifactId),
      `artifact evidence for ${repetition.variant}:${repetition.repetitionId}`,
    );
  }
}

function assertUniqueEvidenceIds(evidenceIds: readonly string[], label: string): void {
  if (new Set(evidenceIds).size !== evidenceIds.length) {
    throw new Error(`duplicate ${label} evidence id`);
  }
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Readonly<Record<string, unknown>>, expectedKeys: readonly string[]): boolean {
  const actualKeys = Object.keys(value).sort();
  const sortedExpected = [...expectedKeys].sort();
  return actualKeys.length === sortedExpected.length && actualKeys.every((key, index) => key === sortedExpected[index]);
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isClassification(value: unknown): value is SemanticAssertionClassification {
  return value === "pass" || value === "behavior_fail" || value === "inconclusive";
}

function isAnchor(value: unknown): value is SemanticEvidenceAnchor {
  return isRecord(value) && hasExactKeys(value, ["kind", "evidenceId", "startOffset", "endOffset"]) &&
    (value.kind === "response" || value.kind === "tool" || value.kind === "artifact") &&
    typeof value.evidenceId === "string" && typeof value.startOffset === "number" && typeof value.endOffset === "number";
}

function isEvidenceSurface(value: string): value is SemanticEvidenceSurface {
  return value === "response" || value === "tools" || /^artifact:[a-z0-9][a-z0-9-]*$/u.test(value);
}
