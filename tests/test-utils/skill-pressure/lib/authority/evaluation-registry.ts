import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseDocument } from "yaml";
import { z } from "zod";

import { readTrackedAuthorityReceiptFile } from "./tracked-authority-receipt-file.js";
import { parseCurrentBaselineReceipt } from "./authority-receipts.js";
import { validateScenarioValidityReceipt } from "./validity-receipts.js";

const identifierSchema = z.string().min(1).max(200).regex(/^[a-z0-9][a-z0-9-]*$/u);
const digestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/u);
const receiptReferenceSchema = z.object({
  receipt_path: z.string().min(1),
  receipt_digest: digestSchema,
}).strict();
const commonRegistryRow = {
  scenario_id: identifierSchema,
  behavior_contract_digest: digestSchema,
  validity_review: receiptReferenceSchema,
} as const;
const registryRowSchema = z.discriminatedUnion("evaluation_role", [
  z.object({
    ...commonRegistryRow,
    evaluation_role: z.literal("gate"),
    freshness: z.enum(["fresh", "stale"]),
    calibration_receipt: receiptReferenceSchema,
  }).strict(),
  z.object({
    ...commonRegistryRow,
    evaluation_role: z.literal("diagnostic"),
    freshness: z.enum(["uncalibrated", "stale"]),
    calibration_receipt: receiptReferenceSchema.nullable(),
  }).strict(),
  z.object({
    ...commonRegistryRow,
    evaluation_role: z.literal("retired"),
    freshness: z.literal("retired"),
    calibration_receipt: receiptReferenceSchema.nullable(),
  }).strict(),
]);
const evaluationRegistrySchema = z.object({
  schema_version: z.literal(1),
  scenarios: z.array(registryRowSchema),
}).strict();

export interface EvaluationRegistryScenarioIdentity {
  readonly scenarioId: string;
  readonly behaviorContractDigest: string;
  readonly plugin: string;
  readonly skill: string;
}

export interface LoadEvaluationRegistryProps {
  readonly repositoryRoot: string;
  readonly registryPath: string;
  readonly knownScenarios: readonly EvaluationRegistryScenarioIdentity[];
}

export interface AuthorityReceiptReference {
  readonly receiptPath: string;
  readonly receiptDigest: string;
}

export interface EvaluationRegistryRow {
  readonly scenarioId: string;
  readonly behaviorContractDigest: string;
  readonly evaluationRole: "gate" | "diagnostic" | "retired";
  readonly freshness: "fresh" | "stale" | "uncalibrated" | "retired";
  readonly validityReview: AuthorityReceiptReference;
  readonly calibrationReceipt: AuthorityReceiptReference | null;
}

export interface EvaluationRegistry {
  readonly schemaVersion: 1;
  readonly scenarios: readonly EvaluationRegistryRow[];
}

export function calculateEvaluationRegistrySnapshotDigest(
  registry: EvaluationRegistry,
): `sha256:${string}` {
  const canonicalRegistry = {
    schemaVersion: registry.schemaVersion,
    scenarios: [...registry.scenarios]
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
      .map((row) => row),
  };
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalRegistry)).digest("hex")}`;
}

export async function loadEvaluationRegistry(
  props: LoadEvaluationRegistryProps,
): Promise<EvaluationRegistry> {
  const source = await readFile(path.resolve(props.registryPath), "utf8");
  const document = parseDocument(source, { prettyErrors: false, strict: true, uniqueKeys: true });
  if (document.errors.length > 0) {
    throw new Error(`evaluation registry YAML is invalid: ${document.errors.map((error) => error.message).join("; ")}`);
  }
  const parsed = evaluationRegistrySchema.safeParse(document.toJS({ maxAliasCount: 0 }));
  if (!parsed.success) {
    throw new Error(`evaluation registry is invalid: ${parsed.error.message}`);
  }

  const knownScenarios = new Map(props.knownScenarios.map((scenario) => [scenario.scenarioId, scenario]));
  if (knownScenarios.size !== props.knownScenarios.length) {
    throw new Error("known scenario identities contain duplicate scenario_id values");
  }
  const seenScenarioIds = new Set<string>();
  const scenarios: EvaluationRegistryRow[] = [];
  for (const row of parsed.data.scenarios) {
    if (seenScenarioIds.has(row.scenario_id)) {
      throw new Error(`evaluation registry contains duplicate scenario_id: ${row.scenario_id}`);
    }
    seenScenarioIds.add(row.scenario_id);
    const knownScenario = knownScenarios.get(row.scenario_id);
    if (knownScenario === undefined) {
      throw new Error(`evaluation registry has unknown scenario_id: ${row.scenario_id}`);
    }
    if (knownScenario.behaviorContractDigest !== row.behavior_contract_digest) {
      throw new Error(`evaluation registry behavior contract digest does not match scenario: ${row.scenario_id}`);
    }
    const validityReview = await validateScenarioValidityReceiptReference({
      repositoryRoot: props.repositoryRoot,
      reference: row.validity_review,
      expected: {
        scenarioId: row.scenario_id,
        behaviorContractDigest: row.behavior_contract_digest,
      },
    });
    const calibrationReceipt = row.calibration_receipt === null
      ? null
        : await validateAuthorityReceiptReference({
          repositoryRoot: props.repositoryRoot,
          reference: row.calibration_receipt,
          expectedKind: "current_baseline",
          scenarioId: row.scenario_id,
          behaviorContractDigest: row.behavior_contract_digest,
          expectedReceiptPath: path.posix.join(
            "tests",
            knownScenario.plugin,
            knownScenario.skill,
            "baselines",
            `${row.scenario_id}.json`,
          ),
        });
    if (row.evaluation_role !== "gate" && calibrationReceipt !== null) {
      throw new Error(`only a gate may retain a current baseline receipt: ${row.scenario_id}`);
    }
    scenarios.push({
      scenarioId: row.scenario_id,
      behaviorContractDigest: row.behavior_contract_digest,
      evaluationRole: row.evaluation_role,
      freshness: row.freshness,
      validityReview,
      calibrationReceipt,
    });
  }
  const missingScenarioIds = [...knownScenarios.keys()].filter((scenarioId) => !seenScenarioIds.has(scenarioId));
  if (missingScenarioIds.length > 0) {
    throw new Error(
      `evaluation registry and known scenarios must have one-to-one closure; missing scenario_id: ${missingScenarioIds.join(", ")}`,
    );
  }
  return { schemaVersion: 1, scenarios };
}

async function validateAuthorityReceiptReference(props: {
  readonly repositoryRoot: string;
  readonly reference: z.infer<typeof receiptReferenceSchema>;
  readonly expectedKind: "current_baseline";
  readonly scenarioId: string;
  readonly behaviorContractDigest: string;
  readonly expectedReceiptPath: string;
}): Promise<AuthorityReceiptReference> {
  if (props.reference.receipt_path !== props.expectedReceiptPath) {
    throw new Error(
      `current_baseline authority receipt must use its scenario owner path: ${props.expectedReceiptPath}`,
    );
  }
  const validated = await readValidatedReceiptSource({
    repositoryRoot: props.repositoryRoot,
    reference: props.reference,
    label: `${props.expectedKind} authority receipt`,
  });
  let receipt: unknown;
  try {
    receipt = JSON.parse(validated.source.toString("utf8"));
  } catch {
    throw new Error(`${props.expectedKind} authority receipt is not valid JSON`);
  }
  if (typeof receipt !== "object" || receipt === null || Array.isArray(receipt)) {
    throw new Error(`${props.expectedKind} authority receipt must be an object`);
  }
  let baseline;
  try {
    baseline = parseCurrentBaselineReceipt(receipt);
  } catch (error) {
    throw new Error(`${props.expectedKind} authority receipt is invalid: ${error instanceof Error ? error.message : "unknown error"}`);
  }
  if (baseline.scenarioId !== props.scenarioId) {
    throw new Error(`${props.expectedKind} authority receipt scenario id does not match its registry row`);
  }
  if (baseline.behaviorContractDigest !== props.behaviorContractDigest) {
    throw new Error(`${props.expectedKind} authority receipt behavior contract digest does not match its registry row`);
  }
  return validated.reference;
}

async function readValidatedReceiptSource(props: {
  readonly repositoryRoot: string;
  readonly reference: z.infer<typeof receiptReferenceSchema>;
  readonly label: string;
}): Promise<{ readonly reference: AuthorityReceiptReference; readonly source: Buffer }> {
  let source: Buffer;
  try {
    source = await readTrackedAuthorityReceiptFile({
      repositoryRoot: props.repositoryRoot,
      receiptPath: props.reference.receipt_path,
      label: props.label,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      throw new Error(`authority receipt does not exist: ${props.reference.receipt_path}`);
    }
    throw error;
  }
  const actualDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualDigest !== props.reference.receipt_digest) {
    throw new Error(`${props.label} digest does not match: ${props.reference.receipt_path}`);
  }
  return {
    reference: { receiptPath: props.reference.receipt_path, receiptDigest: actualDigest },
    source,
  };
}

async function validateScenarioValidityReceiptReference(props: {
  readonly repositoryRoot: string;
  readonly reference: z.infer<typeof receiptReferenceSchema>;
  readonly expected: {
    readonly scenarioId: string;
    readonly behaviorContractDigest: string;
  };
}): Promise<AuthorityReceiptReference> {
  const validatedSource = await readValidatedReceiptSource({
    repositoryRoot: props.repositoryRoot,
    reference: props.reference,
    label: "scenario validity receipt",
  });
  let receipt: unknown;
  try {
    receipt = JSON.parse(validatedSource.source.toString("utf8")) as unknown;
  } catch (error) {
    throw new Error(
      `scenario validity receipt is not valid JSON: ${props.reference.receipt_path}: ${error instanceof Error ? error.message : "unknown parse error"}`,
    );
  }
  validateScenarioValidityReceipt({ receipt, expected: props.expected });
  return validatedSource.reference;
}
