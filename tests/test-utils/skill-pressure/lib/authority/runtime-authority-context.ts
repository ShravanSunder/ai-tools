import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { V3BehaviorContract } from "../contracts/v3-behavior-contract.js";
import type {
  V3ParentAcceptanceContext,
  V3ParentAcceptanceRequest,
} from "../evaluation/v3-scenario-authority.js";
import { writeJsonReceipt } from "../reporting/attempt-receipt.js";
import { calculateCurrentCalibrationFreshnessInputs } from "./calibration-freshness.js";
import {
  validatePromotionReceipt,
  type AuthorityDigest,
  type CalibrationFreshnessInputs,
  type ParentAcceptanceReceipt,
  type ValidatedPromotionReceipt,
} from "./authority-receipts.js";
import type {
  AuthorityReceiptReference,
  EvaluationRegistryRow,
} from "./evaluation-registry.js";
import { readTrackedAuthorityReceiptFile } from "./tracked-authority-receipt-file.js";

const AUTHORITY_RECEIPT_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";

export interface RuntimeAuthorityContext {
  readonly freshnessInputs: CalibrationFreshnessInputs;
  readonly calibration: {
    readonly promotion: ValidatedPromotionReceipt;
    readonly sourceReceipt: AuthorityReceiptReference;
    readonly source: string;
  } | null;
  readonly resolveParentAcceptance: (
    request: V3ParentAcceptanceRequest,
  ) => Promise<V3ParentAcceptanceContext | null>;
}

export async function createRuntimeAuthorityContext(props: {
  readonly repositoryRoot: string;
  readonly contract: V3BehaviorContract;
  readonly registryRow: EvaluationRegistryRow;
  readonly calculateFreshnessInputs?: typeof calculateCurrentCalibrationFreshnessInputs;
}): Promise<RuntimeAuthorityContext> {
  const freshnessInputs = await (props.calculateFreshnessInputs ?? calculateCurrentCalibrationFreshnessInputs)({
    repositoryRoot: props.repositoryRoot,
    contract: props.contract,
  });
  if (props.registryRow.evaluationRole !== "gate") {
    return { freshnessInputs, calibration: null, resolveParentAcceptance: async () => null };
  }
  if (props.registryRow.calibrationReceipt === null) {
    throw new Error("gate registry row is missing its calibration receipt");
  }
  const sourceBuffer = await readTrackedAuthorityReceiptFile({
    repositoryRoot: props.repositoryRoot,
    receiptPath: props.registryRow.calibrationReceipt.receiptPath,
    label: "runtime calibration receipt",
  });
  const source = sourceBuffer.toString("utf8");
  if (digestSource(source) !== props.registryRow.calibrationReceipt.receiptDigest) {
    throw new Error("runtime calibration receipt digest does not match the registry");
  }
  const promotion = await validatePromotionReceipt({
    receipt: JSON.parse(source) as unknown,
    currentFreshnessInputs: freshnessInputs,
    repositoryRoot: props.repositoryRoot,
  });
  const calibration = {
    promotion,
    sourceReceipt: props.registryRow.calibrationReceipt,
    source,
  };
  return {
    freshnessInputs,
    calibration,
    resolveParentAcceptance: async () => null,
  };
}

export async function persistExplicitParentAcceptance(props: {
  readonly repositoryRoot: string;
  readonly contract: V3BehaviorContract;
  readonly promotion: ValidatedPromotionReceipt;
  readonly request: V3ParentAcceptanceRequest;
}): Promise<V3ParentAcceptanceContext> {
  if (
    props.request.candidate.scenarioId !== props.contract.scenarioId ||
    props.request.candidate.behaviorContractDigest !== props.contract.behaviorContractDigest ||
    props.request.candidate.outcome !== "pass"
  ) throw new Error("parent runner cannot accept a mismatched or non-passing authority candidate");
  const receipt: ParentAcceptanceReceipt = {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: props.contract.scenarioId,
    behaviorContractDigest: props.contract.behaviorContractDigest,
    acceptedAuthorityReceiptDigest: props.promotion.authorityReceiptDigest,
    acceptedRunDigest: props.request.runDigest,
    calibrationFingerprintDigest: props.promotion.calibrationFingerprint.digest,
    claimedRequirementManifestDigest: props.request.claimedRequirementManifestDigest,
  };
  const fileName = `${props.contract.scenarioId}-run-${props.request.runDigest.slice(7, 19)}-parent-acceptance.json`;
  const receiptDirectory = path.join(props.repositoryRoot, AUTHORITY_RECEIPT_ROOT);
  const receiptPath = path.join(receiptDirectory, fileName);
  let source: string;
  try {
    source = await readFile(receiptPath, "utf8");
    if (JSON.stringify(JSON.parse(source)) !== JSON.stringify(receipt)) {
      throw new Error("existing parent acceptance receipt does not match this run");
    }
  } catch (error) {
    if (!isMissingFile(error)) throw error;
    const persisted = await writeJsonReceipt({
      receiptDirectory,
      fileName,
      receipt,
      secrets: [],
    });
    source = await readFile(persisted.receiptPath, "utf8");
  }
  return {
    receipt,
    source,
    sourceReceipt: {
      receiptPath: `${AUTHORITY_RECEIPT_ROOT}/${fileName}`,
      receiptDigest: digestSource(source),
    },
  };
}

function digestSource(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
