import { createHash } from "node:crypto";

import {
  calculateParentAcceptanceReceiptDigest,
  evaluateReleaseAuthority,
  type AuthorityDigest,
  type ValidatedCurrentBaselineReceipt,
} from "../authority/authority-receipts.js";
import {
  assertClaimedRequirementValidationIntegrity,
  type ClaimedRequirementValidation,
} from "../authority/claimed-requirements.js";
import type { ScenarioOutcome } from "../reduction/outcome-reducer.js";
import type { AuthorityReceiptReference } from "../authority/evaluation-registry.js";

export interface V3ScenarioAuthorityCandidate {
  readonly scenarioId: string;
  readonly behaviorContractDigest: AuthorityDigest;
  readonly behaviorRequirementIds: readonly string[];
  readonly evaluationRole: "gate" | "diagnostic";
  readonly outcome: ScenarioOutcome;
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly evidenceDigest: AuthorityDigest;
}

export interface V3ParentAcceptanceRequest {
  readonly candidate: V3ScenarioAuthorityCandidate;
  readonly runDigest: AuthorityDigest;
  readonly claimedRequirementManifestDigest: AuthorityDigest;
}

export interface V3ScenarioAuthorityResolution {
  readonly runDigest: AuthorityDigest;
  readonly releaseAuthority: boolean;
  readonly reasonCode: string | null;
  readonly parentAcceptanceReceiptDigest: AuthorityDigest | null;
  readonly parentAcceptanceSourceReceipt: AuthorityReceiptReference | null;
}

export interface V3ParentAcceptanceContext {
  readonly receipt: unknown;
  readonly sourceReceipt: AuthorityReceiptReference;
  readonly source: string;
}

export async function resolveV3ScenarioAuthority(props: {
  readonly candidate: V3ScenarioAuthorityCandidate;
  readonly calibration: ValidatedCurrentBaselineReceipt | null;
  readonly claimedRequirements: ClaimedRequirementValidation;
  readonly resolveParentAcceptance: (request: V3ParentAcceptanceRequest) => Promise<V3ParentAcceptanceContext | null>;
}): Promise<V3ScenarioAuthorityResolution> {
  assertClaimedRequirementValidationIntegrity(props.claimedRequirements);
  assertCandidateMatchesCalibration(props.candidate, props.calibration);
  const runDigest = calculateV3ScenarioAuthorityRunDigest(props.candidate, props.claimedRequirements.manifestDigest);
  const claimedRequirementStatus = resolveClaimedRequirementStatus(props.claimedRequirements);
  const withoutAcceptance = evaluateReleaseAuthority({
    evaluationRole: props.candidate.evaluationRole,
    calibration: props.calibration,
    outcome: props.candidate.outcome,
    runDigest,
    parentAcceptance: null,
    claimedRequirementStatus,
    claimedRequirementManifestDigest: props.claimedRequirements.manifestDigest,
  });
  if (withoutAcceptance.reasonCode !== "missing_parent_acceptance") {
    return {
      ...withoutAcceptance,
      runDigest,
      parentAcceptanceReceiptDigest: null,
      parentAcceptanceSourceReceipt: null,
    };
  }

  const parentAcceptance = await props.resolveParentAcceptance({
    candidate: props.candidate,
    runDigest,
    claimedRequirementManifestDigest: props.claimedRequirements.manifestDigest,
  });
  if (parentAcceptance !== null) assertAuthoritySourceReceipt(parentAcceptance);
  const resolution = evaluateReleaseAuthority({
    evaluationRole: props.candidate.evaluationRole,
    calibration: props.calibration,
    outcome: props.candidate.outcome,
    runDigest,
    parentAcceptance: parentAcceptance?.receipt ?? null,
    claimedRequirementStatus,
    claimedRequirementManifestDigest: props.claimedRequirements.manifestDigest,
  });
  let parentAcceptanceReceiptDigest: AuthorityDigest | null = null;
  if (parentAcceptance !== null) {
    try {
      parentAcceptanceReceiptDigest = calculateParentAcceptanceReceiptDigest(parentAcceptance.receipt);
    } catch {
      parentAcceptanceReceiptDigest = null;
    }
  }
  return {
    ...resolution,
    runDigest,
    parentAcceptanceReceiptDigest,
    parentAcceptanceSourceReceipt: parentAcceptance?.sourceReceipt ?? null,
  };
}

function assertAuthoritySourceReceipt(context: V3ParentAcceptanceContext): void {
  const reference = context.sourceReceipt;
  if (!reference.receiptPath.startsWith("tests/test-utils/skill-pressure/config/authority-receipts/")) {
    throw new Error("parent acceptance source receipt must use the tracked authority receipt root");
  }
  if (!/^sha256:[a-f0-9]{64}$/u.test(reference.receiptDigest)) {
    throw new Error("parent acceptance source receipt digest is invalid");
  }
  const actualSourceDigest = `sha256:${createHash("sha256").update(context.source).digest("hex")}`;
  if (actualSourceDigest !== reference.receiptDigest) {
    throw new Error("parent acceptance source receipt digest does not match its content");
  }
  let parsedSource: unknown;
  try {
    parsedSource = JSON.parse(context.source);
  } catch {
    throw new Error("parent acceptance source receipt is not valid JSON");
  }
  if (JSON.stringify(parsedSource) !== JSON.stringify(context.receipt)) {
    throw new Error("parent acceptance source receipt does not match the validated receipt");
  }
}

export function calculateV3ScenarioAuthorityRunDigest(
  candidate: V3ScenarioAuthorityCandidate,
  claimedRequirementManifestDigest: AuthorityDigest,
): AuthorityDigest {
  const serialized = JSON.stringify({ candidate, claimedRequirementManifestDigest });
  return `sha256:${createHash("sha256").update(serialized).digest("hex")}`;
}

function resolveClaimedRequirementStatus(
  validation: ClaimedRequirementValidation,
): "traced" | "untraced" | "unknown" {
  if (validation.unknownRequirementIds.length > 0) return "unknown";
  if (validation.untracedRequirementIds.length > 0) return "untraced";
  return validation.status === "traced" ? "traced" : "untraced";
}

function assertCandidateMatchesCalibration(
  candidate: V3ScenarioAuthorityCandidate,
  calibration: ValidatedCurrentBaselineReceipt | null,
): void {
  if (calibration === null) return;
  if (calibration.receipt.scenarioId !== candidate.scenarioId) {
    throw new Error("calibration scenario id does not match the authority candidate");
  }
  if (calibration.receipt.behaviorContractDigest !== candidate.behaviorContractDigest) {
    throw new Error("calibration behavior contract digest does not match the authority candidate");
  }
}
