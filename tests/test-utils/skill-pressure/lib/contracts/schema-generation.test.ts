import { readFile, writeFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { generateContractJsonSchemas } from "./schema-generation.js";

const SHOULD_UPDATE_SCHEMAS =
  process.env.SKILL_PRESSURE_UPDATE_SCHEMAS === "1";

describe("generated contract JSON schemas", () => {
  for (const generatedSchema of generateContractJsonSchemas()) {
    it(`${generatedSchema.fileName} matches canonical Zod`, async () => {
      const schemaUrl = new URL(
        `../../schemas/${generatedSchema.fileName}`,
        import.meta.url,
      );
      let checkedContents: string;
      try {
        checkedContents = await readFile(schemaUrl, "utf8");
      } catch {
        checkedContents = "";
      }
      if (SHOULD_UPDATE_SCHEMAS && checkedContents !== generatedSchema.contents) {
        await writeFile(schemaUrl, generatedSchema.contents);
        checkedContents = generatedSchema.contents;
      }

      expect(checkedContents).toBe(generatedSchema.contents);
    });
  }
});
