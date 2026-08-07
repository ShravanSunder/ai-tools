import type {
  SkillPressureEvaluator,
} from "../../scenario-cases/scenario-case-types.js";
import { createJudge, type JudgeResult } from "vitest-evals";

export function createSourceReadEvaluator(
  requiredPaths: readonly string[],
): SkillPressureEvaluator {
  return createJudge(
    "SourceReadEvaluator",
    (context): JudgeResult => {
      const missingPaths = requiredPaths.filter((requiredPath) =>
        !context.output.normalizedToolCalls.some((call) => {
          if (
            call.capability !== "source-read" ||
            call.exitCode !== 0 ||
            call.output.trim().length === 0
          ) {
            return false;
          }
          const commandPathCount = requiredPaths.filter((path) =>
            call.command.includes(path),
          ).length;
          if (commandPathCount === 1 && call.command.includes(requiredPath)) {
            return true;
          }
          return hasDelimitedOutputSection({
            output: readObservableOutput(call.output),
            requiredPath,
          });
        }),
      );
      const passed = missingPaths.length === 0;
      return {
        score: passed ? 1 : 0,
        metadata: {
          disposition: passed ? "pass" : "fail",
          evidence: passed ? [...requiredPaths] : missingPaths,
          rationale: passed
            ? "Every required source produced observable read output."
            : "Required sources were not observably read.",
        },
      };
    },
  );
}

function readObservableOutput(serializedOutput: string): string {
  try {
    const parsedOutput: unknown = JSON.parse(serializedOutput);
    if (
      typeof parsedOutput === "object" &&
      parsedOutput !== null &&
      "formatted_output" in parsedOutput &&
      typeof parsedOutput.formatted_output === "string"
    ) {
      return parsedOutput.formatted_output;
    }
  } catch {
    // Direct read tools may already provide plain text.
  }
  return serializedOutput;
}

function hasDelimitedOutputSection(props: {
  readonly output: string;
  readonly requiredPath: string;
}): boolean {
  const delimiter = `--- ${props.requiredPath}\n`;
  const sectionStart = props.output.indexOf(delimiter);
  if (sectionStart < 0) {
    return false;
  }
  const contentStart = sectionStart + delimiter.length;
  const nextDelimiter = props.output.indexOf("\n--- ", contentStart);
  const sectionEnd = nextDelimiter < 0 ? props.output.length : nextDelimiter;
  return props.output.slice(contentStart, sectionEnd).trim().length > 0;
}
