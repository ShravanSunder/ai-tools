import { readFileSync } from "node:fs";
import { createHarness, type JsonValue } from "vitest-evals";
import { runCodexPressureCase } from "./codex-backend.js";
import { renderCodexPressurePrompt } from "./prompt-renderer.js";
import type { SkillPressureScenario } from "./scenario-parser.js";
import type { SkillPressureResult } from "./result-schema.js";
import { validateSkillPressureResult } from "./result-schema.js";

export interface SkillPressureCase {
  readonly scenario: SkillPressureScenario;
}

export interface SkillPressureHarnessMetadata {
  readonly [key: string]: unknown;
  readonly backend?: string;
}

export interface SkillPressureHarnessOutput {
  readonly [key: string]: JsonValue;
  readonly backend: string;
  readonly renderedPrompt: string;
  readonly finalResult: SkillPressureResult;
  readonly artifactPaths: string[];
  readonly readOnlyRequested: boolean;
  readonly exitCode: number;
  readonly timedOut: boolean;
}

export interface CreateSkillPressureHarnessProps {
  readonly repoRoot: string;
  readonly backend: string;
}

export function createSkillPressureHarness(
  props: CreateSkillPressureHarnessProps,
) {
  return createHarness<
    SkillPressureCase,
    SkillPressureHarnessOutput,
    SkillPressureHarnessMetadata
  >({
    name: "skill-pressure",
    run: async ({ input, metadata, setArtifact }) => {
      const backend = metadata.backend ?? props.backend;
      const renderedPrompt = renderCodexPressurePrompt({
        scenario: input.scenario,
      });

      if (backend === "fake") {
        const output = createFakeHarnessOutput({
          scenario: input.scenario,
          renderedPrompt,
        });
        setArtifact("backend", backend);
        setArtifact("artifactPaths", [...output.artifactPaths]);
        return {
          output,
          messages: [
            { role: "user", content: renderedPrompt },
            { role: "assistant", content: output.finalResult.decision },
          ],
          usage: { provider: "fake", model: "fake-skill-pressure" },
          artifacts: {
            backend,
            artifactPaths: output.artifactPaths,
          },
        };
      }

      const codexRun = await runCodexPressureCase({
        scenario: input.scenario,
        renderedPrompt,
        repoRoot: props.repoRoot,
        model: process.env["CODEX_PRESSURE_MODEL"] ?? "gpt-5.5",
        reasoningEffort:
          process.env["CODEX_PRESSURE_REASONING_EFFORT"] ?? "low",
        timeoutSeconds: Number.parseInt(
          process.env["SKILL_PRESSURE_TIMEOUT_SECONDS"] ?? "900",
          10,
        ),
      });
      const finalJsonText = readFileSync(codexRun.finalJsonPath, "utf8");
      const finalJson = JSON.parse(finalJsonText) as unknown;
      const validation = validateSkillPressureResult(finalJson);
      if (!validation.ok) {
        throw new Error(
          `Codex pressure result failed schema validation:\n${validation.errors.join("\n")}`,
        );
      }

      const output: SkillPressureHarnessOutput = {
        backend,
        renderedPrompt,
        finalResult: validation.value,
        artifactPaths: [...codexRun.artifactPaths],
        readOnlyRequested: codexRun.readOnlyRequested,
        exitCode: codexRun.exitCode,
        timedOut: codexRun.timedOut,
      };
      setArtifact("backend", backend);
      setArtifact("artifactPaths", [...codexRun.artifactPaths]);
      setArtifact("exitCode", codexRun.exitCode);
      setArtifact("timedOut", codexRun.timedOut);

      return {
        output,
        messages: [
          { role: "user", content: renderedPrompt },
          { role: "assistant", content: validation.value.decision },
        ],
        usage: {
          provider: "openai",
          model: process.env["CODEX_PRESSURE_MODEL"] ?? "gpt-5.5",
        },
        artifacts: {
          backend,
        artifactPaths: [...codexRun.artifactPaths],
          exitCode: codexRun.exitCode,
          timedOut: codexRun.timedOut,
        },
        errors: codexRun.exitCode === 0 ? [] : [codexRun.stderr],
      };
    },
  });
}

function createFakeHarnessOutput(props: {
  readonly scenario: SkillPressureScenario;
  readonly renderedPrompt: string;
}): SkillPressureHarnessOutput {
  const decision = [
    "Fake backend satisfied deterministic decision requirements.",
    ...props.scenario.expectDecisionRegexes,
  ].join(" ");
  const coverageEvidence =
    props.scenario.expectProofRegexes.length > 0
      ? [...props.scenario.expectProofRegexes]
      : ["fake proof"];
  const finalResult: SkillPressureResult = {
    scenario_id: props.scenario.scenarioId,
    skill_under_test: props.scenario.skillUnderTest,
    skill_invoked: true,
    mode: props.scenario.mode,
    read_only: props.scenario.expectReadOnly,
    artifact_expected: props.scenario.expectArtifact,
    artifact_created: false,
    decision,
    coverage_evidence: coverageEvidence,
    shortcut_resisted: true,
    rationalizations_rejected: ["fake backend did not execute agent"],
    open_questions: [],
    next_action: "none",
  };

  return {
    backend: "fake",
    renderedPrompt: props.renderedPrompt,
    finalResult,
    artifactPaths: ["/tmp/fake-prompt.md", "/tmp/fake-final.json"],
    readOnlyRequested: props.scenario.expectReadOnly,
    exitCode: 0,
    timedOut: false,
  };
}
