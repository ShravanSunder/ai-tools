import path from "node:path";

import { expect } from "vitest";
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

describeEval("behavioral skill pressure", { harness, judgeThreshold: null }, (it) => {
  for (const evaluationCase of evaluationCases) {
    const register = evaluationCase.concurrent ? it.concurrent : it;
    register(evaluationCase.scenarioId, async ({ run }) => {
      const result = await concurrencyGate.run(() => run(evaluationCase));

      expect(result.output.executionStatus).toBe("executed");
      expect(result.output.outcome).toBe("pass");
      expect(result.output.baselineCount).toBe(5);
      expect(result.output.treatmentCount).toBe(5);
      expect(result.output.pairSetFingerprint).toMatch(/^sha256:/u);
    }, 2_400_000);
  }
});
