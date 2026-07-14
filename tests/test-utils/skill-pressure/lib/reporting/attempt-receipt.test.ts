import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createScenarioProgressReceipt,
  writeAttemptReceipt,
  writeScenarioProgressReceipt,
} from "./attempt-receipt.js";

describe("attempt receipt", () => {
  const durableFacts = {
    processClosed: true,
    streamsDrained: true,
    outputRedacted: true,
    snapshotsCollected: true,
    cleanupFactsCollected: true,
  } as const;

  it("refuses to publish before process close, stream drain, redaction, snapshots, and cleanup facts", async () => {
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "attempt-receipt-"));

    await expect(writeAttemptReceipt({
      receiptDirectory,
      fileName: "attempt-1.json",
      durableFacts: { ...durableFacts, streamsDrained: false },
      receipt: { attemptId: "attempt-1", status: "timed_out" },
      secrets: [],
    })).rejects.toThrow(/streamsDrained/u);
  });

  it("redacts subject and reviewer stream data, including split chunks, before atomic publish and scans persisted bytes", async () => {
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "attempt-receipt-"));
    const secret = "seed-secret-value";

    const result = await writeAttemptReceipt({
      receiptDirectory,
      fileName: "attempt-1.json",
      durableFacts,
      receipt: {
        attemptId: "attempt-1",
        status: "timed_out",
        subject: { stdout: `subject ${secret}`, stderr: `subject ${secret}` },
        reviewer: { stdout: `reviewer ${secret}`, stderr: `reviewer ${secret}` },
        streamChunks: [`seed-`, "secret-value"],
        reasonCode: "scenario_deadline",
        cleanup: { termSent: true, killSent: true },
        snapshotDigest: "sha256:abc",
      },
      secrets: [secret],
    });

    const persisted = await readFile(result.receiptPath, "utf8");
    expect(persisted).not.toContain(secret);
    expect(persisted).not.toContain("seed-secret-value");
    expect(persisted).toContain("scenario_deadline");
    expect(persisted).toContain("sha256:abc");
    expect(persisted).toContain("termSent");
    expect(JSON.stringify(result.receipt)).not.toContain(secret);
    expect(result.receiptDigest).toMatch(/^sha256:/u);
  });

  it("does not publish a valid partial receipt when atomic publication is interrupted", async () => {
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "attempt-receipt-"));

    await expect(writeAttemptReceipt({
      receiptDirectory,
      fileName: "attempt-1.json",
      durableFacts,
      receipt: { attemptId: "attempt-1", status: "cancelled" },
      secrets: [],
      beforeAtomicPublish: () => {
        throw new Error("simulated interruption");
      },
    })).rejects.toThrow(/simulated interruption/u);

    await expect(readFile(path.join(receiptDirectory, "attempt-1.json"), "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    expect((await readdir(receiptDirectory)).every((entry) => !entry.endsWith(".json"))).toBe(true);
  });

  it("returns the exact JSON value that was atomically persisted", async () => {
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "attempt-receipt-"));
    const result = await writeAttemptReceipt({
      receiptDirectory,
      fileName: "attempt-json.json",
      durableFacts,
      receipt: { numeric: Number.NaN, omitted: undefined, nested: [Number.NaN] },
      secrets: [],
    });
    const persisted: unknown = JSON.parse(await readFile(result.receiptPath, "utf8"));

    expect(result.receipt).toEqual(persisted);
  });

  it("creates and atomically persists a progress receipt with its last durable stage and completed attempt paths", async () => {
    const progress = createScenarioProgressReceipt({
      scenarioId: "example",
      status: "timed_out",
      lastDurableStage: "attempt_receipt_published",
      completedAttemptReceiptPaths: ["/tmp/attempt-1.json", "/tmp/attempt-2.json"],
      reasonCode: "scenario_deadline",
    });
    const receiptDirectory = await mkdtemp(path.join(tmpdir(), "attempt-progress-"));
    const persisted = await writeScenarioProgressReceipt({
      receiptDirectory,
      fileName: "progress-1.json",
      progress,
      secrets: [],
    });

    expect(persisted.receipt).toMatchObject({
      lastDurableStage: "attempt_receipt_published",
      completedAttemptReceiptPaths: ["/tmp/attempt-1.json", "/tmp/attempt-2.json"],
      reasonCode: "scenario_deadline",
    });
    await expect(readFile(persisted.receiptPath, "utf8")).resolves.toContain("scenario_deadline");
  });
});
