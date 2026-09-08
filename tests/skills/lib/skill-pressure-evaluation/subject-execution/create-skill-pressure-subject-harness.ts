import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHarness, type JsonValue } from "vitest-evals";
import { parseExactAgentJsonResponse } from "../agent-execution/parse-agent-json-response.js";
import type { AcpxAgentRunner } from "../agent-execution/acpx-codex-agent-runner.js";
import type { AcpxCodexAgentSetup } from "../runtime-configuration/skill-pressure-runtime-configuration.js";
import type {
  NormalizedToolCall,
  SkillPressureInput,
  SubjectConversationTurn,
} from "../scenario-cases/scenario-case-types.js";
import { normalizeAcpxToolCalls } from "./normalize-acpx-events.js";
import {
  renderCodexPressurePrompt,
  renderFollowUpUserTurn,
} from "./render-subject-prompt.js";
import { runAcpxPressureCase } from "./run-acpx-subject.js";
import type { SkillPressureResult } from "./validate-subject-result.js";
import { validateSkillPressureResult } from "./validate-subject-result.js";

export interface SkillPressureHarnessOutput {
  readonly [key: string]: JsonValue;
  readonly backend: string;
  readonly renderedPrompt: string;
  readonly finalResult: SkillPressureResult;
  /** All logical final responses to the final explicit user request. */
  readonly finalResponseParts?: SkillPressureResult[];
  /**
   * Turns before the final one, in conversation order. Empty for single-turn
   * scenarios; the final turn lives in finalResult.
   */
  readonly earlierConversationTurns: SubjectConversationTurn[];
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

      const followUpUserTurns = input.followUpUserTurns ?? [];
      const renderedFollowUpPrompts = followUpUserTurns.map((operatorTurn) =>
        renderFollowUpUserTurn(operatorTurn),
      );
      const acpxRun = await runAcpxPressureCase({
        input,
        renderedPrompt,
        ...(renderedFollowUpPrompts.length === 0
          ? {}
          : { renderedFollowUpPrompts }),
        repoRoot: props.repoRoot,
        runner: props.subjectRunner,
        ...(signal === undefined ? {} : { signal }),
        setup: props.subjectSetup,
      });
      const turnResultGroups = validateAcpxTurnResults({
        turnTexts: acpxRun.turnTexts,
        ...(acpxRun.turnMessageTexts === undefined
          ? {}
          : { turnMessageTexts: acpxRun.turnMessageTexts }),
      });
      const turnResults = turnResultGroups.map(
        (turnResultGroup, requestIndex) => {
          const turnResult = turnResultGroup.at(-1);
          if (turnResult === undefined) {
            throw new Error(
              `ACPX pressure run produced no result for request ${requestIndex + 1}.`,
            );
          }
          return turnResult;
        },
      );
      const finalResult = turnResults.at(-1);
      if (finalResult === undefined) {
        throw new Error("ACPX pressure run produced no turns.");
      }
      const finalResponseParts = turnResultGroups.at(-1);
      if (finalResponseParts === undefined) {
        throw new Error("ACPX pressure run produced no final response group.");
      }
      const operatorMessages = [input.prompt, ...followUpUserTurns];
      const earlierConversationTurns: SubjectConversationTurn[] = turnResults
        .slice(0, -1)
        .map((turnResult, turnIndex) => ({
          operatorMessage: operatorMessages[turnIndex] ?? "",
          subjectDecision: turnResult.decision,
        }));

      const output: SkillPressureHarnessOutput = {
        backend: props.backend,
        renderedPrompt,
        finalResult,
        finalResponseParts: [...finalResponseParts],
        earlierConversationTurns,
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
          ...earlierConversationTurns.flatMap((conversationTurn, turnIndex) =>
            turnIndex === 0
              ? [
                  {
                    role: "assistant" as const,
                    content: conversationTurn.subjectDecision,
                  },
                ]
              : [
                  {
                    role: "user" as const,
                    content: conversationTurn.operatorMessage,
                  },
                  {
                    role: "assistant" as const,
                    content: conversationTurn.subjectDecision,
                  },
                ],
          ),
          ...(followUpUserTurns.length === 0
            ? []
            : [
                {
                  role: "user" as const,
                  content: followUpUserTurns.at(-1) ?? "",
                },
              ]),
          { role: "assistant", content: finalResult.decision },
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
    finalResponseParts: [finalResult],
    earlierConversationTurns: [],
    artifactDirectory: "/tmp",
    artifactPaths: ["/tmp/fake-prompt.md", "/tmp/fake-final.json"],
    normalizedToolCalls: [],
    readOnlyRequested: true,
  };
}

export function validateAcpxTurnResults(props: {
  readonly turnTexts: readonly string[];
  readonly turnMessageTexts?: readonly (readonly string[])[];
}): readonly (readonly SkillPressureResult[])[] {
  const responseGroups =
    props.turnMessageTexts ?? props.turnTexts.map((turnText) => [turnText]);
  if (responseGroups.length !== props.turnTexts.length) {
    throw new Error(
      `ACPX pressure run returned ${responseGroups.length} response groups for ${props.turnTexts.length} explicit requests.`,
    );
  }

  return responseGroups.map((responseGroup, requestIndex) => {
    if (responseGroup.length === 0) {
      throw new Error(
        `ACPX pressure run returned no responses for request ${requestIndex + 1}.`,
      );
    }
    if (responseGroup.at(-1) !== props.turnTexts[requestIndex]) {
      throw new Error(
        `ACPX pressure run response association mismatch on request ${requestIndex + 1}.`,
      );
    }

    return responseGroup.map((responseText, responseIndex) => {
      let responseJson: unknown;
      try {
        responseJson = parseExactAgentJsonResponse(responseText);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `ACPX pressure result failed strict JSON parsing on request ${requestIndex + 1} response ${responseIndex + 1}: ${message}`,
        );
      }
      const responseValidation = validateSkillPressureResult(responseJson);
      if (!responseValidation.ok) {
        throw new Error(
          `ACPX pressure result failed schema validation on request ${requestIndex + 1} response ${responseIndex + 1}:\n${responseValidation.errors.join("\n")}`,
        );
      }
      return responseValidation.value;
    });
  });
}
