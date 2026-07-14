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
  readonly commandSlots: readonly ScenarioCommandBudgetSlot[];
  readonly fixtureSetupReserveMs: number;
  readonly scenarioCleanupReserveMs: number;
  readonly receiptFlushReserveMs: number;
  readonly schedulingMarginMs: number;
  readonly registeredScenarioCount: number;
  readonly jobs: number;
  readonly vitestEmergencyReserveMs: number;
}

export interface DerivedScenarioExecutionBudget {
  readonly repetitions: number;
  readonly infrastructureRetries: number;
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

export function deriveScenarioExecutionBudget(
  input: ScenarioExecutionBudgetInput,
): DerivedScenarioExecutionBudget {
  assertPositiveInteger(input.repetitions, "repetitions");
  assertNonNegativeInteger(input.infrastructureRetries, "infrastructureRetries");
  assertPositiveInteger(input.registeredScenarioCount, "registeredScenarioCount");
  assertPositiveInteger(input.jobs, "jobs");
  assertNonNegativeInteger(input.fixtureSetupReserveMs, "fixtureSetupReserveMs");
  assertNonNegativeInteger(input.scenarioCleanupReserveMs, "scenarioCleanupReserveMs");
  assertNonNegativeInteger(input.receiptFlushReserveMs, "receiptFlushReserveMs");
  assertNonNegativeInteger(input.schedulingMarginMs, "schedulingMarginMs");
  assertNonNegativeInteger(input.vitestEmergencyReserveMs, "vitestEmergencyReserveMs");
  if (input.commandSlots.length === 0) throw new Error("commandSlots must not be empty");

  const commandTypes = input.commandSlots.map((slot) => slot.commandType);
  if (new Set(commandTypes).size !== commandTypes.length) throw new Error("commandSlots contain duplicate command types");
  if (!commandTypes.includes("subject")) throw new Error("commandSlots must include the subject command");
  const commandBudgets = input.commandSlots.map((slot) => {
    assertPositiveInteger(slot.acpxTimeoutMs, `${slot.commandType}.acpxTimeoutMs`);
    assertNonNegativeInteger(slot.executorOverheadMs, `${slot.commandType}.executorOverheadMs`);
    assertPositiveInteger(slot.terminationGraceMs, `${slot.commandType}.terminationGraceMs`);
    const criticalPathCount = slot.commandType === "subject"
      ? input.repetitions * 2 * (input.infrastructureRetries + 1)
      : 1;
    const perCommandMs = slot.acpxTimeoutMs + slot.executorOverheadMs + slot.terminationGraceMs;
    return {
      commandType: slot.commandType,
      perCommandMs,
      criticalPathCount,
      criticalPathMs: perCommandMs * criticalPathCount,
    };
  });
  const commandCriticalPathMs = commandBudgets.reduce((total, command) => total + command.criticalPathMs, 0);
  const scenarioDeadlineMs = commandCriticalPathMs + input.fixtureSetupReserveMs + input.scenarioCleanupReserveMs +
    input.receiptFlushReserveMs + input.schedulingMarginMs;
  const queueWaves = Math.ceil(input.registeredScenarioCount / input.jobs);

  return {
    repetitions: input.repetitions,
    infrastructureRetries: input.infrastructureRetries,
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

export function assertScenarioExecutionBudget(props: {
  readonly budget: DerivedScenarioExecutionBudget;
  readonly configuredScenarioDeadlineMs: number;
  readonly configuredVitestTimeoutMs: number;
}): void {
  assertPositiveInteger(props.configuredScenarioDeadlineMs, "configuredScenarioDeadlineMs");
  assertPositiveInteger(props.configuredVitestTimeoutMs, "configuredVitestTimeoutMs");
  if (props.configuredScenarioDeadlineMs < props.budget.scenarioDeadlineMs) {
    throw new Error(`scenario deadline is under-budget: configured ${props.configuredScenarioDeadlineMs}ms, required ${props.budget.scenarioDeadlineMs}ms`);
  }
  const requiredVitestTimeoutMs = props.configuredScenarioDeadlineMs * props.budget.queueWaves +
    props.budget.vitestEmergencyReserveMs;
  if (props.configuredVitestTimeoutMs < requiredVitestTimeoutMs) {
    throw new Error(`Vitest emergency timeout is under-budget: configured ${props.configuredVitestTimeoutMs}ms, required ${requiredVitestTimeoutMs}ms`);
  }
}

export function assertCommandCanStart(props: {
  readonly remainingScenarioBudgetMs: number;
  readonly commandBudgetMs: number;
}): void {
  assertNonNegativeInteger(props.remainingScenarioBudgetMs, "remainingScenarioBudgetMs");
  assertPositiveInteger(props.commandBudgetMs, "commandBudgetMs");
  if (props.remainingScenarioBudgetMs < props.commandBudgetMs) {
    throw new Error(`command cannot fit inside remaining supervised scenario budget: ${props.remainingScenarioBudgetMs}ms remaining, ${props.commandBudgetMs}ms required`);
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
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
}

function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
}
