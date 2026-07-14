import { stringify } from "yaml";
import { z } from "zod";

import {
  parseScenarioMarkdown,
  type SkillPressureScenario,
} from "../../../../skills/lib/scenario-parser.js";
import { scenarioInputSchema } from "../contracts/contract-schema.js";
import type { ScenarioMigrationRow } from "./scenario-migration.js";

const referenceSkillNames = new Set([
  "manage-agents",
  "ops-observability-stack",
  "ops-security-review",
  "peekaboo",
]);
const patternSkillNames = new Set([
  "tui-presentation",
  "discuss-clarify-mental-models",
]);

type ScenarioInput = z.infer<typeof scenarioInputSchema>;

export interface ConvertLegacyScenarioProps {
  readonly row: ScenarioMigrationRow;
  readonly source: string;
}

export interface ConvertedLegacyScenario {
  readonly targetPath: string;
  readonly content: string;
  readonly skillType: ScenarioInput["skill_type"];
  readonly risk: ScenarioInput["risk"];
  readonly deterministicCheckCount: number;
  readonly expectedArtifactCount: number;
  readonly legacyArtifactDisposition: "not_expected" | "path_observed" | "rubric_only";
}

interface LegacyArtifactHint {
  readonly path: string;
  readonly fileType: "file" | "directory";
  readonly contentContract: string;
}

const concretePathPattern = /`([^`]+)`/gu;
const pathLikePattern = /^(?!\/)(?!.*\.\.?\/)(?:[a-zA-Z0-9_.-]+\/)*[a-zA-Z0-9_.-]+\/?$/u;

const forcedHighRiskScenarioIds = new Set([
  "implementation-pr-wrapup-unresolved-thread-before-merge",
  "implementation-pr-wrapup-untrusted-comment",
  "implementation-pr-wrapup-untrusted-comment-safety",
]);

const forcedStandardRiskScenarioIds = new Set([
  "implementation-pr-wrapup-baseline-comparison",
  "orchestrator-goal-closeout-audit",
  "spec-creation-swarm-durable-primary-spec",
]);

export function classifyLegacyScenarioRisk(
  scenario: Pick<SkillPressureScenario, "scenarioId" | "prompt" | "expectedCompliantBehavior" | "failureSignals">,
): ScenarioInput["risk"] {
  if (forcedHighRiskScenarioIds.has(scenario.scenarioId)) {
    return "high";
  }
  if (forcedStandardRiskScenarioIds.has(scenario.scenarioId)) {
    return "standard";
  }
  const evidence = [
    scenario.prompt,
    scenario.expectedCompliantBehavior,
    scenario.failureSignals,
  ].join("\n");

  const highRiskPatterns = [
    /\b(?:secret|secrets|credential|credentials|password|bearer|1password|api key|access token)\b/iu,
    /\buntrusted\s+(?:instruction|instructions|comment|comments)\b/iu,
    /\bsecurity[- ]?(?:scan|scanning|audit|auditing|review)\b/iu,
    /\b(?:destructive|delete|deleting|deleted|purge|purging|restart|restarting|force[- ]push|reset --hard)\b/iu,
    /\b(?:production|prod-like)\b/iu,
    /\b(?:release|publish|publishing|ship|shipping)\b.{0,80}\b(?:authority|authori[sz]|approval|approved|permission|ready)\b/isu,
    /\b(?:authority|authori[sz]|approval|approved|permission)\b.{0,80}\b(?:release|publish|ship|merge|push|mutation)\b/isu,
    /\bmerge\s+(?:authorization|authority|approval)\b/iu,
  ];

  return highRiskPatterns.some((pattern) => pattern.test(evidence)) ? "high" : "standard";
}

export function classifyLegacyScenarioSkillType(
  ownerSkill: string,
  scenario: Pick<SkillPressureScenario, "prompt" | "expectedCompliantBehavior" | "failureSignals">,
): ScenarioInput["skill_type"] {
  if (referenceSkillNames.has(ownerSkill)) {
    return "reference";
  }
  if (patternSkillNames.has(ownerSkill)) {
    return "pattern";
  }

  const evidence = [
    scenario.prompt,
    scenario.expectedCompliantBehavior,
    scenario.failureSignals,
  ].join("\n");
  if (/\b(?:this|the)\s+skill\s+is\s+a\s+technique\b/iu.test(evidence)) {
    return "technique";
  }
  return "discipline";
}

function normalizeNewlines(source: string): string {
  return source.replace(/\r\n?/gu, "\n");
}

function extractLegacyMarkdownBody(source: string, scenarioPath: string): string {
  const normalizedSource = normalizeNewlines(source);
  const lines = normalizedSource.split("\n");
  const firstSectionIndex = lines.findIndex((line) => line.startsWith("## "));
  if (firstSectionIndex < 1 || !lines[0]?.startsWith("#")) {
    throw new Error(`legacy scenario Markdown body is invalid at ${scenarioPath}`);
  }

  return [lines[0], "", ...lines.slice(firstSectionIndex)].join("\n");
}

function labeledHiddenRubric(scenario: SkillPressureScenario): string {
  return [
    "Expected Compliant Behavior:",
    scenario.expectedCompliantBehavior,
    "",
    "Failure Signals:",
    scenario.failureSignals,
  ].join("\n").trim();
}

function checkId(prefix: string, index: number): string {
  return `${prefix}-${index + 1}`;
}

function buildDeterministicChecks(scenario: SkillPressureScenario): ScenarioInput["deterministic_checks"] {
  return [
    ...scenario.expectDecisionRegexes.map((expected, index) => ({
      check_id: checkId("decision", index),
      fact: "visible_response" as const,
      operator: "matches" as const,
      expected,
    })),
    ...scenario.expectProofRegexes.map((expected, index) => ({
      check_id: checkId("proof", index),
      fact: "visible_response" as const,
      operator: "matches" as const,
      expected,
    })),
    ...scenario.expectForbiddenRegexes.map((expected, index) => ({
      check_id: checkId("forbidden", index),
      fact: "visible_response" as const,
      operator: "not_matches" as const,
      expected,
    })),
  ];
}

function inferExpectedArtifacts(scenario: SkillPressureScenario): readonly LegacyArtifactHint[] {
  if (!scenario.expectArtifact) {
    return [];
  }

  const evidence = [
    scenario.prompt,
    scenario.expectedCompliantBehavior,
    scenario.failureSignals,
  ].join("\n");
  const hints: LegacyArtifactHint[] = [];
  for (const line of evidence.split("\n")) {
    const typeMatch = /\b(file|directory)\b/iu.exec(line);
    const pathMatch = concretePathPattern.exec(line);
    concretePathPattern.lastIndex = 0;
    if (typeMatch?.[1] === undefined || pathMatch?.[1] === undefined) {
      continue;
    }
    const candidatePath = pathMatch[1].replace(/\/$/u, "");
    if (!pathLikePattern.test(candidatePath)) {
      continue;
    }
    const fileType = typeMatch[1].toLowerCase() === "directory" ? "directory" : "file";
    if (hints.some((hint) => hint.path === candidatePath)) {
      continue;
    }
    hints.push({
      path: candidatePath,
      fileType,
      contentContract: `The legacy scenario explicitly requires the ${fileType} at ${candidatePath}.`,
    });
  }
  return hints;
}

function buildExpectedArtifacts(scenario: SkillPressureScenario): ScenarioInput["expected_artifacts"] {
  if (!scenario.expectArtifact) {
    return [];
  }

  return inferExpectedArtifacts(scenario).map((hint, index) => ({
    artifact_id: `artifact-${index + 1}`,
    path: hint.path,
    file_type: hint.fileType,
    content_contract: hint.contentContract,
  }));
}

function legacyArtifactDisposition(
  scenario: SkillPressureScenario,
  expectedArtifacts: ScenarioInput["expected_artifacts"],
): ConvertedLegacyScenario["legacyArtifactDisposition"] {
  if (!scenario.expectArtifact) {
    return "not_expected";
  }
  return expectedArtifacts.length > 0 ? "path_observed" : "rubric_only";
}

function assertLegacyIdentity(
  scenario: SkillPressureScenario,
  row: ScenarioMigrationRow,
): void {
  if (scenario.scenarioId !== row.scenarioId) {
    throw new Error(`scenario_id mismatch for ${row.legacyPath}`);
  }
  if (scenario.skillUnderTest !== row.skillUnderTest) {
    throw new Error(`skill_under_test mismatch for ${row.legacyPath}`);
  }
}

function serializeScenarioContract(
  input: ScenarioInput,
  body: string,
): string {
  const validated = scenarioInputSchema.safeParse(input);
  if (!validated.success) {
    throw new Error(`generated scenario contract is invalid: ${validated.error.message}`);
  }
  const frontmatter = stringify(validated.data, { lineWidth: 0 }).trimEnd();
  return `---\n${frontmatter}\n---\n${body}`;
}

export function convertLegacyScenario(
  props: ConvertLegacyScenarioProps,
): ConvertedLegacyScenario {
  const scenario = parseScenarioMarkdown({
    filePath: props.row.legacyPath,
    markdown: props.source,
  });
  assertLegacyIdentity(scenario, props.row);

  const expectedArtifacts = buildExpectedArtifacts(scenario);
  const input = {
    schema_version: 1 as const,
    scenario_id: props.row.scenarioId,
    owner_plugin: props.row.targetPlugin,
    owner_skill: props.row.targetSkill,
    skill_type: classifyLegacyScenarioSkillType(props.row.targetSkill, scenario),
    prompt: scenario.prompt,
    hidden_rubric: labeledHiddenRubric(scenario),
    baseline: "no_skill" as const,
    repetitions: 5,
    risk: classifyLegacyScenarioRisk(scenario),
    fixture_requirements: [],
    allowed_tools: [],
    allowed_write_paths: [],
    deterministic_checks: buildDeterministicChecks(scenario),
    expected_artifacts: expectedArtifacts,
  } satisfies ScenarioInput;
  const content = serializeScenarioContract(
    input,
    extractLegacyMarkdownBody(props.source, props.row.legacyPath),
  );

  return {
    targetPath: props.row.targetPath,
    content,
    skillType: input.skill_type,
    risk: input.risk,
    deterministicCheckCount: input.deterministic_checks.length,
    expectedArtifactCount: input.expected_artifacts.length,
    legacyArtifactDisposition: legacyArtifactDisposition(scenario, expectedArtifacts),
  };
}
