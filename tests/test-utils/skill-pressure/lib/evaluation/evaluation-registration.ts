import path from "node:path";

import type { DiscoveryReceipt } from "../discovery/skill-discovery.js";
import type { ExecuteBehavioralScenarioProps } from "./behavioral-scenario-runner.js";

const DEFAULT_JOB_COUNT = 4;
const DEFAULT_TIMEOUT_SECONDS = 180;

export interface SkillPressureEvaluationConfiguration {
  readonly fast: boolean;
  readonly scenarioId?: string;
  readonly jobs: number;
  readonly timeoutSeconds: number;
}

export interface SkillPressureEvaluationCase extends ExecuteBehavioralScenarioProps {
  readonly scenarioId: string;
  readonly concurrent: boolean;
}

export function resolveSkillPressureEvaluationConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): SkillPressureEvaluationConfiguration {
  const fast = parseBooleanEnvironmentValue(environment.SKILL_PRESSURE_FAST, "SKILL_PRESSURE_FAST");
  const serial = parseBooleanEnvironmentValue(environment.SKILL_PRESSURE_SERIAL, "SKILL_PRESSURE_SERIAL");
  const scenarioId = parseScenarioId(environment.SKILL_PRESSURE_SCENARIO);
  const requestedJobs = parseJobCount(environment.SKILL_PRESSURE_JOBS);
  const timeoutSeconds = parsePositiveInteger(
    environment.SKILL_PRESSURE_TIMEOUT_SECONDS,
    "SKILL_PRESSURE_TIMEOUT_SECONDS",
    DEFAULT_TIMEOUT_SECONDS,
  );

  return {
    fast,
    ...(scenarioId === undefined ? {} : { scenarioId }),
    jobs: serial || scenarioId !== undefined ? 1 : requestedJobs,
    timeoutSeconds,
  };
}

export function selectedScenarioIdsForEvaluation(
  configuration: SkillPressureEvaluationConfiguration,
): readonly string[] | undefined {
  return configuration.scenarioId === undefined ? undefined : [configuration.scenarioId];
}

export function buildSkillPressureEvaluationCases(props: {
  readonly repositoryRoot: string;
  readonly discoveryReceipt: DiscoveryReceipt;
  readonly configuration: SkillPressureEvaluationConfiguration;
  readonly runId: string;
}): readonly SkillPressureEvaluationCase[] {
  if (props.discoveryReceipt.invalid.length > 0) {
    throw new Error(`invalid discovery receipt: ${props.discoveryReceipt.invalid.map((receipt) => receipt.detail).join("; ")}`);
  }
  if (props.configuration.scenarioId !== undefined && props.discoveryReceipt.selected.length !== 1) {
    throw new Error(`SKILL_PRESSURE_SCENARIO ${props.configuration.scenarioId} did not resolve to exactly one scenario`);
  }

  const outputDirectories = new Set<string>();
  const evaluationCases = props.discoveryReceipt.selected.map((scenario) => {
    const outputDirectory = path.resolve(
      props.repositoryRoot,
      "tmp/skill-pressure-evals",
      `${props.runId}-${scenario.scenarioId}`,
    );
    if (outputDirectories.has(outputDirectory)) {
      throw new Error(`scenario output directory is not unique: ${outputDirectory}`);
    }
    outputDirectories.add(outputDirectory);
    return {
      scenarioId: scenario.scenarioId,
      scenarioPath: scenario.scenarioPath,
      skillDirectory: path.resolve(props.repositoryRoot, "plugins", scenario.owner.plugin, "skills", scenario.owner.skill),
      outputDirectory,
      timeoutSeconds: props.configuration.timeoutSeconds,
      infrastructureRetries: 1,
      concurrent: props.configuration.scenarioId === undefined,
    } satisfies SkillPressureEvaluationCase;
  });

  return evaluationCases;
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
