import type { DiscoveryInvalidReceipt } from "../discovery/skill-discovery.js";
import {
  calculateEvaluationRegistrySnapshotDigest,
  type EvaluationRegistry,
} from "../authority/evaluation-registry.js";
import {
  createV3AggregateReceipt,
  type V3SkillPressureAggregateReceipt,
  type ValidatedV3ScenarioExecutionSummary,
  validateV3ScenarioExecutionForAggregate,
} from "../reporting/aggregate-receipt.js";
import {
  assertV3SuiteSelectionIntegrity,
  type V3SuiteSelectionReceipt,
} from "./v3-suite-selection.js";
import type { ExecutedV3BehavioralScenario } from "./v3-behavioral-scenario-execution.js";

export interface V3SuiteCommandResult {
  readonly exitCode: 0 | 1;
  readonly aggregate: V3SkillPressureAggregateReceipt;
  readonly aggregateReceiptPath: string;
}

export async function executeV3SuiteCommand(props: {
  readonly runId: string;
  readonly repositoryRoot: string;
  readonly discoveredScenarioCount: number;
  readonly invalid: readonly DiscoveryInvalidReceipt[];
  readonly selection: V3SuiteSelectionReceipt;
  readonly registrySnapshot: EvaluationRegistry;
  readonly executeScenario: (scenarioId: string) => Promise<ExecutedV3BehavioralScenario | null>;
  readonly persistAggregate: (receipt: V3SkillPressureAggregateReceipt) => Promise<string>;
}): Promise<V3SuiteCommandResult> {
  assertV3SuiteSelectionIntegrity(props.selection);
  const registrySnapshotDigest = calculateEvaluationRegistrySnapshotDigest(props.registrySnapshot);
  if (registrySnapshotDigest !== props.selection.registrySnapshotDigest) {
    throw new Error("suite selection registry snapshot digest does not match execution");
  }
  const results: ValidatedV3ScenarioExecutionSummary[] = [];
  for (const scenarioId of props.selection.selectedScenarioIds) {
    try {
      const registryRow = props.registrySnapshot.scenarios.find((row) => row.scenarioId === scenarioId);
      const selectedScenario = props.selection.selectedScenarios.find((scenario) => scenario.scenarioId === scenarioId);
      if (registryRow === undefined) throw new Error(`selected scenario is missing from registry snapshot: ${scenarioId}`);
      if (selectedScenario === undefined) throw new Error(`selected scenario is missing repetition metadata: ${scenarioId}`);
      const result = await props.executeScenario(scenarioId);
      if (result !== null) {
        results.push(await validateV3ScenarioExecutionForAggregate({
          scenarioId,
          repositoryRoot: props.repositoryRoot,
          registryRow,
          expectedRepetitions: selectedScenario.repetitions,
          executed: result,
        }));
      }
    } catch {
      // The absent result remains visible as missing execution in the aggregate.
    }
  }

  const aggregate = createV3AggregateReceipt({
    runId: props.runId,
    suiteKind: props.selection.aggregateSuiteKind,
    discoveredScenarioCount: props.discoveredScenarioCount,
    selectedScenarioIds: props.selection.selectedScenarioIds,
    claimedRequirements: props.selection.claimedRequirements,
    registrySnapshotDigest,
    selection: {
      mode: props.selection.mode,
      selectionDigest: props.selection.selectionDigest,
      selectedScenarios: props.selection.selectedScenarios,
      excludedStaleGateScenarioIds: props.selection.excludedStaleGateScenarioIds,
    },
    invalid: props.invalid,
    results,
  });
  const aggregateReceiptPath = await props.persistAggregate(aggregate);
  return {
    exitCode: aggregate.suite.success ? 0 : 1,
    aggregate,
    aggregateReceiptPath,
  };
}
