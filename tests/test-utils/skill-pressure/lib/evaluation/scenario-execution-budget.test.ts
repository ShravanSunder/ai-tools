import { describe, expect, it, vi } from "vitest";

import {
  assertCommandCanStart,
  assertScenarioExecutionBudget,
  createScenarioExecutionCapTracker,
  deriveScenarioExecutionBudget,
  executeWithinCommandBudget,
  readObservedTokenCount,
} from "./scenario-execution-budget.js";

const acceptedCaps = {
  maxModelPrompts: 21,
  maxAcpxCommands: 24,
  maxRetries: 10,
  maxObservedTokens: 1_500_000,
} as const;

describe("scenario execution budget", () => {
  it("derives the serial critical path from ACPX, supervision, retries, repetitions, and command type", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 1,
      acceptedCaps,
      commandSlots: [
        {
          commandType: "subject",
          acpxTimeoutMs: 180_000,
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
          acpxTimeoutMs: 120_000,
          executorOverheadMs: 10_000,
          terminationGraceMs: 5_000,
        },
        {
          commandType: "reviewer_close",
          acpxTimeoutMs: 30_000,
          executorOverheadMs: 5_000,
          terminationGraceMs: 5_000,
        },
      ],
      fixtureSetupReserveMs: 10_000,
      scenarioCleanupReserveMs: 20_000,
      receiptFlushReserveMs: 10_000,
      schedulingMarginMs: 5_000,
      registeredScenarioCount: 5,
      jobs: 2,
      vitestEmergencyReserveMs: 30_000,
    });

    expect(budget.commandBudgets).toContainEqual({
      commandType: "subject",
      perCommandMs: 195_000,
      criticalPathCount: 20,
      criticalPathMs: 3_900_000,
    });
    expect(budget.scenarioDeadlineMs).toBe(4_200_000);
    expect(budget.queueWaves).toBe(3);
    expect(budget.vitestEmergencyTimeoutMs).toBe(12_630_000);
    expect(budget.executionGraph).toEqual({
      maximumModelPrompts: 21,
      maximumAcpxCommands: 24,
      maximumRetries: 10,
      maximumObservedTokens: 1_500_000,
    });
  });

  it("rejects the old fixed high-risk envelope before ACPX can launch", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 1,
      acceptedCaps,
      commandSlots: [
        {
          commandType: "subject",
          acpxTimeoutMs: 180_000,
          executorOverheadMs: 10_000,
          terminationGraceMs: 5_000,
        },
      ],
      fixtureSetupReserveMs: 10_000,
      scenarioCleanupReserveMs: 20_000,
      receiptFlushReserveMs: 10_000,
      schedulingMarginMs: 5_000,
      registeredScenarioCount: 1,
      jobs: 1,
      vitestEmergencyReserveMs: 30_000,
    });

    expect(() =>
      assertScenarioExecutionBudget({
        budget,
        configuredScenarioDeadlineMs: 2_400_000,
        configuredVitestTimeoutMs: 2_400_000,
      }),
    ).toThrow(/scenario deadline is under-budget/u);
  });

  it("derives subject command count instead of trusting caller-supplied topology", () => {
    const common = {
      acceptedCaps: { ...acceptedCaps, maxModelPrompts: 30, maxAcpxCommands: 30, maxRetries: 20 },
      commandSlots: [
        {
          commandType: "subject" as const,
          acpxTimeoutMs: 100,
          executorOverheadMs: 10,
          terminationGraceMs: 5,
        },
      ],
      fixtureSetupReserveMs: 0,
      scenarioCleanupReserveMs: 0,
      receiptFlushReserveMs: 0,
      schedulingMarginMs: 0,
      registeredScenarioCount: 1,
      jobs: 1,
      vitestEmergencyReserveMs: 0,
    };

    expect(
      deriveScenarioExecutionBudget({ ...common, repetitions: 5, infrastructureRetries: 0 })
        .commandBudgets[0]?.criticalPathMs,
    ).toBe(115 * 10);
    expect(
      deriveScenarioExecutionBudget({ ...common, repetitions: 6, infrastructureRetries: 1 })
        .commandBudgets[0]?.criticalPathMs,
    ).toBe(115 * 24);
  });

  it("stops a command that cannot fit inside the remaining supervised deadline", async () => {
    const execute = vi.fn(async () => "should not run");

    expect(() =>
      assertCommandCanStart({ remainingScenarioBudgetMs: 14_999, commandBudgetMs: 15_000 }),
    ).toThrow(/cannot fit/u);
    await expect(
      executeWithinCommandBudget({
        remainingScenarioBudgetMs: 14_999,
        commandBudgetMs: 15_000,
        execute,
      }),
    ).rejects.toThrow(/cannot fit/u);
    expect(execute).not.toHaveBeenCalled();
  });

  it("sizes the outer timeout from the configured scenario deadline and rejects non-finite configuration", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 0,
      acceptedCaps,
      commandSlots: [
        {
          commandType: "subject",
          acpxTimeoutMs: 100,
          executorOverheadMs: 0,
          terminationGraceMs: 1,
        },
      ],
      fixtureSetupReserveMs: 0,
      scenarioCleanupReserveMs: 0,
      receiptFlushReserveMs: 0,
      schedulingMarginMs: 0,
      registeredScenarioCount: 2,
      jobs: 1,
      vitestEmergencyReserveMs: 100,
    });

    expect(() =>
      assertScenarioExecutionBudget({
        budget,
        configuredScenarioDeadlineMs: 10_000,
        configuredVitestTimeoutMs: budget.vitestEmergencyTimeoutMs,
      }),
    ).toThrow(/Vitest.*under-budget/u);
    expect(() =>
      assertScenarioExecutionBudget({
        budget,
        configuredScenarioDeadlineMs: Number.NaN,
        configuredVitestTimeoutMs: 20_100,
      }),
    ).toThrow(/configuredScenarioDeadlineMs/u);
    expect(() =>
      assertScenarioExecutionBudget({
        budget,
        configuredScenarioDeadlineMs: 10_000,
        configuredVitestTimeoutMs: Number.NaN,
      }),
    ).toThrow(/configuredVitestTimeoutMs/u);
  });

  it("rejects an execution graph that exceeds any explicitly accepted cap", () => {
    expect(() =>
      deriveScenarioExecutionBudget({
        repetitions: 5,
        infrastructureRetries: 1,
        acceptedCaps: { ...acceptedCaps, maxModelPrompts: 20 },
        commandSlots: [
          {
            commandType: "subject",
            acpxTimeoutMs: 100,
            executorOverheadMs: 0,
            terminationGraceMs: 1,
          },
          {
            commandType: "reviewer_prompt",
            acpxTimeoutMs: 100,
            executorOverheadMs: 0,
            terminationGraceMs: 1,
          },
        ],
        fixtureSetupReserveMs: 0,
        scenarioCleanupReserveMs: 0,
        receiptFlushReserveMs: 0,
        schedulingMarginMs: 0,
        registeredScenarioCount: 1,
        jobs: 1,
        vitestEmergencyReserveMs: 0,
      }),
    ).toThrow(/model-prompt cap/u);
  });

  it("stops launches and retries after runtime caps are exhausted", () => {
    const tracker = createScenarioExecutionCapTracker({
      executionGraph: {
        maximumModelPrompts: 2,
        maximumAcpxCommands: 2,
        maximumRetries: 1,
        maximumObservedTokens: 100,
      },
      acceptedCaps: {
        maxModelPrompts: 2,
        maxAcpxCommands: 2,
        maxRetries: 1,
        maxObservedTokens: 100,
      },
    });

    tracker.startCommand({ modelPrompt: true, retry: false });
    tracker.recordObservedTokens(100);
    expect(() => tracker.startCommand({ modelPrompt: true, retry: false })).toThrow(
      /observed-token cap/u,
    );
    expect(tracker.snapshot()).toMatchObject({
      modelPrompts: 1,
      acpxCommands: 1,
      retries: 0,
      observedTokens: 100,
    });
  });

  it("rejects an execution graph whose observed-token allocation exceeds the accepted cap", () => {
    expect(() =>
      createScenarioExecutionCapTracker({
        executionGraph: {
          maximumModelPrompts: 1,
          maximumAcpxCommands: 1,
          maximumRetries: 0,
          maximumObservedTokens: 101,
        },
        acceptedCaps: {
          maxModelPrompts: 1,
          maxAcpxCommands: 1,
          maxRetries: 0,
          maxObservedTokens: 100,
        },
      }),
    ).toThrow(/observed-token cap/u);
  });

  it("reads the largest complete token observation without summing cumulative updates", () => {
    expect(
      readObservedTokenCount([
        '{"inputTokens":10,"outputTokens":5}',
        '{"input_tokens":20,"output_tokens":8,"cached_input_tokens":2}',
      ]),
    ).toBe(28);
    expect(readObservedTokenCount(['{"totalTokens":25,"inputTokens":20,"outputTokens":8}'])).toBe(
      25,
    );
    expect(() => readObservedTokenCount([])).toThrow(/missing/u);
    expect(() => readObservedTokenCount(["not-json"])).toThrow(/malformed/u);
  });
});
