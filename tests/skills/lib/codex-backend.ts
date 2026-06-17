import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SkillPressureScenario } from "./scenario-parser.js";

export interface ProcessRunRequest {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly stdin: string;
  readonly stdoutFile: string;
  readonly timeoutMs: number;
}

export interface ProcessRunResult {
  readonly exitCode: number;
  readonly stderr: string;
  readonly timedOut: boolean;
}

export type ProcessRunner = (
  request: ProcessRunRequest,
) => Promise<ProcessRunResult>;

export interface RunCodexPressureCaseProps {
  readonly scenario: SkillPressureScenario;
  readonly renderedPrompt: string;
  readonly repoRoot: string;
  readonly model: string;
  readonly reasoningEffort: string;
  readonly timeoutSeconds: number;
  readonly processRunner?: ProcessRunner;
}

export interface CodexPressureRun {
  readonly artifactDirectory: string;
  readonly promptPath: string;
  readonly eventsPath: string;
  readonly finalJsonPath: string;
  readonly stderrPath: string;
  readonly artifactPaths: readonly string[];
  readonly readOnlyRequested: boolean;
  readonly exitCode: number;
  readonly stderr: string;
  readonly timedOut: boolean;
  readonly durationMs: number;
  readonly command: string;
  readonly args: readonly string[];
}

export async function runCodexPressureCase(
  props: RunCodexPressureCaseProps,
): Promise<CodexPressureRun> {
  const artifactDirectory = createArtifactDirectory({
    repoRoot: props.repoRoot,
    scenarioId: props.scenario.scenarioId,
  });
  const promptPath = join(artifactDirectory, "prompt.md");
  const eventsPath = join(artifactDirectory, "events.jsonl");
  const finalJsonPath = join(artifactDirectory, "final.json");
  const stderrPath = join(artifactDirectory, "stderr.txt");
  writeFileSync(promptPath, props.renderedPrompt);

  const args = [
    "exec",
    "-C",
    props.repoRoot,
    "-m",
    props.model,
    "-c",
    `model_reasoning_effort="${props.reasoningEffort}"`,
    "--sandbox",
    "read-only",
    "--output-schema",
    join(props.repoRoot, "tests/skills/schemas/skill-pressure-result.schema.json"),
    "--output-last-message",
    finalJsonPath,
    "--json",
    "-",
  ] as const;

  const startTime = Date.now();
  const runner = props.processRunner ?? runProcess;
  const processResult = await runner({
    command: "codex",
    args,
    cwd: props.repoRoot,
    stdin: props.renderedPrompt,
    stdoutFile: eventsPath,
    timeoutMs: props.timeoutSeconds * 1_000,
  });
  const durationMs = Date.now() - startTime;
  writeFileSync(stderrPath, processResult.stderr);

  return {
    artifactDirectory,
    promptPath,
    eventsPath,
    finalJsonPath,
    stderrPath,
    artifactPaths: [promptPath, finalJsonPath, eventsPath, stderrPath],
    readOnlyRequested: true,
    exitCode: processResult.exitCode,
    stderr: processResult.stderr,
    timedOut: processResult.timedOut,
    durationMs,
    command: "codex",
    args,
  };
}

function createArtifactDirectory(props: {
  readonly repoRoot: string;
  readonly scenarioId: string;
}): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "");
  const safeScenarioId = props.scenarioId.replace(/[^A-Za-z0-9._-]/g, "-");
  const directory = join(
    props.repoRoot,
    "tmp/skill-pressure-evals",
    `${stamp}-${safeScenarioId}`,
  );
  mkdirSync(directory, { recursive: true });
  return directory;
}

async function runProcess(request: ProcessRunRequest): Promise<ProcessRunResult> {
  return await new Promise((resolve) => {
    const stdout = createWriteStream(request.stdoutFile);
    let stderr = "";
    let timedOut = false;
    const child = spawn(request.command, [...request.args], {
      cwd: request.cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => {
        if (child.exitCode === null) {
          child.kill("SIGKILL");
        }
      }, 5_000).unref();
    }, request.timeoutMs);

    child.stdout.pipe(stdout);
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      stdout.close();
      resolve({
        exitCode: 1,
        stderr: error.message,
        timedOut,
      });
    });
    child.on("close", (exitCode) => {
      clearTimeout(timeout);
      stdout.close();
      resolve({
        exitCode: timedOut ? 124 : (exitCode ?? 1),
        stderr,
        timedOut,
      });
    });
    child.stdin.end(request.stdin);
  });
}
