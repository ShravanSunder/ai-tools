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
// directory holding the skill set (the plugin for `plugins/<plugin>/skills/<skill>`, `.agents` for
// `.agents/skills/<skill>`), so two skill sets with a skill of the same name keep separate
// scenario directories. When that directory is not strictly inside the repository (a skill set at
// `<repo>/skills/` or at the repository root), its name would be the checkout's folder or
// something outside the repository and change per clone or worktree, so the owner segment is
// dropped: `<repo>/tests/skills/pressure-scenarios/<skill>/`.
export const defaultScenarioRoot = join(
  "tests",
  "skills",
  "pressure-scenarios",
);
export const resolveSkillDirectory = (skill: SkillRef): string =>
  resolve(skill.repoRoot, skill.skillPath);
const realOrResolvedPath = (path: string): Promise<string> =>
  Deno.realPath(path).catch(() => resolve(path));
const isStrictlyInside = (parent: string, candidate: string): boolean => {
  const fromParent = relative(parent, candidate);
  return fromParent !== "" && !isAbsolute(fromParent) &&
    fromParent !== ".." && !fromParent.startsWith("../");
};
// `override` is the CLI's `--scenarios <dir>`: relative to the repository root, like `--skill`.
// Paths compare after symlinks resolve; the result is built on the repository root as given.
export async function resolveScenarioDirectory(
  skill: SkillRef,
  override?: string,
): Promise<string> {
  if (override) return resolve(skill.repoRoot, override);
  const skillDirectory = resolveSkillDirectory(skill);
  const skillSetHolder = dirname(
    dirname(await realOrResolvedPath(skillDirectory)),
  );
  const ownerSegment = isStrictlyInside(
      await realOrResolvedPath(skill.repoRoot),
      skillSetHolder,
    )
    ? [basename(skillSetHolder)]
    : [];
  return resolve(
    skill.repoRoot,
    defaultScenarioRoot,
    ...ownerSegment,
    basename(skillDirectory),
  );
}
// Every snapshot drops the scenario directory in use, so a `--scenarios` directory that is or
// holds the skill under test (the repository root, the skill set, or the skill) would strip that
// skill too, and one at the repository root would strip the whole snapshot even when the skill set
// lives outside it. Both are invalid input; paths compare after symlinks resolve, and print as given.
export async function scenarioDirectoryOverrideError(
  skill: SkillRef,
  scenarioDirectory: string,
): Promise<string | undefined> {
  const skillDirectory = resolveSkillDirectory(skill);
  const realScenarioDirectory = await realOrResolvedPath(scenarioDirectory);
  const realSkillDirectory = await realOrResolvedPath(skillDirectory);
  if (
    realScenarioDirectory === realSkillDirectory ||
    isStrictlyInside(realScenarioDirectory, realSkillDirectory)
  ) {
    return `scenario-directory-holds-skill: --scenarios ${
      resolve(scenarioDirectory)
    } is or contains the skill under test ${skillDirectory}`;
  }
  if (realScenarioDirectory === await realOrResolvedPath(skill.repoRoot)) {
    return `scenario-directory-is-repository-root: --scenarios ${
      resolve(scenarioDirectory)
    } is the repository root ${resolve(skill.repoRoot)}`;
  }
  return undefined;
}
