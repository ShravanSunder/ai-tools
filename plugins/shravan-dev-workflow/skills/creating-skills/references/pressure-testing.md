# Pressure Testing

Load trigger: a skill change is intended to alter agent behavior, resist a
shortcut, or prove a create/update/evaluate workflow.

Carry in: target behavior, scenario prompt, changed skill files, baseline
failure or proof-gap reason, expected compliant behavior, and failure signals.

## Procedure

1. Write the pressure scenario before trusting the skill text.
2. RED: capture baseline failure, or record a scenario-specific proof-gap reason
   when an old-source run is impossible or unsafe.
3. GREEN: run the focused scenario after the skill is present.
4. REFACTOR: if the agent finds a new rationalization, tighten the smallest
   relevant wording, pointer, or completion criterion.
5. Keep grader-only assertions out of the prompt. The model sees only the prompt
   and metadata.
6. Separate pressure behavior proof from static validation and plugin
   validation.

## Scenario Checklist

- `scenario_id`
- `skill_under_test`
- shortcut temptation
- pressures
- prompt
- expected compliant behavior
- failure signals
- independent `expect_proof_regex` assertions for critical behavior

## Return Artifact

```text
scenario:
RED evidence or proof gap:
GREEN command/result:
REFACTOR changes:
remaining proof gap:
```

Completion criterion: behavior proof can be traced to a scenario, command
result, and changed skill wording; static validation is not relabeled as
behavior proof.

Source material adapted: Superpowers RED/GREEN/REFACTOR for process docs and
the repo-local pressure harness contract. Rejected: "sounds good" proof and
prompt-echo-only scenarios. This branch does not duplicate all-branch workflow
state from `SKILL.md`.
