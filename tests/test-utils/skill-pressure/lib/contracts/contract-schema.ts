import { z } from "zod";

const nonEmptyStringSchema = z.string().min(1).regex(/\S/u);
const identifierSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9][a-z0-9-]*$/u);
const relativePathSchema = z
  .string()
  .min(1)
  .max(512)
  .regex(
    /^(?!\/)(?!.*\\)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)(?!.*\/$).+$/u,
    "must be a non-traversing POSIX relative path",
  );
const immutableRevisionSchema = z.string().regex(/^[a-f0-9]{40}$/u, "must be a full lowercase commit SHA");
const deterministicFactSchema = z.union([
  z.literal("tool_observations"),
  z.templateLiteral(["path:", z.string().min(1)]),
  z.templateLiteral(["artifact:", identifierSchema]),
]);

function hasUniqueCheckIds(input: unknown): boolean {
  if (typeof input !== "object" || input === null || !("deterministic_checks" in input)) {
    return true;
  }
  const checks = (input as { readonly deterministic_checks?: unknown }).deterministic_checks;
  if (!Array.isArray(checks)) {
    return true;
  }
  const ids = checks.flatMap((check) =>
    typeof check === "object" && check !== null && "check_id" in check && typeof check.check_id === "string"
      ? [check.check_id]
      : [],
  );
  return new Set(ids).size === ids.length;
}

const scenarioShape = {
  schema_version: z.literal(2),
  scenario_id: identifierSchema,
  owner_plugin: identifierSchema,
  owner_skill: identifierSchema,
  skill_type: z.enum(["discipline", "technique", "pattern", "reference"]),
  prompt: nonEmptyStringSchema,
  hidden_rubric: nonEmptyStringSchema,
  comparison_intent: z.enum(["improvement", "non_regression"]),
  repetitions: z.number().int().min(5),
  risk: z.enum(["standard", "high"]),
  fixture_requirements: z.array(nonEmptyStringSchema),
  allowed_tools: z.array(nonEmptyStringSchema),
  allowed_write_paths: z.array(relativePathSchema),
  deterministic_checks: z.array(
    z.object({
      check_id: identifierSchema,
      fact: deterministicFactSchema,
        operator: z.enum(["equals", "contains", "excludes", "matches", "not_matches", "exists", "absent"]),
      expected: z.unknown().optional(),
    }).strict().superRefine((check, context) => {
      const requiresExpected = check.operator === "equals" ||
          check.operator === "contains" ||
          check.operator === "excludes" ||
        check.operator === "matches" ||
        check.operator === "not_matches";
      if (requiresExpected && check.expected === undefined) {
        context.addIssue({ code: "custom", path: ["expected"], message: `${check.operator} requires expected` });
      }
      if (!requiresExpected && check.expected !== undefined) {
        context.addIssue({ code: "custom", path: ["expected"], message: `${check.operator} does not accept expected` });
      }
    }),
  ),
  expected_artifacts: z.array(
    z.object({
      artifact_id: identifierSchema,
      path: relativePathSchema,
      file_type: z.enum(["file", "directory"]),
      content_contract: nonEmptyStringSchema,
    }).strict(),
  ),
} as const;

export const scenarioInputSchema = z
  .discriminatedUnion("baseline", [
    z.object({
      ...scenarioShape,
      baseline: z.literal("no_skill"),
    }).strict(),
    z.object({
      ...scenarioShape,
      baseline: z.literal("previous_revision"),
      baseline_revision: immutableRevisionSchema,
    }).strict(),
  ])
  .superRefine((scenario, context) => {
    if (!hasUniqueCheckIds(scenario)) {
      context.addIssue({
        code: "custom",
        path: ["deterministic_checks"],
        message: "duplicate check_id",
      });
    }
    const artifactIds = scenario.expected_artifacts.map((artifact) => artifact.artifact_id);
    const artifactPaths = scenario.expected_artifacts.map((artifact) => artifact.path);
    if (new Set(artifactIds).size !== artifactIds.length) {
      context.addIssue({ code: "custom", path: ["expected_artifacts"], message: "duplicate artifact_id" });
    }
    if (new Set(artifactPaths).size !== artifactPaths.length) {
      context.addIssue({ code: "custom", path: ["expected_artifacts"], message: "duplicate artifact path" });
    }
    const declaredArtifactPaths = new Set(artifactPaths);
    scenario.deterministic_checks.forEach((check, index) => {
      if (
        check.fact.startsWith("path:") &&
        declaredArtifactPaths.has(check.fact.slice("path:".length)) &&
        check.operator !== "exists" &&
        check.operator !== "absent"
      ) {
        context.addIssue({
          code: "custom",
          path: ["deterministic_checks", index, "fact"],
          message: "declared artifact content and kind checks must use artifact_id",
        });
      }
      if (
        (check.operator === "matches" || check.operator === "not_matches") &&
        (typeof check.expected !== "string" || !isBoundedSafePattern(check.expected))
      ) {
        context.addIssue({
          code: "custom",
          path: ["deterministic_checks", index, "expected"],
          message: "pattern must be valid, bounded, and free of unbounded quantifiers",
        });
      }
    });
  });

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

export { hasUniqueCheckIds };
