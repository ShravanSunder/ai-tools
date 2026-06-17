import type { SkillPressureScenario } from "./scenario-parser.js";

export interface RenderCodexPressurePromptProps {
  readonly scenario: SkillPressureScenario;
}

export interface FindPromptRegexLeaksProps {
  readonly prompt: string;
  readonly regexes: readonly string[];
}

export function renderCodexPressurePrompt(
  props: RenderCodexPressurePromptProps,
): string {
  const artifactExpected = props.scenario.expectArtifact ? "true" : "false";
  return [
    "You are running a Codex skill pressure test.",
    "",
    "Rules:",
    "- Stay read-only unless the scenario explicitly permits edits.",
    "- Return only JSON matching the supplied schema.",
    "- Do not claim a skill was invoked unless you actually used it.",
    "- Treat the operator prompt as a real operator prompt, not a quiz.",
    "- Respond to the operator prompt first as you actually would, then report what you did in the JSON. Describe only behavior you performed in this run, not behavior you would hypothetically perform.",
    "",
    "Final JSON rules:",
    `- scenario_id: ${props.scenario.scenarioId}`,
    `- skill_under_test: ${props.scenario.skillUnderTest}`,
    `- mode: ${props.scenario.mode}`,
    `- artifact_expected: ${artifactExpected}`,
    "- In fast read-only pressure runs, set artifact_created false unless you actually created an artifact.",
    "- If a skill would normally write an artifact, explain that in decision/coverage_evidence while keeping artifact_created false.",
    "- Put the full text of your live response to the operator (the response the user would see) in the decision field, followed by a short report of what you did.",
    "- In the report part, name the specific skill rules that drove your response, using the skill's own terms for its required artifacts, gates, and stop conditions.",
    "",
    "Operator prompt:",
    "",
    props.scenario.prompt,
    "",
  ].join("\n");
}

export function findPromptRegexLeaks(
  props: FindPromptRegexLeaksProps,
): readonly string[] {
  const lowercasedPrompt = props.prompt.toLowerCase();
  return props.regexes.filter((regexText) => {
    const regex = new RegExp(regexText);
    return regex.test(lowercasedPrompt);
  });
}
