import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { loadScenarios } from "./scenarios/parse-scenario.ts";
import {
  checkAgentPrerequisites,
  loadSnapshotHidePatterns,
  prepareEnvironment,
  resolveSkillSetSource,
} from "./environment/prepare-environment.ts";
import { runSubject } from "./subjects/run-subject.ts";
import { evaluateRun } from "./qa/evaluate-run.ts";
import { NoEngineJev } from "./jev/jev-port.ts";
import { AcpxJudge } from "./judge/acpx-judge.ts";
import { lintSkills } from "./lint/lint-skills.ts";
import { assessDoneBar } from "./done-bar/assess-done-bar.ts";
import {
  type BatchRun,
  summarizeBatch,
  writeBatch,
} from "./report/write-batch.ts";
import type { Revision, SkillRef } from "./contracts/common.ts";
import { sandboxPreflightMessage } from "./runtime/sandbox-preflight.ts";
import { validateNamedScenarioStatuses } from "./runtime/validate-scenario-selection.ts";
const args = Deno.args;
const command = args[0] ?? "help";
const value = (name: string, required = true): string | undefined => {
  const index = args.indexOf(name);
  const result = index >= 0 ? args[index + 1] : undefined;
  if (required && !result) throw new Error(`missing ${name}`);
  return result;
};
const values = (name: string): readonly string[] =>
  args.flatMap((arg, index) =>
    arg === name && args[index + 1] ? [args[index + 1]] : []
  );
const numberValue = (name: string, defaultValue: number): number => {
  const raw = value(name, false);
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`invalid ${name}`);
  }
  return parsed;
};
const repoSkill = (): SkillRef => ({
  repoRoot: value("--repo") ?? Deno.cwd(),
  skillPath: value("--skill") ?? ".",
});
const revision = (): Revision => {
  const raw = value("--rev", false) ?? "working-tree";
  return raw === "working-tree"
    ? { kind: "working-tree" }
    : { kind: "commit", value: raw };
};
const printJson = (valueToPrint: unknown): void =>
  console.log(JSON.stringify(valueToPrint, null, 2));
const invalidSkillSetReason = async (
  skill: SkillRef,
  revisions: readonly Revision[],
): Promise<string | undefined> => {
  for (const candidate of revisions) {
    const source = await resolveSkillSetSource(skill, candidate);
    if (source.kind === "invalid") return source.reason;
  }
  return undefined;
};
const agentPrerequisiteMessages = {
  "codex-not-found":
    "codex-not-found: no codex on PATH; install Codex or pass --codex-path",
  "no-agent-login":
    "no-agent-login: no file-based Codex login (auth.json) in CODEX_HOME or ~/.codex",
} as const;
const missingAgentPrerequisite = async (
  codexPath: string | undefined,
): Promise<string | undefined> => {
  const prerequisites = await checkAgentPrerequisites(codexPath);
  return prerequisites.kind === "failed"
    ? agentPrerequisiteMessages[prerequisites.reason]
    : undefined;
};
// Invalid input and an unusable environment stop the command before any Run starts (exit 2).
const runPreflightError = async (
  skill: SkillRef,
  revisions: readonly Revision[],
  codexPath: string | undefined,
): Promise<string | undefined> => {
  const skillSetError = await invalidSkillSetReason(skill, revisions);
  if (skillSetError) return skillSetError;
  const hidePatterns = await loadSnapshotHidePatterns(skill);
  if (hidePatterns.kind === "invalid") return hidePatterns.reason;
  return await missingAgentPrerequisite(codexPath);
};
const runOne = async (
  scenario: import("./contracts/scenario.ts").Scenario,
  skill: SkillRef,
  runId: string,
  rev: Revision,
  codexPath: string | undefined,
): Promise<BatchRun> => {
  const env = await prepareEnvironment(
    skill,
    rev,
    scenario.frontmatter.fixtures,
    scenario.path,
    codexPath,
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
      judgeRetryCount: 0,
    };
  }
  try {
    const outcome = await runSubject(scenario, env.environment, { runId });
    const evaluated = outcome.kind === "observed"
      ? await evaluateRun(scenario, outcome, {
        jev: new NoEngineJev(),
        judge: new AcpxJudge(env.environment),
      })
      : {
        checks: [],
        verdict: "execution-failed" as const,
        judgeRetryCount: 0,
      };
    return {
      id: runId,
      outcome,
      checks: evaluated.checks,
      verdict: evaluated.verdict,
      judgeRetryCount: evaluated.judgeRetryCount,
    };
  } finally {
    await env.environment.dispose();
  }
};
const runScenarios = async (
  skill: SkillRef,
  scenarios: readonly import("./contracts/scenario.ts").Scenario[],
  out: string,
  count: number,
  parallel: number,
  rev: Revision,
  codexPath: string | undefined,
): Promise<
  { summaries: readonly ReturnType<typeof summarizeBatch>[]; exitCode: number }
> => {
  const summaries: ReturnType<typeof summarizeBatch>[] = [];
  let exitCode = 0;
  for (
    const scenario of scenarios.filter((candidate) =>
      candidate.frontmatter.status === "active"
    )
  ) {
    const results: Array<BatchRun | undefined> = [];
    let nextIndex = 0;
    await Promise.all(
      Array.from({ length: Math.min(parallel, count) }, async () => {
        while (nextIndex < count) {
          const index = nextIndex++;
          results[index] = await runOne(
            scenario,
            skill,
            `${scenario.frontmatter.scenarioId}-${index + 1}`,
            rev,
            codexPath,
          );
        }
      }),
    );
    const runs = results.filter((run): run is BatchRun => run !== undefined);
    if (runs.some((run) => run.verdict !== "pass")) exitCode = 1;
    await writeBatch(
      join(out, scenario.frontmatter.scenarioId),
      scenario,
      runs,
    );
    summaries.push(summarizeBatch(scenario, runs));
    console.log(join(out, scenario.frontmatter.scenarioId));
  }
  await Deno.writeTextFile(
    join(out, "batch.json"),
    JSON.stringify({ scenarios: summaries }, null, 2),
  );
  return { summaries, exitCode };
};
async function main(): Promise<number> {
  if (command === "help" || command === "--help") {
    console.log("skill-eval-runner validate|run|lint|done-bar");
    return 0;
  }
  const scenarioIds = values("--scenario");
  if (command === "run" || command === "done-bar") {
    const preflightError = sandboxPreflightMessage(Deno.env.toObject());
    if (preflightError) {
      console.error(preflightError);
      return 2;
    }
  }
  if (command === "lint") {
    const dir = value("--skill-set", false) ?? value("--skill", false) ??
      Deno.cwd();
    const result = await lintSkills(dir, values("--forbid"));
    printJson(result);
    return result.findings.length ? 1 : 0;
  }
  const skill = repoSkill();
  const loaded = await loadScenarios(
    skill,
    scenarioIds.length > 0 ? scenarioIds : undefined,
  );
  if (command === "validate") {
    printJson(loaded);
    return loaded.kind === "loaded" ? 0 : 2;
  }
  if (command === "run") {
    if (loaded.kind !== "loaded") {
      printJson(loaded);
      return 2;
    }
    const selectionErrors = validateNamedScenarioStatuses(
      loaded.scenarios,
      scenarioIds,
    );
    if (selectionErrors.length > 0) {
      printJson({ kind: "invalid", errors: selectionErrors });
      return 2;
    }
    if (
      !loaded.scenarios.some((scenario) =>
        scenario.frontmatter.status === "active"
      )
    ) {
      console.error(
        "no active scenario selected: only scenarios with status active run",
      );
      return 2;
    }
    const runRevision = revision();
    const preflightError = await runPreflightError(
      skill,
      [runRevision],
      value("--codex-path", false),
    );
    if (preflightError) {
      console.error(preflightError);
      return 2;
    }
    const out = value("--out", false) ??
      join(
        Deno.env.get("XDG_CACHE_HOME") ??
          join(Deno.env.get("HOME") ?? "/tmp", ".cache"),
        "skill-evals",
        skill.repoRoot.replaceAll("/", "-").replace(/^-+/, ""),
        crypto.randomUUID(),
      );
    await mkdir(out, { recursive: true });
    return (await runScenarios(
      skill,
      loaded.scenarios,
      out,
      numberValue("--runs", 1),
      numberValue("--parallel", 3),
      runRevision,
      value("--codex-path", false),
    )).exitCode;
  }
  if (command === "done-bar") {
    if (loaded.kind !== "loaded") {
      printJson(loaded);
      return 2;
    }
    const selectionErrors = validateNamedScenarioStatuses(
      loaded.scenarios,
      scenarioIds,
    );
    if (selectionErrors.length > 0) {
      printJson({ kind: "invalid", errors: selectionErrors });
      return 2;
    }
    const kind = (value("--kind", false) ?? "new-from-intent") as
      | "new-from-intent"
      | "fix-for-recorded-failure";
    const selected = loaded.scenarios.filter((scenario) =>
      scenario.frontmatter.status === "active"
    );
    if (kind === "fix-for-recorded-failure" && selected.length > 1) {
      console.error(
        `fix-for-recorded-failure needs exactly one --scenario; ${selected.length} active scenarios are selected: ${
          selected.map((scenario) => scenario.frontmatter.scenarioId).join(", ")
        }`,
      );
      return 2;
    }
    const out = value("--out", false) ??
      join(
        Deno.env.get("XDG_CACHE_HOME") ??
          join(Deno.env.get("HOME") ?? "/tmp", ".cache"),
        "skill-evals",
        skill.repoRoot.replaceAll("/", "-"),
        crypto.randomUUID(),
      );
    await mkdir(out, { recursive: true });
    const skillDirectory = skill.skillPath.startsWith("/")
      ? skill.skillPath
      : join(skill.repoRoot, skill.skillPath);
    if (kind === "new-from-intent") {
      const lintResult = await lintSkills(
        join(skillDirectory, ".."),
        values("--forbid"),
      );
      const result = assessDoneBar({
        kind,
        lintClean: lintResult.findings.length === 0,
        jevLintAvailable: false,
        runs: [],
      });
      await Deno.writeTextFile(
        join(out, "done-bar.json"),
        JSON.stringify(result, null, 2),
      );
      printJson(result);
      return result.kind === "met" ? 0 : 1;
    }
    if (selected.length === 0) {
      const result = {
        kind: "not-evaluable",
        reason: "no-active-scenario",
      } as const;
      await Deno.writeTextFile(
        join(out, "done-bar.json"),
        JSON.stringify(result, null, 2),
      );
      printJson(result);
      return 1;
    }
    const scenario = selected[0];
    const base = value("--base");
    const headRaw = value("--head", false) ?? "working-tree";
    const head: Revision = headRaw === "working-tree"
      ? { kind: "working-tree" }
      : { kind: "commit", value: headRaw };
    const preflightError = await runPreflightError(
      skill,
      [{ kind: "commit", value: base }, head],
      value("--codex-path", false),
    );
    if (preflightError) {
      console.error(preflightError);
      return 2;
    }
    const baseRun = await runOne(
      scenario,
      skill,
      `${scenario.frontmatter.scenarioId}-base`,
      { kind: "commit", value: base },
      value("--codex-path", false),
    );
    const headRuns: BatchRun[] = [];
    for (let index = 0; index < 3; index++) {
      headRuns.push(
        await runOne(
          scenario,
          skill,
          `${scenario.frontmatter.scenarioId}-head-${index + 1}`,
          head,
          value("--codex-path", false),
        ),
      );
    }
    const result = assessDoneBar({
      kind,
      lintClean: true,
      jevLintAvailable: true,
      baseVerdict: baseRun.verdict,
      runs: headRuns,
    });
    await Deno.writeTextFile(
      join(out, "done-bar.json"),
      JSON.stringify(result, null, 2),
    );
    printJson(result);
    return result.kind === "met" ? 0 : 1;
  }
  throw new Error(`unknown command ${command}`);
}
try {
  Deno.exit(await main());
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  Deno.exit(2);
}
