import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createRepositoryFixture, scenarioContract } from "../test-fixtures.js";
import { loadScenarioContract } from "./skill-contracts.js";

describe("skill pressure scenario contract", () => {
  it("loads the v3 behavioral fields and keeps semantic assertions separate from the prompt", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "behavior", plugin: "workflow", skill: "skill" }));

    await expect(loadScenarioContract({ scenarioPath })).resolves.toMatchObject({
      scenarioId: "behavior",
      plugin: "workflow",
      skill: "skill",
      skillType: "discipline",
      prompt: "Follow the requested workflow under time pressure.",
      semanticAssertions: [{
        assertionId: "behavior-behavior",
        criterion: "The response must reject the shortcut and follow the workflow.",
        evidenceSurface: "response",
      }],
      behaviorRequirementIds: ["behavior"],
      baseline: "no_skill",
      baselineRevision: null,
      comparisonIntent: "improvement",
      repetitions: 5,
      risk: "standard",
      schemaVersion: 3,
    });
  });

  it("rejects v2 scenarios instead of applying a compatibility default", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(
      scenarioPath,
      scenarioContract({ scenarioId: "legacy", plugin: "workflow", skill: "skill" })
        .replace("schema_version: 3", "schema_version: 2"),
    );

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/schema_version/);
  });

  it("rejects a missing comparison intent", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(
      scenarioPath,
      scenarioContract({ scenarioId: "missing-intent", plugin: "workflow", skill: "skill" })
        .replace("comparison_intent: improvement\n", ""),
    );

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/comparison_intent/);
  });

  it("requires a full immutable revision for previous-revision baselines", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(
      scenarioPath,
      scenarioContract({
        scenarioId: "unpinned-control",
        plugin: "workflow",
        skill: "skill",
        baseline: "previous_revision",
        comparisonIntent: "non_regression",
      }),
    );

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/baseline_revision/);
  });

  it("loads a previous-revision baseline only when pinned to a full commit", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const baselineRevision = "0123456789abcdef0123456789abcdef01234567";
    await writeFile(
      scenarioPath,
      scenarioContract({
        scenarioId: "pinned-control",
        plugin: "workflow",
        skill: "skill",
        baseline: "previous_revision",
        baselineRevision,
        comparisonIntent: "non_regression",
      }),
    );

    await expect(loadScenarioContract({ scenarioPath })).resolves.toMatchObject({
      baseline: "previous_revision",
      baselineRevision,
      comparisonIntent: "non_regression",
    });
  });

  it("rejects a baseline revision for no-skill baselines", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(
      scenarioPath,
      scenarioContract({
        scenarioId: "invalid-no-skill-pin",
        plugin: "workflow",
        skill: "skill",
        baselineRevision: "0123456789abcdef0123456789abcdef01234567",
      }),
    );

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/baseline_revision/);
  });

  it("hashes the canonical parsed contract instead of markdown formatting", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const firstPath = join(repositoryRoot, "first.md");
    const secondPath = join(repositoryRoot, "second.md");
    const source = scenarioContract({ scenarioId: "canonical", plugin: "workflow", skill: "skill" });
    await writeFile(firstPath, source);
    await writeFile(secondPath, `${source.trimEnd()}\n\n# Non-contract body\n`);

    const first = await loadScenarioContract({ scenarioPath: firstPath });
    const second = await loadScenarioContract({ scenarioPath: secondPath });

    expect(first.behaviorContractDigest).toBe(second.behaviorContractDigest);
  });

  it("includes comparison intent in the canonical contract digest", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const improvementPath = join(repositoryRoot, "improvement.md");
    const controlPath = join(repositoryRoot, "control.md");
    const baselineRevision = "0123456789abcdef0123456789abcdef01234567";
    await writeFile(
      improvementPath,
      scenarioContract({ scenarioId: "digest-intent", plugin: "workflow", skill: "skill" }),
    );
    await writeFile(
      controlPath,
      scenarioContract({
        scenarioId: "digest-intent",
        plugin: "workflow",
        skill: "skill",
        baseline: "previous_revision",
        baselineRevision,
        comparisonIntent: "non_regression",
      }),
    );

    const improvement = await loadScenarioContract({ scenarioPath: improvementPath });
    const control = await loadScenarioContract({ scenarioPath: controlPath });

    expect(improvement.behaviorContractDigest).not.toBe(control.behaviorContractDigest);
  });

  it("rejects fewer than five repetitions", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "too-few", plugin: "workflow", skill: "skill", repetitions: 4 }));

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/repetitions/);
  });

  it("rejects owner fields that disagree with the owner path", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    await writeFile(scenarioPath, scenarioContract({ scenarioId: "wrong-owner", plugin: "wrong", skill: "skill" }));

    await expect(
      loadScenarioContract({ scenarioPath, expectedOwner: { plugin: "workflow", skill: "skill" } }),
    ).rejects.toThrow(/owner fields/);
  });

  it("rejects duplicate deterministic check ids", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const source = scenarioContract({ scenarioId: "duplicate", plugin: "workflow", skill: "skill" })
      .replace("deterministic_checks: []", `deterministic_checks:
  - check_id: same
    fact: tool_observations
    operator: contains
    expected: first
  - check_id: same
    fact: tool_observations
    operator: contains
    expected: second`);
    await writeFile(scenarioPath, source);

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/duplicate check_id/);
  });

  it("rejects semantic response matching as a deterministic fact", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const source = scenarioContract({ scenarioId: "semantic-check", plugin: "workflow", skill: "skill" })
      .replace("deterministic_checks: []", `deterministic_checks:
  - check_id: response-wording
    fact: visible_response
    operator: matches
    expected: followed the workflow`);
    await writeFile(scenarioPath, source);

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/deterministic_checks/);
  });

  it("rejects direct-path content checks for declared artifact paths", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const source = scenarioContract({ scenarioId: "duplicate-owner", plugin: "workflow", skill: "skill" })
      .replace("effect_surfaces:\n  - response", "effect_surfaces:\n  - response\n  - artifacts")
      .replace("allowed_write_paths: []", "allowed_write_paths:\n  - reports/result.md")
      .replace("deterministic_checks: []", `deterministic_checks:
  - check_id: wrong-owner
    fact: path:reports/result.md
    operator: contains
    expected: required text`)
      .replace("expected_artifacts: []", `expected_artifacts:
  - artifact_id: result
    path: reports/result.md
    file_type: file
    content_contract: report`);
    await writeFile(scenarioPath, source);

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/artifact_id/);
  });

  it("rejects invalid or unbounded content patterns during loading", async () => {
    const repositoryRoot = await createRepositoryFixture();
    const scenarioPath = join(repositoryRoot, "scenario.md");
    const source = scenarioContract({ scenarioId: "unsafe-pattern", plugin: "workflow", skill: "skill" })
      .replace("deterministic_checks: []", `deterministic_checks:
  - check_id: unsafe
    fact: tool_observations
    operator: matches
    expected: (a+)+$`);
    await writeFile(scenarioPath, source);

    await expect(loadScenarioContract({ scenarioPath })).rejects.toThrow(/bounded/);
  });
});
