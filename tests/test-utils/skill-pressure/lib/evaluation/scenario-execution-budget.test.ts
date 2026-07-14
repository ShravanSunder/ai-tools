import { describe, expect, it, vi } from "vitest";

import {
  assertCommandCanStart,
  assertScenarioExecutionBudget,
  deriveScenarioExecutionBudget,
  executeWithinCommandBudget,
} from "./scenario-execution-budget.js";

describe("scenario execution budget", () => {
  it("derives the serial critical path from ACPX, supervision, retries, repetitions, and command type", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 1,
      commandSlots: [
        { commandType: "subject", acpxTimeoutMs: 180_000, executorOverheadMs: 10_000, terminationGraceMs: 5_000 },
        { commandType: "reviewer_session_create", acpxTimeoutMs: 30_000, executorOverheadMs: 5_000, terminationGraceMs: 5_000 },
        { commandType: "reviewer_effort_config", acpxTimeoutMs: 30_000, executorOverheadMs: 5_000, terminationGraceMs: 5_000 },
        { commandType: "reviewer_prompt", acpxTimeoutMs: 120_000, executorOverheadMs: 10_000, terminationGraceMs: 5_000 },
        { commandType: "reviewer_close", acpxTimeoutMs: 30_000, executorOverheadMs: 5_000, terminationGraceMs: 5_000 },
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
  });

  it("rejects the old fixed high-risk envelope before ACPX can launch", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 1,
      commandSlots: [{ commandType: "subject", acpxTimeoutMs: 180_000, executorOverheadMs: 10_000, terminationGraceMs: 5_000 }],
      fixtureSetupReserveMs: 10_000,
      scenarioCleanupReserveMs: 20_000,
      receiptFlushReserveMs: 10_000,
      schedulingMarginMs: 5_000,
      registeredScenarioCount: 1,
      jobs: 1,
      vitestEmergencyReserveMs: 30_000,
    });

    expect(() => assertScenarioExecutionBudget({
      budget,
      configuredScenarioDeadlineMs: 2_400_000,
      configuredVitestTimeoutMs: 2_400_000,
    })).toThrow(/scenario deadline is under-budget/u);
  });

  it("derives subject command count instead of trusting caller-supplied topology", () => {
    const common = {
      commandSlots: [{ commandType: "subject" as const, acpxTimeoutMs: 100, executorOverheadMs: 10, terminationGraceMs: 5 }],
      fixtureSetupReserveMs: 0,
      scenarioCleanupReserveMs: 0,
      receiptFlushReserveMs: 0,
      schedulingMarginMs: 0,
      registeredScenarioCount: 1,
      jobs: 1,
      vitestEmergencyReserveMs: 0,
    };

    expect(deriveScenarioExecutionBudget({ ...common, repetitions: 5, infrastructureRetries: 0 })
      .commandBudgets[0]?.criticalPathMs).toBe(115 * 10);
    expect(deriveScenarioExecutionBudget({ ...common, repetitions: 6, infrastructureRetries: 1 })
      .commandBudgets[0]?.criticalPathMs).toBe(115 * 24);
  });

  it("stops a command that cannot fit inside the remaining supervised deadline", async () => {
    const execute = vi.fn(async () => "should not run");

    expect(() => assertCommandCanStart({ remainingScenarioBudgetMs: 14_999, commandBudgetMs: 15_000 })).toThrow(/cannot fit/u);
    await expect(executeWithinCommandBudget({
      remainingScenarioBudgetMs: 14_999,
      commandBudgetMs: 15_000,
      execute,
    })).rejects.toThrow(/cannot fit/u);
    expect(execute).not.toHaveBeenCalled();
  });

  it("sizes the outer timeout from the configured scenario deadline and rejects non-finite configuration", () => {
    const budget = deriveScenarioExecutionBudget({
      repetitions: 5,
      infrastructureRetries: 0,
      commandSlots: [{ commandType: "subject", acpxTimeoutMs: 100, executorOverheadMs: 0, terminationGraceMs: 1 }],
      fixtureSetupReserveMs: 0,
      scenarioCleanupReserveMs: 0,
      receiptFlushReserveMs: 0,
      schedulingMarginMs: 0,
      registeredScenarioCount: 2,
      jobs: 1,
      vitestEmergencyReserveMs: 100,
    });

    expect(() => assertScenarioExecutionBudget({
      budget,
      configuredScenarioDeadlineMs: 10_000,
      configuredVitestTimeoutMs: budget.vitestEmergencyTimeoutMs,
    })).toThrow(/Vitest.*under-budget/u);
    expect(() => assertScenarioExecutionBudget({
      budget,
      configuredScenarioDeadlineMs: Number.NaN,
      configuredVitestTimeoutMs: 20_100,
    })).toThrow(/configuredScenarioDeadlineMs/u);
    expect(() => assertScenarioExecutionBudget({
      budget,
      configuredScenarioDeadlineMs: 10_000,
      configuredVitestTimeoutMs: Number.NaN,
    })).toThrow(/configuredVitestTimeoutMs/u);
  });
});
