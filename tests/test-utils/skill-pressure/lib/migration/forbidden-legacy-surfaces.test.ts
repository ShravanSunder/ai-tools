import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  FORBIDDEN_LEGACY_CONTENT_SURFACES,
  FORBIDDEN_LEGACY_SURFACES,
  verifyForbiddenLegacySurfacesAbsent,
} from "./forbidden-legacy-surfaces.js";

describe("forbidden v2 surface accounting", () => {
  it("names every legacy surface category explicitly", () => {
    expect(new Set(FORBIDDEN_LEGACY_SURFACES.map((surface) => surface.category))).toEqual(new Set([
      "scenario-tree",
      "schema",
      "parser",
      "oracle",
      "shell-authority",
      "runner",
      "reducer",
      "entrypoint",
    ]));
  });

  it.each(FORBIDDEN_LEGACY_SURFACES)("rejects a restored $id without mutating the repository", async (surface) => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), "skill-pressure-forbidden-surface-"));
    const fixturePath = path.join(fixtureRoot, surface.relativePath);
    if (surface.category === "scenario-tree") {
      await mkdir(fixturePath, { recursive: true });
      await writeFile(path.join(fixturePath, "restored.md"), "v2 fixture\n");
    } else {
      await mkdir(path.dirname(fixturePath), { recursive: true });
      await writeFile(fixturePath, "v2 fixture\n");
    }

    await expect(verifyForbiddenLegacySurfacesAbsent({
      repositoryRoot: fixtureRoot,
      sourceOverrides: { [surface.id]: fixturePath },
    })).rejects.toThrow(new RegExp(surface.id, "u"));
  });

  it.each(FORBIDDEN_LEGACY_CONTENT_SURFACES)("rejects restored $id authority content", async (surface) => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), "skill-pressure-forbidden-content-"));
    const restoredSourceById: Readonly<Record<string, string>> = {
      "v2-schema-version-marker": "schema_version: 2\n",
      "v2-hidden-rubric-field": "hidden_rubric: trust the response\n",
      "v2-response-regex-oracle-field": "response_patterns: [passed]\n",
      "v2-self-report-oracle-field": "const selfReport = true;\n",
    };

    await expect(verifyForbiddenLegacySurfacesAbsent({
      repositoryRoot: fixtureRoot,
      sourceOverrides: Object.fromEntries(
        FORBIDDEN_LEGACY_SURFACES.map((item) => [item.id, path.join(fixtureRoot, "missing", item.id)]),
      ),
      contentOverrides: { [surface.id]: restoredSourceById[surface.id]! },
    })).rejects.toThrow(new RegExp(surface.id, "u"));
  });

  it("accepts an absent denylist when every source override is missing", async () => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), "skill-pressure-forbidden-clear-"));

    await expect(verifyForbiddenLegacySurfacesAbsent({
      repositoryRoot: fixtureRoot,
      sourceOverrides: Object.fromEntries(
        FORBIDDEN_LEGACY_SURFACES.map((surface) => [surface.id, path.join(fixtureRoot, "missing", surface.id)]),
      ),
    })).resolves.toMatchObject({ absent: true, contentChecked: expect.any(Array) });
  });
});
