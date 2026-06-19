import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { describeEval } from "vitest-evals";
import { expect } from "vitest";
import { evaluatePressureAssertions } from "../lib/pressure-assertions.js";
import { parseScenarioMarkdown } from "../lib/scenario-parser.js";
import { shouldRunSkillPressureCase } from "../lib/scenario-selection.js";
import {
  createSkillPressureHarness,
  type SkillPressureCase,
  type SkillPressureHarnessOutput,
} from "../lib/skill-pressure-harness.js";

const repoRoot = join(import.meta.dirname, "../../..");
const scenarioDirectory = join(repoRoot, "tests/skills/pressure-scenarios");
const selectedScenario = process.env["SKILL_PRESSURE_SCENARIO"];
const selectedMode = process.env["SKILL_PRESSURE_MODE"];
const backend = process.env["SKILL_PRESSURE_BACKEND"] ?? "codex";

const scenarios = readdirSync(scenarioDirectory)
  .filter((fileName) => fileName.endsWith(".md") && fileName !== "README.md")
  .filter((fileName) => {
    if (!selectedScenario) {
      return true;
    }
    return basename(fileName, ".md") === selectedScenario;
  })
  .map((fileName): SkillPressureCase => {
    const filePath = join(scenarioDirectory, fileName);
    return {
      scenario: parseScenarioMarkdown({
        filePath,
        markdown: readFileSync(filePath, "utf8"),
      }),
    };
  })
  .filter((skillPressureCase) =>
    shouldRunSkillPressureCase({
      skillPressureCase,
      selectedMode,
      selectedScenario,
    }),
  );

describeEval(
  "skill pressure",
  {
    harness: createSkillPressureHarness({ repoRoot, backend }),
    judgeThreshold: null,
  },
  (it) => {
    for (const skillPressureCase of scenarios) {
      it(
        skillPressureCase.scenario.scenarioId,
        async ({ run }) => {
          const result = await run(skillPressureCase, {
            metadata: {
              backend,
            },
          });

          const output = result.output as SkillPressureHarnessOutput | undefined;
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
        },
        900_000,
      );
    }
  },
);
