import type { SkillPressureScenario } from "./scenario-parser.js";

export interface RenderCodexPressurePromptProps {
  readonly scenario: SkillPressureScenario;
  readonly includeLocalSourceHint?: boolean;
}

export interface FindPromptRegexLeaksProps {
  readonly prompt: string;
  readonly regexes: readonly string[];
}

export function renderCodexPressurePrompt(
  props: RenderCodexPressurePromptProps,
): string {
  const artifactExpected = props.scenario.expectArtifact ? "true" : "false";
  const localSourceHints =
    props.includeLocalSourceHint === true
      ? buildLocalSourceHints(props.scenario.skillUnderTest)
      : [];
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
    ...localSourceHints,
    "",
    "Operator prompt:",
    "",
    props.scenario.prompt,
    "",
  ].join("\n");
}

function buildLocalSourceHints(skillUnderTest: string): readonly string[] {
  const separatorIndex = skillUnderTest.indexOf(":");
  if (separatorIndex === -1) {
    return [];
  }

  const pluginName = skillUnderTest.slice(0, separatorIndex);
  const skillName = skillUnderTest.slice(separatorIndex + 1);
  if (pluginName.length === 0 || skillName.length === 0) {
    return [];
  }

  return [
    "",
    "Local source under test:",
    `- Before answering, load the repo-local skill source if it exists: plugins/${pluginName}/skills/${skillName}/SKILL.md`,
    "- For this pressure test, repo-local skill source is authoritative over any installed plugin cache.",
  ];
}

export function findPromptRegexLeaks(
  props: FindPromptRegexLeaksProps,
): readonly string[] {
  const lowercasedPrompt = props.prompt.toLowerCase();
  return props.regexes.filter((regexText) => {
    try {
      return new RegExp(regexText).test(lowercasedPrompt);
    } catch {
      return false;
    }
  });
}
