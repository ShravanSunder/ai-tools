import { dirname, join } from "node:path";
export type LintFinding = {
  path: string;
  line: number;
  rule: string;
  message: string;
};
export type LintResult = {
  findings: readonly LintFinding[];
  jevCards: "not-run: no Jev engine";
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
const collectMarkdown = async (
  skillRoot: string,
): Promise<readonly string[]> => {
  const paths: string[] = [];
  const visit = async (directory: string): Promise<void> => {
    for await (const entry of Deno.readDir(directory)) {
      if (entry.name === "scenarios" && entry.isDirectory) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory) await visit(path);
      else if (entry.isFile && entry.name.endsWith(".md")) paths.push(path);
    }
  };
  await visit(skillRoot);
  return paths;
};
export async function lintSkills(
  skillSetDir: string,
  forbidden: readonly string[] = [],
): Promise<LintResult> {
  const findings: LintFinding[] = [];
  for await (const entry of Deno.readDir(skillSetDir)) {
    if (!entry.isDirectory) continue;
    const skillRoot = join(skillSetDir, entry.name);
    const skillPath = join(skillRoot, "SKILL.md");
    let skillText: string;
    try {
      skillText = await Deno.readTextFile(skillPath);
    } catch {
      continue;
    }
    const front = skillText.match(/^---\s*\n([\s\S]*?)\n---/);
    const fields = front?.[1] ?? "";
    const name = fields.match(/^name:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
    const description = fields.match(/^description:\s*["']?(.+?)["']?\s*$/m)
      ?.[1]?.trim();
    if (name !== entry.name) {
      findings.push({
        path: skillPath,
        line: 1,
        rule: "frontmatter-name",
        message: `name must equal directory ${entry.name}`,
      });
    }
    if (!description) {
      findings.push({
        path: skillPath,
        line: 1,
        rule: "frontmatter-description",
        message: "description is required",
      });
    } else {
      if (!description.startsWith("Use when")) {
        findings.push({
          path: skillPath,
          line: 1,
          rule: "frontmatter-description",
          message: "description must start with Use when",
        });
      }
      if (description.length > 1024) {
        findings.push({
          path: skillPath,
          line: 1,
          rule: "frontmatter-description",
          message: "description exceeds 1024 characters",
        });
      }
    }
    for (const filePath of await collectMarkdown(skillRoot)) {
      const text = await Deno.readTextFile(filePath);
      const scanText = withoutFencedBlocks(text);
      for (const word of forbidden) {
        for (
          const match of scanText.matchAll(
            new RegExp(
              `\\b${word.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")}\\b`,
              "gi",
            ),
          )
        ) {
          findings.push({
            path: filePath,
            line: lineNumber(text, match.index ?? 0),
            rule: "forbidden-word",
            message: `contains forbidden word ${word}`,
          });
        }
      }
      for (const match of scanText.matchAll(/`([^`]*\.md)`/g)) {
        const relative = match[1].trim();
        if (
          !relative.startsWith("./") && !relative.startsWith("../") &&
          !relative.startsWith("references/")
        ) continue;
        if (relative.includes("*") || relative.includes("<")) continue;
        try {
          await Deno.stat(resolveReference(skillRoot, filePath, relative));
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
  }
  return { findings, jevCards: "not-run: no Jev engine" };
}
