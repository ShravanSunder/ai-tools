import { Ajv2020 } from "ajv/dist/2020.js";

import { hasUniqueDeterministicCheckIds } from "./v3-behavior-contract.js";

export function createContractJsonSchemaValidator(): Ajv2020 {
  const validator = new Ajv2020({ allErrors: true, strict: true });
  validator.addKeyword({
    keyword: "xSkillPressureUniqueCheckIds",
    schemaType: "boolean",
    errors: false,
    validate: (enabled: boolean, input: unknown): boolean => !enabled || hasUniqueDeterministicCheckIds(input),
  });
  return validator;
}
