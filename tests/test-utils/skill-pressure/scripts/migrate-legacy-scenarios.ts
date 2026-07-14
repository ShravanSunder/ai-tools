import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { resolve } from "node:path";

import {
  convertLegacyScenario,
  type ConvertedLegacyScenario,
} from "../lib/migration/legacy-scenario-converter.js";
import {
  loadScenarioMigrationInventory,
} from "../lib/migration/scenario-migration.js";

const { values } = parseArgs({
  options: {
    check: { type: "boolean", default: false },
    write: { type: "boolean", default: false },
    "repository-root": { type: "string" },
  },
  strict: true,
});

const check = values.check ?? false;
const write = values.write ?? false;
if (check === write) {
  throw new Error("pass exactly one of --check or --write");
}

const repositoryRoot = resolve(values["repository-root"] ?? process.cwd());
const inventoryPath = resolve(
  repositoryRoot,
  "tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml",
);

// Inventory verification must complete before any target directory is created or file is changed.
const inventory = await loadScenarioMigrationInventory({ repositoryRoot, inventoryPath });
const conversions: ConvertedLegacyScenario[] = [];
for (const row of inventory.scenarios) {
  if (row.disposition !== "migrate") {
    continue;
  }
  const source = await readFile(resolve(repositoryRoot, row.legacyPath), "utf8");
  conversions.push(convertLegacyScenario({ row, source }));
}

const mismatches: string[] = [];
let created = 0;
let overwritten = 0;
let unchanged = 0;
for (const conversion of conversions) {
  const targetPath = resolve(repositoryRoot, conversion.targetPath);
  const current = await readExistingFile(targetPath);
  if (current === null) {
    if (!check) {
      await mkdir(resolve(targetPath, ".."), { recursive: true });
      await writeFile(targetPath, conversion.content, { flag: "wx" });
      created += 1;
    } else {
      mismatches.push(`${conversion.targetPath}: missing`);
    }
    continue;
  }
  if (current === conversion.content) {
    unchanged += 1;
    continue;
  }
  if (!write) {
    mismatches.push(`${conversion.targetPath}: content differs`);
    continue;
  }
  await writeFile(targetPath, conversion.content);
  overwritten += 1;
}

if (mismatches.length > 0) {
  process.stderr.write(`${mismatches.join("\n")}\n`);
  process.exitCode = 1;
}

const ownerCount = new Set(inventory.scenarios.map((row) => `${row.targetPlugin}/${row.targetSkill}`)).size;
const riskCounts = countBy(conversions, (conversion) => conversion.risk);
const artifactCount = conversions.reduce(
  (count, conversion) => count + conversion.expectedArtifactCount,
  0,
);
const artifactDispositionCounts = countBy(
  conversions,
  (conversion) => conversion.legacyArtifactDisposition,
);
process.stdout.write(`${JSON.stringify({
  mode: check ? "check" : "write",
  inventoryCount: inventory.scenarios.length,
  generatedCount: conversions.length,
  ownerCount,
  created,
  overwritten,
  unchanged,
  mismatches: mismatches.length,
  riskHigh: riskCounts.high,
  riskStandard: riskCounts.standard,
  expectedArtifactCount: artifactCount,
  legacyArtifactPathObserved: artifactDispositionCounts.path_observed ?? 0,
  legacyArtifactRubricOnly: artifactDispositionCounts.rubric_only ?? 0,
  legacyArtifactNotExpected: artifactDispositionCounts.not_expected ?? 0,
})}\n`);

async function readExistingFile(filePath: string): Promise<string | null> {
  try {
    const status = await lstat(filePath);
    if (!status.isFile() || status.isSymbolicLink()) {
      throw new Error(`target must be a regular file: ${filePath}`);
    }
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function countBy<TValue>(
  valuesToCount: readonly TValue[],
  key: (value: TValue) => string,
): Record<string, number> {
  return valuesToCount.reduce<Record<string, number>>((counts, value) => {
    const valueKey = key(value);
    counts[valueKey] = (counts[valueKey] ?? 0) + 1;
    return counts;
  }, {});
}
