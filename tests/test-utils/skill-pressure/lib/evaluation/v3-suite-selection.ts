import { createHash } from "node:crypto";

import {
  assertClaimedRequirementValidationIntegrity,
  type ClaimedRequirementValidation,
} from "../authority/claimed-requirements.js";
import {
  calculateEvaluationRegistrySnapshotDigest,
  type EvaluationRegistry,
  type EvaluationRegistryRow,
} from "../authority/evaluation-registry.js";
import type { AggregateSuiteKind } from "../reporting/aggregate-receipt.js";

export interface V3SuiteSelectionCandidate {
  readonly scenarioId: string;
  readonly risk: "standard" | "high";
  readonly repetitions: number;
}

export type V3SuiteSelectionRequest =
  | { readonly mode: "gate"; readonly risk?: "standard" | "high" }
  | { readonly mode: "diagnostic"; readonly risk?: "standard" | "high"; readonly scenarioIds?: readonly string[] }
  | { readonly mode: "focused"; readonly scenarioId: string };

export interface V3SuiteSelectionReceipt {
  readonly schemaVersion: 1;
  readonly mode: V3SuiteSelectionRequest["mode"];
  readonly aggregateSuiteKind: AggregateSuiteKind;
  readonly selectedScenarioIds: readonly string[];
  readonly selectedScenarios: readonly { readonly scenarioId: string; readonly repetitions: number }[];
  readonly excludedStaleGateScenarioIds: readonly string[];
  readonly registrySnapshotDigest: `sha256:${string}`;
  readonly claimedRequirements: ClaimedRequirementValidation;
  readonly selectionDigest: `sha256:${string}`;
}

const selectorProducedSelection = Symbol("selector-produced-v3-suite-selection");

export function selectV3SuiteScenarios(
  props: V3SuiteSelectionRequest & {
    readonly candidates: readonly V3SuiteSelectionCandidate[];
    readonly registry: EvaluationRegistry;
    readonly claimedRequirements: ClaimedRequirementValidation;
  },
): V3SuiteSelectionReceipt {
  assertClaimedRequirementValidationIntegrity(props.claimedRequirements);
  const rows = validateIdentityClosure(props.candidates, props.registry);
  for (const candidate of props.candidates) {
    if (!Number.isSafeInteger(candidate.repetitions) || candidate.repetitions < 3) {
      throw new Error(`selection candidate ${candidate.scenarioId} must require at least three repetitions`);
    }
  }
  const candidatesById = new Map(props.candidates.map((candidate) => [candidate.scenarioId, candidate]));
  const risk = "risk" in props ? props.risk : undefined;
  const rowsInRisk = rows.filter((row) => risk === undefined || candidatesById.get(row.scenarioId)?.risk === risk);
  const excludedStaleGateScenarioIds = props.mode === "gate"
    ? rowsInRisk
        .filter((row) => row.evaluationRole === "gate" && row.freshness !== "fresh")
        .map((row) => row.scenarioId)
        .sort((left, right) => left.localeCompare(right))
    : [];

  let selectedRows: readonly EvaluationRegistryRow[];
  let aggregateSuiteKind: AggregateSuiteKind;
  if (props.mode === "gate") {
    selectedRows = rowsInRisk.filter((row) => row.evaluationRole === "gate" && row.freshness === "fresh");
    aggregateSuiteKind = "gate";
  } else if (props.mode === "diagnostic") {
    const requestedScenarioIds = new Set(props.scenarioIds ?? rowsInRisk.map((row) => row.scenarioId));
    if (requestedScenarioIds.size !== (props.scenarioIds?.length ?? requestedScenarioIds.size)) {
      throw new Error("diagnostic scenario selection contains duplicate ids");
    }
    for (const scenarioId of requestedScenarioIds) {
      const row = rowsInRisk.find((candidate) => candidate.scenarioId === scenarioId);
      if (row === undefined) {
        throw new Error(`diagnostic scenario is not registered in the selected risk: ${scenarioId}`);
      }
      if (props.scenarioIds !== undefined && row.evaluationRole !== "diagnostic") {
        throw new Error(`diagnostic selection requires a diagnostic scenario: ${scenarioId}`);
      }
    }
    selectedRows = rowsInRisk.filter((row) => row.evaluationRole === "diagnostic" && requestedScenarioIds.has(row.scenarioId));
    aggregateSuiteKind = "diagnostic";
    if (selectedRows.length === 0) {
      throw new Error("diagnostic selection requires at least one diagnostic scenario");
    }
  } else {
    const selected = rows.find((row) => row.scenarioId === props.scenarioId);
    if (selected === undefined) throw new Error(`focused scenario is not registered: ${props.scenarioId}`);
    if (selected.evaluationRole === "retired") throw new Error(`focused scenario is retired: ${props.scenarioId}`);
    selectedRows = [selected];
    aggregateSuiteKind = selected.evaluationRole;
  }

  const base = {
    schemaVersion: 1 as const,
    mode: props.mode,
    aggregateSuiteKind,
    selectedScenarioIds: selectedRows.map((row) => row.scenarioId).sort((left, right) => left.localeCompare(right)),
    selectedScenarios: selectedRows
      .map((row) => ({ scenarioId: row.scenarioId, repetitions: candidatesById.get(row.scenarioId)!.repetitions }))
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId)),
    excludedStaleGateScenarioIds,
    registrySnapshotDigest: calculateEvaluationRegistrySnapshotDigest(props.registry),
    claimedRequirements: props.claimedRequirements,
  };
  const selection: V3SuiteSelectionReceipt = {
    ...base,
    selectionDigest: calculateV3SuiteSelectionDigest(base),
  };
  Object.defineProperty(selection, selectorProducedSelection, { value: true });
  return deepFreeze(selection);
}

export function assertV3SuiteSelectionIntegrity(selection: V3SuiteSelectionReceipt): void {
  if (Object.getOwnPropertyDescriptor(selection, selectorProducedSelection)?.value !== true) {
    throw new Error("suite selection was not selector-produced");
  }
  const { selectionDigest, ...selectionWithoutDigest } = selection;
  if (calculateV3SuiteSelectionDigest(selectionWithoutDigest) !== selectionDigest) {
    throw new Error("suite selection digest does not match its content");
  }
}

export function calculateV3SuiteSelectionDigest(
  selection: Omit<V3SuiteSelectionReceipt, "selectionDigest">,
): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(JSON.stringify(selection)).digest("hex")}`;
}

function validateIdentityClosure(
  candidates: readonly V3SuiteSelectionCandidate[],
  registry: EvaluationRegistry,
): readonly EvaluationRegistryRow[] {
  const candidateIds = candidates.map((candidate) => candidate.scenarioId);
  const registryIds = registry.scenarios.map((row) => row.scenarioId);
  if (new Set(candidateIds).size !== candidateIds.length || new Set(registryIds).size !== registryIds.length) {
    throw new Error("selection candidates and registry must have one-to-one identities");
  }
  const sortedCandidateIds = [...candidateIds].sort((left, right) => left.localeCompare(right));
  const sortedRegistryIds = [...registryIds].sort((left, right) => left.localeCompare(right));
  if (JSON.stringify(sortedCandidateIds) !== JSON.stringify(sortedRegistryIds)) {
    throw new Error("selection candidates and registry must have one-to-one identities");
  }
  return registry.scenarios;
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
}
