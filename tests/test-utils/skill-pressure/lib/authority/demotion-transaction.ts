import { createHash } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";

import { discoverSkillScenarios } from "../discovery/skill-discovery.js";
import type { ExecutedV3BehavioralScenario } from "../evaluation/v3-behavioral-scenario-execution.js";
import { validateV3ScenarioExecutionForAggregate } from "../reporting/aggregate-receipt.js";
import { writeJsonReceipt } from "../reporting/attempt-receipt.js";
import { digestJson } from "./calibration-freshness.js";
import {
  calculateAuthorityReceiptDigest,
  validateDemotionReceipt,
  type AuthorityDigest,
  type DemotionReceipt,
  type ParentAcceptanceReceipt,
} from "./authority-receipts.js";
import { demoteRegistryRow } from "./demotion-registry.js";
import { loadEvaluationRegistry, type EvaluationRegistryRow } from "./evaluation-registry.js";

const AUTHORITY_RECEIPT_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const DEFAULT_REGISTRY_PATH = "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml";
const DEMOTION_REASONS = [
  "contract_contradiction",
  "unstable_baseline",
  "reviewer_ambiguity",
  "execution_budget_insufficient",
] as const;

export type DemotionReason = (typeof DEMOTION_REASONS)[number];

export interface DemoteScenarioResult {
  readonly scenarioId: string;
  readonly demotionReceiptPath: string;
  readonly demotionReceiptDigest: AuthorityDigest;
  readonly authorityReceiptDigest: AuthorityDigest;
  readonly observedRunDigest: AuthorityDigest;
  readonly registryPath: string;
}

export interface DemotionTransactionDependencies {
  readonly validateScenarioExecution?: typeof validateV3ScenarioExecutionForAggregate;
  readonly beforeRegistryCommit?: () => Promise<void>;
}

export async function demoteScenarioFromReceipt(props: {
  readonly repositoryRoot: string;
  readonly scenarioReceiptPath: string;
  readonly aggregateReceiptPath: string;
  readonly reason: DemotionReason;
  readonly parentAccepted: boolean;
  readonly registryPath?: string;
  readonly dependencies?: DemotionTransactionDependencies;
}): Promise<DemoteScenarioResult> {
  if (!props.parentAccepted) {
    throw new Error("demotion requires explicit parent acceptance");
  }
  assertDemotionReason(props.reason);

  const repositoryRoot = path.resolve(props.repositoryRoot);
  const registryPath = path.resolve(repositoryRoot, props.registryPath ?? DEFAULT_REGISTRY_PATH);
  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`demotion discovery is invalid: ${discovery.invalid[0]?.detail ?? "unknown error"}`);
  }

  const resolvedScenarioReceiptPath = path.resolve(props.scenarioReceiptPath);
  const scenarioSource = await readFile(resolvedScenarioReceiptPath, "utf8");
  const receipt = parseObservedScenarioReceipt(scenarioSource);
  const contract = discovery.discovered.find((candidate) => candidate.scenarioId === receipt.scenarioId);
  if (contract === undefined) throw new Error(`demotion scenario is not discovered: ${receipt.scenarioId}`);

  const registry = await loadEvaluationRegistry({
    repositoryRoot,
    registryPath,
    knownScenarios: discovery.discovered.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      behaviorContractDigest: scenario.behaviorContractDigest,
    })),
  });
  const registryRow = registry.scenarios.find((row) => row.scenarioId === receipt.scenarioId);
  if (registryRow === undefined) throw new Error(`demotion registry row is missing: ${receipt.scenarioId}`);
  assertCurrentGateRow(registryRow);
  assertObservedGateRun({ receipt, registryRow, behaviorContractDigest: contract.behaviorContractDigest });

  const scenarioReceiptDigest = digestSource(scenarioSource);
  await (props.dependencies?.validateScenarioExecution ?? validateV3ScenarioExecutionForAggregate)({
    scenarioId: receipt.scenarioId,
    repositoryRoot,
    registryRow,
    expectedRepetitions: contract.repetitions,
    executed: {
      receiptPath: resolvedScenarioReceiptPath,
      receiptDigest: scenarioReceiptDigest,
      receipt,
    },
  });
  const aggregateReceiptPath = path.resolve(props.aggregateReceiptPath);
  const aggregateSource = await readFile(aggregateReceiptPath, "utf8");
  assertAggregateBindsObservedRun({
    source: aggregateSource,
    scenarioId: receipt.scenarioId,
    runDigest: receipt.authoritySnapshot.runDigest,
    scenarioReceiptDigest,
  });

  const behaviorContractDigest = asAuthorityDigest(
    contract.behaviorContractDigest,
    "demotion behavior contract digest",
  );
  const observedRunDigest = asAuthorityDigest(
    receipt.authoritySnapshot.runDigest,
    "demotion observed run digest",
  );
  const unsignedDemotion = {
    schemaVersion: 1 as const,
    receiptKind: "demotion" as const,
    scenarioId: receipt.scenarioId,
    behaviorContractDigest,
    observedRunDigest,
    evidence: {
      contractDigest: behaviorContractDigest,
      repetitionSetDigest: digestJson(receipt.repetitionReceipts),
      reviewDigest: digestJson(receipt.semanticReview),
      aggregateDigest: digestSource(aggregateSource),
      reason: props.reason,
    },
  };
  const authorityReceiptDigest = calculateAuthorityReceiptDigest(unsignedDemotion);
  const parentAcceptance: ParentAcceptanceReceipt = {
    schemaVersion: 1,
    receiptKind: "parent_acceptance",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest,
    acceptedAuthorityReceiptDigest: authorityReceiptDigest,
    acceptedRunDigest: observedRunDigest,
    calibrationFingerprintDigest: asAuthorityDigest(
      receipt.authoritySnapshot.calibrationFingerprintDigest,
      "demotion calibration fingerprint digest",
    ),
    claimedRequirementManifestDigest: asAuthorityDigest(
      receipt.claimedRequirements.manifestDigest,
      "demotion claimed requirement manifest digest",
    ),
  };
  const demotionReceipt: DemotionReceipt = { ...unsignedDemotion, parentAcceptance };
  validateDemotionReceipt({ receipt: demotionReceipt });

  let createdReceiptPath: string | null = null;
  try {
    const fileName = `${receipt.scenarioId}-demotion-${authorityReceiptDigest.slice(7, 19)}.json`;
    const persistedDemotion = await writeJsonReceipt({
      receiptDirectory: path.join(repositoryRoot, AUTHORITY_RECEIPT_ROOT),
      fileName,
      receipt: demotionReceipt,
      secrets: [],
    });
    createdReceiptPath = persistedDemotion.receiptPath;
    const demotionReceiptPath = `${AUTHORITY_RECEIPT_ROOT}/${fileName}`;
    const demotionReceiptDigest = asAuthorityDigest(
      persistedDemotion.receiptDigest,
      "persisted demotion receipt digest",
    );
    const persistedReceipt = JSON.parse(await readFile(persistedDemotion.receiptPath, "utf8")) as unknown;
    const validatedDemotion = validateDemotionReceipt({ receipt: persistedReceipt });
    if (validatedDemotion.authorityReceiptDigest !== authorityReceiptDigest) {
      throw new Error("persisted demotion authority receipt digest does not match");
    }

    await demoteRegistryRow({
      repositoryRoot,
      registryPath,
      discovery,
      scenarioId: receipt.scenarioId,
      demotionReceiptPath,
      demotionReceiptDigest,
      ...(props.dependencies?.beforeRegistryCommit === undefined
        ? {}
        : { beforeRegistryCommit: props.dependencies.beforeRegistryCommit }),
    });
    return {
      scenarioId: receipt.scenarioId,
      demotionReceiptPath,
      demotionReceiptDigest,
      authorityReceiptDigest,
      observedRunDigest,
      registryPath,
    };
  } catch (error) {
    if (createdReceiptPath !== null) await rm(createdReceiptPath, { force: true });
    throw error;
  }
}

function assertAggregateBindsObservedRun(props: {
  readonly source: string;
  readonly scenarioId: string;
  readonly runDigest: string;
  readonly scenarioReceiptDigest: AuthorityDigest;
}): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(props.source) as unknown;
  } catch {
    throw new Error("demotion aggregate receipt is not valid JSON");
  }
  const aggregate = assertRecord(parsed, "demotion aggregate receipt");
  if (aggregate.schemaVersion !== 3 || !Array.isArray(aggregate.results)) {
    throw new Error("demotion aggregate receipt must use the v3 aggregate contract");
  }
  const matchingResults = aggregate.results.filter((candidate) => {
    if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) return false;
    const result = candidate as Record<string, unknown>;
    return (
      result.scenarioId === props.scenarioId &&
      result.runDigest === props.runDigest &&
      result.scenarioReceiptDigest === props.scenarioReceiptDigest
    );
  });
  if (matchingResults.length !== 1) {
    throw new Error("demotion aggregate does not bind the exact observed scenario run");
  }
}

function assertDemotionReason(reason: unknown): asserts reason is DemotionReason {
  if (!DEMOTION_REASONS.includes(reason as DemotionReason)) {
    throw new Error("treatment failure or mix does not justify demotion");
  }
}

function assertCurrentGateRow(row: EvaluationRegistryRow): asserts row is EvaluationRegistryRow & {
  readonly evaluationRole: "gate";
} {
  if (row.evaluationRole !== "gate") {
    throw new Error(`only current gate rows can demote: ${row.scenarioId}`);
  }
}

function assertObservedGateRun(props: {
  readonly receipt: ExecutedV3BehavioralScenario["receipt"];
  readonly registryRow: EvaluationRegistryRow;
  readonly behaviorContractDigest: string;
}): void {
  if (
    props.receipt.behaviorIdentity.behaviorContractDigest !== props.behaviorContractDigest ||
    props.receipt.behaviorIdentity.behaviorContractDigest !== props.registryRow.behaviorContractDigest
  ) {
    throw new Error("demotion source receipt behavior contract does not match the current registry row");
  }
  if (
    props.receipt.authoritySnapshot.evaluationRole !== "gate" ||
    props.receipt.authoritySnapshot.freshness !== props.registryRow.freshness
  ) {
    throw new Error("demotion source receipt is not a current gate run");
  }
  if (props.receipt.authoritySnapshot.demotedThisRun !== false) {
    throw new Error("demotion must be a separate post-run transaction");
  }
}

function parseObservedScenarioReceipt(source: string): ExecutedV3BehavioralScenario["receipt"] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source) as unknown;
  } catch {
    throw new Error("demotion source scenario receipt is not valid JSON");
  }
  const receipt = assertRecord(parsed, "demotion source scenario receipt");
  if (receipt.schemaVersion !== 3) throw new Error("demotion source scenario receipt must use schema version 3");
  assertIdentifier(receipt.scenarioId, "demotion source scenario id");
  const behaviorIdentity = assertRecord(receipt.behaviorIdentity, "demotion source behavior identity");
  asAuthorityDigest(behaviorIdentity.behaviorContractDigest, "demotion source behavior contract digest");
  const authoritySnapshot = assertRecord(receipt.authoritySnapshot, "demotion source authority snapshot");
  if (authoritySnapshot.evaluationRole !== "gate" && authoritySnapshot.evaluationRole !== "diagnostic") {
    throw new Error("demotion source evaluation role is invalid");
  }
  if (
    authoritySnapshot.freshness !== "fresh" &&
    authoritySnapshot.freshness !== "stale" &&
    authoritySnapshot.freshness !== "uncalibrated" &&
    authoritySnapshot.freshness !== "retired"
  ) {
    throw new Error("demotion source freshness is invalid");
  }
  asAuthorityDigest(authoritySnapshot.runDigest, "demotion source run digest");
  asAuthorityDigest(authoritySnapshot.evidenceDigest, "demotion source aggregate evidence digest");
  asAuthorityDigest(authoritySnapshot.calibrationFingerprintDigest, "demotion source calibration fingerprint digest");
  if (authoritySnapshot.demotedThisRun !== false) {
    throw new Error("demotion must be a separate post-run transaction");
  }
  const claimedRequirements = assertRecord(receipt.claimedRequirements, "demotion source claimed requirements");
  asAuthorityDigest(claimedRequirements.manifestDigest, "demotion source claimed requirement manifest digest");
  if (!Array.isArray(receipt.repetitionReceipts)) {
    throw new Error("demotion source repetition receipts must be an array");
  }
  assertRecord(receipt.semanticReview, "demotion source semantic review");
  return parsed as ExecutedV3BehavioralScenario["receipt"];
}

function asAuthorityDigest(value: unknown, label: string): AuthorityDigest {
  if (typeof value !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(value)) {
    throw new Error(`${label} is invalid`);
  }
  return value as AuthorityDigest;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    throw new Error(`${label} must be an identifier`);
  }
}

function digestSource(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}
