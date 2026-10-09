import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
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
const realOrResolvedPath = (path: string): Promise<string> =>
  Deno.realPath(path).catch(() => resolve(path));
// Every snapshot drops the scenario directory in use, so a `--scenarios` directory that is or
// holds the skill under test (the repository root, the skill set, or the skill) would strip that
// skill too. It is invalid input; paths compare after symlinks resolve, and print as given.
export async function scenarioDirectoryHoldingSkillError(
  skill: SkillRef,
  scenarioDirectory: string,
): Promise<string | undefined> {
  const skillDirectory = resolveSkillDirectory(skill);
  const fromScenarioDirectoryToSkill = relative(
    await realOrResolvedPath(scenarioDirectory),
    await realOrResolvedPath(skillDirectory),
  );
  const holdsSkill = fromScenarioDirectoryToSkill === "" ||
    !(isAbsolute(fromScenarioDirectoryToSkill) ||
      fromScenarioDirectoryToSkill === ".." ||
      fromScenarioDirectoryToSkill.startsWith("../"));
  return holdsSkill
    ? `scenario-directory-holds-skill: --scenarios ${
      resolve(scenarioDirectory)
    } is or contains the skill under test ${skillDirectory}`
    : undefined;
}
