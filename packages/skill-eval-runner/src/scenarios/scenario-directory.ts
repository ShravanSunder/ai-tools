import { basename, dirname, join, resolve } from "node:path";
import type { SkillRef } from "../contracts/common.ts";
// Scenarios are tests, so by default they live under the repository's tests tree, not inside the
// skill package: `<repo>/tests/skills/pressure-scenarios/<owner>/<skill>/`. The owner is the
// directory holding the skill set (the plugin for `plugins/<plugin>/skills/<skill>`), so two
// skill sets with a skill of the same name keep separate scenario directories.
export const defaultScenarioRoot = join(
  "tests",
  "skills",
  "pressure-scenarios",
);
export const resolveSkillDirectory = (skill: SkillRef): string =>
  resolve(skill.repoRoot, skill.skillPath);
// `override` is the CLI's `--scenarios <dir>`: relative to the repository root, like `--skill`.
export function resolveScenarioDirectory(
  skill: SkillRef,
  override?: string,
): string {
  if (override) return resolve(skill.repoRoot, override);
  const skillDirectory = resolveSkillDirectory(skill);
  const skillSetOwner = basename(dirname(dirname(skillDirectory)));
  return resolve(
    skill.repoRoot,
    defaultScenarioRoot,
    skillSetOwner,
    basename(skillDirectory),
  );
}
