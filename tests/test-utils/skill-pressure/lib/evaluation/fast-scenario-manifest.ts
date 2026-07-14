import { readFile } from "node:fs/promises";

import { parseDocument } from "yaml";
import { z } from "zod";

const fastScenarioManifestSchema = z.object({
  schema_version: z.literal(1),
  scenario_ids: z.array(z.string().min(1)).min(1),
}).strict();

export async function loadFastScenarioManifest(manifestUrl: URL): Promise<readonly string[]> {
  const source = await readFile(manifestUrl, "utf8");
  const document = parseDocument(source, { prettyErrors: false, strict: true, uniqueKeys: true });
  if (document.errors.length > 0) {
    throw new Error(`invalid fast scenario manifest: ${document.errors.map((error) => error.message).join("; ")}`);
  }
  const parsed = fastScenarioManifestSchema.safeParse(document.toJS({ maxAliasCount: 0 }));
  if (!parsed.success) {
    throw new Error(`invalid fast scenario manifest: ${parsed.error.message}`);
  }
  if (new Set(parsed.data.scenario_ids).size !== parsed.data.scenario_ids.length) {
    throw new Error("invalid fast scenario manifest: duplicate scenario_id");
  }
  return [...parsed.data.scenario_ids];
}
