import { z } from "zod";

import { v3BehaviorContractInputSchema } from "./v3-behavior-contract.js";

export interface GeneratedContractJsonSchema {
  readonly fileName: string;
  readonly contents: string;
}

export function generateContractJsonSchemas(): readonly GeneratedContractJsonSchema[] {
  const generatedSchema = z.toJSONSchema(v3BehaviorContractInputSchema, { target: "draft-2020-12" });
  return [{
    fileName: "skill-pressure-scenario.schema.json",
    contents: `${JSON.stringify({
      ...generatedSchema,
      $id: "https://ai-tools.local/schemas/skill-pressure/scenario/v3.json",
      title: "Skill Pressure Scenario v3",
      xSkillPressureUniqueCheckIds: true,
    }, null, 2)}\n`,
  }];
}
