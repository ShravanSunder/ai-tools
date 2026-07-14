import { createHash } from "node:crypto";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  loadEvaluationRegistry,
  type EvaluationRegistryScenarioIdentity,
} from "./evaluation-registry.js";

const SCENARIO_ID = "artifact-proof";
const BEHAVIOR_DIGEST = `sha256:${"a".repeat(64)}`;

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
  readonly history?: string;
}): string {
  const role = props?.role ?? "diagnostic";
  const calibration = props?.calibration ?? "null";
  const history = props?.history ?? "[]";
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
    authority_history: ${history}
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
  const validitySource = "{\"kind\":\"validity\"}\n";
  const validityPath = path.join(receiptRoot, "artifact-proof-validity.json");
  await writeFile(validityPath, validitySource);
  const validityDigest = `sha256:${createHash("sha256").update(validitySource).digest("hex")}`;
  const registryPath = path.join(repositoryRoot, "registry.yaml");
  await writeFile(registryPath, registrySource({ validityDigest }));
  return { repositoryRoot, registryPath, validityDigest };
}

describe("evaluation registry", () => {
  it("loads a diagnostic row without changing behavior identity", async () => {
    const fixture = await createRegistryFixture();

    await expect(loadEvaluationRegistry({
      ...fixture,
      knownScenarios: knownScenarios(),
    })).resolves.toMatchObject({
      schemaVersion: 1,
      scenarios: [{
        scenarioId: SCENARIO_ID,
        behaviorContractDigest: BEHAVIOR_DIGEST,
        evaluationRole: "diagnostic",
        freshness: "uncalibrated",
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

  it("rejects missing, ignored, and digest-mismatched authority receipts", async () => {
    const fixture = await createRegistryFixture();
    await writeFile(fixture.registryPath, registrySource({
      validityPath: "tmp/validity.json",
      validityDigest: fixture.validityDigest,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/tracked authority receipt/u);

    await writeFile(fixture.registryPath, registrySource({
      validityPath: "tests/test-utils/skill-pressure/config/authority-receipts/missing.json",
      validityDigest: fixture.validityDigest,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/authority receipt/u);

    await writeFile(fixture.registryPath, registrySource({
      validityDigest: `sha256:${"d".repeat(64)}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/receipt digest/u);
  });

  it("applies receipt integrity checks to calibration and authority-history pointers", async () => {
    const fixture = await createRegistryFixture();
    const validReceipt = `
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`;
    const validPromotion = `
      - sequence: 1
        event: promotion${validReceipt}`;
    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: `
      receipt_path: tmp/calibration.json
      receipt_digest: ${fixture.validityDigest}`,
      history: `
      - sequence: 1
        event: promotion
        receipt_path: tmp/calibration.json
        receipt_digest: ${fixture.validityDigest}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/tracked authority receipt/u);

    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: `
      receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
      receipt_digest: ${`sha256:${"c".repeat(64)}`}`,
      history: `
      - sequence: 1
        event: promotion
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${`sha256:${"c".repeat(64)}`}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/receipt digest/u);

    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      history: `${validPromotion}
      - sequence: 2
        event: demotion
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/missing-history.json
        receipt_digest: ${fixture.validityDigest}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/authority receipt does not exist/u);

    for (const invalidHistoryReceipt of [
      {
        path: "tmp/history.json",
        digest: fixture.validityDigest,
        expectedError: /tracked authority receipt/u,
      },
      {
        path: "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json",
        digest: `sha256:${"d".repeat(64)}`,
        expectedError: /receipt digest/u,
      },
    ]) {
      await writeFile(fixture.registryPath, registrySource({
        validityDigest: fixture.validityDigest,
        history: `${validPromotion}
      - sequence: 2
        event: demotion
        receipt_path: ${invalidHistoryReceipt.path}
        receipt_digest: ${invalidHistoryReceipt.digest}`,
      }));
      await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
        .rejects.toThrow(invalidHistoryReceipt.expectedError);
    }
  });

  it("keeps behavior identity stable across valid authority-role changes", async () => {
    const fixture = await createRegistryFixture();
    const diagnostic = await loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() });
    const receipt = `
      receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
      receipt_digest: ${fixture.validityDigest}`;
    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration: receipt,
      history: `
      - sequence: 1
        event: promotion
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`,
    }));
    const gate = await loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() });

    expect(gate.scenarios[0]?.behaviorContractDigest)
      .toBe(diagnostic.scenarios[0]?.behaviorContractDigest);
    expect(gate.scenarios[0]?.evaluationRole).not.toBe(diagnostic.scenarios[0]?.evaluationRole);
  });

  it("requires a fresh gate to carry a tracked calibration receipt", async () => {
    const fixture = await createRegistryFixture();
    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/calibration_receipt/u);
  });

  it("requires role state to agree with the latest authority event", async () => {
    const fixture = await createRegistryFixture();
    const calibration = `
      receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
      receipt_digest: ${fixture.validityDigest}`;
    await writeFile(fixture.registryPath, registrySource({
      role: "gate",
      validityDigest: fixture.validityDigest,
      calibration,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/gate.*promotion/u);

    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      calibration,
      history: `
      - sequence: 1
        event: promotion
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`,
    }));
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/diagnostic.*demotion/u);
  });

  it("rejects impossible authority-history transitions", async () => {
    const fixture = await createRegistryFixture();
    const receipt = `
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`;
    const invalidHistories = [
      `
      - sequence: 1
        event: demotion${receipt}`,
      `
      - sequence: 1
        event: promotion${receipt}
      - sequence: 2
        event: promotion${receipt}`,
      `
      - sequence: 1
        event: promotion${receipt}
      - sequence: 2
        event: retirement${receipt}
      - sequence: 3
        event: demotion${receipt}`,
      `
      - sequence: 1
        event: retirement${receipt}
      - sequence: 2
        event: promotion${receipt}`,
    ];

    for (const history of invalidHistories) {
      const finalEvent = /event: promotion\s*$/u.test(history.trim()) ? "gate" : "diagnostic";
      const calibration = finalEvent === "gate"
        ? `
      receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
      receipt_digest: ${fixture.validityDigest}`
        : undefined;
      await writeFile(fixture.registryPath, registrySource({
        role: finalEvent,
        validityDigest: fixture.validityDigest,
        ...(calibration === undefined ? {} : { calibration }),
        history,
      }));

      await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
        .rejects.toThrow(/authority transition/u);
    }
  });

  it("accepts a legal promotion and demotion cycle", async () => {
    const fixture = await createRegistryFixture();
    const receipt = `
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`;
    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      history: `
      - sequence: 1
        event: promotion${receipt}
      - sequence: 2
        event: demotion${receipt}`,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .resolves.toMatchObject({ scenarios: [{ evaluationRole: "diagnostic" }] });
  });

  it("rejects authority receipt links even when the link target digest matches", async () => {
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
      .rejects.toThrow(/regular file/u);
  });

  it("rejects unordered or non-contiguous authority history", async () => {
    const fixture = await createRegistryFixture();
    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      history: `
      - sequence: 2
        event: demotion
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/authority history/u);
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
