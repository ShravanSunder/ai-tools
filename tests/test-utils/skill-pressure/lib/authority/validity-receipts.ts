export type ScenarioValidityDigest = `sha256:${string}`;

export interface ScenarioValidityConsistencyChecks {
  readonly promptConsistent: true;
  readonly effectSurfacesConsistent: true;
  readonly semanticAssertionsConsistent: true;
  readonly permissionsConsistent: true;
  readonly fixturesConsistent: true;
  readonly expectedArtifactsConsistent: true;
}

export interface ScenarioValidityReceipt {
  readonly schemaVersion: 1;
  readonly receiptKind: "scenario_validity";
  readonly scenarioId: string;
  readonly behaviorContractDigest: ScenarioValidityDigest;
  readonly verdict: "pass";
  readonly consistency: ScenarioValidityConsistencyChecks;
}

export interface ValidateScenarioValidityReceiptProps {
  readonly receipt: unknown;
  readonly expected: {
    readonly scenarioId: string;
    readonly behaviorContractDigest: string;
  };
}

export function parseScenarioValidityReceipt(input: unknown): ScenarioValidityReceipt {
  const receipt = assertRecord(input, "scenario validity receipt");
  assertLiteral(receipt.schemaVersion, 1, "scenario validity receipt schemaVersion");
  assertLiteral(receipt.receiptKind, "scenario_validity", "scenario validity receipt kind");
  assertIdentifier(receipt.scenarioId, "scenario validity receipt scenario id");
  assertDigest(receipt.behaviorContractDigest, "scenario validity receipt behavior contract digest");
  assertLiteral(receipt.verdict, "pass", "scenario validity receipt verdict");

  const consistency = assertRecord(receipt.consistency, "scenario validity receipt consistency");
  assertLiteral(consistency.promptConsistent, true, "scenario validity prompt consistency");
  assertLiteral(consistency.effectSurfacesConsistent, true, "scenario validity effect surface consistency");
  assertLiteral(consistency.semanticAssertionsConsistent, true, "scenario validity semantic assertion consistency");
  assertLiteral(consistency.permissionsConsistent, true, "scenario validity permission consistency");
  assertLiteral(consistency.fixturesConsistent, true, "scenario validity fixture consistency");
  assertLiteral(consistency.expectedArtifactsConsistent, true, "scenario validity expected artifact consistency");

  return {
    schemaVersion: 1,
    receiptKind: "scenario_validity",
    scenarioId: receipt.scenarioId,
    behaviorContractDigest: receipt.behaviorContractDigest,
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
}

export function validateScenarioValidityReceipt(
  props: ValidateScenarioValidityReceiptProps,
): ScenarioValidityReceipt {
  const receipt = parseScenarioValidityReceipt(props.receipt);
  if (receipt.scenarioId !== props.expected.scenarioId) {
    throw new Error("scenario validity receipt scenario id does not match");
  }
  if (receipt.behaviorContractDigest !== props.expected.behaviorContractDigest) {
    throw new Error("scenario validity receipt behavior contract digest does not match");
  }
  return receipt;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function assertDigest(value: unknown, label: string): asserts value is ScenarioValidityDigest {
  if (typeof value !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(value)) {
    throw new Error(`${label} must be a sha256 digest`);
  }
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]*$/u.test(value)) {
    throw new Error(`${label} must be an identifier`);
  }
}

function assertLiteral<TValue>(value: unknown, expected: TValue, label: string): asserts value is TValue {
  if (value !== expected) {
    throw new Error(`${label} must equal ${String(expected)}`);
  }
}
