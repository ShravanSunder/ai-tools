import { dirname, join } from "node:path";
export type LintFinding = {
  path: string;
  line: number;
  rule: string;
  message: string;
};
const lineNumber = (text: string, index: number): number =>
  text.slice(0, index).split("\n").length;
const withoutFencedBlocks = (text: string): string =>
  text.replace(
    /```[\s\S]*?```|~~~[\s\S]*?~~~/g,
    (block) => block.replace(/[^\n]/g, " "),
  );
const resolveReference = (
  skillRoot: string,
  filePath: string,
  reference: string,
): string => {
  const fileDirectory = dirname(filePath);
  if (reference.startsWith("references/")) {
    const fromSkillRoot = join(skillRoot, reference);
    try {
      Deno.statSync(fromSkillRoot);
      return fromSkillRoot;
    } catch {
      return join(fileDirectory, reference);
    }
  }
  return join(fileDirectory, reference);
};
export async function lintSkills(
  skillSetDir: string,
  forbidden: readonly string[] = [],
): Promise<readonly LintFinding[]> {
  const findings: LintFinding[] = [];
  for await (const entry of Deno.readDir(skillSetDir)) {
    if (!entry.isDirectory) continue;
    const skillRoot = join(skillSetDir, entry.name);
    const filePath = join(skillRoot, "SKILL.md");
    let text: string;
    try {
      text = await Deno.readTextFile(filePath);
    } catch {
      continue;
    }
    const front = text.match(/^---\s*\n([\s\S]*?)\n---/);
    const description = front?.[1].match(/^description:\s*["']?(.+?)["']?\s*$/m)
      ?.[1]?.trim();
    if (!description) {
      findings.push({
        path: filePath,
        line: 1,
        rule: "frontmatter-description",
        message: "description is required",
      });
    } else {
      if (!description.startsWith("Use when")) {
        findings.push({
          path: filePath,
          line: 1,
          rule: "frontmatter-description",
          message: "description must start with Use when",
        });
      }
      if (description.length > 1024) {
        findings.push({
          path: filePath,
          line: 1,
          rule: "frontmatter-description",
          message: "description exceeds 1024 characters",
        });
      }
    }
    for (const word of forbidden) {
      const index = text.toLowerCase().indexOf(word.toLowerCase());
      if (index >= 0) {
        findings.push({
          path: filePath,
          line: lineNumber(text, index),
          rule: "forbidden-word",
          message: `contains forbidden word ${word}`,
        });
      }
    }
    const scanText = withoutFencedBlocks(text);
    for (const match of scanText.matchAll(/`([^`]*\.md)`/g)) {
      const relative = match[1].trim();
      if (
        !relative.startsWith("./") && !relative.startsWith("../") &&
        !relative.startsWith("references/")
      ) continue;
      if (relative.includes("*") || relative.includes("<")) continue;
      const target = resolveReference(skillRoot, filePath, relative);
      try {
        await Deno.stat(target);
      } catch {
        findings.push({
          path: filePath,
          line: lineNumber(text, match.index ?? 0),
          rule: "reference-exists",
          message: `missing reference ${relative}`,
        });
      }
    }
  }
  return findings;
}
