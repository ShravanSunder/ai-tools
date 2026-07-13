import path from "node:path";

import { expect } from "vitest";
import { describeEval } from "vitest-evals";

import { createSkillPressureEvalHarness } from "../lib/evaluation/skill-pressure-eval-harness.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const runId = `${Date.now()}-${process.pid}`;
const harness = createSkillPressureEvalHarness();

describeEval("behavioral skill pressure", { harness, judgeThreshold: null }, (it) => {
  it("manage-agents-pattern-routing", async ({ run }) => {
    const result = await run({
      scenarioId: "manage-agents-pattern-routing",
      scenarioPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/fixtures/scenarios/manage-agents-pattern-routing.md",
      ),
      skillDirectory: path.join(
        repositoryRoot,
        "plugins/shravan-dev-workflow/skills/manage-agents",
      ),
      outputDirectory: path.join(
        repositoryRoot,
        "tmp/skill-pressure-evals",
        `${runId}-manage-agents-pattern-routing`,
      ),
      timeoutSeconds: 180,
      infrastructureRetries: 1,
    });

    expect(result.output.executionStatus).toBe("executed");
    expect(result.output.baselineCount).toBe(5);
    expect(result.output.treatmentCount).toBe(5);
    expect(result.output.pairSetFingerprint).toMatch(/^sha256:/u);
  }, 2_400_000);
});
