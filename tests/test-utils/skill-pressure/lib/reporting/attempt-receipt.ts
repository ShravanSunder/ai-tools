import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export interface AttemptDurableFacts {
  readonly processClosed: boolean;
  readonly streamsDrained: boolean;
  readonly outputRedacted: boolean;
  readonly snapshotsCollected: boolean;
  readonly cleanupFactsCollected: boolean;
}

export interface WriteAttemptReceiptProps<TReceipt extends object> {
  readonly receiptDirectory: string;
  readonly fileName: string;
  readonly durableFacts: AttemptDurableFacts;
  readonly receipt: TReceipt;
  readonly secrets: readonly string[];
  readonly beforeAtomicPublish?: () => void;
}

export interface PersistedAttemptReceipt<TReceipt extends object> {
  readonly receiptPath: string;
  readonly receiptDigest: string;
  readonly receipt: TReceipt & {
    readonly schemaVersion: 1;
    readonly durableFacts: AttemptDurableFacts;
    readonly lastDurableStage: "attempt_receipt_published";
  };
}

export interface ScenarioProgressReceipt {
  readonly schemaVersion: 1;
  readonly scenarioId: string;
  readonly status: "running" | "timed_out" | "cancelled" | "completed" | "infrastructure_error";
  readonly lastDurableStage: string;
  readonly completedAttemptReceiptPaths: readonly string[];
  readonly reasonCode: string | null;
}

export async function writeAttemptReceipt<TReceipt extends object>(
  props: WriteAttemptReceiptProps<TReceipt>,
): Promise<PersistedAttemptReceipt<TReceipt>> {
  assertAttemptDurableFacts(props.durableFacts);
  const receipt = {
    ...props.receipt,
    schemaVersion: 1 as const,
    durableFacts: props.durableFacts,
    lastDurableStage: "attempt_receipt_published" as const,
  };
  const published = await publishAtomicRedactedReceipt({
    receiptDirectory: props.receiptDirectory,
    fileName: props.fileName,
    receipt,
    secrets: props.secrets,
    ...(props.beforeAtomicPublish === undefined ? {} : { beforeAtomicPublish: props.beforeAtomicPublish }),
  });
  return {
    receiptPath: published.receiptPath,
    receiptDigest: digest(await readFile(published.receiptPath)),
    receipt: published.receipt,
  };
}

export function createScenarioProgressReceipt(props: Omit<ScenarioProgressReceipt, "schemaVersion" | "reasonCode"> & {
  readonly reasonCode?: string | null;
}): ScenarioProgressReceipt {
  if (props.scenarioId.trim() === "") throw new Error("scenarioId must be non-empty");
  if (props.lastDurableStage.trim() === "") throw new Error("lastDurableStage must be non-empty");
  return {
    schemaVersion: 1,
    scenarioId: props.scenarioId,
    status: props.status,
    lastDurableStage: props.lastDurableStage,
    completedAttemptReceiptPaths: [...new Set(props.completedAttemptReceiptPaths)],
    reasonCode: props.reasonCode ?? null,
  };
}

export async function writeScenarioProgressReceipt(props: {
  readonly receiptDirectory: string;
  readonly fileName: string;
  readonly progress: ScenarioProgressReceipt;
  readonly secrets: readonly string[];
  readonly beforeAtomicPublish?: () => void;
}): Promise<{ readonly receiptPath: string; readonly receiptDigest: string; readonly receipt: ScenarioProgressReceipt }> {
  const published = await publishAtomicRedactedReceipt({
    receiptDirectory: props.receiptDirectory,
    fileName: props.fileName,
    receipt: { ...props.progress },
    secrets: props.secrets,
    ...(props.beforeAtomicPublish === undefined ? {} : { beforeAtomicPublish: props.beforeAtomicPublish }),
  });
  return {
    receiptPath: published.receiptPath,
    receiptDigest: digest(await readFile(published.receiptPath)),
    receipt: published.receipt,
  };
}

async function publishAtomicRedactedReceipt<TReceipt extends object>(props: {
  readonly receiptDirectory: string;
  readonly fileName: string;
  readonly receipt: TReceipt;
  readonly secrets: readonly string[];
  readonly beforeAtomicPublish?: () => void;
}): Promise<{ readonly receiptPath: string; readonly receipt: TReceipt }> {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.json$/u.test(props.fileName)) {
    throw new Error(`receipt fileName must be a simple JSON filename: ${props.fileName}`);
  }
  const receiptDirectory = path.resolve(props.receiptDirectory);
  const receiptPath = path.resolve(receiptDirectory, props.fileName);
  if (path.dirname(receiptPath) !== receiptDirectory) throw new Error("receipt path escapes receiptDirectory");
  await mkdir(receiptDirectory, { recursive: true });
  const redactedReceipt = redactReceiptValue(
    props.receipt,
    normalizedSecrets(props.secrets),
  ) as TReceipt;
  const serialized = `${JSON.stringify(redactedReceipt, null, 2)}\n`;
  const persistedReceipt = JSON.parse(serialized) as TReceipt;
  assertSecretsAbsent(Buffer.from(serialized), props.secrets);
  const temporaryPath = path.join(receiptDirectory, `.${props.fileName}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporaryPath, serialized, { encoding: "utf8", flag: "wx" });
    props.beforeAtomicPublish?.();
    await link(temporaryPath, receiptPath);
    const persisted = await readFile(receiptPath);
    assertSecretsAbsent(persisted, props.secrets);
    return { receiptPath, receipt: persistedReceipt };
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

function assertAttemptDurableFacts(facts: AttemptDurableFacts): void {
  for (const [name, complete] of Object.entries(facts)) {
    if (!complete) throw new Error(`attempt receipt requires ${name}`);
  }
}

function redactReceiptValue(value: unknown, secrets: readonly string[], propertyName?: string): unknown {
  if (typeof value === "string") return redactText(value, secrets);
  if (Array.isArray(value)) {
    if (isStreamChunkArray(propertyName, value)) return [redactText((value as readonly string[]).join(""), secrets)];
    return value.map((item) => redactReceiptValue(item, secrets));
  }
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactReceiptValue(item, secrets, key)]));
}

function isStreamChunkArray(propertyName: string | undefined, value: readonly unknown[]): boolean {
  return propertyName !== undefined && /(?:chunk|stdout|stderr|stream|output)/iu.test(propertyName) && value.every((item) => typeof item === "string");
}

function normalizedSecrets(secrets: readonly string[]): readonly string[] {
  return [...new Set(secrets.filter((secret) => secret.length > 0))].sort((left, right) => right.length - left.length);
}

function redactText(value: string, secrets: readonly string[]): string {
  return secrets.reduce((redacted, secret) => redacted.split(secret).join("[REDACTED]"), value);
}

function assertSecretsAbsent(value: Buffer, secrets: readonly string[]): void {
  for (const secret of normalizedSecrets(secrets)) {
    if (value.includes(Buffer.from(secret))) throw new Error("redaction failed: receipt bytes contain a secret");
  }
}

function digest(value: Buffer): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
