import { Ajv2020 } from "ajv/dist/2020.js";

import { hasUniqueCheckIds } from "./contract-schema.js";

export function createContractJsonSchemaValidator(): Ajv2020 {
  const validator = new Ajv2020({ allErrors: true, strict: true });
  validator.addKeyword({
    keyword: "xSkillPressureUniqueCheckIds",
    schemaType: "boolean",
    errors: false,
    validate: (enabled: boolean, input: unknown): boolean => !enabled || hasUniqueCheckIds(input),
  });
  return validator;
}
