import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";

import { parseDocument } from "yaml";
import { z } from "zod";

const TRACKED_AUTHORITY_RECEIPT_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const identifierSchema = z.string().min(1).max(200).regex(/^[a-z0-9][a-z0-9-]*$/u);
const digestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/u);
const receiptReferenceSchema = z.object({
  receipt_path: z.string().min(1),
  receipt_digest: digestSchema,
}).strict();
const authorityEventSchema = z.object({
  sequence: z.number().int().min(1),
  event: z.enum(["promotion", "demotion", "retirement"]),
  receipt_path: z.string().min(1),
  receipt_digest: digestSchema,
}).strict();
const commonRegistryRow = {
  scenario_id: identifierSchema,
  behavior_contract_digest: digestSchema,
  validity_review: receiptReferenceSchema,
  authority_history: z.array(authorityEventSchema),
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
  readonly authorityHistory: readonly {
    readonly sequence: number;
    readonly event: "promotion" | "demotion" | "retirement";
    readonly receipt: AuthorityReceiptReference;
  }[];
}

export interface EvaluationRegistry {
  readonly schemaVersion: 1;
  readonly scenarios: readonly EvaluationRegistryRow[];
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
    validateAuthorityHistory(row.authority_history, row.scenario_id);
    validateRoleHistoryConsistency(row);
    const validityReview = await validateReceiptReference(props.repositoryRoot, row.validity_review);
    const calibrationReceipt = row.calibration_receipt === null
      ? null
      : await validateReceiptReference(props.repositoryRoot, row.calibration_receipt);
    const authorityHistory = [];
    for (const event of row.authority_history) {
      authorityHistory.push({
        sequence: event.sequence,
        event: event.event,
        receipt: await validateReceiptReference(props.repositoryRoot, {
          receipt_path: event.receipt_path,
          receipt_digest: event.receipt_digest,
        }),
      });
    }
    scenarios.push({
      scenarioId: row.scenario_id,
      behaviorContractDigest: row.behavior_contract_digest,
      evaluationRole: row.evaluation_role,
      freshness: row.freshness,
      validityReview,
      calibrationReceipt,
      authorityHistory,
    });
  }
  return { schemaVersion: 1, scenarios };
}

function validateAuthorityHistory(
  history: readonly z.infer<typeof authorityEventSchema>[],
  scenarioId: string,
): void {
  let authorityState: "diagnostic" | "gate" | "retired" = "diagnostic";
  history.forEach((event, index) => {
    if (event.sequence !== index + 1) {
      throw new Error(`evaluation registry authority history is not contiguous for scenario ${scenarioId}`);
    }
    if (event.event === "promotion" && authorityState === "diagnostic") {
      authorityState = "gate";
      return;
    }
    if (event.event === "demotion" && authorityState === "gate") {
      authorityState = "diagnostic";
      return;
    }
    if (event.event === "retirement" && authorityState !== "retired") {
      authorityState = "retired";
      return;
    }
    throw new Error(
      `evaluation registry authority transition ${authorityState} -> ${event.event} is invalid for scenario ${scenarioId}`,
    );
  });
}

function validateRoleHistoryConsistency(row: z.infer<typeof registryRowSchema>): void {
  const latestEvent = row.authority_history.at(-1);
  if (row.evaluation_role === "gate" && latestEvent?.event !== "promotion") {
    throw new Error(`gate scenario requires a latest promotion authority history event: ${row.scenario_id}`);
  }
  if (
    row.evaluation_role === "diagnostic" &&
    (row.calibration_receipt !== null || row.authority_history.length > 0) &&
    latestEvent?.event !== "demotion"
  ) {
    throw new Error(`diagnostic scenario with authority history requires a latest demotion event: ${row.scenario_id}`);
  }
  if (row.evaluation_role === "retired" && latestEvent?.event !== "retirement") {
    throw new Error(`retired scenario requires a latest retirement event: ${row.scenario_id}`);
  }
  if (
    row.evaluation_role === "gate" &&
    latestEvent !== undefined &&
    (latestEvent.receipt_path !== row.calibration_receipt.receipt_path ||
      latestEvent.receipt_digest !== row.calibration_receipt.receipt_digest)
  ) {
    throw new Error(`gate calibration_receipt must match the latest promotion event: ${row.scenario_id}`);
  }
}

async function validateReceiptReference(
  repositoryRoot: string,
  reference: z.infer<typeof receiptReferenceSchema>,
): Promise<AuthorityReceiptReference> {
  const normalizedPath = path.posix.normalize(reference.receipt_path);
  if (
    normalizedPath !== reference.receipt_path ||
    path.posix.isAbsolute(normalizedPath) ||
    !(normalizedPath === TRACKED_AUTHORITY_RECEIPT_ROOT || normalizedPath.startsWith(`${TRACKED_AUTHORITY_RECEIPT_ROOT}/`))
  ) {
    throw new Error(`authority receipt must use the tracked authority receipt root: ${reference.receipt_path}`);
  }
  let source: string;
  try {
    const receiptStatus = await lstat(path.resolve(repositoryRoot, normalizedPath));
    if (!receiptStatus.isFile() || receiptStatus.nlink !== 1) {
      throw new Error(`authority receipt must be one regular file without links: ${normalizedPath}`);
    }
    source = await readFile(path.resolve(repositoryRoot, normalizedPath), "utf8");
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      throw new Error(`authority receipt does not exist: ${normalizedPath}`);
    }
    throw error;
  }
  const actualDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualDigest !== reference.receipt_digest) {
    throw new Error(`authority receipt digest does not match: ${normalizedPath}`);
  }
  return { receiptPath: normalizedPath, receiptDigest: actualDigest };
}
