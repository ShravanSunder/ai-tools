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
const lineAt = (text: string, index: number): string => {
  const start = text.lastIndexOf("\n", index - 1) + 1;
  const end = text.indexOf("\n", index);
  return text.slice(start, end === -1 ? text.length : end);
};
const columnAt = (text: string, index: number): number =>
  index - (text.lastIndexOf("\n", index - 1) + 1);
const crossSkillOwner = (
  line: string,
  referenceStart: number,
  skillNames: ReadonlySet<string>,
): string | undefined => {
  const prefix = line.slice(0, referenceStart).replace(/`\s*$/, "").trimEnd();
  let owner: string | undefined;
  for (const match of prefix.matchAll(/`([^`]+)`(?:'s|’s)/g)) {
    if (skillNames.has(match[1])) owner = match[1];
  }
  return owner;
};
export async function lintSkills(
  skillSetDir: string,
  forbidden: readonly string[] = [],
): Promise<LintResult> {
  const findings: LintFinding[] = [];
  const skillNames = new Set<string>();
  for await (const entry of Deno.readDir(skillSetDir)) {
    if (entry.isDirectory) {
      try {
        await Deno.stat(join(skillSetDir, entry.name, "SKILL.md"));
        skillNames.add(entry.name);
      } catch { /* not a skill */ }
    }
  }
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
        let target = resolveReference(skillRoot, filePath, relative);
        try {
          await Deno.stat(target);
        } catch {
          const line = lineAt(text, match.index ?? 0);
          const owner = crossSkillOwner(
            line,
            columnAt(text, match.index ?? 0),
            skillNames,
          );
          if (owner) {
            target = resolveReference(
              join(skillSetDir, owner),
              filePath,
              relative,
            );
          }
        }
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
  }
  return { findings, jevCards: "not-run: no Jev engine" };
}
