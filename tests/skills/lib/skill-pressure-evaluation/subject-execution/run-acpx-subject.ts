import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  AcpxAgentRunner,
} from "../agent-execution/acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import type { SkillPressureInput } from "../scenario-cases/scenario-case-types.js";

export interface RunAcpxPressureCaseProps {
  readonly input: SkillPressureInput;
  readonly renderedPrompt: string;
  readonly renderedFollowUpPrompts?: readonly string[];
  readonly repoRoot: string;
  readonly runner: AcpxAgentRunner;
  readonly signal?: AbortSignal;
  readonly setup: AcpxCodexAgentSetup;
}

export interface AcpxPressureRun {
  readonly artifactDirectory: string;
  readonly promptPath: string;
  readonly eventsPath: string;
  readonly finalJsonPath: string;
  readonly stderrPath: string;
  readonly artifactPaths: readonly string[];
  readonly readOnlyRequested: boolean;
  readonly durationMs: number;
  readonly finalText: string;
  /** Assistant text per turn, in conversation order; last entry equals finalText. */
  readonly turnTexts: readonly string[];
}

export async function runAcpxPressureCase(
  props: RunAcpxPressureCaseProps,
): Promise<AcpxPressureRun> {
  const artifactDirectory = createArtifactDirectory({
    repoRoot: props.repoRoot,
    scenarioId: props.input.scenarioId,
  });
  const promptPath = join(artifactDirectory, "prompt.md");
  const eventsPath = join(artifactDirectory, "events.jsonl");
  const finalJsonPath = join(artifactDirectory, "final.json");
  const stderrPath = join(artifactDirectory, "stderr.txt");
  writeFileSync(promptPath, props.renderedPrompt);
  const followUpPrompts = props.renderedFollowUpPrompts ?? [];
  const followUpPromptPaths = followUpPrompts.map((followUpPrompt, index) => {
    const followUpPromptPath = join(
      artifactDirectory,
      `follow-up-${index + 1}.md`,
    );
    writeFileSync(followUpPromptPath, followUpPrompt);
    return followUpPromptPath;
  });

  const startTime = Date.now();
  const agentResult = await props.runner({
    namePrefix: `pressure-subject-${props.input.scenarioId}`,
    prompt: props.renderedPrompt,
    ...(followUpPrompts.length === 0
      ? {}
      : { followUpPrompts }),
    ...(props.signal === undefined ? {} : { signal: props.signal }),
    setup: props.setup,
  });
  const durationMs = Date.now() - startTime;
  writeFileSync(eventsPath, agentResult.rawEvents);
  writeFileSync(finalJsonPath, agentResult.finalText);
  writeFileSync(stderrPath, agentResult.stderr);
  const turnTextPaths = agentResult.turnTexts.slice(0, -1).map(
    (turnText, index) => {
      const turnTextPath = join(artifactDirectory, `turn-${index + 1}.json`);
      writeFileSync(turnTextPath, turnText);
      return turnTextPath;
    },
  );

  return {
    artifactDirectory,
    promptPath,
    eventsPath,
    finalJsonPath,
    stderrPath,
    artifactPaths: [
      promptPath,
      ...followUpPromptPaths,
      ...turnTextPaths,
      finalJsonPath,
      eventsPath,
      stderrPath,
    ],
    readOnlyRequested: props.setup.permissionMode === "approve-reads",
    durationMs,
    finalText: agentResult.finalText,
    turnTexts: agentResult.turnTexts,
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
