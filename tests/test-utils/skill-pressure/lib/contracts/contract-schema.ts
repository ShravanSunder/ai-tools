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
const deterministicFactSchema = z.union([
  z.literal("visible_response"),
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

export const scenarioInputSchema = z
  .object({
    schema_version: z.literal(1),
    scenario_id: identifierSchema,
    owner_plugin: identifierSchema,
    owner_skill: identifierSchema,
    skill_type: z.enum(["discipline", "technique", "pattern", "reference"]),
    prompt: nonEmptyStringSchema,
    hidden_rubric: nonEmptyStringSchema,
    baseline: z.enum(["no_skill", "previous_revision"]),
    repetitions: z.number().int().min(5),
    risk: z.enum(["standard", "high"]),
    fixture_requirements: z.array(nonEmptyStringSchema),
    allowed_tools: z.array(nonEmptyStringSchema),
    allowed_write_paths: z.array(relativePathSchema),
    deterministic_checks: z.array(
      z.object({
        check_id: identifierSchema,
        fact: deterministicFactSchema,
        operator: z.enum(["equals", "contains", "matches", "not_matches", "exists", "absent"]),
        expected: z.unknown().optional(),
      }).strict().superRefine((check, context) => {
        const requiresExpected = check.operator === "equals" ||
          check.operator === "contains" ||
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
  })
  .strict()
  .superRefine((scenario, context) => {
    if (!hasUniqueCheckIds(scenario)) {
      context.addIssue({
        code: "custom",
        path: ["deterministic_checks"],
        message: "duplicate check_id",
      });
    }
  });

export { hasUniqueCheckIds };
