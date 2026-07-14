import { createHash, randomUUID } from "node:crypto";

import {
  assertComparablePair,
  runSubjectRepetition,
  type RunSubjectRepetitionProps,
  type SelectedSkillSource,
  type SubjectRepetitionReceipt,
} from "./subject-repetition.js";
import type { ScenarioBaseline } from "../contracts/contract-types.js";

const COORDINATOR_VERSION = "skill-pressure-coordinator-v1";

type RepetitionCommonProps = Omit<
  RunSubjectRepetitionProps,
  "variant" | "selectedSkillSource" | "execute"
>;

export interface RunScenarioRepetitionsProps {
  readonly repetitions: number;
  readonly infrastructureRetries?: number;
  readonly baselineSource: Exclude<SelectedSkillSource, { readonly mode: "current" }>;
  readonly treatmentSource: Extract<SelectedSkillSource, { readonly mode: "current" }>;
  readonly repetitionProps: RepetitionCommonProps;
  readonly runRepetition?: (props: RunSubjectRepetitionProps) => Promise<SubjectRepetitionReceipt>;
  readonly persistAttemptReceipt?: (props: {
    readonly receipt: SubjectRepetitionReceipt;
    readonly variant: "baseline" | "treatment";
    readonly repetitionNumber: number;
    readonly attemptNumber: number;
  }) => Promise<string>;
  readonly beforeAttempt?: (props: {
    readonly variant: "baseline" | "treatment";
    readonly repetitionNumber: number;
    readonly attemptNumber: number;
    readonly retry: boolean;
  }) => void;
}

export interface ScenarioRepetitionSetReceipt {
  readonly coordinatorVersion: typeof COORDINATOR_VERSION;
  readonly runId: string;
  readonly scenarioId: string;
  readonly requestedRepetitions: number;
  readonly infrastructureRetries: number;
  readonly baseline: readonly SubjectRepetitionReceipt[];
  readonly treatment: readonly SubjectRepetitionReceipt[];
  readonly attempts: readonly RepetitionAttemptReceipt[];
  readonly pairSetFingerprint: string;
  readonly status: "executed" | "infrastructure_error";
  readonly infrastructureReasons: readonly string[];
}

export interface RepetitionAttemptReceipt {
  readonly variant: "baseline" | "treatment";
  readonly repetitionNumber: number;
  readonly receipts: readonly SubjectRepetitionReceipt[];
  readonly durableAttemptReceiptPaths: readonly string[];
  readonly selectedRepetitionId: string;
}

export function selectBaselineSkillSource(props: {
  readonly baseline: ScenarioBaseline;
  readonly baselineRevision: string | null;
  readonly repositoryRoot: string;
  readonly skillRelativePath: string;
}): Exclude<SelectedSkillSource, { readonly mode: "current" }> {
  if (props.baseline === "no_skill") {
    if (props.baselineRevision !== null) {
      throw new Error("no-skill baseline may not declare a previous revision");
    }
    return { mode: "none" };
  }
  if (props.baselineRevision === null || !/^[a-f0-9]{40}$/u.test(props.baselineRevision)) {
    throw new Error("previous-revision baseline requires an immutable 40-character Git revision");
  }
  return {
    mode: "previous_revision",
    repositoryRoot: props.repositoryRoot,
    revision: props.baselineRevision,
    skillRelativePath: props.skillRelativePath,
  };
}

export async function runScenarioRepetitions(
  props: RunScenarioRepetitionsProps,
): Promise<ScenarioRepetitionSetReceipt> {
  if (!Number.isInteger(props.repetitions) || props.repetitions < 5) {
    throw new Error("pressure scenarios require at least five repetitions per variant");
  }
  const infrastructureRetries = props.infrastructureRetries ?? 0;
  if (!Number.isInteger(infrastructureRetries) || infrastructureRetries < 0) {
    throw new Error("infrastructureRetries must be a non-negative integer");
  }

  const runRepetition = props.runRepetition ?? runSubjectRepetition;
  const baseline: SubjectRepetitionReceipt[] = [];
  const treatment: SubjectRepetitionReceipt[] = [];
  const attempts: RepetitionAttemptReceipt[] = [];
  for (let repetitionIndex = 0; repetitionIndex < props.repetitions; repetitionIndex += 1) {
    const baselineAttempt = await runWithInfrastructureRetries({
      runRepetition,
      repetitionProps: props.repetitionProps,
      variant: "baseline",
      selectedSkillSource: props.baselineSource,
      repetitionNumber: repetitionIndex + 1,
      infrastructureRetries,
      persistAttemptReceipt: props.persistAttemptReceipt,
      beforeAttempt: props.beforeAttempt,
    });
    baseline.push(baselineAttempt.selected);
    attempts.push(baselineAttempt.receipt);
    const treatmentAttempt = await runWithInfrastructureRetries({
      runRepetition,
      repetitionProps: props.repetitionProps,
      variant: "treatment",
      selectedSkillSource: props.treatmentSource,
      repetitionNumber: repetitionIndex + 1,
      infrastructureRetries,
      persistAttemptReceipt: props.persistAttemptReceipt,
      beforeAttempt: props.beforeAttempt,
    });
    treatment.push(treatmentAttempt.selected);
    attempts.push(treatmentAttempt.receipt);
  }

  const infrastructureReasons = collectSetInfrastructureReasons(baseline, treatment);
  return {
    coordinatorVersion: COORDINATOR_VERSION,
    runId: randomUUID(),
    scenarioId: props.repetitionProps.scenarioId,
    requestedRepetitions: props.repetitions,
    infrastructureRetries,
    baseline,
    treatment,
    attempts,
    pairSetFingerprint: digest(
      JSON.stringify({
        coordinatorVersion: COORDINATOR_VERSION,
        scenarioId: props.repetitionProps.scenarioId,
        repetitions: props.repetitions,
        infrastructureRetries,
        commonInputDigest: uniqueValues(
          [...baseline, ...treatment].map((item) => item.commonInputDigest),
        ),
        promptDigest: uniqueValues([...baseline, ...treatment].map((item) => item.promptDigest)),
        fixtureDigest: uniqueValues([...baseline, ...treatment].map((item) => item.fixtureDigest)),
        model: props.repetitionProps.model,
        reasoningEffort: props.repetitionProps.reasoningEffort,
        permissionMode: props.repetitionProps.permissionMode,
        runtimeIdentity: props.repetitionProps.runtimeIdentity,
        baselineSourceMode: props.baselineSource.mode,
        baselineSourceDigest: uniqueValues(baseline.map((item) => item.sourceDigest)),
        baselineSourceRevision: uniqueValues(baseline.map((item) => item.sourceRevision)),
        treatmentSourceMode: props.treatmentSource.mode,
        treatmentSourceDigest: uniqueValues(treatment.map((item) => item.sourceDigest)),
        treatmentSourceRevision: uniqueValues(treatment.map((item) => item.sourceRevision)),
      }),
    ),
    status: infrastructureReasons.length === 0 ? "executed" : "infrastructure_error",
    infrastructureReasons,
  };
}

async function runWithInfrastructureRetries(props: {
  readonly runRepetition: (props: RunSubjectRepetitionProps) => Promise<SubjectRepetitionReceipt>;
  readonly repetitionProps: RepetitionCommonProps;
  readonly variant: "baseline" | "treatment";
  readonly selectedSkillSource: SelectedSkillSource;
  readonly repetitionNumber: number;
  readonly infrastructureRetries: number;
  readonly persistAttemptReceipt: RunScenarioRepetitionsProps["persistAttemptReceipt"];
  readonly beforeAttempt: RunScenarioRepetitionsProps["beforeAttempt"];
}): Promise<{
  readonly selected: SubjectRepetitionReceipt;
  readonly receipt: RepetitionAttemptReceipt;
}> {
  const receipts: SubjectRepetitionReceipt[] = [];
  const durableAttemptReceiptPaths: string[] = [];
  for (let attempt = 0; attempt <= props.infrastructureRetries; attempt += 1) {
    if (props.repetitionProps.signal?.aborted) {
      throw new Error(
        "runner abort signal is already aborted; refusing to launch another repetition attempt",
      );
    }
    props.beforeAttempt?.({
      variant: props.variant,
      repetitionNumber: props.repetitionNumber,
      attemptNumber: attempt + 1,
      retry: attempt > 0,
    });
    const receipt = await props.runRepetition({
      ...props.repetitionProps,
      variant: props.variant,
      selectedSkillSource: props.selectedSkillSource,
    });
    receipts.push(receipt);
    const durableAttemptReceiptPath = await props.persistAttemptReceipt?.({
      receipt,
      variant: props.variant,
      repetitionNumber: props.repetitionNumber,
      attemptNumber: attempt + 1,
    });
    if (durableAttemptReceiptPath !== undefined)
      durableAttemptReceiptPaths.push(durableAttemptReceiptPath);
    if (props.repetitionProps.signal?.aborted) {
      if (receipt.status === "executed") {
        throw new Error(
          "runner abort signal fired after a durable attempt receipt; refusing to accept the successful attempt",
        );
      }
      throw new Error("runner abort signal fired after a failed attempt; refusing retry");
    }
    if (receipt.status === "executed") break;
  }
  const selected = receipts.at(-1);
  if (selected === undefined) throw new Error("repetition attempt produced no receipt");
  return {
    selected,
    receipt: {
      variant: props.variant,
      repetitionNumber: props.repetitionNumber,
      receipts,
      durableAttemptReceiptPaths,
      selectedRepetitionId: selected.repetitionId,
    },
  };
}

function collectSetInfrastructureReasons(
  baseline: readonly SubjectRepetitionReceipt[],
  treatment: readonly SubjectRepetitionReceipt[],
): readonly string[] {
  const reasons: string[] = [];
  const all = [...baseline, ...treatment];
  if (baseline.length !== treatment.length || baseline.length < 5) {
    reasons.push("baseline and treatment repetition counts are invalid");
  }
  if (all.some((item) => item.status !== "executed")) {
    reasons.push("one or more repetitions contain an infrastructure error");
  }
  if (uniqueValues(all.map((item) => item.repetitionId)).length !== all.length) {
    reasons.push("repetition ids are not unique");
  }
  if (uniqueValues(all.map((item) => item.repositoryIdentity)).length !== all.length) {
    reasons.push("repository identities are not unique across repetitions");
  }
  const sessionIds = all.map((item) => item.transcript.sessionId);
  if (sessionIds.some((sessionId) => sessionId === null)) {
    reasons.push("one or more ACPX session ids are missing");
  } else if (uniqueValues(sessionIds).length !== all.length) {
    reasons.push("ACPX session ids are not unique across repetitions");
  }
  if (uniqueValues(all.map((item) => item.commonInputDigest)).length !== 1) {
    reasons.push("common inputs differ across repetitions");
  }
  if (uniqueValues(all.map((item) => item.promptDigest)).length !== 1) {
    reasons.push("prompt digests differ across repetitions");
  }
  if (uniqueValues(all.map((item) => item.fixtureDigest)).length !== 1) {
    reasons.push("fixture digests differ across repetitions");
  }
  if (uniqueValues(baseline.map((item) => item.sourceDigest)).length !== 1) {
    reasons.push("baseline source digest differs across repetitions");
  }
  if (uniqueValues(baseline.map((item) => item.sourceRevision)).length !== 1) {
    reasons.push("baseline source revision differs across repetitions");
  }
  if (uniqueValues(treatment.map((item) => item.sourceDigest)).length !== 1) {
    reasons.push("treatment source digest differs across repetitions");
  }
  for (let index = 0; index < Math.min(baseline.length, treatment.length); index += 1) {
    const baselineReceipt = baseline[index];
    const treatmentReceipt = treatment[index];
    if (baselineReceipt === undefined || treatmentReceipt === undefined) continue;
    try {
      assertComparablePair(baselineReceipt, treatmentReceipt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown pair comparison error";
      reasons.push(`pair ${index + 1} is not comparable: ${message}`);
    }
  }
  return [...new Set(reasons)];
}

function uniqueValues<TValue>(values: readonly TValue[]): readonly TValue[] {
  return [...new Set(values)];
}

function digest(value: string): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
