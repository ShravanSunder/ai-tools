import { assertEquals } from "jsr:@std/assert@1";
import {
  resolveScenarioDirectory,
  scenarioDirectoryOverrideError,
} from "./scenario-directory.ts";
Deno.test("a plugin skill's scenarios default to tests/skills/pressure-scenarios/<plugin>/<skill>", async () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "plugins/skill-authoring/skills/skill-creation",
  };
  const scenarioDirectory = await resolveScenarioDirectory(skill);
  assertEquals(
    scenarioDirectory,
    "/repo/tests/skills/pressure-scenarios/skill-authoring/skill-creation",
  );
});
Deno.test("an absolute skill path still resolves its owner from the directory holding its skill set", async () => {
  const scenarioDirectory = await resolveScenarioDirectory({
    repoRoot: "/repo",
    skillPath: "/repo/plugins/shravan-dev-workflow/skills/spec-design/",
  });
  assertEquals(
    scenarioDirectory,
    "/repo/tests/skills/pressure-scenarios/shravan-dev-workflow/spec-design",
  );
});
Deno.test("a skill set whose holder is the repository root has no owner segment, whatever the checkout is called", async () => {
  for (const checkout of ["/work/ai-tools", "/work/ai-tools.feature-branch"]) {
    assertEquals(
      await resolveScenarioDirectory({
        repoRoot: checkout,
        skillPath: "skills/sample-skill",
      }),
      `${checkout}/tests/skills/pressure-scenarios/sample-skill`,
    );
  }
});
Deno.test("a skill set that is the repository root has no owner segment, whatever holds the checkout", async () => {
  for (const checkout of ["/work/ai-tools", "/elsewhere/clone"]) {
    assertEquals(
      await resolveScenarioDirectory({
        repoRoot: checkout,
        skillPath: "sample-skill",
      }),
      `${checkout}/tests/skills/pressure-scenarios/sample-skill`,
    );
  }
});
Deno.test("a .agents/skills skill keeps .agents as its owner segment", async () => {
  assertEquals(
    await resolveScenarioDirectory({
      repoRoot: "/repo",
      skillPath: ".agents/skills/local-skill",
    }),
    "/repo/tests/skills/pressure-scenarios/.agents/local-skill",
  );
});
Deno.test("--scenarios overrides the default, relative to the repository root unless absolute", async () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "plugins/skill-authoring/skills/skill-creation",
  };
  assertEquals(
    await resolveScenarioDirectory(skill, "evals/skill-creation"),
    "/repo/evals/skill-creation",
  );
  assertEquals(
    await resolveScenarioDirectory(skill, "/elsewhere/skill-creation"),
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
    const error = await scenarioDirectoryOverrideError(skill, holding);
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
      await scenarioDirectoryOverrideError(skill, separate),
      undefined,
    );
  }
});
Deno.test("a scenario directory that is the repository root is refused even when the skill set is outside it", async () => {
  const skill = {
    repoRoot: "/repo",
    skillPath: "/outside/skills/outside-skill",
  };
  assertEquals(
    await scenarioDirectoryOverrideError(skill, "/repo"),
    "scenario-directory-is-repository-root: --scenarios /repo is the repository root /repo",
  );
});
