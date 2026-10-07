import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import type { SkillRef } from "../contracts/common.ts";
export function resolveFileReference(
  skill: SkillRef,
  reference: string,
): string {
  const skillDirectory = resolve(skill.repoRoot, skill.skillPath);
  const sibling = reference.match(/^skill\(([^)]+)\):(.*)$/);
  let base: string, suffix: string;
  if (reference.startsWith("repo:")) {
    base = skill.repoRoot;
    suffix = reference.slice(5);
  } else if (reference.startsWith("skill:")) {
    base = skillDirectory;
    suffix = reference.slice(6);
  } else if (sibling) {
    base = join(dirname(skillDirectory), sibling[1]);
    suffix = sibling[2];
  } else throw new Error(`unsupported file reference ${reference}`);
  const resolved = resolve(base, suffix);
  const within = relative(base, resolved);
  if (isAbsolute(suffix) || within.startsWith("../") || within === "..") {
    throw new Error(`file reference escapes its root ${reference}`);
  }
  return resolved;
}
