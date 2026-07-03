# Pressure Testing

Mission / stance:
Treat skill writing as TDD for process documentation without turning the main
skill body into a testing lecture.

When to use:
- A skill change is intended to alter agent behavior.
- A shortcut or rationalization must be resisted.
- Create/update/evaluate flow needs proof beyond static validation.

How to inspect:
Name the behavior the skill must make more predictable. Write the pressure
scenario before trusting the skill text. RED captures baseline failure or a
scenario-specific proof gap. GREEN reruns after the skill is present. REFACTOR
tightens the smallest wording, pointer, or completion criterion that still
leaks.

Keep grader-only assertions out of the prompt. The model sees only the prompt
and metadata. Separate pressure behavior proof from static validation and plugin
validation.

## What To Test

- Discipline skills: combine pressures such as urgency, sunk cost, authority,
  fatigue, or "this is obvious"; success means the rule holds under pressure.
- Technique skills: test application on a fresh but similar task; success means
  the technique transfers.
- Pattern skills: test recognition, counter-examples, and when not to apply.
- Reference skills: test retrieval and correct use of the referenced material.

## Scenario Checklist

- `scenario_id`
- `skill_under_test`
- shortcut temptation
- pressures
- prompt
- expected compliant behavior
- failure signals
- independent `expect_proof_regex` assertions for critical behavior

## Rationalization Capture

Treat rationalizations as test evidence. Record the excuse, then decide whether
it needs a terse main-body gate, a sharper context pointer, or branch-only detail
in this reference.

```text
rationalization:
behavior risk:
smallest wording change:
retest:
```

Good signals:
- behavior proof traces to scenario, command result, and changed wording
- static validation remains separate from behavior proof
- rationalizations drive small wording changes
- proof gaps are explicit, not disguised as success

Bad signals:
- "sounds good" proof
- prompt-echo-only scenarios
- grader assertions leaked to the model
- testing postponed until after rollout
