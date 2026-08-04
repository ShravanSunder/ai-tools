import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHarness, type JsonValue } from "vitest-evals";
import { parseExactAgentJsonResponse } from "../agent-execution/parse-agent-json-response.js";
import type { AcpxAgentRunner } from "../agent-execution/acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import type {
  NormalizedToolCall,
  SkillPressureInput,
} from "../scenario-cases/scenario-case-types.js";
import { normalizeAcpxToolCalls } from "./normalize-acpx-events.js";
import { renderCodexPressurePrompt } from "./render-subject-prompt.js";
import { runAcpxPressureCase } from "./run-acpx-subject.js";
import type { SkillPressureResult } from "./validate-subject-result.js";
import { validateSkillPressureResult } from "./validate-subject-result.js";

export interface SkillPressureHarnessOutput {
  readonly [key: string]: JsonValue;
  readonly backend: string;
  readonly renderedPrompt: string;
  readonly finalResult: SkillPressureResult;
  readonly artifactDirectory: string;
  readonly artifactPaths: string[];
  readonly normalizedToolCalls: NormalizedToolCall[];
  readonly readOnlyRequested: boolean;
}

export interface CreateSkillPressureHarnessProps {
  readonly repoRoot: string;
  readonly backend: string;
  readonly subjectRunner: AcpxAgentRunner;
  readonly subjectSetup: AcpxCodexAgentSetup;
}

export function createSkillPressureHarness(
  props: CreateSkillPressureHarnessProps,
) {
  return createHarness<SkillPressureInput, SkillPressureHarnessOutput>({
    name: "skill-pressure",
    run: async ({ input, setArtifact, signal }) => {
      const outputSchema =
        props.backend === "fake"
          ? undefined
          : readFileSync(
              join(
                props.repoRoot,
                "tests/skills/schemas/skill-pressure-result.schema.json",
              ),
              "utf8",
            );
      const renderedPrompt = renderCodexPressurePrompt({
        input,
        includeLocalSourceHint: props.backend !== "fake",
        ...(outputSchema === undefined ? {} : { outputSchema }),
      });

      if (props.backend === "fake") {
        const output = createFakeHarnessOutput({ input, renderedPrompt });
        setArtifact("backend", props.backend);
        setArtifact("artifactPaths", [...output.artifactPaths]);
        return {
          output,
          messages: [
            { role: "user", content: renderedPrompt },
            { role: "assistant", content: output.finalResult.decision },
          ],
          usage: { provider: "fake", model: "fake-skill-pressure" },
          artifacts: {
            backend: props.backend,
            artifactPaths: output.artifactPaths,
          },
        };
      }

      const acpxRun = await runAcpxPressureCase({
        input,
        renderedPrompt,
        repoRoot: props.repoRoot,
        runner: props.subjectRunner,
        ...(signal === undefined ? {} : { signal }),
        setup: props.subjectSetup,
      });
      const finalJson = parseExactAgentJsonResponse(acpxRun.finalText);
      const validation = validateSkillPressureResult(finalJson);
      if (!validation.ok) {
        throw new Error(
          `ACPX pressure result failed schema validation:\n${validation.errors.join("\n")}`,
        );
      }

      const output: SkillPressureHarnessOutput = {
        backend: props.backend,
        renderedPrompt,
        finalResult: validation.value,
        artifactDirectory: acpxRun.artifactDirectory,
        artifactPaths: [...acpxRun.artifactPaths],
        normalizedToolCalls: [...normalizeAcpxToolCalls(acpxRun.eventsPath)],
        readOnlyRequested: acpxRun.readOnlyRequested,
      };
      setArtifact("backend", props.backend);
      setArtifact("artifactPaths", [...acpxRun.artifactPaths]);

      return {
        output,
        messages: [
          { role: "user", content: renderedPrompt },
          { role: "assistant", content: validation.value.decision },
        ],
        usage: {
          provider: "openai",
          model: props.subjectSetup.model,
        },
        artifacts: {
          backend: props.backend,
          artifactPaths: [...acpxRun.artifactPaths],
        },
      };
    },
  });
}

function createFakeHarnessOutput(props: {
  readonly input: SkillPressureInput;
  readonly renderedPrompt: string;
}): SkillPressureHarnessOutput {
  const finalResult: SkillPressureResult = {
    scenario_id: props.input.scenarioId,
    skill_under_test: props.input.skillUnderTest,
    skill_invoked: true,
    mode: props.input.mode,
    read_only: true,
    artifact_expected: false,
    artifact_created: false,
    decision: "Fake backend returned a subject observation.",
    coverage_evidence: ["fake backend plumbing evidence"],
    shortcut_resisted: true,
    rationalizations_rejected: ["fake backend did not execute agent"],
    open_questions: [],
    next_action: "none",
  };

  return {
    backend: "fake",
    renderedPrompt: props.renderedPrompt,
    finalResult,
    artifactDirectory: "/tmp",
    artifactPaths: ["/tmp/fake-prompt.md", "/tmp/fake-final.json"],
    normalizedToolCalls: [],
    readOnlyRequested: true,
  };
}
