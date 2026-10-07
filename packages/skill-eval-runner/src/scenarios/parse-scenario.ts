import { parse as parseYaml } from "npm:yaml@2.9.1";
import { type CheckTree, checkTreeSchema } from "../contracts/check-tree.ts";
import {
  type QuestionCard,
  questionCardSchema,
} from "../contracts/question-card.ts";
import {
  type Scenario,
  scenarioFrontmatterSchema,
  type ScenarioLoadResult,
} from "../contracts/scenario.ts";
import { resolveFileReference } from "./file-references.ts";
import type { SkillRef } from "../contracts/common.ts";

const forbiddenPromptPatterns = [
  /\bevals?\b/i,
  /\btests?\b|\btesting\b|\btested\b/i,
  /\bjudges?\b|\bjudging\b|\bjudged\b/i,
  /\bexperiments?\b/i,
  /\brubrics?\b/i,
  /\bscores?\b|\bscoring\b|\bscored\b/i,
  /\bcompar(?:e|es|ed|ing)\b|\bcomparisons?\b/i,
  /\bbenchmarks?\b/i,
  /\bcandidates?\b/i,
  /\barenas?\b/i,
];
const credentialPattern =
  /(credential|escrow|token|secret|password|keychain|auth|api.?key|private.?key)/i;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const parseFrontmatter = (
  text: string,
): { frontmatterText: string; body: string } | { error: string } => {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  return m
    ? { frontmatterText: m[1], body: m[2] }
    : { error: "missing YAML frontmatter" };
};
const parseSections = (
  body: string,
): { prompt: string; checksText: string; legacy: boolean } => {
  const pm = body.match(/(?:^|\n)## Prompt\s*\n([\s\S]*?)(?=\n## |$)/i);
  const cm = body.match(/(?:^|\n)## Checks\s*\n([\s\S]*?)(?=\n## |$)/i);
  return {
    prompt: (pm?.[1] ?? "").trim(),
    checksText: (cm?.[1] ?? "").trim(),
    legacy: /expect_[A-Za-z0-9_-]+\s*:/.test(body),
  };
};
const yamlBlock = (text: string): unknown => {
  const fenced = text.match(/```(?:yaml|yml)?\s*\n([\s\S]*?)\n```/i);
  return parseYaml(fenced?.[1] ?? text);
};
const inspectTree = (
  tree: CheckTree,
  cards: Map<string, QuestionCard>,
): string[] => {
  const errors: string[] = [];
  const terminals = new Set(["pass", "fail", "inconclusive"]);
  if (!tree.nodes[tree.root] && !terminals.has(tree.root)) {
    errors.push(`check ${tree.id}: root does not resolve`);
  }
  const seen = new Set<string>();
  const visiting = new Set<string>();
  const walk = (ref: string): boolean => {
    if (terminals.has(ref)) return true;
    const node = tree.nodes[ref];
    if (!node) {
      errors.push(`check ${tree.id}: unknown node ${ref}`);
      return false;
    }
    if (visiting.has(ref)) {
      errors.push(`check ${tree.id}: cyclic tree at ${ref}`);
      return false;
    }
    if (seen.has(ref)) return true;
    visiting.add(ref);
    let ok = false;
    if (node.kind === "code") {
      ok = [node.onTrue, node.onFalse, node.onUnavailable].map(walk).every(
        Boolean,
      );
    } else if (node.kind === "jev") {
      const card = cards.get(node.card);
      if (!card) errors.push(`check ${tree.id}: unknown card ${node.card}`);
      else if (card.type !== "yes_no") {
        errors.push(`check ${tree.id}: card ${node.card} is not yes_no`);
      }
      ok = Object.values(node.branches).map(walk).every(Boolean);
    } else if (node.kind === "jev-choice") {
      const card = cards.get(node.card);
      if (!card) errors.push(`check ${tree.id}: unknown card ${node.card}`);
      else if (card.type !== "choice") {
        errors.push(`check ${tree.id}: card ${node.card} is not choice`);
      }
      ok = [...Object.values(node.branches), node.uncertain].map(walk).every(
        Boolean,
      );
      if (
        card?.options && card.options.some((option) => !node.branches[option])
      ) errors.push(`check ${tree.id}: choice branch missing`);
    } else {
      if (node.tools.length > 0) {
        errors.push(
          `check ${tree.id}: judge tools are not supported in first pass`,
        );
      }
      ok = true;
    }
    visiting.delete(ref);
    seen.add(ref);
    return ok;
  };
  for (const nodeId of Object.keys(tree.nodes)) walk(nodeId);
  walk(tree.root);
  return errors;
};
export async function loadScenarios(
  skill: SkillRef,
  ids?: readonly string[],
): Promise<ScenarioLoadResult> {
  const errors: string[] = [];
  let skillDir = skill.skillPath;
  if (!skillDir.startsWith("/")) skillDir = `${skill.repoRoot}/${skillDir}`;
  const entries: string[] = [];
  try {
    for await (const e of Deno.readDir(`${skillDir}/scenarios`)) {
      if (e.isFile && e.name.endsWith(".scenario.md")) {
        entries.push(`${skillDir}/scenarios/${e.name}`);
      }
    }
  } catch {
    return {
      kind: "invalid",
      errors: [`scenario directory not found: ${skillDir}/scenarios`],
    };
  }
  const cards = new Map<string, QuestionCard>();
  try {
    const cardText = await Deno.readTextFile(
      `${skillDir}/scenarios/cards.yaml`,
    );
    const parsed = parseYaml(cardText);
    const cardValues = Array.isArray(parsed)
      ? parsed
      : (isRecord(parsed) && Array.isArray(parsed.cards) ? parsed.cards : []);
    for (const value of cardValues) {
      const card = questionCardSchema.safeParse(value);
      if (card.success) cards.set(card.data.id, card.data);
      else errors.push(`invalid question card: ${card.error.message}`);
    }
  } catch { /* cards are optional */ }
  const scenarios: Scenario[] = [];
  for (const path of entries) {
    const text = await Deno.readTextFile(path);
    const fm = parseFrontmatter(text);
    if ("error" in fm) {
      errors.push(`${path}: ${fm.error}`);
      continue;
    }
    const frontmatterRaw = parseYaml(fm.frontmatterText);
    const frontmatter = scenarioFrontmatterSchema.safeParse(frontmatterRaw);
    if (!frontmatter.success) {
      errors.push(`${path}: invalid frontmatter: ${frontmatter.error.message}`);
      continue;
    }
    if (ids && !ids.includes(frontmatter.data.scenarioId)) continue;
    const sections = parseSections(fm.body);
    if (/expect_[A-Za-z0-9_-]+\s*:/.test(text)) {
      errors.push(`${path}: legacy-form expect_* field`);
    }
    if (sections.legacy) errors.push(`${path}: legacy-form expect_* field`);
    if (
      forbiddenPromptPatterns.some((pattern) =>
        pattern.test(
          [sections.prompt, ...frontmatter.data.followUps].join("\n"),
        )
      )
    ) errors.push(`${path}: banned word in prompt`);
    const parsed = sections.checksText
      ? yamlBlock(sections.checksText)
      : undefined;
    const rawChecks = isRecord(parsed) && Array.isArray(parsed.checks)
      ? parsed.checks
      : [];
    const checks: CheckTree[] = [];
    for (const raw of rawChecks) {
      const parsedCheck = checkTreeSchema.safeParse(raw);
      if (!parsedCheck.success) {
        errors.push(`${path}: invalid check: ${parsedCheck.error.message}`);
        continue;
      }
      checks.push(parsedCheck.data);
      for (const node of Object.values(parsedCheck.data.nodes)) {
        if (node.kind === "code" && "loadedSkill" in node.step) {
          const namedSkill = node.step.loadedSkill ?? frontmatter.data.skill;
          const explicitTokens =
            [sections.prompt, ...frontmatter.data.followUps].join("\n").match(
              /\$[A-Za-z0-9_-]+(?::[A-Za-z0-9_-]+)?/g,
            ) ?? [];
          if (
            explicitTokens.some((token) =>
              token === `$${namedSkill}` || token.endsWith(`:${namedSkill}`)
            )
          ) {
            errors.push(
              `${path}: loadedSkill ${namedSkill} is explicitly named and injected without a read`,
            );
          }
        }
      }
      errors.push(...inspectTree(parsedCheck.data, cards));
    }
    if (!sections.prompt) errors.push(`${path}: missing Prompt`);
    for (const fixture of frontmatter.data.fixtures) {
      const scenarioDirectory = path.slice(0, path.lastIndexOf("/"));
      const sourcePath = `${scenarioDirectory}/${fixture.source}`;
      if (
        fixture.source.startsWith("/") ||
        fixture.source.split("/").includes("..")
      ) errors.push(`${path}: fixture source escapes scenarios`);
      if (
        fixture.target.startsWith("/") ||
        fixture.target.split("/").includes("..")
      ) {
        errors.push(
          `${path}: fixture target escapes snapshot: ${fixture.target}`,
        );
      }
      try {
        await Deno.stat(sourcePath);
      } catch {
        errors.push(`${path}: fixture source missing: ${fixture.source}`);
      }
      try {
        await Deno.stat(`${skill.repoRoot}/${fixture.target}`);
        errors.push(
          `${path}: fixture target already exists: ${fixture.target}`,
        );
      } catch { /* expected */ }
    }
    const scenarioCandidate = {
      frontmatter: frontmatter.data,
      prompt: sections.prompt,
      checks,
      cards: [...cards.values()],
      path,
    };
    const scenario: Scenario = scenarioCandidate;
    const references: string[] = cards.size
      ? [...cards.values()].flatMap((card) =>
        card.evidence.flatMap((evidence) =>
          typeof evidence === "object" ? [evidence.file] : []
        )
      )
      : [];
    for (const check of checks) {
      for (const node of Object.values(check.nodes)) {
        if (node.kind === "judge") {
          references.push(
            ...node.evidence.flatMap((evidence) =>
              typeof evidence === "object" ? [evidence.file] : []
            ),
          );
        }
        if (node.kind === "code" && "readFile" in node.step) {
          references.push(node.step.readFile);
        }
      }
    }
    for (const reference of references) {
      if (credentialPattern.test(reference)) {
        errors.push(`${path}: credential-pattern evidence file ${reference}`);
        continue;
      }
      try {
        await Deno.stat(resolveFileReference(skill, reference));
      } catch {
        errors.push(`${path}: missing or invalid file reference ${reference}`);
      }
    }
    scenarios.push(scenario);
  }
  if (
    ids &&
    ids.some((id) =>
      !scenarios.some((scenario) => scenario.frontmatter.scenarioId === id)
    )
  ) errors.push("unknown scenario id");
  if (
    new Set(scenarios.map((scenario) => scenario.frontmatter.scenarioId))
      .size !== scenarios.length
  ) errors.push("duplicate scenario id");
  return errors.length
    ? { kind: "invalid", errors }
    : { kind: "loaded", scenarios };
}
