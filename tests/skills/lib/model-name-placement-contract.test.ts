import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const pluginRoot = path.join(repoRoot, "plugins/shravan-dev-workflow");

const modelNamePattern = /\b(Luna|Sol|Astra|Opus|Grok|Fable|Sonnet|Haiku)\b/g;
const modelIdParagraphStart = "**Resolve the exact model id.**";

const isModelNameHome = (fileName: string): boolean =>
  fileName === "model-catalog.md" ||
  fileName.startsWith("native-providers-") ||
  fileName.startsWith("acpx-");

const listFilesUnder = (directory: string): readonly string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFilesUnder(entryPath) : [entryPath];
  });

const findModelNamesOutsideHomes = (filePath: string): readonly string[] => {
  const relativePath = path.relative(pluginRoot, filePath);
  return readFileSync(filePath, "utf8")
    .split("\n")
    .flatMap((line, index) =>
      line.startsWith(modelIdParagraphStart)
        ? []
        : [...line.matchAll(modelNamePattern)].map(
            (match) => `${relativePath}:${index + 1}: ${match[0]}`,
          ),
    );
};

describe("model name placement", () => {
  test("names models only in the catalog, provider pages, and the model-id rule", () => {
    const scannedFiles = ["skills", "shared-references"]
      .flatMap((root) => listFilesUnder(path.join(pluginRoot, root)))
      .filter((filePath) => !isModelNameHome(path.basename(filePath)));

    const violations = scannedFiles.flatMap(findModelNamesOutsideHomes);

    expect(violations).toEqual([]);
  });
});
