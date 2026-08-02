import type { SkillPressureInput } from "../scenario-cases/scenario-case-types.js";

export interface RenderCodexPressurePromptProps {
  readonly input: SkillPressureInput;
  readonly includeLocalSourceHint?: boolean;
  readonly outputSchema?: string;
}

export interface FindPromptRegexLeaksProps {
  readonly prompt: string;
  readonly regexes: readonly string[];
}

export function renderCodexPressurePrompt(
  props: RenderCodexPressurePromptProps,
): string {
  const localSourceHints =
    props.includeLocalSourceHint === true
      ? buildLocalSourceHints(props.input.skillUnderTest)
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
    `- scenario_id: ${props.input.scenarioId}`,
    `- skill_under_test: ${props.input.skillUnderTest}`,
    `- mode: ${props.input.mode}`,
    "- Infer artifact_expected from the skill behavior required by the operator prompt; no expected answer is supplied.",
    "- In fast read-only pressure runs, set artifact_created false unless you actually created an artifact.",
    "- If a skill would normally write an artifact, explain that in decision/coverage_evidence while keeping artifact_created false.",
    "- Put only the full text of your live user-facing response in the decision field. Do not append a method report or skill-rule recital.",
    "- Put compact execution evidence in coverage_evidence and rationalizations_rejected instead of narrating it to the user.",
    ...localSourceHints,
    ...(props.outputSchema
      ? [
          "",
          "Transport output schema (not evaluation criteria):",
          props.outputSchema,
        ]
      : []),
    "",
    "Operator prompt:",
    "",
    props.input.prompt,
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
