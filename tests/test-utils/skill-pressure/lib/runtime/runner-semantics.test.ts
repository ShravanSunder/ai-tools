import { describe, expect, it } from "vitest";

import {
  assertRunnerSemanticsManifestClosure,
  calculateRunnerSemantics,
  RUNNER_SEMANTICS_MANIFEST,
} from "./runner-semantics.js";

const repositoryRoot = new URL("../../../../..", import.meta.url).pathname;

describe("runner semantics manifest", () => {
  it("covers every live semantic module and references only existing files", async () => {
    const result = await calculateRunnerSemantics({ repositoryRoot });

    expect(result.manifestEntries).toEqual(RUNNER_SEMANTICS_MANIFEST);
    expect(result.runnerSemanticsDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
  });

  it("changes the digest when any semantic inclusion class changes", async () => {
    const baseline = await calculateRunnerSemantics({ repositoryRoot });
    const firstEntryByClass = new Map(
      RUNNER_SEMANTICS_MANIFEST.map((entry) => [entry.semanticClass, entry] as const),
    );

    expect(firstEntryByClass.size).toBe(9);
    for (const [semanticClass, entry] of firstEntryByClass) {
      const changed = await calculateRunnerSemantics({
        repositoryRoot,
        sourceOverrides: new Map([[entry.path, `semantic mutation for ${semanticClass}`]]),
      });
      expect(changed.runnerSemanticsDigest, semanticClass).not.toBe(baseline.runnerSemanticsDigest);
    }
  });

  it("treats the generated scenario schema as contract-parser semantics", async () => {
    const schemaPath = "schemas/skill-pressure-scenario.schema.json";
    const baseline = await calculateRunnerSemantics({ repositoryRoot });
    const changed = await calculateRunnerSemantics({
      repositoryRoot,
      sourceOverrides: new Map([[schemaPath, "schema mutation"]]),
    });

    expect(RUNNER_SEMANTICS_MANIFEST).toContainEqual({
      semanticClass: "contract_parser",
      path: schemaPath,
    });
    expect(changed.runnerSemanticsDigest).not.toBe(baseline.runnerSemanticsDigest);
  });

  it("keeps documentation outside runner semantics", async () => {
    const baseline = await calculateRunnerSemantics({ repositoryRoot });
    const changed = await calculateRunnerSemantics({
      repositoryRoot,
      sourceOverrides: new Map([["README.md", "documentation mutation"]]),
    });

    expect(changed.runnerSemanticsDigest).toBe(baseline.runnerSemanticsDigest);
  });

  it("rejects unmanifested semantic modules and stale manifest entries", () => {
    expect(() => assertRunnerSemanticsManifestClosure({
      discoveredSemanticPaths: ["lib/contracts/new-semantic-module.ts"],
      manifestPaths: [],
    })).toThrow(/unmanifested semantic module/u);
    expect(() => assertRunnerSemanticsManifestClosure({
      discoveredSemanticPaths: [],
      manifestPaths: ["lib/contracts/removed-semantic-module.ts"],
    })).toThrow(/manifest entry does not exist/u);
  });
});
