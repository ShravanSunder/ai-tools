import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { afterAll, expect, it as vitestIt } from "vitest";
import { describeEval } from "vitest-evals";

import { validateClaimedRequirementManifest } from "../lib/authority/claimed-requirements.js";
import { loadEvaluationRegistry } from "../lib/authority/evaluation-registry.js";
import { discoverSkillScenarios } from "../lib/discovery/skill-discovery.js";
import {
  buildSkillPressureEvaluationCases,
  createSkillPressureExecutionGraphReceipt,
  createBoundedConcurrencyGate,
  resolveSkillPressureEvaluationConfiguration,
  validatePersistedSkillPressureExecutionGraphReceipt,
} from "../lib/evaluation/evaluation-registration.js";
import { createSkillPressureEvalHarness } from "../lib/evaluation/skill-pressure-eval-harness.js";
import { loadFastScenarioManifest } from "../lib/evaluation/fast-scenario-manifest.js";
import type { ExecutedV3BehavioralScenario } from "../lib/evaluation/v3-behavioral-scenario-execution.js";
import { selectV3SuiteScenarios } from "../lib/evaluation/v3-suite-selection.js";
import { calculateRunnerSemantics } from "../lib/runtime/runner-semantics.js";
import {
  createV3AggregateReceipt,
  validateV3ScenarioExecutionForAggregate,
  type ValidatedV3ScenarioExecutionSummary,
} from "../lib/reporting/aggregate-receipt.js";
import { writeJsonReceipt } from "../lib/reporting/attempt-receipt.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const runId = `${Date.now()}-${process.pid}`;
const harness = createSkillPressureEvalHarness();
const configuration = resolveSkillPressureEvaluationConfiguration(process.env);
const fastScenarioIds = await loadFastScenarioManifest(
  new URL("../config/fast-scenario-manifest.yaml", import.meta.url),
);
const discoveryReceipt = await discoverSkillScenarios({ repositoryRoot });
const registrySnapshot = await loadEvaluationRegistry({
  repositoryRoot,
  registryPath: path.join(
    repositoryRoot,
    "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml",
  ),
  knownScenarios: discoveryReceipt.discovered.map((scenario) => ({
    scenarioId: scenario.scenarioId,
    behaviorContractDigest: scenario.behaviorContractDigest,
  })),
});
const selectedScenarioIds = selectScenarioIds();
const selectedContracts = discoveryReceipt.discovered.filter((scenario) =>
  selectedScenarioIds.has(scenario.scenarioId),
);
const knownRequirementIds = discoveryReceipt.discovered.flatMap(
  (scenario) => scenario.behaviorRequirementIds,
);
const calibratedGateRequirementIds = discoveryReceipt.discovered.flatMap((scenario) => {
  const registryRow = registrySnapshot.scenarios.find(
    (row) => row.scenarioId === scenario.scenarioId,
  );
  return registryRow?.evaluationRole === "gate" && registryRow.freshness === "fresh"
    ? scenario.behaviorRequirementIds
    : [];
});
const claimedRequirementIds =
  selectedContracts.length > 0
    ? selectedContracts.flatMap((scenario) => scenario.behaviorRequirementIds)
    : knownRequirementIds;
const claimedRequirements = validateClaimedRequirementManifest({
  manifest: { schemaVersion: 1, source: "cli_manifest", claimedRequirementIds },
  knownRequirementIds,
  calibratedGateRequirementIds,
});
const selection = selectV3SuiteScenarios({
  ...selectionRequest(),
  candidates: discoveryReceipt.discovered.map((scenario) => ({
    scenarioId: scenario.scenarioId,
    risk: scenario.risk,
    repetitions: scenario.repetitions,
  })),
  registry: registrySnapshot,
  claimedRequirements,
});
const selectedIdSet = new Set(selection.selectedScenarioIds);
const selectedDiscoveryReceipt = {
  ...discoveryReceipt,
  selected: discoveryReceipt.discovered.filter((scenario) =>
    selectedIdSet.has(scenario.scenarioId),
  ),
  skipped: discoveryReceipt.discovered.filter(
    (scenario) => !selectedIdSet.has(scenario.scenarioId),
  ),
};
const evaluationCases = buildSkillPressureEvaluationCases({
  repositoryRoot,
  discoveryReceipt: selectedDiscoveryReceipt,
  configuration,
  runId,
  registrySnapshot,
  claimedRequirements,
});
const runnerSemantics = await calculateRunnerSemantics({ repositoryRoot });
const suiteExecutionGraphReceipt =
  evaluationCases.length === 0 || configuration.acceptedCaps === null
    ? null
    : createSkillPressureExecutionGraphReceipt({
        evaluationCases,
        acceptedCaps: configuration.acceptedCaps,
        runnerSemanticsDigest: runnerSemantics.runnerSemanticsDigest,
      });
const suiteExecutionGraphReceiptPath = path.join(
  repositoryRoot,
  "tmp/skill-pressure-evals",
  runId,
  "execution-graph-preflight.json",
);
const suiteExecutionGraphPersistence =
  suiteExecutionGraphReceipt === null
    ? null
    : await writeJsonReceipt({
        receiptDirectory: path.dirname(suiteExecutionGraphReceiptPath),
        fileName: path.basename(suiteExecutionGraphReceiptPath),
        receipt: suiteExecutionGraphReceipt,
        secrets: [],
      });
const concurrencyGate = createBoundedConcurrencyGate(configuration.jobs);
const completedResults: ValidatedV3ScenarioExecutionSummary[] = [];

afterAll(async () => {
  if (suiteExecutionGraphPersistence !== null) {
    if (suiteExecutionGraphReceipt === null) {
      throw new Error("persisted suite execution graph is missing its accepted in-memory receipt");
    }
    await validatePersistedSkillPressureExecutionGraphReceipt({
      receiptPath: suiteExecutionGraphPersistence.receiptPath,
      receiptDigest: suiteExecutionGraphPersistence.receiptDigest,
      expectedReceipt: suiteExecutionGraphReceipt,
    });
  }
  if (configuration.dryRun) {
    expect(
      suiteExecutionGraphReceipt,
      `execution graph receipt: ${suiteExecutionGraphReceiptPath}`,
    ).not.toBeNull();
    return;
  }
  const aggregateReceipt = createV3AggregateReceipt({
    runId,
    suiteKind: selection.aggregateSuiteKind,
    discoveredScenarioCount: discoveryReceipt.discovered.length,
    selectedScenarioIds: selection.selectedScenarioIds,
    claimedRequirements,
    registrySnapshotDigest: selection.registrySnapshotDigest,
    executionGraphPreflightReceipt:
      suiteExecutionGraphPersistence === null
        ? null
        : {
            receiptPath: suiteExecutionGraphPersistence.receiptPath,
            receiptDigest: suiteExecutionGraphPersistence.receiptDigest,
          },
    selection: {
      mode: selection.mode,
      selectionDigest: selection.selectionDigest,
      selectedScenarios: selection.selectedScenarios,
      excludedStaleGateScenarioIds: selection.excludedStaleGateScenarioIds,
    },
    invalid: discoveryReceipt.invalid,
    results: completedResults,
  });
  const aggregateDirectory = path.join(repositoryRoot, "tmp/skill-pressure-evals", runId);
  const aggregatePath = path.join(aggregateDirectory, "aggregate-receipt.json");
  await mkdir(aggregateDirectory, { recursive: true });
  await writeFile(aggregatePath, `${JSON.stringify(aggregateReceipt, null, 2)}\n`, { flag: "wx" });
  expect(aggregateReceipt.suite.success, `aggregate receipt: ${aggregatePath}`).toBe(true);
});

if (!configuration.dryRun) {
  describeEval("behavioral skill pressure v3", { harness, judgeThreshold: null }, (it) => {
    for (const evaluationCase of evaluationCases) {
      const register = evaluationCase.concurrent ? it.concurrent : it;
      register(
        evaluationCase.scenarioId,
        async ({ run }) => {
          const result = await concurrencyGate.run(() => run(evaluationCase));
          const receiptSource = await readFile(result.output.receiptPath, "utf8");
          const receipt = JSON.parse(receiptSource) as ExecutedV3BehavioralScenario["receipt"];
          const registryRow = registrySnapshot.scenarios.find(
            (row) => row.scenarioId === result.output.scenarioId,
          );
          if (registryRow === undefined)
            throw new Error(`missing registry row: ${result.output.scenarioId}`);
          completedResults.push(
            await validateV3ScenarioExecutionForAggregate({
              scenarioId: result.output.scenarioId,
              repositoryRoot,
              registryRow,
              expectedRepetitions:
                selection.selectedScenarios.find(
                  (scenario) => scenario.scenarioId === result.output.scenarioId,
                )?.repetitions ?? 0,
              executed: {
                receiptPath: result.output.receiptPath,
                receiptDigest: `sha256:${createHash("sha256").update(receiptSource).digest("hex")}`,
                receipt,
              },
            }),
          );

          expect(result.output.executionStatus).toBe("executed");
          expect(result.output.baselineCount).toBe(5);
          expect(result.output.treatmentCount).toBe(5);
          expect(result.output.evidenceDigest).toMatch(/^sha256:/u);
          if (selection.aggregateSuiteKind === "gate") {
            expect(result.output.outcome).toBe("pass");
          }
        },
        evaluationCase.vitestTimeoutMs,
      );
    }
  });
}

if (configuration.dryRun) {
  vitestIt("writes the accepted execution graph without launching model work", () => {
    expect(suiteExecutionGraphReceipt?.status).toBe("accepted_before_launch");
  });
}

function selectScenarioIds(): ReadonlySet<string> {
  if (configuration.fast) return new Set(fastScenarioIds);
  if (configuration.scenarioId !== undefined) return new Set([configuration.scenarioId]);
  if (configuration.risk !== undefined) {
    return new Set(
      registrySnapshot.scenarios
        .filter((row) => row.evaluationRole === "gate" && row.freshness === "fresh")
        .flatMap((row) => {
          const scenario = discoveryReceipt.discovered.find(
            (candidate) => candidate.scenarioId === row.scenarioId,
          );
          return scenario?.risk === configuration.risk ? [row.scenarioId] : [];
        }),
    );
  }
  return new Set(
    registrySnapshot.scenarios
      .filter((row) => row.evaluationRole === "diagnostic")
      .map((row) => row.scenarioId),
  );
}

function selectionRequest() {
  if (configuration.fast) return { mode: "diagnostic" as const, scenarioIds: fastScenarioIds };
  if (configuration.scenarioId !== undefined)
    return { mode: "focused" as const, scenarioId: configuration.scenarioId };
  if (configuration.risk !== undefined) return { mode: "gate" as const, risk: configuration.risk };
  return { mode: "diagnostic" as const };
}
