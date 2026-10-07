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
const provenanceSkillNames = [
  "orchestrator-goal",
  "plan-creation-swarm",
  "plan-review-swarm",
  "implementation-execute-plan",
  "implementation-review-swarm",
] as const;

const fullyRetiredSkillNames = [
  "plan-creation-swarm",
  "plan-review-swarm",
  "implementation-execute-plan",
  "implementation-review-swarm",
] as const;

const activeReplacementSkillNames = [
  "orchestrator-implementation-goal",
  "plan-implementation",
  "implement-plan",
  "implementation-review",
] as const;

describe("retired skill runtime discoverability", () => {
  test("keeps complete provenance outside the active skill root", () => {
    for (const skillName of provenanceSkillNames) {
      const activeSkillPath = path.join(activeSkillRoot, skillName);
      const retiredSkillPath = path.join(retiredSkillRoot, skillName);

      expect(existsSync(path.join(retiredSkillPath, "SKILL.retired.md"))).toBe(
        true,
      );

      expect(existsSync(activeSkillPath)).toBe(false);
    }
  });

  test("does not register retired skills in either plugin manifest", () => {
    const manifests = [
      path.join(repoRoot, "plugins/shravan-dev-workflow/.codex-plugin/plugin.json"),
      path.join(repoRoot, "plugins/shravan-dev-workflow/.claude-plugin/plugin.json"),
    ];

    for (const manifestPath of manifests) {
      const manifestText = readFileSync(manifestPath, "utf8");
      for (const skillName of fullyRetiredSkillNames) {
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
      for (const skillName of fullyRetiredSkillNames) {
        expect(entrypoint).not.toContain(`${path.sep}${skillName}${path.sep}`);
      }
    }
  });

  test("discovers new minimal owners while preserving retired provenance", () => {
    for (const skillName of activeReplacementSkillNames) {
      expect(existsSync(path.join(activeSkillRoot, skillName, "SKILL.md"))).toBe(
        true,
      );
    }
  });
});
