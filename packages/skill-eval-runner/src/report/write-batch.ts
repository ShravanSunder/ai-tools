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
  const batch = {
    scenarioId: scenario.frontmatter.scenarioId,
    skill: scenario.frontmatter.skill,
    runs: runs.map((r) => ({ runId: r.id, verdict: r.verdict })),
    counts: {
      pass: runs.filter((r) => r.verdict === "pass").length,
      fail: runs.filter((r) => r.verdict === "fail").length,
      inconclusive: runs.filter((r) => r.verdict === "inconclusive").length,
      executionFailed:
        runs.filter((r) => r.verdict === "execution-failed").length,
    },
  };
  await Deno.writeTextFile(
    join(outDir, "batch.json"),
    JSON.stringify(batch, null, 2),
  );
  return outDir;
}
