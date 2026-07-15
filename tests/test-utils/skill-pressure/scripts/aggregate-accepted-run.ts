import path from "node:path";

import { aggregateParentAcceptedRun } from "../lib/authority/run-acceptance-transaction.js";

const argumentsByName = parseArguments(process.argv.slice(2));
const aggregateReceiptPath = argumentsByName.get("aggregate-receipt");
if (aggregateReceiptPath === undefined) throw new Error("--aggregate-receipt is required");

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const result = await aggregateParentAcceptedRun({
  repositoryRoot,
  aggregateReceiptPath: path.resolve(repositoryRoot, aggregateReceiptPath),
});
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

function parseArguments(argumentsList: readonly string[]): ReadonlyMap<string, string> {
  const parsed = new Map<string, string>();
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--") continue;
    if (argument === "--aggregate-receipt") {
      const value = argumentsList[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error("--aggregate-receipt requires a path");
      }
      parsed.set("aggregate-receipt", value);
      index += 1;
      continue;
    }
    throw new Error(`unknown aggregate argument: ${argument ?? ""}`);
  }
  return parsed;
}
