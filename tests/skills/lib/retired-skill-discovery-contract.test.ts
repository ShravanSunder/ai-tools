import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const activeSkillRoot = path.join(
  repoRoot,
  "plugins/shravan-dev-workflow/skills",
);
const retiredSkillRoot = path.join(
  repoRoot,
  "plugins/shravan-dev-workflow/retired-skills",
);
const activeScenarioRoot = path.join(
  repoRoot,
  "tests/skills/pressure-scenarios/shravan-dev-workflow",
);
const retiredScenarioRoot = path.join(
  repoRoot,
  "tests/skills/retired-pressure-scenarios/shravan-dev-workflow",
);
const retiredSkills = [
  "orchestrator-goal",
  "plan-creation-swarm",
  "plan-review-swarm",
  "implementation-execute-plan",
  "implementation-review-swarm",
] as const;

describe("retired skill runtime discoverability", () => {
  test("keeps complete provenance outside active skill and scenario roots", () => {
    for (const skillName of retiredSkills) {
      const activeSkillPath = path.join(activeSkillRoot, skillName);
      const retiredSkillPath = path.join(retiredSkillRoot, skillName);
      const activeScenarioPath = path.join(activeScenarioRoot, skillName);
      const retiredScenarioPath = path.join(retiredScenarioRoot, skillName);

      expect(existsSync(activeSkillPath)).toBe(false);
      expect(existsSync(path.join(activeSkillPath, "SKILL.md"))).toBe(false);
      expect(existsSync(path.join(retiredSkillPath, "SKILL.retired.md"))).toBe(
        true,
      );
      expect(existsSync(activeScenarioPath)).toBe(false);
      expect(existsSync(retiredScenarioPath)).toBe(true);
    }
  });

  test("does not register retired skills in either plugin manifest", () => {
    const manifests = [
      path.join(repoRoot, "plugins/shravan-dev-workflow/.codex-plugin/plugin.json"),
      path.join(repoRoot, "plugins/shravan-dev-workflow/.claude-plugin/plugin.json"),
    ];

    for (const manifestPath of manifests) {
      const manifestText = readFileSync(manifestPath, "utf8");
      for (const skillName of retiredSkills) {
        expect(manifestText).not.toContain(`"${skillName}"`);
      }
    }
  });

  test("active skill discovery sees no retired entrypoint", () => {
    const activeEntrypoints = readdirSync(activeSkillRoot, {
      recursive: true,
      withFileTypes: true,
    })
      .filter(
        (entry) => entry.isFile() && entry.name === "SKILL.md",
      )
      .map((entry) => path.join(entry.parentPath, entry.name));

    for (const entrypoint of activeEntrypoints) {
      for (const skillName of retiredSkills) {
        expect(entrypoint).not.toContain(`${path.sep}${skillName}${path.sep}`);
      }
    }
  });
});
