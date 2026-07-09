# Pressure Testing

Use this as the detailed proof protocol. Pressure testing validates the craft
model; it is not a substitute for writing a clear trigger, mental model, main
path, and reference hierarchy.

Load this when a skill change is intended to alter agent behavior, when a
shortcut or rationalization must be resisted, or when create/update/evaluate
flow needs proof beyond static validation.

RED captures baseline failure or a scenario-specific proof gap. GREEN reruns
after the skill is present. REFACTOR tightens the smallest trigger, pointer,
completion criterion, or wording form that still leaks. Keep grader-only
assertions out of the prompt -- the model under test sees only the prompt and
metadata. Static validation remains structural proof only.

## Proof By Skill Type

- Discipline skill: combine pressures such as urgency, sunk cost, authority,
  fatigue, ambiguity, or "this is obvious." Success means the rule holds under
  pressure and rationalizations are rejected.
- Technique skill: test application on a fresh but similar task. Success means
  the technique transfers without handholding.
- Pattern skill: test recognition, correct use, and counter-examples. Success
  means the agent knows when and when not to apply the mental model.
- Reference skill: test retrieval and correct use. Success means the pointer
  gets the agent to the right detail and the detail is applied correctly.
- Mechanical or metadata change: use structural validation. Do not invent
  pressure proof for a change that cannot alter behavior.

## Micro-Test Protocol

Use micro-tests to verify wording quickly; scenarios remain the gate for
discipline skills.

- Run a no-guidance control first. If the control does not fail, do not author
  the guidance -- there is nothing to fix.
- Run 5+ fresh-context repetitions of the candidate wording, each inside its
  realistic surrounding context, not in isolation.
- Read every flagged transcript by hand; do not trust a keyword match alone.
- Treat variance across reps as a metric: five different interpretations of the
  same wording means the wording is not binding yet.

## Rationalization Capture

Treat rationalizations as test evidence. Record the excuse, then decide whether
it needs a main-body gate, a sharper context pointer, a stronger completion
criterion, or branch-only detail in this reference.

```text
rationalization:
behavior risk:
smallest wording change:
retest:
```

## Running The Suite

`tests/skills/run-skill-pressure-tests.sh --fast` runs the fast suite;
`tests/skills/run-skill-pressure-tests.sh --scenario <id>` runs one scenario.
Scenario file format and the runner's grader-only checks are owned by
`tests/skills/README.md` -- cite it, do not restate its checklist here.
