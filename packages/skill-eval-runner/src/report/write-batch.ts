import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import type { Scenario } from "../contracts/scenario.ts";
import type { RunOutcome } from "../contracts/run.ts";
import type { CheckResult } from "../contracts/check-result.ts";
import type { RunVerdict } from "../contracts/run-verdict.ts";
export type BatchRun = {
  id: string;
  outcome: RunOutcome;
  checks: readonly CheckResult[];
  verdict: RunVerdict;
  judgeRetryCount: number;
};
export type ScenarioBatchSummary = {
  scenarioId: string;
  skill: string;
  runs: readonly { runId: string; verdict: RunVerdict }[];
  counts: {
    pass: number;
    fail: number;
    inconclusive: number;
    executionFailed: number;
  };
  judgeLeafRate: number;
  subjectTokenTotal: number;
  judgeCallCount: number;
  judgeRetryCount: number;
};
export const summarizeBatch = (
  scenario: Scenario,
  runs: readonly BatchRun[],
): ScenarioBatchSummary => {
  const checks = runs.flatMap((run) => run.checks);
  return {
    scenarioId: scenario.frontmatter.scenarioId,
    skill: scenario.frontmatter.skill,
    runs: runs.map((run) => ({ runId: run.id, verdict: run.verdict })),
    counts: {
      pass: runs.filter((run) => run.verdict === "pass").length,
      fail: runs.filter((run) => run.verdict === "fail").length,
      inconclusive: runs.filter((run) => run.verdict === "inconclusive").length,
      executionFailed:
        runs.filter((run) => run.verdict === "execution-failed").length,
    },
    judgeLeafRate: checks.length === 0
      ? 0
      : checks.filter((check) => check.decidedBy === "judge").length /
        checks.length,
    subjectTokenTotal: runs.reduce(
      (total, run) =>
        total +
        (run.outcome.kind === "observed"
          ? run.outcome.observation.usage.totalTokens
          : 0),
      0,
    ),
    judgeCallCount:
      checks.filter((check) => check.decidedBy === "judge").length,
    judgeRetryCount: runs.reduce(
      (total, run) => total + run.judgeRetryCount,
      0,
    ),
  };
};
export async function writeBatch(
  outDir: string,
  scenario: Scenario,
  runs: readonly BatchRun[],
): Promise<string> {
  await mkdir(join(outDir, "runs"), { recursive: true });
  for (const run of runs) {
    const dir = join(outDir, "runs", run.id);
    await mkdir(dir, { recursive: true });
    await Deno.writeTextFile(
      join(dir, "outcome.json"),
      JSON.stringify(run.outcome, null, 2),
    );
    await Deno.writeTextFile(
      join(dir, "prompt.md"),
      [scenario.prompt, ...scenario.frontmatter.followUps].join("\n\n"),
    );
    if (run.outcome.kind === "observed") {
      await Deno.writeTextFile(
        join(dir, "observation.json"),
        JSON.stringify(run.outcome.observation, null, 2),
      );
    }
    await Deno.writeTextFile(
      join(dir, "checks.json"),
      JSON.stringify(run.checks, null, 2),
    );
    await Deno.writeTextFile(
      join(dir, "verdict.json"),
      JSON.stringify(run.verdict, null, 2),
    );
  }
  const batch = summarizeBatch(scenario, runs);
  await Deno.writeTextFile(
    join(outDir, "batch.json"),
    JSON.stringify(batch, null, 2),
  );
  return outDir;
}
