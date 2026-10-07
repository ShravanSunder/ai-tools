import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { loadScenarios } from "./scenarios/parse-scenario.ts";
import { prepareEnvironment } from "./environment/prepare-environment.ts";
import { runSubject } from "./subjects/run-subject.ts";
import { evaluateRun } from "./qa/evaluate-run.ts";
import { NoEngineJev } from "./jev/jev-port.ts";
import { AcpxJudge } from "./judge/acpx-judge.ts";
import { lintSkills } from "./lint/lint-skills.ts";
import { type BatchRun, writeBatch } from "./report/write-batch.ts";
import type { SkillRef } from "./contracts/common.ts";
const args = Deno.args;
const command = args[0] ?? "help";
const value = (name: string, required = true): string | undefined => {
  const index = args.indexOf(name);
  const result = index >= 0 ? args[index + 1] : undefined;
  if (required && !result) throw new Error(`missing ${name}`);
  return result;
};
const numberValue = (name: string, defaultValue: number): number => {
  const raw = value(name, false);
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`invalid ${name}`);
  }
  return parsed;
};
const repoSkill = (): SkillRef => {
  const repo = value("--repo") ?? Deno.cwd(), skill = value("--skill") ?? ".";
  return { repoRoot: repo, skillPath: skill };
};
const printJson = (v: unknown): void => console.log(JSON.stringify(v, null, 2));
async function main(): Promise<number> {
  if (command === "help" || command === "--help") {
    console.log("skill-eval-runner validate|run|lint|done-bar");
    return 0;
  }
  if (command === "lint") {
    const dir = value("--skill-set", false) ?? value("--skill", false) ??
      Deno.cwd();
    const forbidden: string[] = [];
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] === "--forbid") forbidden.push(args[i + 1]);
    }
    const findings = await lintSkills(dir, forbidden);
    printJson(findings);
    return findings.length ? 1 : 0;
  }
  if (command === "validate") {
    const result = await loadScenarios(repoSkill());
    printJson(result);
    return result.kind === "loaded" ? 0 : 2;
  }
  if (command === "run") {
    const skill = repoSkill();
    const loaded = await loadScenarios(skill);
    if (loaded.kind !== "loaded") {
      printJson(loaded);
      return 2;
    }
    const count = numberValue("--runs", 1);
    const out = value("--out", false) ??
      join(
        Deno.env.get("XDG_CACHE_HOME") ??
          join(Deno.env.get("HOME") ?? "/tmp", ".cache"),
        "skill-evals",
        skill.repoRoot.replaceAll("/", "-").replace(/^-+/, ""),
        crypto.randomUUID(),
      );
    await mkdir(out, { recursive: true });
    let overall = 0;
    for (
      const scenario of loaded.scenarios.filter((s) =>
        s.frontmatter.status === "active"
      )
    ) {
      const parallel = numberValue("--parallel", 3);
      const results: Array<BatchRun | undefined> = [];
      let nextIndex = 0;
      const runOne = async (index: number): Promise<BatchRun> => {
        const runId = `${scenario.frontmatter.scenarioId}-${index + 1}`;
        const env = await prepareEnvironment(
          skill,
          { kind: "working-tree" },
          scenario.frontmatter.fixtures,
          scenario.path,
        );
        if (env.kind !== "ready") {
          return {
            id: runId,
            outcome: {
              kind: "execution-failed",
              runId,
              cause: "agent-start-failed",
              detail: env.reason,
            },
            checks: [],
            verdict: "execution-failed",
          };
        }
        try {
          const outcome = await runSubject(scenario, env.environment, {
            runId,
          });
          const judged = outcome.kind === "observed"
            ? await evaluateRun(scenario, outcome, {
              jev: new NoEngineJev(),
              judge: new AcpxJudge(env.environment),
            })
            : { checks: [], verdict: "execution-failed" as const };
          return {
            id: runId,
            outcome,
            checks: judged.checks,
            verdict: judged.verdict,
          };
        } finally {
          await env.environment.dispose();
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(parallel, count) }, async () => {
          while (nextIndex < count) {
            const index = nextIndex++;
            results[index] = await runOne(index);
          }
        }),
      );
      const runs = results.filter((run): run is BatchRun => run !== undefined);
      if (runs.some((run) => run.verdict !== "pass")) overall = 1;
      const dir = await writeBatch(
        join(out, scenario.frontmatter.scenarioId),
        scenario,
        runs,
      );
      console.log(dir);
    }
    return overall;
  }
  if (command === "done-bar") {
    const skill = repoSkill();
    const loaded = await loadScenarios(skill);
    if (loaded.kind !== "loaded") {
      printJson({ kind: "not-evaluable", reason: "no-active-scenario" });
      return 1;
    }
    printJson({ kind: "not-evaluable", reason: "jev-lint-unavailable" });
    return 1;
  }
  throw new Error(`unknown command ${command}`);
}
try {
  Deno.exit(await main());
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  Deno.exit(2);
}
