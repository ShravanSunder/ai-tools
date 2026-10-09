import { assertEquals } from "jsr:@std/assert@1";
import { resolveScenarioDirectory } from "./scenario-directory.ts";
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
