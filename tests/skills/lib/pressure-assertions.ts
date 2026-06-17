import type { SkillPressureScenario } from "./scenario-parser.js";
import type { SkillPressureResult } from "./result-schema.js";
import { findPromptRegexLeaks } from "./prompt-renderer.js";

export interface EvaluatePressureAssertionsProps {
  readonly scenario: SkillPressureScenario;
  readonly result: SkillPressureResult;
  readonly renderedPrompt: string;
  readonly readOnlyRequested: boolean;
  readonly artifactPaths: readonly string[];
}

export interface PressureAssertionResult {
  readonly failures: readonly string[];
}

export function evaluatePressureAssertions(
  props: EvaluatePressureAssertionsProps,
): PressureAssertionResult {
  const failures: string[] = [];
  const lowercasedDecision = props.result.decision.toLowerCase();
  const lowercasedProofSurface = JSON.stringify(props.result).toLowerCase();

  if (props.result.scenario_id !== props.scenario.scenarioId) {
    failures.push(
      `scenario_id mismatch: expected ${props.scenario.scenarioId}, received ${props.result.scenario_id}`,
    );
  }
  if (props.result.skill_under_test !== props.scenario.skillUnderTest) {
    failures.push(
      `skill_under_test mismatch: expected ${props.scenario.skillUnderTest}, received ${props.result.skill_under_test}`,
    );
  }
  if (!props.result.skill_invoked) {
    failures.push("skill_invoked must be true");
  }
  if (props.result.mode !== props.scenario.mode) {
    failures.push(
      `mode mismatch: expected ${props.scenario.mode}, received ${props.result.mode}`,
    );
  }
  if (props.result.read_only !== props.scenario.expectReadOnly) {
    failures.push(
      `read_only mismatch: expected ${props.scenario.expectReadOnly}, received ${props.result.read_only}`,
    );
  }
  if (props.readOnlyRequested !== props.scenario.expectReadOnly) {
    failures.push(
      `read-only backend request mismatch: expected ${props.scenario.expectReadOnly}, received ${props.readOnlyRequested}`,
    );
  }
  if (props.result.artifact_expected !== props.scenario.expectArtifact) {
    failures.push(
      `artifact_expected mismatch: expected ${props.scenario.expectArtifact}, received ${props.result.artifact_expected}`,
    );
  }
  if (!props.result.shortcut_resisted) {
    failures.push("shortcut_resisted must be true");
  }
  if (props.artifactPaths.length === 0) {
    failures.push("artifacts needed for debugging were not recorded");
  }

  appendRegexFailures({
    failures,
    label: "decision regex",
    regexes: props.scenario.expectDecisionRegexes,
    text: lowercasedDecision,
    shouldMatch: true,
  });

  appendRegexFailures({
    failures,
    label: "proof regex",
    regexes: props.scenario.expectProofRegexes,
    text: lowercasedProofSurface,
    shouldMatch: true,
  });

  appendRegexFailures({
    failures,
    label: "forbidden regex",
    regexes: props.scenario.expectForbiddenRegexes,
    text: lowercasedProofSurface,
    shouldMatch: false,
  });

  for (const leak of findPromptRegexLeaks({
    prompt: props.renderedPrompt,
    regexes: props.scenario.expectProofRegexes,
  })) {
    failures.push(`rubric leak: prompt text satisfies proof regex: ${leak}`);
  }

  return { failures };
}

interface AppendRegexFailuresProps {
  readonly failures: string[];
  readonly label: string;
  readonly regexes: readonly string[];
  readonly text: string;
  readonly shouldMatch: boolean;
}

function appendRegexFailures(props: AppendRegexFailuresProps): void {
  props.regexes.forEach((regexText, index) => {
    const regexNumber = index + 1;
    let matches: boolean;
    try {
      matches = new RegExp(regexText).test(props.text);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      props.failures.push(`invalid ${props.label} ${regexNumber} "${regexText}": ${message}`);
      return;
    }
    if (props.shouldMatch && !matches) {
      props.failures.push(`${props.label} ${regexNumber} did not match: ${regexText}`);
    }
    if (!props.shouldMatch && matches) {
      props.failures.push(`${props.label} ${regexNumber} matched unexpectedly: ${regexText}`);
    }
  });
}
