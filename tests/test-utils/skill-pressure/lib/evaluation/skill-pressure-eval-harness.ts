import { createHarness, type JsonValue } from "vitest-evals";

import {
  executeBehavioralScenario,
  type ExecuteBehavioralScenarioProps,
} from "./behavioral-scenario-runner.js";
import type { ExecutedV3BehavioralScenario } from "./v3-behavioral-scenario-execution.js";

export interface SkillPressureEvalInput extends ExecuteBehavioralScenarioProps {
  readonly scenarioId: string;
}

export interface SkillPressureEvalOutput {
  readonly [key: string]: JsonValue;
  readonly scenarioId: string;
  readonly executionStatus: "executed" | "infrastructure_error";
  readonly outcome: "pass" | "behavior_fail" | "inconclusive" | "infrastructure_error" | "not_evaluated";
  readonly reasonCode: string | null;
  readonly comparisonIntent: "improvement" | "non_regression";
  readonly baselineCount: number;
  readonly treatmentCount: number;
  readonly evidenceDigest: string;
  readonly receiptPath: string;
}

export interface CreateSkillPressureEvalHarnessProps {
  readonly executeScenario?: (
    props: ExecuteBehavioralScenarioProps,
  ) => Promise<ExecutedV3BehavioralScenario>;
}

export function createSkillPressureEvalHarness(
  props: CreateSkillPressureEvalHarnessProps = {},
) {
  const executeScenario = props.executeScenario ?? executeBehavioralScenario;
  return createHarness<SkillPressureEvalInput, SkillPressureEvalOutput>({
    name: "acpx-skill-pressure-v3",
    run: async ({ input, setArtifact }) => {
      const executed = await executeScenario(input);
      const baseline = executed.receipt.subjects.filter((subject) => subject.evidence.variant === "baseline");
      const treatment = executed.receipt.subjects.filter((subject) => subject.evidence.variant === "treatment");
      const output: SkillPressureEvalOutput = {
        scenarioId: executed.receipt.scenarioId,
        executionStatus: executed.receipt.reduction.outcome === "infrastructure_error"
          ? "infrastructure_error"
          : "executed",
        outcome: executed.receipt.reduction.outcome,
        reasonCode: executed.receipt.reduction.reasonCode ?? null,
        comparisonIntent: executed.receipt.behaviorIdentity.comparisonIntent,
        baselineCount: baseline.length,
        treatmentCount: treatment.length,
        evidenceDigest: executed.receipt.authoritySnapshot.evidenceDigest,
        receiptPath: executed.receiptPath,
      };
      setArtifact("receiptPath", executed.receiptPath);
      setArtifact("evidenceDigest", output.evidenceDigest);
      return {
        output,
        events: buildTranscriptEvents(executed),
        usage: { provider: "openai", model: "gpt-5.6-luna" },
        artifacts: {
          receiptPath: executed.receiptPath,
          evidenceDigest: output.evidenceDigest,
          outcome: output.outcome,
        },
        errors: output.executionStatus === "executed"
          ? []
          : [...executed.receipt.reduction.reasons],
      };
    },
  });
}

function buildTranscriptEvents(executed: ExecutedV3BehavioralScenario) {
  return executed.receipt.subjects.flatMap((subject) => [
    {
      type: "message" as const,
      role: "user" as const,
      content: `${subject.evidence.variant.toUpperCase()}: ${executed.receipt.scenarioId}`,
    },
    {
      type: "message" as const,
      role: "assistant" as const,
      content: subject.evidence.visibleResponse,
    },
  ]);
}
