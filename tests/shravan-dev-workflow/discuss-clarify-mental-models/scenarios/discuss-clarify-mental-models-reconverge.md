---
schema_version: 2
scenario_id: discuss-clarify-mental-models-reconverge
owner_plugin: shravan-dev-workflow
owner_skill: discuss-clarify-mental-models
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:discuss-clarify-mental-models

  You agreed too quickly on the workflow change. We need to talk this through
  before planning. The issue touches discussion behavior, specs, plan review, and
  goal loops, and I think you are flattening them into the same thing. Do not
  write a plan yet.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only and does not create an artifact.
  - Agent uses the skill's output contract fields.
  - Agent maps the mixed concerns as distinct branches or framings.
  - Agent separates inherited framing, first principles, and assumptions.
  - Agent names a countercase and load-bearing assumption.
  - Agent does not ask a ritual single forcing question.
  - Agent names a next workflow only after marking whether the model is open or
    confirmed.

  Failure Signals:
  - Creates or edits a spec, plan, doc, or code file.
  - Produces an implementation plan.
  - Uses the old one-question grill shape.
  - Summarizes the user without branches, assumptions, and countercase.
  - Collapses inherited framing, first principles, and assumptions.
  - Names the next workflow without saying what remains open or confirmed.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# discuss-clarify-mental-models reconverge pressure

## Shortcut Temptation

The user says the previous agent agreed too quickly and wants to talk before
artifact work. The agent may reuse the older discussion behavior, force a single
question, or jump into a spec/plan because the user mentions implementation
surfaces.

## Pressures

- The user is frustrated and wants quick alignment.
- Several concerns are mixed together.
- The older discussion surface trains a single-question ending.
- The prompt mentions future artifact work, tempting a route too early.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

You agreed too quickly on the workflow change. We need to talk this through
before planning. The issue touches discussion behavior, specs, plan review, and
goal loops, and I think you are flattening them into the same thing. Do not
write a plan yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and does not create an artifact.
- Agent uses the skill's output contract fields.
- Agent maps the mixed concerns as distinct branches or framings.
- Agent separates inherited framing, first principles, and assumptions.
- Agent names a countercase and load-bearing assumption.
- Agent does not ask a ritual single forcing question.
- Agent names a next workflow only after marking whether the model is open or
  confirmed.

## Failure Signals

- Creates or edits a spec, plan, doc, or code file.
- Produces an implementation plan.
- Uses the old one-question grill shape.
- Summarizes the user without branches, assumptions, and countercase.
- Collapses inherited framing, first principles, and assumptions.
- Names the next workflow without saying what remains open or confirmed.
