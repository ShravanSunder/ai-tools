import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";

import type { ClaimedRequirementValidation } from "../authority/claimed-requirements.js";
import type { EvaluationRegistry } from "../authority/evaluation-registry.js";
import type { DiscoveryReceipt } from "../discovery/skill-discovery.js";
import {
  ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE,
  ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
} from "../runtime/runtime-profile.js";
import type { ExecuteBehavioralScenarioProps } from "./behavioral-scenario-runner.js";
import {
  deriveScenarioExecutionBudget,
  type DerivedScenarioExecutionBudget,
  type ScenarioExecutionCaps,
} from "./scenario-execution-budget.js";

const DEFAULT_JOB_COUNT = 4;
const DEFAULT_TIMEOUT_SECONDS = 180;

export interface SkillPressureEvaluationConfiguration {
  readonly fast: boolean;
  readonly scenarioId?: string;
  readonly risk?: "standard" | "high";
  readonly jobs: number;
  readonly timeoutSeconds: number;
  readonly dryRun: boolean;
  readonly acceptedCaps: ScenarioExecutionCaps | null;
}

export interface SkillPressureEvaluationCase extends ExecuteBehavioralScenarioProps {
  readonly scenarioId: string;
  readonly concurrent: boolean;
  readonly scenarioDeadlineMs: number;
  readonly vitestTimeoutMs: number;
  readonly behaviorContractDigest: string;
  readonly baseline: "no_skill" | "previous_revision";
  readonly baselineRevision: string | null;
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly risk: "standard" | "high";
}

export interface SkillPressureExecutionGraphReceipt {
  readonly schemaVersion: 1;
  readonly selectedScenarioIds: readonly string[];
  readonly executionGraph: {
    readonly maximumModelPrompts: number;
    readonly maximumAcpxCommands: number;
    readonly maximumRetries: number;
    readonly maximumObservedTokens: number;
  };
  readonly acceptedCaps: ScenarioExecutionCaps;
  readonly perScenarioObservedTokenCap: number;
  readonly runnerSemanticsDigest: string;
  readonly subjectProfile: typeof ACPX_LUNA_XHIGH_SUBJECT_PROFILE;
  readonly scenarios: readonly {
    readonly scenarioId: string;
    readonly behaviorContractDigest: string;
    readonly baseline: "no_skill" | "previous_revision";
    readonly baselineRevision: string | null;
    readonly comparisonIntent: "improvement" | "non_regression";
    readonly risk: "standard" | "high";
    readonly reviewProfile:
      | typeof ACPX_LUNA_XHIGH_SUBJECT_PROFILE
      | typeof ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE;
    readonly commandBudgets: DerivedScenarioExecutionBudget["commandBudgets"];
    readonly scenarioDeadlineMs: number;
    readonly vitestTimeoutMs: number;
  }[];
  readonly status: "accepted_before_launch";
  readonly receiptDigest: string;
}

export function resolveSkillPressureEvaluationConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): SkillPressureEvaluationConfiguration {
  const fast = parseBooleanEnvironmentValue(environment.SKILL_PRESSURE_FAST, "SKILL_PRESSURE_FAST");
  const dryRun = parseBooleanEnvironmentValue(
    environment.SKILL_PRESSURE_DRY_RUN,
    "SKILL_PRESSURE_DRY_RUN",
  );
  const serial = parseBooleanEnvironmentValue(
    environment.SKILL_PRESSURE_SERIAL,
    "SKILL_PRESSURE_SERIAL",
  );
  const scenarioId = parseScenarioId(environment.SKILL_PRESSURE_SCENARIO);
  const risk = parseRisk(environment.SKILL_PRESSURE_RISK);
  const requestedJobs = parseJobCount(environment.SKILL_PRESSURE_JOBS);
  const timeoutSeconds = parsePositiveInteger(
    environment.SKILL_PRESSURE_TIMEOUT_SECONDS,
    "SKILL_PRESSURE_TIMEOUT_SECONDS",
    DEFAULT_TIMEOUT_SECONDS,
  );
  const acceptedCaps = parseExecutionCaps(environment);

  if (fast && (scenarioId !== undefined || risk !== undefined)) {
    throw new Error(
      "SKILL_PRESSURE_FAST cannot be combined with SKILL_PRESSURE_SCENARIO or SKILL_PRESSURE_RISK",
    );
  }

  return {
    fast,
    dryRun,
    ...(scenarioId === undefined ? {} : { scenarioId }),
    ...(risk === undefined ? {} : { risk }),
    jobs: serial || scenarioId !== undefined ? 1 : requestedJobs,
    timeoutSeconds,
    acceptedCaps,
  };
}

export function selectedScenarioIdsForEvaluation(
  configuration: SkillPressureEvaluationConfiguration,
  fastScenarioIds: readonly string[],
): readonly string[] | undefined {
  if (configuration.fast) return fastScenarioIds;
  return configuration.scenarioId === undefined ? undefined : [configuration.scenarioId];
}

export function buildSkillPressureEvaluationCases(props: {
  readonly repositoryRoot: string;
  readonly discoveryReceipt: DiscoveryReceipt;
  readonly configuration: SkillPressureEvaluationConfiguration;
  readonly runId: string;
  readonly registrySnapshot: EvaluationRegistry;
  readonly claimedRequirements: ClaimedRequirementValidation;
}): readonly SkillPressureEvaluationCase[] {
  if (props.discoveryReceipt.invalid.length > 0) {
    throw new Error(
      `invalid discovery receipt: ${props.discoveryReceipt.invalid.map((receipt) => receipt.detail).join("; ")}`,
    );
  }
  if (
    props.configuration.scenarioId !== undefined &&
    props.discoveryReceipt.selected.length !== 1
  ) {
    throw new Error(
      `SKILL_PRESSURE_SCENARIO ${props.configuration.scenarioId} did not resolve to exactly one scenario`,
    );
  }

  const outputDirectories = new Set<string>();
  const selectedScenarios =
    props.configuration.risk === undefined
      ? props.discoveryReceipt.selected
      : props.discoveryReceipt.selected.filter(
          (scenario) => scenario.risk === props.configuration.risk,
        );
  if (selectedScenarios.length > 0 && props.configuration.acceptedCaps === null) {
    throw new Error(
      "explicit model-prompt, ACPX-command, retry, and observed-token caps are required before pressure execution",
    );
  }
  const evaluationCases = selectedScenarios.map((scenario) => {
    const outputDirectory = path.resolve(
      props.repositoryRoot,
      "tmp/skill-pressure-evals",
      `${props.runId}-${scenario.scenarioId}`,
    );
    if (outputDirectories.has(outputDirectory)) {
      throw new Error(`scenario output directory is not unique: ${outputDirectory}`);
    }
    outputDirectories.add(outputDirectory);
    const derivedBudget = deriveScenarioExecutionBudget({
      repetitions: scenario.repetitions,
      infrastructureRetries: 1,
      acceptedCaps: props.configuration.acceptedCaps ?? missingExecutionCaps(),
      commandSlots:
        scenario.risk === "high"
          ? [
              {
                commandType: "subject",
                acpxTimeoutMs: props.configuration.timeoutSeconds * 1_000,
                executorOverheadMs: 10_000,
                terminationGraceMs: 5_000,
              },
              {
                commandType: "reviewer_session_create",
                acpxTimeoutMs: 30_000,
                executorOverheadMs: 5_000,
                terminationGraceMs: 5_000,
              },
              {
                commandType: "reviewer_effort_config",
                acpxTimeoutMs: 30_000,
                executorOverheadMs: 5_000,
                terminationGraceMs: 5_000,
              },
              {
                commandType: "reviewer_prompt",
                acpxTimeoutMs: props.configuration.timeoutSeconds * 1_000,
                executorOverheadMs: 10_000,
                terminationGraceMs: 5_000,
              },
              {
                commandType: "reviewer_close",
                acpxTimeoutMs: 30_000,
                executorOverheadMs: 5_000,
                terminationGraceMs: 5_000,
              },
            ]
          : [
              {
                commandType: "subject",
                acpxTimeoutMs: props.configuration.timeoutSeconds * 1_000,
                executorOverheadMs: 10_000,
                terminationGraceMs: 5_000,
              },
              {
                commandType: "reviewer_prompt",
                acpxTimeoutMs: props.configuration.timeoutSeconds * 1_000,
                executorOverheadMs: 10_000,
                terminationGraceMs: 5_000,
              },
            ],
      fixtureSetupReserveMs: 10_000,
      scenarioCleanupReserveMs: 20_000,
      receiptFlushReserveMs: 10_000,
      schedulingMarginMs: 5_000,
      registeredScenarioCount: selectedScenarios.length,
      jobs: props.configuration.jobs,
      vitestEmergencyReserveMs: 30_000,
    });
    const perScenarioObservedTokenCap = Math.floor(
      (props.configuration.acceptedCaps?.maxObservedTokens ?? 0) / selectedScenarios.length,
    );
    const budget = {
      ...derivedBudget,
      executionGraph: {
        ...derivedBudget.executionGraph,
        maximumObservedTokens: perScenarioObservedTokenCap,
      },
      acceptedCaps: {
        maxModelPrompts: derivedBudget.executionGraph.maximumModelPrompts,
        maxAcpxCommands: derivedBudget.executionGraph.maximumAcpxCommands,
        maxRetries: derivedBudget.executionGraph.maximumRetries,
        maxObservedTokens: perScenarioObservedTokenCap,
      },
    } satisfies typeof derivedBudget;
    return {
      scenarioId: scenario.scenarioId,
      behaviorContractDigest: scenario.behaviorContractDigest,
      baseline: scenario.baseline,
      baselineRevision: scenario.baselineRevision,
      comparisonIntent: scenario.comparisonIntent,
      risk: scenario.risk,
      scenarioPath: scenario.scenarioPath,
      skillDirectory: path.resolve(
        props.repositoryRoot,
        "plugins",
        scenario.owner.plugin,
        "skills",
        scenario.owner.skill,
      ),
      outputDirectory,
      timeoutSeconds: props.configuration.timeoutSeconds,
      infrastructureRetries: 1,
      registrySnapshot: props.registrySnapshot,
      claimedRequirements: props.claimedRequirements,
      executionBudget: budget,
      concurrent: props.configuration.scenarioId === undefined,
      scenarioDeadlineMs: budget.scenarioDeadlineMs,
      vitestTimeoutMs: budget.vitestEmergencyTimeoutMs,
    } satisfies SkillPressureEvaluationCase;
  });

  if (evaluationCases.length > 0) {
    assertSuiteExecutionGraphFitsCaps({
      evaluationCases,
      acceptedCaps: props.configuration.acceptedCaps ?? missingExecutionCaps(),
    });
  }
  return evaluationCases;
}

export function createSkillPressureExecutionGraphReceipt(props: {
  readonly evaluationCases: readonly SkillPressureEvaluationCase[];
  readonly acceptedCaps: ScenarioExecutionCaps;
  readonly runnerSemanticsDigest: string;
}): SkillPressureExecutionGraphReceipt {
  if (!/^sha256:[a-f0-9]{64}$/u.test(props.runnerSemanticsDigest)) {
    throw new Error("runnerSemanticsDigest must be a SHA-256 digest");
  }
  const graph = assertSuiteExecutionGraphFitsCaps(props);
  const base = {
    schemaVersion: 1 as const,
    selectedScenarioIds: props.evaluationCases.map((evaluationCase) => evaluationCase.scenarioId),
    executionGraph: graph.executionGraph,
    acceptedCaps: props.acceptedCaps,
    perScenarioObservedTokenCap: graph.perScenarioObservedTokenCap,
    runnerSemanticsDigest: props.runnerSemanticsDigest,
    subjectProfile: ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
    scenarios: props.evaluationCases.map((evaluationCase) => ({
      scenarioId: evaluationCase.scenarioId,
      behaviorContractDigest: evaluationCase.behaviorContractDigest,
      baseline: evaluationCase.baseline,
      baselineRevision: evaluationCase.baselineRevision,
      comparisonIntent: evaluationCase.comparisonIntent,
      risk: evaluationCase.risk,
      reviewProfile:
        evaluationCase.risk === "high"
          ? ACPX_CLAUDE_OPUS_XHIGH_REVIEW_PROFILE
          : ACPX_LUNA_XHIGH_SUBJECT_PROFILE,
      commandBudgets: evaluationCase.executionBudget.commandBudgets,
      scenarioDeadlineMs: evaluationCase.scenarioDeadlineMs,
      vitestTimeoutMs: evaluationCase.vitestTimeoutMs,
    })),
    status: "accepted_before_launch" as const,
  };
  return {
    ...base,
    receiptDigest: `sha256:${createHash("sha256").update(JSON.stringify(base)).digest("hex")}`,
  };
}

export async function validatePersistedSkillPressureExecutionGraphReceipt(props: {
  readonly receiptPath: string;
  readonly receiptDigest: string;
  readonly expectedReceipt: SkillPressureExecutionGraphReceipt;
}): Promise<void> {
  const status = await lstat(props.receiptPath);
  if (!status.isFile() || status.nlink !== 1) {
    throw new Error("execution-graph preflight receipt must be one regular file without links");
  }
  const source = await readFile(props.receiptPath);
  const actualDigest = `sha256:${createHash("sha256").update(source).digest("hex")}`;
  if (actualDigest !== props.receiptDigest) {
    throw new Error("execution-graph preflight persisted digest does not match its reference");
  }
  const persisted: unknown = JSON.parse(source.toString("utf8"));
  if (JSON.stringify(persisted) !== JSON.stringify(props.expectedReceipt)) {
    throw new Error("execution-graph preflight persisted source does not match the accepted graph");
  }
}

function assertSuiteExecutionGraphFitsCaps(props: {
  readonly evaluationCases: readonly SkillPressureEvaluationCase[];
  readonly acceptedCaps: ScenarioExecutionCaps;
}): {
  readonly executionGraph: SkillPressureExecutionGraphReceipt["executionGraph"];
  readonly perScenarioObservedTokenCap: number;
} {
  const executionGraph = props.evaluationCases.reduce(
    (total, evaluationCase) => ({
      maximumModelPrompts:
        total.maximumModelPrompts +
        evaluationCase.executionBudget.executionGraph.maximumModelPrompts,
      maximumAcpxCommands:
        total.maximumAcpxCommands +
        evaluationCase.executionBudget.executionGraph.maximumAcpxCommands,
      maximumRetries:
        total.maximumRetries + evaluationCase.executionBudget.executionGraph.maximumRetries,
      maximumObservedTokens:
        total.maximumObservedTokens +
        evaluationCase.executionBudget.executionGraph.maximumObservedTokens,
    }),
    {
      maximumModelPrompts: 0,
      maximumAcpxCommands: 0,
      maximumRetries: 0,
      maximumObservedTokens: 0,
    },
  );
  if (executionGraph.maximumModelPrompts > props.acceptedCaps.maxModelPrompts) {
    throw new Error("selected execution graph exceeds the accepted model-prompt cap");
  }
  if (executionGraph.maximumAcpxCommands > props.acceptedCaps.maxAcpxCommands) {
    throw new Error("selected execution graph exceeds the accepted ACPX-command cap");
  }
  if (executionGraph.maximumRetries > props.acceptedCaps.maxRetries) {
    throw new Error("selected execution graph exceeds the accepted retry cap");
  }
  if (executionGraph.maximumObservedTokens > props.acceptedCaps.maxObservedTokens) {
    throw new Error("selected execution graph exceeds the accepted observed-token cap");
  }
  const perScenarioObservedTokenCap =
    props.evaluationCases.length === 0
      ? props.acceptedCaps.maxObservedTokens
      : Math.floor(props.acceptedCaps.maxObservedTokens / props.evaluationCases.length);
  if (perScenarioObservedTokenCap <= 0) {
    throw new Error(
      "accepted observed-token cap cannot allocate a positive cap to every selected scenario",
    );
  }
  return { executionGraph, perScenarioObservedTokenCap };
}

function parseExecutionCaps(
  environment: Readonly<Record<string, string | undefined>>,
): ScenarioExecutionCaps | null {
  const names = [
    "SKILL_PRESSURE_MAX_MODEL_PROMPTS",
    "SKILL_PRESSURE_MAX_ACPX_COMMANDS",
    "SKILL_PRESSURE_MAX_RETRIES",
    "SKILL_PRESSURE_MAX_OBSERVED_TOKENS",
  ] as const;
  const present = names.filter(
    (name) => environment[name] !== undefined && environment[name] !== "",
  );
  if (present.length === 0) return null;
  if (present.length !== names.length)
    throw new Error("all skill-pressure execution caps must be supplied together");
  return {
    maxModelPrompts: parsePositiveInteger(
      environment.SKILL_PRESSURE_MAX_MODEL_PROMPTS,
      names[0],
      0,
    ),
    maxAcpxCommands: parsePositiveInteger(
      environment.SKILL_PRESSURE_MAX_ACPX_COMMANDS,
      names[1],
      0,
    ),
    maxRetries: parseNonNegativeInteger(environment.SKILL_PRESSURE_MAX_RETRIES, names[2]),
    maxObservedTokens: parsePositiveInteger(
      environment.SKILL_PRESSURE_MAX_OBSERVED_TOKENS,
      names[3],
      0,
    ),
  };
}

function parseNonNegativeInteger(value: string | undefined, name: string): number {
  if (value === undefined || !/^\d+$/u.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return Number(value);
}

function missingExecutionCaps(): never {
  throw new Error("execution caps are unavailable");
}

function parseRisk(value: string | undefined): "standard" | "high" | undefined {
  if (value === undefined || value === "") return undefined;
  if (value === "standard" || value === "high") return value;
  throw new Error("SKILL_PRESSURE_RISK must be standard or high");
}

export function createBoundedConcurrencyGate(maximumConcurrency: number): {
  readonly run: <TResult>(operation: () => Promise<TResult>) => Promise<TResult>;
} {
  if (!Number.isInteger(maximumConcurrency) || maximumConcurrency <= 0) {
    throw new Error("maximumConcurrency must be a positive integer");
  }
  let active = 0;
  const waiting: Array<() => void> = [];

  return {
    run: async <TResult>(operation: () => Promise<TResult>): Promise<TResult> => {
      if (active >= maximumConcurrency) {
        await new Promise<void>((resolve) => waiting.push(resolve));
      }
      active += 1;
      try {
        return await operation();
      } finally {
        active -= 1;
        waiting.shift()?.();
      }
    },
  };
}

function parseBooleanEnvironmentValue(value: string | undefined, name: string): boolean {
  if (value === undefined || value === "" || value === "0" || value === "false") {
    return false;
  }
  if (value === "1" || value === "true") {
    return true;
  }
  throw new Error(`${name} must be one of 0, 1, false, or true`);
}

function parseScenarioId(value: string | undefined): string | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  if (value.trim() !== value) {
    throw new Error("SKILL_PRESSURE_SCENARIO must not include surrounding whitespace");
  }
  return value;
}

function parseJobCount(value: string | undefined): number {
  return parsePositiveInteger(value, "SKILL_PRESSURE_JOBS", DEFAULT_JOB_COUNT);
}

function parsePositiveInteger(
  value: string | undefined,
  name: string,
  defaultValue: number,
): number {
  if (value === undefined || value === "") {
    return defaultValue;
  }
  if (!/^[1-9]\d*$/u.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error(`${name} must be a positive integer`);
  }
  return Number(value);
}
