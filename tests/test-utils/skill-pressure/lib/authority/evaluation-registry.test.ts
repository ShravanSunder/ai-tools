import { createHash } from "node:crypto";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

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
  const validitySource = `${JSON.stringify(VALIDITY_RECEIPT, null, 2)}\n`;
  const validityPath = path.join(receiptRoot, "artifact-proof-validity.json");
  await writeFile(validityPath, validitySource);
  const validityDigest = `sha256:${createHash("sha256").update(validitySource).digest("hex")}`;
  const registryPath = path.join(repositoryRoot, "registry.yaml");
  await writeFile(registryPath, registrySource({ validityDigest }));
  return { repositoryRoot, registryPath, validityDigest };
}

async function writeAuthorityReceipt(
  fixture: { readonly repositoryRoot: string },
  receiptKind: "promotion" | "demotion",
): Promise<{ readonly path: string; readonly digest: string }> {
  const receiptPath = `tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-${receiptKind}.json`;
  const source = `${JSON.stringify({
    schemaVersion: 1,
    receiptKind,
    scenarioId: SCENARIO_ID,
    behaviorContractDigest: BEHAVIOR_DIGEST,
  }, null, 2)}\n`;
  await writeFile(path.join(fixture.repositoryRoot, receiptPath), source);
  return {
    path: receiptPath,
    digest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
  };
}

describe("evaluation registry", () => {
  it("loads the complete 109-row repository registry and every tracked validity receipt", async () => {
    const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");
    const discovery = await discoverSkillScenarios({ repositoryRoot });

    expect(discovery.invalid).toEqual([]);
    expect(discovery.discovered).toHaveLength(109);
    const registry = await loadEvaluationRegistry({
      repositoryRoot,
      registryPath: path.join(
        repositoryRoot,
        "tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml",
      ),
      knownScenarios: discovery.discovered,
    });

    expect(registry.scenarios).toHaveLength(109);
    expect(new Set(registry.scenarios.map((row) => row.validityReview.receiptPath)).size).toBe(109);
    const gates = registry.scenarios.filter((row) => row.evaluationRole === "gate");
    expect(gates.map((row) => row.scenarioId).sort()).toEqual([
      "skills-creation-reference-lane-non-regression",
    ]);
    expect(gates.every((row) => row.freshness === "fresh")).toBe(true);
    expect(gates.every((row) => row.calibrationReceipt !== null)).toBe(true);
    expect(registry.scenarios.filter((row) => row.evaluationRole === "diagnostic")).toHaveLength(108);
  });

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

  it("rejects a validity receipt bound to a different scenario or behavior digest", async () => {
    const fixture = await createRegistryFixture();
    const validityPath = path.join(
      fixture.repositoryRoot,
      "tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json",
    );

    for (const [field, value, expectedError] of [
      ["scenarioId", "other-scenario", /scenario id does not match/u],
      ["behaviorContractDigest", `sha256:${"c".repeat(64)}`, /behavior contract digest does not match/u],
    ] as const) {
      const forgedSource = `${JSON.stringify({ ...VALIDITY_RECEIPT, [field]: value }, null, 2)}\n`;
      await writeFile(validityPath, forgedSource);
      const forgedDigest = `sha256:${createHash("sha256").update(forgedSource).digest("hex")}`;
      await writeFile(fixture.registryPath, registrySource({ validityDigest: forgedDigest }));

      await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
        .rejects.toThrow(expectedError);
    }
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
    const promotionReceipt = await writeAuthorityReceipt(fixture, "promotion");
    const validReceipt = `
        receipt_path: ${promotionReceipt.path}
        receipt_digest: ${promotionReceipt.digest}`;
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

  it("rejects a validity receipt reused as gate calibration authority", async () => {
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
    expect(diagnostic.scenarios[0]?.behaviorContractDigest).toBe(BEHAVIOR_DIGEST);
    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/promotion authority receipt kind/u);
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
    const promotion = await writeAuthorityReceipt(fixture, "promotion");
    const demotion = await writeAuthorityReceipt(fixture, "demotion");
    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      history: `
      - sequence: 1
        event: promotion
        receipt_path: ${promotion.path}
        receipt_digest: ${promotion.digest}
      - sequence: 2
        event: demotion
        receipt_path: ${demotion.path}
        receipt_digest: ${demotion.digest}`,
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
      .rejects.toThrow(/regular file|symlinked parent/u);
  });

  it("rejects authority receipts reached through a symlinked parent directory", async () => {
    const fixture = await createRegistryFixture();
    const outsideDirectory = path.join(fixture.repositoryRoot, "outside-authority");
    await mkdir(outsideDirectory);
    const outsideSource = "{\"kind\":\"outside-parent\"}\n";
    await writeFile(path.join(outsideDirectory, "validity.json"), outsideSource);
    const linkedDirectory = path.join(
      fixture.repositoryRoot,
      "tests/test-utils/skill-pressure/config/authority-receipts/alias",
    );
    await symlink(outsideDirectory, linkedDirectory);
    const linkedDigest = `sha256:${createHash("sha256").update(outsideSource).digest("hex")}`;
    await writeFile(fixture.registryPath, registrySource({
      validityPath: "tests/test-utils/skill-pressure/config/authority-receipts/alias/validity.json",
      validityDigest: linkedDigest,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/symlinked parent|canonical tracked authority root/u);
  });

  it("rejects a symlinked tracked authority root", async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), "skill-pressure-registry-root-link-"));
    const outsideDirectory = await mkdtemp(path.join(tmpdir(), "skill-pressure-authority-outside-"));
    const outsideSource = "{\"kind\":\"outside-root\"}\n";
    await writeFile(path.join(outsideDirectory, "artifact-proof-validity.json"), outsideSource);
    const authorityParent = path.join(repositoryRoot, "tests/test-utils/skill-pressure/config");
    await mkdir(authorityParent, { recursive: true });
    await symlink(outsideDirectory, path.join(authorityParent, "authority-receipts"));
    const validityDigest = `sha256:${createHash("sha256").update(outsideSource).digest("hex")}`;
    const registryPath = path.join(repositoryRoot, "registry.yaml");
    await writeFile(registryPath, registrySource({ validityDigest }));

    await expect(loadEvaluationRegistry({ repositoryRoot, registryPath, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/tracked authority root.*real directory/u);
  });

  it("rejects reuse of an old promotion receipt after demotion", async () => {
    const fixture = await createRegistryFixture();
    const receipt = `
        receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
        receipt_digest: ${fixture.validityDigest}`;
    await writeFile(fixture.registryPath, registrySource({
      validityDigest: fixture.validityDigest,
      role: "gate",
      calibration: `
      receipt_path: tests/test-utils/skill-pressure/config/authority-receipts/artifact-proof-validity.json
      receipt_digest: ${fixture.validityDigest}`,
      history: `
      - sequence: 1
        event: promotion${receipt}
      - sequence: 2
        event: demotion${receipt}
      - sequence: 3
        event: promotion${receipt}`,
    }));

    await expect(loadEvaluationRegistry({ ...fixture, knownScenarios: knownScenarios() }))
      .rejects.toThrow(/promotion receipt.*reused/u);
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
