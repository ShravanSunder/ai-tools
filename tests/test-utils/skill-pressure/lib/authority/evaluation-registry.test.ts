import { createHash } from "node:crypto";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { createValidatedCurrentBaselineFixture, fixtureAuthorityDigest } from "../test-fixtures.js";
import { discoverSkillScenarios } from "../discovery/skill-discovery.js";
import {
  loadEvaluationRegistry,
  type EvaluationRegistryScenarioIdentity,
} from "./evaluation-registry.js";
import type { ScenarioValidityDigest, ScenarioValidityReceipt } from "./validity-receipts.js";

const SCENARIO_ID = "artifact-proof";
const BEHAVIOR_DIGEST: ScenarioValidityDigest = `sha256:${"a".repeat(64)}`;

const VALIDITY_RECEIPT: ScenarioValidityReceipt = {
  schemaVersion: 1,
  receiptKind: "scenario_validity",
  scenarioId: SCENARIO_ID,
  behaviorContractDigest: BEHAVIOR_DIGEST,
  verdict: "pass",
  consistency: {
    promptConsistent: true,
    effectSurfacesConsistent: true,
    semanticAssertionsConsistent: true,
    permissionsConsistent: true,
    fixturesConsistent: true,
    expectedArtifactsConsistent: true,
  },
};

function knownScenarios(): readonly EvaluationRegistryScenarioIdentity[] {
  return [{ scenarioId: SCENARIO_ID, behaviorContractDigest: BEHAVIOR_DIGEST }];
}

function registrySource(props?: {
  readonly scenarioId?: string;
  readonly behaviorDigest?: string;
  readonly role?: "gate" | "diagnostic" | "retired";
  readonly validityPath?: string;
  readonly validityDigest?: string;
  readonly calibration?: string;
}): string {
  const role = props?.role ?? "diagnostic";
  const calibration = props?.calibration ?? "null";
  return `schema_version: 1
scenarios:
  - scenario_id: ${props?.scenarioId ?? SCENARIO_ID}
    behavior_contract_digest: ${props?.behaviorDigest ?? BEHAVIOR_DIGEST}
    evaluation_role: ${role}
    freshness: ${role === "gate" ? "fresh" : role === "retired" ? "retired" : "uncalibrated"}
    validity_review:
      receipt_path: ${props?.validityPath ?? "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json"}
      receipt_digest: ${props?.validityDigest ?? `sha256:${"b".repeat(64)}`}
    calibration_receipt: ${calibration}
`;
}

async function createRegistryFixture(): Promise<{
  readonly repositoryRoot: string;
  readonly registryPath: string;
  readonly validityDigest: string;
}> {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "skill-pressure-registry-"));
  const receiptRoot = path.join(
    repositoryRoot,
    "tests/test-utils/skill-pressure/config/authority-receipts",
  );
  await mkdir(receiptRoot, { recursive: true });
  const validitySource = `${JSON.stringify(VALIDITY_RECEIPT, null, 2)}\n`;
  const validityPath = path.join(receiptRoot, "artifact-proof-validity.json");
  await writeFile(validityPath, validitySource);
  const validityDigest = `sha256:${createHash("sha256").update(validitySource).digest("hex")}`;
  const registryPath = path.join(repositoryRoot, "registry.yaml");
  await writeFile(registryPath, registrySource({ validityDigest }));
  return { repositoryRoot, registryPath, validityDigest };
}

async function writeCurrentBaselineReceipt(
  fixture: { readonly repositoryRoot: string },
): Promise<{ readonly path: string; readonly digest: string }> {
  const receiptPath = "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-baseline.json";
  const receipt = createValidatedCurrentBaselineFixture({
    scenarioId: SCENARIO_ID,
    behaviorContractDigest: BEHAVIOR_DIGEST,
  }).receipt;
  const source = `${JSON.stringify(receipt, null, 2)}\n`;
  await writeFile(path.join(fixture.repositoryRoot, receiptPath), source);
  return {
    path: receiptPath,
    digest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
  };
}

function receiptReference(receipt: { readonly path: string; readonly digest: string }): string {
  return `
      receipt_path: ${receipt.path}
      receipt_digest: ${receipt.digest}`;
}

describe("evaluation registry", () => {
  it("loads the complete 110-row repository registry and every tracked validity receipt", async () => {
    const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");
    const discovery = await discoverSkillScenarios({ repositoryRoot });

    expect(discovery.invalid).toEqual([]);
    expect(discovery.discovered).toHaveLength(110);
    const registry = await loadEvaluationRegistry({
      repositoryRoot,
      registryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml",
      ),
      knownScenarios: discovery.discovered,
    });

    expect(registry.scenarios).toHaveLength(110);
    expect(new Set(registry.scenarios.map((row) => row.validityReview.receiptPath)).size).toBe(110);
    const gates = registry.scenarios.filter((row) => row.evaluationRole === "gate");
    expect(gates).toEqual([]);
    expect(registry.scenarios.filter((row) => row.evaluationRole === "diagnostic")).toHaveLength(110);
  });

  it("loads a diagnostic row without changing behavior identity", async () => {
    const fixture = await createRegistryFixture();

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() })).resolves.toMatchObject({
      schemaVersion: 1,
      scenarios: [{
        scenarioId: SCENARIO_ID,
        behaviorContractDigest: BEHAVIOR_DIGEST,
        evaluationRole: "diagnostic",
        freshness: "uncalibrated",
        calibrationReceipt: null,
      }],
    });
  });

  it("rejects unknown scenarios and behavior digest drift", async () => {
    const fixture = await createRegistryFixture();
    await writeFile(fixture.registryPath, registrySource({
      scenarioId: "unknown-scenario",
      validityDigest: fixture.validityDigest,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/unknown scenario_id/u);

    await writeFile(fixture.registryPath, registrySource({
      behaviorDigest: `sha256:${"c".repeat(64)}`,
      validityDigest: fixture.validityDigest,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/behavior contract digest/u);
  });

  it("requires exact one-to-one closure with known scenarios", async () => {
    const fixture = await createRegistryFixture();

    await expect(loadEvaluationRegistry({
      ...fixture,
      knownScenarios: [
        ...knownScenarios(),
        { scenarioId: "another-scenario", behaviorContractDigest: `sha256:${"c".repeat(64)}` },
      ],
    })).rejects.toThrow(/one-to-one.*missing.*another-scenario/u);
  });

  it("rejects a validity receipt whose content is forged behind a matching registry digest", async () => {
    const fixture = await createRegistryFixture();
    const forgedSource = `${JSON.stringify({ ...VALIDITY_RECEIPT, verdict: "fail" }, null, 2)}\n`;
    const validityPath = path.join(
      fixture.repositoryRoot,
      "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json",
    );
    await writeFile(validityPath, forgedSource);
    const forgedDigest = `sha256:${createHash("sha256").update(forgedSource).digest("hex")}`;
    await writeFile(fixture.registryPath, registrySource({ validityDigest: forgedDigest }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/scenario validity receipt.*verdict.*pass/u);
  });

  it("rejects invalid, untracked, and digest-mismatched current baseline receipts", async () => {
    const fixture = await createRegistryFixture();
    const baseline = await writeCurrentBaselineReceipt(fixture);
    const validBaseline = receiptReference(baseline);

    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: `
      receipt_path: tmp/calibration.json
      receipt_digest: ${fixture.validityDigest}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/tracked validity receipt or owner-local baseline path/u);

    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: receiptReference({
        path: "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json",
        digest: fixture.validityDigest,
      }),
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/current_baseline authority receipt is invalid/u);

    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: validBaseline.replace(baseline.digest, fixture.validityDigest),
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/receipt digest does not match/u);
  });

  it("accepts a gate with a valid current baseline and requires gate calibration", async () => {
    const fixture = await createRegistryFixture();
    const baseline = await writeCurrentBaselineReceipt(fixture);
    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: receiptReference(baseline),
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .resolves.toMatchObject({ scenarios: [{ evaluationRole: "gate", freshness: "fresh" }] });

    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/calibration_receipt/u);
  });

  it("rejects calibration authority on diagnostic rows", async () => {
    const fixture = await createRegistryFixture();
    const baseline = await writeCurrentBaselineReceipt(fixture);
    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      calibration: receiptReference(baseline),
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/only a gate may retain a current baseline receipt/u);
  });

  it("rejects authority receipts reached through symlinked files or parent directories", async () => {
    const fixture = await createRegistryFixture();
    const outsidePath = path.join(fixture.repositoryRoot, "outside.json");
    const outsideSource = "{\"kind\":\"outside\"}\n";
    await writeFile(outsidePath, outsideSource);
    const linkedPath = path.join(
      fixture.repositoryRoot,
      "tests/test-utils/skill-pressure/config/authority-receipts/linked.json",
    );
    await symlink(outsidePath, linkedPath);
    const linkedDigest = `sha256:${createHash("sha256").update(outsideSource).digest("hex")}`;
    await writeFile(fixture.registryPath, registrySource({
      validityPath: "tests/test-utils/skill-pressure/config/authority-receipts/linked.json",
      validityDigest: linkedDigest,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/regular file|symlinked parent/u);

    const outsideDirectory = path.join(fixture.repositoryRoot, "outside-authority");
    await mkdir(outsideDirectory);
    const parentSource = "{\"kind\":\"outside-parent\"}\n";
    await writeFile(path.join(outsideDirectory, "validity.json"), parentSource);
    const linkedDirectory = path.join(
      fixture.repositoryRoot,
      "tests/test-utils/skill-pressure/config/authority-receipts/alias",
    );
    await symlink(outsideDirectory, linkedDirectory);
    const parentDigest = `sha256:${createHash("sha256").update(parentSource).digest("hex")}`;
    await writeFile(fixture.registryPath, registrySource({
      validityPath: "tests/test-utils/skill-pressure/config/authority-receipts/alias/validity.json",
      validityDigest: parentDigest,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/real directory|symlinked parent|canonical tracked authority root/u);
  });

  it("rejects a silent default role", async () => {
    const fixture = await createRegistryFixture();
    const missingRole = registrySource({ validityDigest: fixture.validityDigest })
      .replace("    evaluation_role: diagnostic\n", "");
    await writeFile(fixture.registryPath, missingRole);

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/evaluation_role/u);
  });
});
