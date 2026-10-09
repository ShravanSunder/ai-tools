import { assertEquals } from "jsr:@std/assert@1";
import {
  resolveScenarioDirectory,
  scenarioDirectoryHoldingSkillError,
} from "./scenario-directory.ts";
Deno.test("a plugin skill's scenarios default to tests/skills/pressure-scenarios/<plugin>/<skill>", () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "plugins/skill-authoring/skills/skill-creation",
  };
  const scenarioDirectory = resolveScenarioDirectory(skill);
  assertEquals(
    scenarioDirectory,
    "/repo/tests/skills/pressure-scenarios/skill-authoring/skill-creation",
  );
});
Deno.test("an absolute skill path still resolves its owner from the directory holding its skill set", () => {
  const scenarioDirectory = resolveScenarioDirectory({
    repoRoot: "/repo",
    skillPath: "/repo/plugins/shravan-dev-workflow/skills/spec-design/",
  });
  assertEquals(
    scenarioDirectory,
    "/repo/tests/skills/pressure-scenarios/shravan-dev-workflow/spec-design",
  );
});
Deno.test("--scenarios overrides the default, relative to the repository root unless absolute", () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "plugins/skill-authoring/skills/skill-creation",
  };
  assertEquals(
    resolveScenarioDirectory(skill, "evals/skill-creation"),
    "/repo/evals/skill-creation",
  );
  assertEquals(
    resolveScenarioDirectory(skill, "/elsewhere/skill-creation"),
    "/elsewhere/skill-creation",
  );
});
Deno.test("a scenario directory that is or contains the skill under test is refused, naming both paths", async () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "plugins/sample-plugin/skills/sample-skill",
  };
  for (
    const holding of [
      "/repo",
      "/repo/plugins/sample-plugin/skills",
      "/repo/plugins/sample-plugin/skills/sample-skill",
    ]
  ) {
    const error = await scenarioDirectoryHoldingSkillError(skill, holding);
    assertEquals(
      error,
      `scenario-directory-holds-skill: --scenarios ${holding} is or contains the skill under test /repo/plugins/sample-plugin/skills/sample-skill`,
    );
  }
  for (
    const separate of [
      "/repo/tests/skills/pressure-scenarios/sample-plugin/sample-skill",
      "/repo/plugins/sample-plugin/skills/sample-skill/scenarios",
      "/repo/plugins/sample-plugin/skills/sample-skill-evals",
    ]
  ) {
    assertEquals(
      await scenarioDirectoryHoldingSkillError(skill, separate),
      undefined,
    );
  }
});
