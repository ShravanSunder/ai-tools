import { readFileSync } from "node:fs";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";
import type { JsonValue } from "vitest-evals";

export interface SkillPressureResult {
  readonly [key: string]: JsonValue;
  readonly scenario_id: string;
  readonly skill_under_test: string;
  readonly skill_invoked: boolean;
  readonly mode: "fast" | "integration" | "baseline";
  readonly read_only: boolean;
  readonly artifact_expected: boolean;
  readonly artifact_created: boolean;
  readonly decision: string;
  readonly coverage_evidence: string[];
  readonly shortcut_resisted: boolean;
  readonly rationalizations_rejected: string[];
  readonly open_questions: string[];
  readonly next_action: string;
}

export type SkillPressureResultValidation =
  | {
      readonly ok: true;
      readonly value: SkillPressureResult;
    }
  | {
      readonly ok: false;
      readonly errors: readonly string[];
    };

const schema = JSON.parse(
  readFileSync(
    new URL("../schemas/skill-pressure-result.schema.json", import.meta.url),
    "utf8",
  ),
) as object;

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile<SkillPressureResult>(schema);

export function validateSkillPressureResult(
  value: unknown,
): SkillPressureResultValidation {
  if (validate(value)) {
    return {
      ok: true,
      value: value as SkillPressureResult,
    };
  }

  return {
    ok: false,
    errors: (validate.errors ?? []).map((error: ErrorObject) => {
      const path = error.instancePath || "/";
      return `${path} ${error.message ?? "failed validation"}`;
    }),
  };
}
