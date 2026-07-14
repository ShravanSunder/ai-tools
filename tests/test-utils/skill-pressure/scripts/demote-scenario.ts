import path from "node:path";

import { demoteScenarioFromReceipt, type DemotionReason } from "../lib/authority/demotion-transaction.js";

const argumentsByName = parseArguments(process.argv.slice(2));
const scenarioReceiptPath = argumentsByName.get("scenario-receipt");
const aggregateReceiptPath = argumentsByName.get("aggregate-receipt");
const reason = argumentsByName.get("reason");
if (scenarioReceiptPath === undefined) throw new Error("--scenario-receipt is required");
if (aggregateReceiptPath === undefined) throw new Error("--aggregate-receipt is required");
if (reason === undefined) throw new Error("--reason is required");
if (!argumentsByName.has("accept")) throw new Error("--accept is required for parent-owned demotion");

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const result = await demoteScenarioFromReceipt({
  repositoryRoot,
  scenarioReceiptPath: path.resolve(repositoryRoot, scenarioReceiptPath),
  aggregateReceiptPath: path.resolve(repositoryRoot, aggregateReceiptPath),
  reason: reason as DemotionReason,
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
    if (
      argument === "--scenario-receipt" ||
      argument === "--aggregate-receipt" ||
      argument === "--reason"
    ) {
      const value = argumentsList[index + 1];
      if (value === undefined || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      parsed.set(argument.slice(2), value);
      index += 1;
      continue;
    }
    throw new Error(`unknown demotion argument: ${argument ?? ""}`);
  }
  return parsed;
}
