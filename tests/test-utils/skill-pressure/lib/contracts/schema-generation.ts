import { z } from "zod";

import { scenarioInputSchema } from "./contract-schema.js";

export interface GeneratedContractJsonSchema {
  readonly fileName: string;
  readonly contents: string;
}

export function generateContractJsonSchemas(): readonly GeneratedContractJsonSchema[] {
  const generatedSchema = z.toJSONSchema(scenarioInputSchema, { target: "draft-2020-12" });
  return [{
    fileName: "skill-pressure-scenario.schema.json",
    contents: `${JSON.stringify({
      ...generatedSchema,
      $id: "https://ai-tools.local/schemas/skill-pressure/scenario/v1.json",
      title: "Skill Pressure Scenario v1",
      xSkillPressureUniqueCheckIds: true,
    }, null, 2)}\n`,
  }];
}
