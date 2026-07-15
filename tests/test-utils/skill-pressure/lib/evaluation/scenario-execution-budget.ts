export type ScenarioCommandType =
  | "subject"
  | "reviewer_session_create"
  | "reviewer_effort_config"
  | "reviewer_prompt"
  | "reviewer_close";

export interface ScenarioCommandBudgetSlot {
  readonly commandType: ScenarioCommandType;
  readonly acpxTimeoutMs: number;
  readonly executorOverheadMs: number;
  readonly terminationGraceMs: number;
}

export interface ScenarioExecutionBudgetInput {
  readonly repetitions: number;
  readonly infrastructureRetries: number;
  readonly acceptedCaps: ScenarioExecutionCaps;
  readonly commandSlots: readonly ScenarioCommandBudgetSlot[];
  readonly fixtureSetupReserveMs: number;
  readonly scenarioCleanupReserveMs: number;
  readonly receiptFlushReserveMs: number;
  readonly schedulingMarginMs: number;
  readonly registeredScenarioCount: number;
  readonly jobs: number;
  readonly vitestEmergencyReserveMs: number;
}

export interface ScenarioExecutionCaps {
  readonly maxModelPrompts: number;
  readonly maxAcpxCommands: number;
  readonly maxRetries: number;
  readonly maxObservedTokens: number;
}

export interface ScenarioExecutionGraph {
  readonly maximumModelPrompts: number;
  readonly maximumAcpxCommands: number;
  readonly maximumRetries: number;
  readonly maximumObservedTokens: number;
}

export interface ScenarioExecutionCapSnapshot {
  readonly modelPrompts: number;
  readonly acpxCommands: number;
  readonly retries: number;
  readonly observedTokens: number;
}

export interface DerivedScenarioExecutionBudget {
  readonly repetitions: number;
  readonly infrastructureRetries: number;
  readonly acceptedCaps: ScenarioExecutionCaps;
  readonly executionGraph: ScenarioExecutionGraph;
  readonly commandBudgets: readonly {
    readonly commandType: ScenarioCommandType;
    readonly perCommandMs: number;
    readonly criticalPathCount: number;
    readonly criticalPathMs: number;
  }[];
  readonly commandCriticalPathMs: number;
  readonly fixtureSetupReserveMs: number;
  readonly scenarioCleanupReserveMs: number;
  readonly receiptFlushReserveMs: number;
  readonly schedulingMarginMs: number;
  readonly scenarioDeadlineMs: number;
  readonly registeredScenarioCount: number;
  readonly jobs: number;
  readonly queueWaves: number;
  readonly vitestEmergencyReserveMs: number;
  readonly vitestEmergencyTimeoutMs: number;
}

const MIN_PRESSURE_REPETITIONS = 3;

export function deriveScenarioExecutionBudget(
  input: ScenarioExecutionBudgetInput,
): DerivedScenarioExecutionBudget {
  assertPositiveInteger(input.repetitions, "repetitions");
  if (input.repetitions !== MIN_PRESSURE_REPETITIONS) {
    throw new Error("pressure scenarios require exactly three repetitions per variant");
  }
  assertNonNegativeInteger(input.infrastructureRetries, "infrastructureRetries");
  validateExecutionCaps(input.acceptedCaps);
  assertPositiveInteger(input.registeredScenarioCount, "registeredScenarioCount");
  assertPositiveInteger(input.jobs, "jobs");
  assertNonNegativeInteger(input.fixtureSetupReserveMs, "fixtureSetupReserveMs");
  assertNonNegativeInteger(input.scenarioCleanupReserveMs, "scenarioCleanupReserveMs");
  assertNonNegativeInteger(input.receiptFlushReserveMs, "receiptFlushReserveMs");
  assertNonNegativeInteger(input.schedulingMarginMs, "schedulingMarginMs");
  assertNonNegativeInteger(input.vitestEmergencyReserveMs, "vitestEmergencyReserveMs");
  if (input.commandSlots.length === 0) throw new Error("commandSlots must not be empty");

  const commandTypes = input.commandSlots.map((slot) => slot.commandType);
  if (new Set(commandTypes).size !== commandTypes.length)
    throw new Error("commandSlots contain duplicate command types");
  if (!commandTypes.includes("subject"))
    throw new Error("commandSlots must include the subject command");
  const commandBudgets = input.commandSlots.map((slot) => {
    assertPositiveInteger(slot.acpxTimeoutMs, `${slot.commandType}.acpxTimeoutMs`);
    assertNonNegativeInteger(slot.executorOverheadMs, `${slot.commandType}.executorOverheadMs`);
    assertPositiveInteger(slot.terminationGraceMs, `${slot.commandType}.terminationGraceMs`);
    const criticalPathCount =
      slot.commandType === "subject"
        ? 2 * (input.infrastructureRetries + 1)
        : 1;
    const perCommandMs = slot.acpxTimeoutMs + slot.executorOverheadMs + slot.terminationGraceMs;
    return {
      commandType: slot.commandType,
      perCommandMs,
      criticalPathCount,
      criticalPathMs: perCommandMs * criticalPathCount,
    };
  });
  const commandCriticalPathMs = commandBudgets.reduce(
    (total, command) => total + command.criticalPathMs,
    0,
  );
  const subjectCommandCount = input.repetitions * 2 * (input.infrastructureRetries + 1);
  const reviewerPromptCount = commandTypes.includes("reviewer_prompt") ? 1 : 0;
  const executionGraph = {
    maximumModelPrompts: subjectCommandCount + reviewerPromptCount,
    maximumAcpxCommands: subjectCommandCount + commandTypes.filter((type) => type !== "subject").length,
    maximumRetries: input.repetitions * 2 * input.infrastructureRetries,
    maximumObservedTokens: input.acceptedCaps.maxObservedTokens,
  } satisfies ScenarioExecutionGraph;
  assertExecutionGraphFitsCaps(executionGraph, input.acceptedCaps);
  const scenarioDeadlineMs =
    commandCriticalPathMs +
    input.fixtureSetupReserveMs +
    input.scenarioCleanupReserveMs +
    input.receiptFlushReserveMs +
    input.schedulingMarginMs;
  const queueWaves = Math.ceil(input.registeredScenarioCount / input.jobs);

  return {
    repetitions: input.repetitions,
    infrastructureRetries: input.infrastructureRetries,
    acceptedCaps: input.acceptedCaps,
    executionGraph,
    commandBudgets,
    commandCriticalPathMs,
    fixtureSetupReserveMs: input.fixtureSetupReserveMs,
    scenarioCleanupReserveMs: input.scenarioCleanupReserveMs,
    receiptFlushReserveMs: input.receiptFlushReserveMs,
    schedulingMarginMs: input.schedulingMarginMs,
    scenarioDeadlineMs,
    registeredScenarioCount: input.registeredScenarioCount,
    jobs: input.jobs,
    queueWaves,
    vitestEmergencyReserveMs: input.vitestEmergencyReserveMs,
    vitestEmergencyTimeoutMs: scenarioDeadlineMs * queueWaves + input.vitestEmergencyReserveMs,
  };
}

export function createScenarioExecutionCapTracker(props: {
  readonly executionGraph: ScenarioExecutionGraph;
  readonly acceptedCaps: ScenarioExecutionCaps;
}): {
  readonly startCommand: (command: {
    readonly modelPrompt: boolean;
    readonly retry: boolean;
    readonly mandatoryCleanup?: boolean;
  }) => void;
  readonly recordObservedTokens: (count: number) => void;
  readonly snapshot: () => ScenarioExecutionCapSnapshot;
} {
  validateExecutionCaps(props.acceptedCaps);
  assertExecutionGraphFitsCaps(props.executionGraph, props.acceptedCaps);
  let modelPrompts = 0;
  let acpxCommands = 0;
  let retries = 0;
  let observedTokens = 0;
  return {
    startCommand: (command): void => {
      if (
        observedTokens >= props.acceptedCaps.maxObservedTokens &&
        command.mandatoryCleanup !== true
      ) {
        throw new Error(
          `observed-token cap is exhausted: ${observedTokens}/${props.acceptedCaps.maxObservedTokens}`,
        );
      }
      const nextModelPrompts = modelPrompts + (command.modelPrompt ? 1 : 0);
      const nextAcpxCommands = acpxCommands + 1;
      const nextRetries = retries + (command.retry ? 1 : 0);
      if (nextModelPrompts > props.executionGraph.maximumModelPrompts)
        throw new Error("execution graph model-prompt count exceeded");
      if (nextAcpxCommands > props.executionGraph.maximumAcpxCommands)
        throw new Error("execution graph ACPX-command count exceeded");
      if (nextRetries > props.executionGraph.maximumRetries)
        throw new Error("execution graph retry count exceeded");
      if (nextModelPrompts > props.acceptedCaps.maxModelPrompts)
        throw new Error("model-prompt cap is exhausted");
      if (nextAcpxCommands > props.acceptedCaps.maxAcpxCommands)
        throw new Error("ACPX-command cap is exhausted");
      if (nextRetries > props.acceptedCaps.maxRetries) throw new Error("retry cap is exhausted");
      modelPrompts = nextModelPrompts;
      acpxCommands = nextAcpxCommands;
      retries = nextRetries;
    },
    recordObservedTokens: (count): void => {
      assertNonNegativeInteger(count, "observedTokenCount");
      observedTokens += count;
      if (observedTokens > props.acceptedCaps.maxObservedTokens) {
        throw new Error(
          `observed-token cap exceeded: ${observedTokens}/${props.acceptedCaps.maxObservedTokens}`,
        );
      }
      if (observedTokens > props.executionGraph.maximumObservedTokens) {
        throw new Error("execution graph observed-token count exceeded");
      }
    },
    snapshot: (): ScenarioExecutionCapSnapshot => ({
      modelPrompts,
      acpxCommands,
      retries,
      observedTokens,
    }),
  };
}

export function readObservedTokenCount(observations: readonly string[]): number {
  if (observations.length === 0) throw new Error("ACPX usage observations are missing");
  const totals = observations.map((observation) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(observation) as unknown;
    } catch {
      throw new Error("ACPX usage observation is malformed");
    }
    const total = readTokenTotal(parsed);
    if (total === null) throw new Error("ACPX usage observation has no recognized token fields");
    return total;
  });
  return Math.max(...totals);
}

function readTokenTotal(value: unknown): number | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const usage = value as Record<string, unknown>;
  const explicitTotal = readTokenField(usage, ["totalTokens", "total_tokens"]);
  if (explicitTotal !== null) return explicitTotal;
  const input = readTokenField(usage, ["inputTokens", "input_tokens"]);
  const output = readTokenField(usage, ["outputTokens", "output_tokens"]);
  return input === null && output === null ? null : (input ?? 0) + (output ?? 0);
}

function readTokenField(
  usage: Readonly<Record<string, unknown>>,
  names: readonly string[],
): number | null {
  for (const name of names) {
    const value = usage[name];
    if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
  }
  return null;
}

function validateExecutionCaps(caps: ScenarioExecutionCaps): void {
  assertPositiveInteger(caps.maxModelPrompts, "maxModelPrompts");
  assertPositiveInteger(caps.maxAcpxCommands, "maxAcpxCommands");
  assertNonNegativeInteger(caps.maxRetries, "maxRetries");
  assertPositiveInteger(caps.maxObservedTokens, "maxObservedTokens");
}

function assertExecutionGraphFitsCaps(
  graph: ScenarioExecutionGraph,
  caps: ScenarioExecutionCaps,
): void {
  if (graph.maximumModelPrompts > caps.maxModelPrompts) {
    throw new Error(
      `execution graph exceeds model-prompt cap: ${graph.maximumModelPrompts}/${caps.maxModelPrompts}`,
    );
  }
  if (graph.maximumAcpxCommands > caps.maxAcpxCommands) {
    throw new Error(
      `execution graph exceeds ACPX-command cap: ${graph.maximumAcpxCommands}/${caps.maxAcpxCommands}`,
    );
  }
  if (graph.maximumRetries > caps.maxRetries) {
    throw new Error(
      `execution graph exceeds retry cap: ${graph.maximumRetries}/${caps.maxRetries}`,
    );
  }
  if (graph.maximumObservedTokens > caps.maxObservedTokens) {
    throw new Error(
      `execution graph exceeds observed-token cap: ${graph.maximumObservedTokens}/${caps.maxObservedTokens}`,
    );
  }
}

export function assertScenarioExecutionBudget(props: {
  readonly budget: DerivedScenarioExecutionBudget;
  readonly configuredScenarioDeadlineMs: number;
  readonly configuredVitestTimeoutMs: number;
}): void {
  assertPositiveInteger(props.configuredScenarioDeadlineMs, "configuredScenarioDeadlineMs");
  assertPositiveInteger(props.configuredVitestTimeoutMs, "configuredVitestTimeoutMs");
  if (props.configuredScenarioDeadlineMs < props.budget.scenarioDeadlineMs) {
    throw new Error(
      `scenario deadline is under-budget: configured ${props.configuredScenarioDeadlineMs}ms, required ${props.budget.scenarioDeadlineMs}ms`,
    );
  }
  const requiredVitestTimeoutMs =
    props.configuredScenarioDeadlineMs * props.budget.queueWaves +
    props.budget.vitestEmergencyReserveMs;
  if (props.configuredVitestTimeoutMs < requiredVitestTimeoutMs) {
    throw new Error(
      `Vitest emergency timeout is under-budget: configured ${props.configuredVitestTimeoutMs}ms, required ${requiredVitestTimeoutMs}ms`,
    );
  }
}

export function assertCommandCanStart(props: {
  readonly remainingScenarioBudgetMs: number;
  readonly commandBudgetMs: number;
}): void {
  assertNonNegativeInteger(props.remainingScenarioBudgetMs, "remainingScenarioBudgetMs");
  assertPositiveInteger(props.commandBudgetMs, "commandBudgetMs");
  if (props.remainingScenarioBudgetMs < props.commandBudgetMs) {
    throw new Error(
      `command cannot fit inside remaining supervised scenario budget: ${props.remainingScenarioBudgetMs}ms remaining, ${props.commandBudgetMs}ms required`,
    );
  }
}

export async function executeWithinCommandBudget<TResult>(props: {
  readonly remainingScenarioBudgetMs: number;
  readonly commandBudgetMs: number;
  readonly execute: () => Promise<TResult>;
}): Promise<TResult> {
  assertCommandCanStart(props);
  return props.execute();
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new Error(`${name} must be a positive integer`);
}

function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error(`${name} must be a non-negative integer`);
}
