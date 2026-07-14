import path from "node:path";

import { promoteScenarioFromReceipt } from "../lib/authority/promotion-transaction.js";

const argumentsByName = parseArguments(process.argv.slice(2));
const scenarioReceiptPath = argumentsByName.get("scenario-receipt");
if (scenarioReceiptPath === undefined) throw new Error("--scenario-receipt is required");
if (!argumentsByName.has("accept")) throw new Error("--accept is required for parent-owned promotion");

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const result = await promoteScenarioFromReceipt({
  repositoryRoot,
  scenarioReceiptPath: path.resolve(repositoryRoot, scenarioReceiptPath),
  parentAccepted: true,
});
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

function parseArguments(argumentsList: readonly string[]): ReadonlyMap<string, string> {
  const parsed = new Map<string, string>();
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--") continue;
    if (argument === "--accept") {
      parsed.set("accept", "true");
      continue;
    }
    if (argument === "--scenario-receipt") {
      const value = argumentsList[index + 1];
      if (value === undefined || value.startsWith("--")) throw new Error("--scenario-receipt requires a path");
      parsed.set("scenario-receipt", value);
      index += 1;
      continue;
    }
    throw new Error(`unknown promotion argument: ${argument ?? ""}`);
  }
  return parsed;
}
