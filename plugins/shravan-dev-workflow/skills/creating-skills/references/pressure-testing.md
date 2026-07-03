# Pressure Testing

Treat skill writing as TDD for process documentation. Write the pressure
scenario before trusting the skill text; do not let the main skill body turn
into a testing lecture.

Load this when a skill change is intended to alter agent behavior, when a
shortcut or rationalization must be resisted, or when create/update/evaluate
flow needs proof beyond static validation.

RED captures baseline failure or a scenario-specific proof gap. GREEN
reruns after the skill is present. REFACTOR tightens the smallest wording,
pointer, or completion criterion that still leaks. Keep grader-only
assertions out of the prompt -- the model under test sees only the prompt
and metadata. This protocol produces behavior proof; static or plugin
validation is a separate, out-of-scope check.

## What To Test, By Skill Type

- Discipline skills: combine pressures such as urgency, sunk cost, authority,
  fatigue, or "this is obvious"; success means the rule holds under
  pressure.
- Technique skills: test application on a fresh but similar task; success
  means the technique transfers.
- Pattern skills: test recognition, counter-examples, and when not to apply.
- Reference skills: test retrieval and correct use of the referenced
  material.

## Micro-Test Protocol

Use micro-tests to verify wording quickly; scenarios remain the gate for
discipline skills.

- Run a no-guidance control first. If the control does not fail, do not
  author the guidance -- there is nothing to fix.
- Run 5+ fresh-context repetitions of the candidate wording, each inside its
  realistic surrounding context, not in isolation.
- Read every flagged transcript by hand; do not trust a keyword match alone.
- Treat variance across reps as a metric in itself: five different
  interpretations of the same wording means the wording is not binding yet,
  no matter how many reps technically passed.

## Rationalization Capture

Treat rationalizations as test evidence. Record the excuse, then decide
whether it needs a terse main-body gate, a sharper context pointer, or
branch-only detail in this reference.

```text
rationalization:
behavior risk:
smallest wording change:
retest:
```

## Running The Suite

`tests/skills/run-skill-pressure-tests.sh --fast` runs the fast suite;
`tests/skills/run-skill-pressure-tests.sh --scenario <id>` runs one scenario.
Scenario file format and the runner's grader-only contract are owned by
`tests/skills/README.md` -- cite it, do not restate its checklist here.
