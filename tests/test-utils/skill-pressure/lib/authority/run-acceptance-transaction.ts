import { createHash } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";

import { validateClaimedRequirementManifest } from "./claimed-requirements.js";
import { discoverSkillScenarios } from "../discovery/skill-discovery.js";
import type {
  ExecutedV3BehavioralScenario,
  V3BehavioralScenarioReceipt,
} from "../evaluation/v3-behavioral-scenario-execution.js";
import {
  createParentAcceptedV3AggregateReceipt,
  validateV3ScenarioExecutionForAggregate,
  type V3SkillPressureAggregateReceipt,
  type ValidatedV3ScenarioExecutionSummary,
} from "../reporting/aggregate-receipt.js";
import { writeJsonReceipt } from "../reporting/attempt-receipt.js";
import { calculateParentAcceptanceReceiptDigest, type AuthorityDigest } from "./authority-receipts.js";
import {
  calculateEvaluationRegistrySnapshotDigest,
  loadEvaluationRegistry,
} from "./evaluation-registry.js";
import {
  createRuntimeAuthorityContext,
  persistExplicitParentAcceptance,
} from "./runtime-authority-context.js";

const DEFAULT_REGISTRY_PATH = "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml";

export interface AcceptScenarioRunResult {
  readonly scenarioId: string;
  readonly runDigest: AuthorityDigest;
  readonly parentAcceptanceReceiptPath: string;
  readonly parentAcceptanceReceiptDigest: AuthorityDigest;
  readonly acceptedScenarioReceiptPath: string;
  readonly acceptedScenarioReceiptDigest: AuthorityDigest;
}

export interface RunAcceptanceTransactionDependencies {
  readonly validateScenarioExecution?: typeof validateV3ScenarioExecutionForAggregate;
  readonly createAuthorityContext?: typeof createRuntimeAuthorityContext;
  readonly beforeAcceptedReceiptCommit?: () => Promise<void>;
}

export interface AggregateParentAcceptedRunResult {
  readonly aggregateReceiptPath: string;
  readonly aggregateReceiptDigest: AuthorityDigest;
  readonly acceptedScenarioIds: readonly string[];
}

export async function acceptScenarioRunFromReceipt(props: {
  readonly repositoryRoot: string;
  readonly scenarioReceiptPath: string;
  readonly parentAccepted: boolean;
  readonly registryPath?: string;
  readonly dependencies?: RunAcceptanceTransactionDependencies;
}): Promise<AcceptScenarioRunResult> {
  if (!props.parentAccepted) throw new Error("run acceptance requires an explicit parent decision");

  const repositoryRoot = path.resolve(props.repositoryRoot);
  const scenarioReceiptPath = path.resolve(repositoryRoot, props.scenarioReceiptPath);
  const scenarioSource = await readFile(scenarioReceiptPath, "utf8");
  const receipt = JSON.parse(scenarioSource) as V3BehavioralScenarioReceipt;
  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`run acceptance discovery is invalid: ${discovery.invalid[0]?.detail ?? "unknown error"}`);
  }
  const contract = discovery.discovered.find((candidate) => candidate.scenarioId === receipt.scenarioId);
  if (contract === undefined) throw new Error(`run acceptance scenario is not discovered: ${receipt.scenarioId}`);
  const registryPath = path.resolve(repositoryRoot, props.registryPath ?? DEFAULT_REGISTRY_PATH);
  const registry = await loadEvaluationRegistry({
    repositoryRoot,
    registryPath,
    knownScenarios: discovery.discovered.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      behaviorContractDigest: scenario.behaviorContractDigest,
      plugin: scenario.plugin,
      skill: scenario.skill,
    })),
  });
  const registryRow = registry.scenarios.find((row) => row.scenarioId === receipt.scenarioId);
  if (registryRow === undefined) throw new Error(`run acceptance registry row is missing: ${receipt.scenarioId}`);
  if (registryRow.evaluationRole !== "gate" || registryRow.freshness !== "fresh") {
    throw new Error("run acceptance requires a fresh gate registry row");
  }

  const executed = {
    receiptPath: scenarioReceiptPath,
    receiptDigest: digestSource(scenarioSource),
    receipt,
  } satisfies ExecutedV3BehavioralScenario;
  await (props.dependencies?.validateScenarioExecution ?? validateV3ScenarioExecutionForAggregate)({
    scenarioId: receipt.scenarioId,
    repositoryRoot,
    registryRow,
    expectedRepetitions: contract.repetitions,
    executed,
  });
  assertAcceptableCandidate(receipt);

  const authorityContext = await (
    props.dependencies?.createAuthorityContext ?? createRuntimeAuthorityContext
  )({ repositoryRoot, contract, registryRow });
  const currentBaseline = authorityContext.calibration?.currentBaseline;
  if (currentBaseline === undefined || currentBaseline.freshness.status !== "fresh") {
    throw new Error("run acceptance requires fresh validated calibration authority");
  }
  if (
    receipt.authoritySnapshot.calibrationAuthorityReceiptDigest !== currentBaseline.authorityReceiptDigest ||
    receipt.authoritySnapshot.calibrationFingerprintDigest !== currentBaseline.calibrationFingerprint.digest
  ) {
    throw new Error("run acceptance calibration bindings do not match current authority");
  }

  const acceptance = await persistExplicitParentAcceptance({
    repositoryRoot,
    contract,
    currentBaseline,
    request: {
      candidate: {
        scenarioId: receipt.scenarioId,
        behaviorContractDigest: receipt.behaviorIdentity.behaviorContractDigest as AuthorityDigest,
        behaviorRequirementIds: receipt.behaviorIdentity.behaviorRequirementIds,
        evaluationRole: receipt.authoritySnapshot.evaluationRole,
        outcome: receipt.reduction.outcome,
        comparisonIntent: receipt.behaviorIdentity.comparisonIntent,
        evidenceDigest: receipt.authoritySnapshot.evidenceDigest as AuthorityDigest,
      },
      runDigest: receipt.authoritySnapshot.runDigest as AuthorityDigest,
      claimedRequirementManifestDigest: receipt.claimedRequirements.manifestDigest as AuthorityDigest,
    },
  });
  const parentAcceptanceReceiptDigest = calculateParentAcceptanceReceiptDigest(
    acceptance.receipt,
  );
  const acceptedReceipt: V3BehavioralScenarioReceipt = {
    ...receipt,
    authoritySnapshot: {
      ...receipt.authoritySnapshot,
      releaseAuthority: true,
      reasonCode: null,
      parentAcceptanceReceiptDigest,
      parentAcceptanceSourceReceipt: acceptance.sourceReceipt,
    },
  };
  const acceptedFileName = "scenario-receipt.parent-accepted.json";
  const acceptedReceiptPath = path.join(path.dirname(scenarioReceiptPath), acceptedFileName);
  let acceptedReceiptCreated = false;
  try {
    await props.dependencies?.beforeAcceptedReceiptCommit?.();
    const persisted = await persistAcceptedScenarioReceipt({
      receiptDirectory: path.dirname(scenarioReceiptPath),
      fileName: acceptedFileName,
      receipt: acceptedReceipt,
    });
    acceptedReceiptCreated = persisted.newlyCreated;
    await (props.dependencies?.validateScenarioExecution ?? validateV3ScenarioExecutionForAggregate)({
      scenarioId: receipt.scenarioId,
      repositoryRoot,
      registryRow,
      expectedRepetitions: contract.repetitions,
      executed: persisted.executed,
    });
    return {
      scenarioId: receipt.scenarioId,
      runDigest: receipt.authoritySnapshot.runDigest as AuthorityDigest,
      parentAcceptanceReceiptPath: acceptance.sourceReceipt.receiptPath,
      parentAcceptanceReceiptDigest,
      acceptedScenarioReceiptPath: persisted.executed.receiptPath,
      acceptedScenarioReceiptDigest: persisted.executed.receiptDigest as AuthorityDigest,
    };
  } catch (error) {
    if (acceptedReceiptCreated) await rm(acceptedReceiptPath, { force: true });
    if (acceptance.newlyCreated) {
      await rm(path.join(repositoryRoot, acceptance.sourceReceipt.receiptPath), { force: true });
    }
    throw error;
  }
}

export async function aggregateParentAcceptedRun(props: {
  readonly repositoryRoot: string;
  readonly aggregateReceiptPath: string;
  readonly registryPath?: string;
}): Promise<AggregateParentAcceptedRunResult> {
  const repositoryRoot = path.resolve(props.repositoryRoot);
  const aggregateReceiptPath = path.resolve(repositoryRoot, props.aggregateReceiptPath);
  const aggregateSource = await readFile(aggregateReceiptPath, "utf8");
  const aggregate = JSON.parse(aggregateSource) as V3SkillPressureAggregateReceipt;
  if (aggregate.schemaVersion !== 3 || aggregate.suite.kind !== "gate") {
    throw new Error("parent-accepted aggregation requires a v3 gate aggregate");
  }
  if (aggregate.results.length !== aggregate.selectedScenarioIds.length) {
    throw new Error("parent-accepted aggregation requires every selected scenario result");
  }

  const discovery = await discoverSkillScenarios({ repositoryRoot });
  if (discovery.invalid.length > 0) {
    throw new Error(`parent-accepted aggregation discovery is invalid: ${discovery.invalid[0]?.detail ?? "unknown error"}`);
  }
  const registryPath = path.resolve(repositoryRoot, props.registryPath ?? DEFAULT_REGISTRY_PATH);
  const registry = await loadEvaluationRegistry({
    repositoryRoot,
    registryPath,
    knownScenarios: discovery.discovered.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      behaviorContractDigest: scenario.behaviorContractDigest,
      plugin: scenario.plugin,
      skill: scenario.skill,
    })),
  });
  const registrySnapshotDigest = calculateEvaluationRegistrySnapshotDigest(registry);
  if (registrySnapshotDigest !== aggregate.registrySnapshotDigest) {
    throw new Error("parent-accepted aggregation registry snapshot changed after execution");
  }
  const knownRequirementIds = discovery.discovered.flatMap(
    (scenario) => scenario.behaviorRequirementIds,
  );
  const calibratedGateRequirementIds = discovery.discovered.flatMap((scenario) => {
    const registryRow = registry.scenarios.find((row) => row.scenarioId === scenario.scenarioId);
    return registryRow?.evaluationRole === "gate" && registryRow.freshness === "fresh"
      ? scenario.behaviorRequirementIds
      : [];
  });
  const claimedRequirements = validateClaimedRequirementManifest({
    manifest: {
      schemaVersion: 1,
      source: "cli_manifest",
      claimedRequirementIds: aggregate.claimedRequirementIds,
    },
    knownRequirementIds,
    calibratedGateRequirementIds,
  });
  if (claimedRequirements.manifestDigest !== aggregate.claimedRequirementInputDigest) {
    throw new Error("parent-accepted aggregation claimed requirements changed after execution");
  }

  const acceptedResults: ValidatedV3ScenarioExecutionSummary[] = [];
  for (const originalResult of aggregate.results) {
    const contract = discovery.discovered.find(
      (candidate) => candidate.scenarioId === originalResult.scenarioId,
    );
    const registryRow = registry.scenarios.find(
      (candidate) => candidate.scenarioId === originalResult.scenarioId,
    );
    if (contract === undefined || registryRow === undefined) {
      throw new Error(`parent-accepted scenario is no longer discovered: ${originalResult.scenarioId}`);
    }
    const acceptedReceiptPath = path.join(
      path.dirname(originalResult.receiptPath),
      "scenario-receipt.parent-accepted.json",
    );
    const acceptedSource = await readFile(acceptedReceiptPath, "utf8");
    const acceptedReceipt = JSON.parse(acceptedSource) as V3BehavioralScenarioReceipt;
    const accepted = await validateV3ScenarioExecutionForAggregate({
      scenarioId: originalResult.scenarioId,
      repositoryRoot,
      registryRow,
      expectedRepetitions: contract.repetitions,
      executed: {
        receiptPath: acceptedReceiptPath,
        receiptDigest: digestSource(acceptedSource),
        receipt: acceptedReceipt,
      },
    });
    if (!accepted.releaseAuthority) {
      throw new Error(`scenario is not parent-accepted: ${originalResult.scenarioId}`);
    }
    acceptedResults.push(accepted);
  }

  const acceptedAggregate = createParentAcceptedV3AggregateReceipt({
    sourceAggregate: aggregate,
    claimedRequirements,
    results: acceptedResults,
  });
  if (!acceptedAggregate.suite.success) {
    throw new Error("parent-accepted aggregate did not satisfy the gate");
  }
  const persisted = await writeJsonReceipt({
    receiptDirectory: path.dirname(aggregateReceiptPath),
    fileName: "aggregate-receipt.parent-accepted.json",
    receipt: acceptedAggregate,
    secrets: [],
  });
  return {
    aggregateReceiptPath: persisted.receiptPath,
    aggregateReceiptDigest: persisted.receiptDigest as AuthorityDigest,
    acceptedScenarioIds: acceptedResults.map((result) => result.scenarioId),
  };
}

async function persistAcceptedScenarioReceipt(props: {
  readonly receiptDirectory: string;
  readonly fileName: string;
  readonly receipt: V3BehavioralScenarioReceipt;
}): Promise<{
  readonly executed: ExecutedV3BehavioralScenario;
  readonly newlyCreated: boolean;
}> {
  const receiptPath = path.join(props.receiptDirectory, props.fileName);
  try {
    const source = await readFile(receiptPath, "utf8");
    if (JSON.stringify(JSON.parse(source)) !== JSON.stringify(props.receipt)) {
      throw new Error("existing parent-accepted scenario receipt does not match this run");
    }
    return {
      executed: {
        receiptPath,
        receiptDigest: digestSource(source),
        receipt: props.receipt,
      },
      newlyCreated: false,
    };
  } catch (error) {
    if (!isMissingFile(error)) throw error;
  }
  const persisted = await writeJsonReceipt({
    receiptDirectory: props.receiptDirectory,
    fileName: props.fileName,
    receipt: props.receipt,
    secrets: [],
  });
  return { executed: persisted, newlyCreated: true };
}

function assertAcceptableCandidate(receipt: V3BehavioralScenarioReceipt): void {
  if (
    receipt.authoritySnapshot.evaluationRole !== "gate" ||
    receipt.authoritySnapshot.calibrationStatus !== "calibrated" ||
    receipt.reduction.outcome !== "pass"
  ) {
    throw new Error("run acceptance requires a passing calibrated gate candidate");
  }
  if (
    receipt.authoritySnapshot.releaseAuthority ||
    receipt.authoritySnapshot.reasonCode !== "missing_parent_acceptance" ||
    receipt.authoritySnapshot.parentAcceptanceReceiptDigest !== null ||
    receipt.authoritySnapshot.parentAcceptanceSourceReceipt !== null
  ) {
    throw new Error("run acceptance requires an unaccepted exact-run candidate");
  }
}

function digestSource(source: string): AuthorityDigest {
  return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
