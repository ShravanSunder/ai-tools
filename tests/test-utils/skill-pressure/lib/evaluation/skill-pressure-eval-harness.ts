import { createHarness, type JsonValue } from "vitest-evals";

import {
  executeBehavioralScenario,
  type ExecutedBehavioralScenario,
  type ExecuteBehavioralScenarioProps,
} from "./behavioral-scenario-runner.js";

export interface SkillPressureEvalInput extends ExecuteBehavioralScenarioProps {
  readonly scenarioId: string;
}

export interface SkillPressureEvalOutput {
  readonly [key: string]: JsonValue;
  readonly scenarioId: string;
  readonly executionStatus: "executed" | "infrastructure_error";
  readonly outcome: "pass" | "behavior_fail" | "inconclusive" | "infrastructure_error" | "not_evaluated";
  readonly baselineCount: number;
  readonly treatmentCount: number;
  readonly pairSetFingerprint: string;
  readonly receiptPath: string;
}

export interface CreateSkillPressureEvalHarnessProps {
  readonly executeScenario?: (
    props: ExecuteBehavioralScenarioProps,
  ) => Promise<ExecutedBehavioralScenario>;
}

export function createSkillPressureEvalHarness(
  props: CreateSkillPressureEvalHarnessProps = {},
) {
  const executeScenario = props.executeScenario ?? executeBehavioralScenario;
  return createHarness<SkillPressureEvalInput, SkillPressureEvalOutput>({
    name: "acpx-skill-pressure",
    run: async ({ input, setArtifact }) => {
      const executed = await executeScenario(input);
      const output: SkillPressureEvalOutput = {
        scenarioId: executed.receipt.scenario.scenarioId,
        executionStatus: executed.receipt.result.status,
        outcome: executed.receipt.reduction.outcome,
        baselineCount: executed.receipt.result.baseline.length,
        treatmentCount: executed.receipt.result.treatment.length,
        pairSetFingerprint: executed.receipt.result.pairSetFingerprint,
        receiptPath: executed.receiptPath,
      };
      setArtifact("receiptPath", executed.receiptPath);
      setArtifact("pairSetFingerprint", output.pairSetFingerprint);
      return {
        output,
        events: buildTranscriptEvents(executed),
        usage: { provider: "openai", model: "gpt-5.6-luna" },
        artifacts: {
          receiptPath: executed.receiptPath,
          pairSetFingerprint: output.pairSetFingerprint,
          outcome: output.outcome,
        },
        errors: output.executionStatus === "executed"
          ? []
          : [...executed.receipt.result.infrastructureReasons],
      };
    },
  });
}

function buildTranscriptEvents(executed: ExecutedBehavioralScenario) {
  return [
    ...executed.receipt.result.baseline.flatMap((receipt, index) => [
      { type: "message" as const, role: "user" as const, content: `RED ${index + 1}: ${executed.scenarioPrompt}` },
      { type: "message" as const, role: "assistant" as const, content: receipt.transcript.visibleResponse },
    ]),
    ...executed.receipt.result.treatment.flatMap((receipt, index) => [
      { type: "message" as const, role: "user" as const, content: `GREEN ${index + 1}: ${executed.scenarioPrompt}` },
      { type: "message" as const, role: "assistant" as const, content: receipt.transcript.visibleResponse },
    ]),
  ];
}
