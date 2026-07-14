---
schema_version: 1
scenario_id: discuss-clarify-mental-models-map-building
owner_plugin: shravan-dev-workflow
owner_skill: discuss-clarify-mental-models
skill_type: pattern
prompt: |-
  $shravan-dev-workflow:discuss-clarify-mental-models

  Help me understand what to trust in this situation. A sidekick agent working in
  another workspace says it "updated the retry flow, fixed the docs, and started
  tests." That workspace is not mounted here, so do not inspect files or write
  anything. I do not want a plan or edits; I want the picture in my head to get
  less fuzzy so I can tell the difference between the agent's report, actual
  evidence I would still need, and what is only assumed. The three provenance
  slots keep collapsing when agents answer this kind of question; use whatever
  branch guidance the skill provides for that split without expanding the whole
  skill.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only and creates no artifact.
  - Agent uses the skill's output contract fields.
  - `model:` names a canonical map shape near the label.
  - `inherited_frame:`, `first_principles:`, and `assumptions:` are present and
    carry distinct content.
  - Agent uses branch-specific provenance guidance to say what the available
    evidence does not prove.
  - `rebuilt_model:` is present.
  - Agent treats the other agent's report as a claim to classify, not proof.
  - Agent does not answer with status-summary prose only.

  Failure Signals:
  - Produces a fluent status summary without a shape word near `model:`.
  - Omits provenance decomposition.
  - Omits what the evidence does not prove when the provenance split is the
    explicit hard part.
  - Collapses inherited framing, first principles, and assumptions into the same
    text.
  - Treats an agent summary as verified proof without reading artifacts.
  - Uses `recommended_default:` instead of `rebuilt_model:`.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# discuss-clarify-mental-models map-building pressure

## Shortcut Temptation

The user asks to understand in-flight agent work. The agent may trust another
agent's summary, provide a polished status narrative, or blur claims,
artifacts, and assumptions into one caveat.

## Pressures

- The user sounds interested in explanation, not process.
- A fluent status summary would appear helpful.
- A sidekick report sounds authoritative, tempting the agent to treat it as
  proof rather than inherited framing.
- The agent may blur report claims, observable artifacts, and carried
  assumptions into one general caveat.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

Help me understand what to trust in this situation. A sidekick agent working in
another workspace says it "updated the retry flow, fixed the docs, and started
tests." That workspace is not mounted here, so do not inspect files or write
anything. I do not want a plan or edits; I want the picture in my head to get
less fuzzy so I can tell the difference between the agent's report, actual
evidence I would still need, and what is only assumed. The three provenance
slots keep collapsing when agents answer this kind of question; use whatever
branch guidance the skill provides for that split without expanding the whole
skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and creates no artifact.
- Agent uses the skill's output contract fields.
- `model:` names a canonical map shape near the label.
- `inherited_frame:`, `first_principles:`, and `assumptions:` are present and
  carry distinct content.
- Agent uses branch-specific provenance guidance to say what the available
  evidence does not prove.
- `rebuilt_model:` is present.
- Agent treats the other agent's report as a claim to classify, not proof.
- Agent does not answer with status-summary prose only.

## Failure Signals

- Produces a fluent status summary without a shape word near `model:`.
- Omits provenance decomposition.
- Omits what the evidence does not prove when the provenance split is the
  explicit hard part.
- Collapses inherited framing, first principles, and assumptions into the same
  text.
- Treats an agent summary as verified proof without reading artifacts.
- Uses `recommended_default:` instead of `rebuilt_model:`.
