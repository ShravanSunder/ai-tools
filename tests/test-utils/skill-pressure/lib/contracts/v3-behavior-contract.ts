import { createHash } from "node:crypto";

import { z } from "zod";

import type {
  ComparisonIntent,
  DeterministicCheck,
  ExpectedArtifact,
  ScenarioBaseline,
  ScenarioRisk,
  SkillOwner,
  SkillType,
} from "./contract-types.js";
import { isPathAllowedByWritePolicy } from "./write-path-policy.js";

const nonEmptyStringSchema = z.string().min(1).regex(/\S/u);
const identifierSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9][a-z0-9-]*$/u);
const digestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/u);
const relativePathSchema = z
  .string()
  .min(1)
  .max(512)
  .regex(
    /^(?!\/)(?!.*\\)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)(?!.*\/$).+$/u,
    "must be a non-traversing POSIX relative path",
  );
const immutableRevisionSchema = z.string().regex(/^[a-f0-9]{40}$/u, "must be a full lowercase commit SHA");
const effectSurfaceSchema = z.enum(["response", "artifacts", "tools"]);
const evidenceSurfaceSchema = z.union([
  z.literal("response"),
  z.literal("tools"),
  z.templateLiteral(["artifact:", identifierSchema]),
]);
const deterministicFactSchema = z.union([
  z.literal("tool_observations"),
  z.templateLiteral(["path:", relativePathSchema]),
  z.templateLiteral(["artifact:", identifierSchema]),
]);
const deterministicCheckSchema = z.object({
  check_id: identifierSchema,
  fact: deterministicFactSchema,
  operator: z.enum(["equals", "contains", "excludes", "matches", "not_matches", "exists", "absent"]),
  expected: z.unknown().optional(),
}).strict().superRefine((check, context) => {
  const requiresExpected = ["equals", "contains", "excludes", "matches", "not_matches"].includes(check.operator);
  if (requiresExpected && check.expected === undefined) {
    context.addIssue({ code: "custom", path: ["expected"], message: `${check.operator} requires expected` });
  }
  if (!requiresExpected && check.expected !== undefined) {
    context.addIssue({ code: "custom", path: ["expected"], message: `${check.operator} does not accept expected` });
  }
  if (
    (Object.hasOwn(check, "expected") && check.expected === undefined) ||
    (check.expected !== undefined && !isJsonValue(check.expected))
  ) {
    context.addIssue({ code: "custom", path: ["expected"], message: "expected must be a finite JSON value" });
  }
  if (
    (check.operator === "matches" || check.operator === "not_matches") &&
    (typeof check.expected !== "string" || !isBoundedSafePattern(check.expected))
  ) {
    context.addIssue({ code: "custom", path: ["expected"], message: "pattern must be valid and bounded" });
  }
});
const semanticAssertionSchema = z.object({
  assertion_id: identifierSchema,
  criterion: nonEmptyStringSchema,
  evidence_surface: evidenceSurfaceSchema,
}).strict();
const expectedArtifactSchema = z.object({
  artifact_id: identifierSchema,
  path: relativePathSchema,
  file_type: z.enum(["file", "directory"]),
  content_contract: nonEmptyStringSchema,
}).strict();

const v3ScenarioShape = {
  schema_version: z.literal(3),
  scenario_id: identifierSchema,
  owner_plugin: identifierSchema,
  owner_skill: identifierSchema,
  skill_type: z.enum(["discipline", "technique", "pattern", "reference"]),
  effect_surfaces: z.array(effectSurfaceSchema).min(1),
  prompt: nonEmptyStringSchema,
  semantic_assertions: z.array(semanticAssertionSchema).min(1),
  behavior_requirement_ids: z.array(identifierSchema).min(1),
  comparison_intent: z.enum(["improvement", "non_regression"]),
  repetitions: z.literal(3),
  risk: z.enum(["standard", "high"]),
  fixture_requirements: z.array(nonEmptyStringSchema),
  allowed_tools: z.array(nonEmptyStringSchema),
  allowed_write_paths: z.array(relativePathSchema),
  required_tool_observations: z.array(nonEmptyStringSchema),
  forbidden_tool_observations: z.array(nonEmptyStringSchema),
  deterministic_checks: z.array(deterministicCheckSchema),
  expected_artifacts: z.array(expectedArtifactSchema),
} as const;

export const v3BehaviorContractInputSchema = z
  .discriminatedUnion("baseline", [
    z.object({ ...v3ScenarioShape, baseline: z.literal("no_skill") }).strict(),
    z.object({
      ...v3ScenarioShape,
      baseline: z.literal("previous_revision"),
      baseline_revision: immutableRevisionSchema,
    }).strict(),
  ])
  .superRefine(validateV3ContractConsistency);

export type V3BehaviorContractInput = z.input<typeof v3BehaviorContractInputSchema>;
export type EffectSurface = z.infer<typeof effectSurfaceSchema>;
export type SemanticEvidenceSurface = z.infer<typeof evidenceSurfaceSchema>;

export interface SemanticAssertion {
  readonly assertionId: string;
  readonly criterion: string;
  readonly evidenceSurface: SemanticEvidenceSurface;
}

export interface V3BehaviorContract extends SkillOwner {
  readonly schemaVersion: 3;
  readonly scenarioId: string;
  readonly skillType: SkillType;
  readonly effectSurfaces: readonly EffectSurface[];
  readonly prompt: string;
  readonly semanticAssertions: readonly SemanticAssertion[];
  readonly behaviorRequirementIds: readonly string[];
  readonly baseline: ScenarioBaseline;
  readonly baselineRevision: string | null;
  readonly comparisonIntent: ComparisonIntent;
  readonly repetitions: number;
  readonly risk: ScenarioRisk;
  readonly fixtureRequirements: readonly string[];
  readonly allowedTools: readonly string[];
  readonly allowedWritePaths: readonly string[];
  readonly requiredToolObservations: readonly string[];
  readonly forbiddenToolObservations: readonly string[];
  readonly deterministicChecks: readonly DeterministicCheck[];
  readonly expectedArtifacts: readonly ExpectedArtifact[];
  readonly behaviorContractDigest: z.infer<typeof digestSchema>;
}

export function parseV3BehaviorContract(input: unknown): V3BehaviorContract {
  const parsed = v3BehaviorContractInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`v3 behavior contract is invalid: ${parsed.error.message}`);
  }
  const behaviorContractDigest = digestCanonicalValue(parsed.data);
  return {
    schemaVersion: 3,
    scenarioId: parsed.data.scenario_id,
    plugin: parsed.data.owner_plugin,
    skill: parsed.data.owner_skill,
    skillType: parsed.data.skill_type,
    effectSurfaces: parsed.data.effect_surfaces,
    prompt: parsed.data.prompt,
    semanticAssertions: parsed.data.semantic_assertions.map((assertion) => ({
      assertionId: assertion.assertion_id,
      criterion: assertion.criterion,
      evidenceSurface: assertion.evidence_surface,
    })),
    behaviorRequirementIds: parsed.data.behavior_requirement_ids,
    baseline: parsed.data.baseline,
    baselineRevision: parsed.data.baseline === "previous_revision" ? parsed.data.baseline_revision : null,
    comparisonIntent: parsed.data.comparison_intent,
    repetitions: parsed.data.repetitions,
    risk: parsed.data.risk,
    fixtureRequirements: parsed.data.fixture_requirements,
    allowedTools: parsed.data.allowed_tools,
    allowedWritePaths: parsed.data.allowed_write_paths,
    requiredToolObservations: parsed.data.required_tool_observations,
    forbiddenToolObservations: parsed.data.forbidden_tool_observations,
    deterministicChecks: parsed.data.deterministic_checks.map((check) => ({
      checkId: check.check_id,
      fact: check.fact,
      operator: check.operator,
      ...(check.expected === undefined ? {} : { expected: check.expected }),
    })),
    expectedArtifacts: parsed.data.expected_artifacts.map((artifact) => ({
      artifactId: artifact.artifact_id,
      path: artifact.path,
      fileType: artifact.file_type,
      contentContract: artifact.content_contract,
    })),
    behaviorContractDigest,
  };
}

export function hasUniqueDeterministicCheckIds(input: unknown): boolean {
  if (typeof input !== "object" || input === null || !("deterministic_checks" in input)) return true;
  const checks = (input as { readonly deterministic_checks?: unknown }).deterministic_checks;
  if (!Array.isArray(checks)) return true;
  const checkIds = checks.flatMap((check) =>
    typeof check === "object" && check !== null && "check_id" in check && typeof check.check_id === "string"
      ? [check.check_id]
      : [],
  );
  return new Set(checkIds).size === checkIds.length;
}

function validateV3ContractConsistency(
  contract: z.infer<z.ZodDiscriminatedUnion<typeof v3BehaviorContractInputSchema.def.options>>,
  context: z.RefinementCtx,
): void {
  requireUnique(contract.effect_surfaces, "effect_surface", ["effect_surfaces"], context);
  requireUnique(
    contract.semantic_assertions.map((assertion) => assertion.assertion_id),
    "assertion_id",
    ["semantic_assertions"],
    context,
  );
  requireUnique(contract.behavior_requirement_ids, "behavior_requirement_id", ["behavior_requirement_ids"], context);
  requireUnique(contract.deterministic_checks.map((check) => check.check_id), "check_id", ["deterministic_checks"], context);
  requireUnique(contract.expected_artifacts.map((artifact) => artifact.artifact_id), "artifact_id", ["expected_artifacts"], context);
  requireUnique(contract.expected_artifacts.map((artifact) => artifact.path), "artifact path", ["expected_artifacts"], context);
  requireUnique(contract.allowed_tools, "allowed tool", ["allowed_tools"], context);
  requireUnique(contract.allowed_write_paths, "allowed write path", ["allowed_write_paths"], context);
  requireUnique(contract.required_tool_observations, "required tool observation", ["required_tool_observations"], context);
  requireUnique(contract.forbidden_tool_observations, "forbidden tool observation", ["forbidden_tool_observations"], context);

  if (contract.comparison_intent === "non_regression" && contract.baseline !== "previous_revision") {
    addIssue(context, ["comparison_intent"], "non_regression requires baseline previous_revision with an immutable revision");
  }

  const effectSurfaces = new Set(contract.effect_surfaces);
  const artifactsById = new Map(contract.expected_artifacts.map((artifact) => [artifact.artifact_id, artifact]));
  for (const [index, assertion] of contract.semantic_assertions.entries()) {
    if (assertion.evidence_surface === "response" && !effectSurfaces.has("response")) {
      addIssue(context, ["semantic_assertions", index, "evidence_surface"], "response evidence_surface requires the response effect surface");
    }
    if (assertion.evidence_surface === "tools" && !effectSurfaces.has("tools")) {
      addIssue(context, ["semantic_assertions", index, "evidence_surface"], "tools evidence_surface requires the tools effect surface");
    }
    if (assertion.evidence_surface.startsWith("artifact:")) {
      const artifactId = assertion.evidence_surface.slice("artifact:".length);
      if (!effectSurfaces.has("artifacts") || !artifactsById.has(artifactId)) {
        addIssue(context, ["semantic_assertions", index, "evidence_surface"], "artifact evidence_surface must resolve to a declared artifact effect");
      }
    }
  }

  validateArtifactEffects(contract, effectSurfaces, artifactsById, context);
  validateToolEffects(contract, effectSurfaces, context);
}

interface V3ConsistencyInput {
  readonly allowed_tools: readonly string[];
  readonly allowed_write_paths: readonly string[];
  readonly deterministic_checks: readonly z.infer<typeof deterministicCheckSchema>[];
  readonly expected_artifacts: readonly z.infer<typeof expectedArtifactSchema>[];
  readonly forbidden_tool_observations: readonly string[];
  readonly required_tool_observations: readonly string[];
}

function validateArtifactEffects(
  contract: V3ConsistencyInput,
  effectSurfaces: ReadonlySet<EffectSurface>,
  artifactsById: ReadonlyMap<string, z.infer<typeof expectedArtifactSchema>>,
  context: z.RefinementCtx,
): void {
  if (effectSurfaces.has("artifacts")) {
    if (contract.expected_artifacts.length === 0) {
      addIssue(context, ["expected_artifacts"], "artifacts effect surface requires expected_artifacts");
    }
    for (const [index, artifact] of contract.expected_artifacts.entries()) {
      if (!contract.allowed_write_paths.some((allowedPath) => isPathAllowedByWritePolicy(allowedPath, artifact.path))) {
        addIssue(context, ["allowed_write_paths"], `allowed_write_paths must contain expected artifact ${artifact.path}`);
      }
      if (!contract.deterministic_checks.some((check) => check.fact === `artifact:${artifact.artifact_id}`)) {
        addIssue(context, ["deterministic_checks", index], `objective artifact ${artifact.artifact_id} requires a structured deterministic check`);
      }
    }
    for (const [index, check] of contract.deterministic_checks.entries()) {
      if (check.fact.startsWith("artifact:")) {
        const artifactId = check.fact.slice("artifact:".length);
        if (!artifactsById.has(artifactId)) {
          addIssue(context, ["deterministic_checks", index, "fact"], `deterministic artifact fact must resolve to expected_artifacts: ${artifactId}`);
        }
      }
      if (check.fact.startsWith("path:")) {
        const checkedPath = check.fact.slice("path:".length);
        if (!contract.allowed_write_paths.some((allowedPath) => isPathAllowedByWritePolicy(allowedPath, checkedPath))) {
          addIssue(context, ["deterministic_checks", index, "fact"], `deterministic path fact must fit allowed_write_paths: ${checkedPath}`);
        }
        const declaredArtifact = contract.expected_artifacts.find((artifact) => artifact.path === checkedPath);
        if (declaredArtifact !== undefined && check.operator !== "exists" && check.operator !== "absent") {
          addIssue(context, ["deterministic_checks", index, "fact"], "declared artifact content and kind checks must use artifact_id");
        }
      }
    }
    return;
  }
  const hasArtifactFacts = contract.deterministic_checks.some((check) => check.fact.startsWith("artifact:") || check.fact.startsWith("path:"));
  if (contract.expected_artifacts.length > 0 || contract.allowed_write_paths.length > 0 || hasArtifactFacts || artifactsById.size > 0) {
    addIssue(context, ["effect_surfaces"], "artifacts effect surface is absent but artifact or repository effects are declared");
  }
}

function validateToolEffects(
  contract: V3ConsistencyInput,
  effectSurfaces: ReadonlySet<EffectSurface>,
  context: z.RefinementCtx,
): void {
  const toolObservations = [...contract.required_tool_observations, ...contract.forbidden_tool_observations];
  const hasToolFacts = contract.deterministic_checks.some((check) => check.fact === "tool_observations");
  if (effectSurfaces.has("tools")) {
    if (contract.allowed_tools.length === 0) {
      addIssue(context, ["allowed_tools"], "tools effect surface requires allowed_tools");
    }
    if (toolObservations.length === 0 && !hasToolFacts) {
      addIssue(context, ["required_tool_observations"], "tools effect surface requires required or forbidden tool observations");
    }
    for (const requiredTool of contract.required_tool_observations) {
      if (!contract.allowed_tools.includes(requiredTool)) {
        addIssue(context, ["required_tool_observations"], `required_tool_observations must be granted by allowed_tools: ${requiredTool}`);
      }
    }
    const forbidden = new Set(contract.forbidden_tool_observations);
    if (contract.required_tool_observations.some((tool) => forbidden.has(tool))) {
      addIssue(context, ["forbidden_tool_observations"], "the same tool cannot be required and forbidden");
    }
    return;
  }
  if (toolObservations.length > 0 || hasToolFacts) {
    addIssue(context, ["effect_surfaces"], "tools effect surface is absent but tool permissions or observations are declared");
  }
}

function requireUnique(
  values: readonly string[],
  label: string,
  path: PropertyKey[],
  context: z.RefinementCtx,
): void {
  if (new Set(values).size !== values.length) {
    addIssue(context, path, `duplicate ${label}`);
  }
}

function isBoundedSafePattern(pattern: string): boolean {
  if (pattern.length === 0 || pattern.length > 512) return false;
  if (/(^|[^\\])[+*]/u.test(pattern) || /\\[1-9]/u.test(pattern) || /\(\?<([=!])/u.test(pattern)) return false;
  for (const match of pattern.matchAll(/\{(\d+)(?:,(\d*))?\}/gu)) {
    const upperBound = match[2] === undefined ? Number(match[1]) : Number(match[2]);
    if (!Number.isFinite(upperBound) || upperBound > 1_000) return false;
  }
  try {
    const inlineFlags = /^\(\?([is]+)\)/u.exec(pattern);
    const flags = new Set(["u", ...(inlineFlags?.[1] ?? "")]);
    new RegExp(inlineFlags === null ? pattern : pattern.slice(inlineFlags[0].length), [...flags].join(""));
    return true;
  } catch {
    return false;
  }
}

function isJsonValue(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length) return false;
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.hasOwn(value, index) || !isJsonValue(value[index])) return false;
    }
    return true;
  }
  if (typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value).every(isJsonValue);
}

function addIssue(context: z.RefinementCtx, path: PropertyKey[], message: string): void {
  context.addIssue({ code: "custom", path, message });
}

function digestCanonicalValue(value: unknown): z.infer<typeof digestSchema> {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex")}`;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entryValue]) => [key, canonicalize(entryValue)]),
  );
}
