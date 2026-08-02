import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describeEval } from "vitest-evals";
import { createAcpxCodexAgentRunner } from "../lib/skill-pressure-evaluation/agent-execution/acpx-codex-agent-runner.js";
import { evaluatePressureAssertions } from "../lib/skill-pressure-evaluation/evaluators/deterministic/legacy-pressure-assertions.js";
import { executeEvaluatorSequence } from "../lib/skill-pressure-evaluation/evaluation-execution/execute-evaluator-sequence.js";
import { createAcpxTerraJudgeHarness } from "../lib/skill-pressure-evaluation/evaluators/semantic/terra-judge-harness.js";
import {
  loadSkillPressureCase,
  validateNoOrphanCaseDefinitions,
  validateUniqueSkillPressureCaseIdentities,
} from "../lib/skill-pressure-evaluation/scenario-cases/load-scenario-cases.js";
import { resolveSkillPressureRuntimeConfiguration } from "../lib/skill-pressure-evaluation/runtime-configuration/skill-pressure-runtime-configuration.js";
import {
  parseScenarioMarkdown,
  validateScenarioFilePlacement,
} from "../lib/skill-pressure-evaluation/scenario-cases/parse-scenario-fixture.js";
import { shouldRunSkillPressureCase } from "../lib/skill-pressure-evaluation/scenario-cases/select-legacy-scenarios.js";
import type { SkillPressureCase } from "../lib/skill-pressure-evaluation/scenario-cases/scenario-case-types.js";
import { createSkillPressureHarness } from "../lib/skill-pressure-evaluation/subject-execution/create-skill-pressure-subject-harness.js";

const repoRoot = join(import.meta.dirname, "../../..");
const scenarioDirectory = join(repoRoot, "tests/skills/pressure-scenarios");
const selectedScenario = process.env["SKILL_PRESSURE_SCENARIO"];
const selectedMode = process.env["SKILL_PRESSURE_MODE"];
const backend = process.env["SKILL_PRESSURE_BACKEND"] ?? "codex";
const runtimeConfiguration = resolveSkillPressureRuntimeConfiguration();
const acpxAgentRunner = createAcpxCodexAgentRunner({
  repoRoot,
  adapterConfiguration: runtimeConfiguration.codexAdapter,
});

const scenarioFixtureFiles = discoverFilesEndingWith(
  scenarioDirectory,
  ".md",
).filter((filePath) => !filePath.endsWith("/README.md"));
const caseDefinitionFiles = discoverFilesEndingWith(
  scenarioDirectory,
  ".case.ts",
);
validateNoOrphanCaseDefinitions({
  caseDefinitionFiles,
  scenarioFixtureFiles,
});
const loadedScenarios = await Promise.all(
  scenarioFixtureFiles.map(
    async (filePath): Promise<SkillPressureCase> => {
      const scenario = parseScenarioMarkdown({
        filePath,
        markdown: readFileSync(filePath, "utf8"),
      });
      validateScenarioFilePlacement({ scenarioDirectory, scenario });
      return await loadSkillPressureCase(scenario);
    },
  ),
);
validateUniqueSkillPressureCaseIdentities(loadedScenarios);

const scenarios = loadedScenarios.filter((skillPressureCase) =>
  shouldRunSkillPressureCase({
    skillPressureCase,
    selectedMode,
    selectedScenario,
  }),
);

function discoverFilesEndingWith(
  directoryPath: string,
  suffix: string,
): readonly string[] {
  return readdirSync(directoryPath, { recursive: true, withFileTypes: true })
    .filter(
      (directoryEntry) =>
        directoryEntry.isFile() && directoryEntry.name.endsWith(suffix),
    )
    .map((directoryEntry) => join(directoryEntry.parentPath, directoryEntry.name))
    .sort();
}

describeEval(
  "skill pressure",
  {
    harness: createSkillPressureHarness({
      repoRoot,
      backend,
      subjectRunner: acpxAgentRunner,
      subjectSetup: runtimeConfiguration.subject,
    }),
    judgeHarness: createAcpxTerraJudgeHarness({
      judgeRunner: acpxAgentRunner,
      judgeSetup: runtimeConfiguration.judge,
    }),
    judgeThreshold: null,
  },
  (it) => {
    it.concurrent.for(scenarios)(
      "$name",
      { timeout: 900_000 },
      async (skillPressureCase, { expect, run }) => {
        const result = await run(skillPressureCase.input);

        if (skillPressureCase.usesLegacyEvaluation) {
          const output = result.output;
          if (!output) {
            throw new Error("Skill pressure harness did not return output");
          }
          const assertionResult = evaluatePressureAssertions({
            scenario: skillPressureCase.scenario,
            result: output.finalResult,
            renderedPrompt: output.renderedPrompt,
            readOnlyRequested: output.readOnlyRequested,
            artifactPaths: output.artifactPaths,
          });
          expect(assertionResult.failures).toEqual([]);
          return;
        }

        await executeEvaluatorSequence({
          deterministicEvaluators: skillPressureCase.deterministicEvaluators,
          semanticEvaluator: skillPressureCase.semanticEvaluator,
          semanticEvaluationEnabled: backend !== "fake",
          applyEvaluator: async ({ evaluator, enforcement }) => {
            await expect(result).toSatisfyJudge(
              evaluator,
              enforcement === "record" ? { threshold: null } : undefined,
            );
          },
        });
      },
    );
  },
);
