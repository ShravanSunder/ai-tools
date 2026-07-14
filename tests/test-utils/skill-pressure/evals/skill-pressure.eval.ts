import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { afterAll, expect } from "vitest";
import { describeEval } from "vitest-evals";

import { discoverSkillScenarios } from "../lib/discovery/skill-discovery.js";
import {
  buildSkillPressureEvaluationCases,
  createBoundedConcurrencyGate,
  resolveSkillPressureEvaluationConfiguration,
  selectedScenarioIdsForEvaluation,
} from "../lib/evaluation/evaluation-registration.js";
import { createSkillPressureEvalHarness } from "../lib/evaluation/skill-pressure-eval-harness.js";
import { loadFastScenarioManifest } from "../lib/evaluation/fast-scenario-manifest.js";
import { createAggregateReceipt, type ScenarioExecutionSummary } from "../lib/reporting/aggregate-receipt.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const runId = `${Date.now()}-${process.pid}`;
const harness = createSkillPressureEvalHarness();
const configuration = resolveSkillPressureEvaluationConfiguration(process.env);
const fastScenarioIds = await loadFastScenarioManifest(
  new URL("../config/fast-scenario-manifest.yaml", import.meta.url),
);
const selectedScenarioIds = selectedScenarioIdsForEvaluation(configuration, fastScenarioIds);
const discoveryReceipt = await discoverSkillScenarios({
  repositoryRoot,
  ...(selectedScenarioIds === undefined ? {} : { selectedScenarioIds }),
});
const evaluationCases = buildSkillPressureEvaluationCases({
  repositoryRoot,
  discoveryReceipt,
  configuration,
  runId,
});
const concurrencyGate = createBoundedConcurrencyGate(configuration.jobs);
const completedResults: ScenarioExecutionSummary[] = [];

afterAll(async () => {
  const aggregateReceipt = createAggregateReceipt({
    runId,
    discoveredScenarioCount: discoveryReceipt.discovered.length,
    selectedScenarioIds: evaluationCases.map((evaluationCase) => evaluationCase.scenarioId),
    invalid: discoveryReceipt.invalid,
    results: completedResults,
  });
  const aggregateDirectory = path.join(repositoryRoot, "tmp/skill-pressure-evals", runId);
  const aggregatePath = path.join(aggregateDirectory, "aggregate-receipt.json");
  await mkdir(aggregateDirectory, { recursive: true });
  await writeFile(aggregatePath, `${JSON.stringify(aggregateReceipt, null, 2)}\n`, { flag: "wx" });
  expect(aggregateReceipt.success, `aggregate receipt: ${aggregatePath}`).toBe(true);
});

describeEval("behavioral skill pressure", { harness, judgeThreshold: null }, (it) => {
  for (const evaluationCase of evaluationCases) {
    const register = evaluationCase.concurrent ? it.concurrent : it;
    register(evaluationCase.scenarioId, async ({ run }) => {
      const result = await concurrencyGate.run(() => run(evaluationCase));
      completedResults.push({
        scenarioId: result.output.scenarioId,
        executionStatus: result.output.executionStatus,
        outcome: result.output.outcome,
        comparisonIntent: result.output.comparisonIntent,
        reasonCode: result.output.reasonCode,
        receiptPath: result.output.receiptPath,
      });

      expect(result.output.executionStatus).toBe("executed");
      expect(result.output.outcome).toBe("pass");
      expect(result.output.baselineCount).toBe(5);
      expect(result.output.treatmentCount).toBe(5);
      expect(result.output.pairSetFingerprint).toMatch(/^sha256:/u);
    }, 2_400_000);
  }
});
