import path from "node:path";

import { acceptScenarioRunFromReceipt } from "../lib/authority/run-acceptance-transaction.js";

const argumentsList = process.argv.slice(2);
const receiptIndex = argumentsList.indexOf("--scenario-receipt");
const scenarioReceiptPath = receiptIndex >= 0 ? argumentsList[receiptIndex + 1] : undefined;
const parentAccepted = argumentsList.includes("--accept");

if (scenarioReceiptPath === undefined || scenarioReceiptPath.trim() === "") {
  throw new Error("usage: accept-scenario-run --scenario-receipt PATH --accept");
}

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const result = await acceptScenarioRunFromReceipt({
  repositoryRoot,
  scenarioReceiptPath,
  parentAccepted,
});
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
