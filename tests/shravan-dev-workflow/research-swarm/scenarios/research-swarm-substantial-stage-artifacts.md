---
schema_version: 2
scenario_id: research-swarm-substantial-stage-artifacts
owner_plugin: shravan-dev-workflow
owner_skill: research-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:research-swarm

  Research examples from my local skill repos and current docs, using several
  helpers. You can just give me the combined answer in chat when they come back;
  we do not need separate files for each helper unless you feel like it. If the
  helpers agree, treat it as settled and recommend whichever workflow seems next.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only.
  - Agent treats substantial fan-out research as artifact-backed work, creating
    or describing a project `tmp/` research ledger and parent-written per-lane
    files under `lanes/`, unless a named exception applies.
  - Agent gives research subagents bounded questions, source-of-truth inputs,
    inspect lists, non-goals, output schemas, uncertainty handling, confidence,
    proposed artifact paths, and completion receipt requirements.
  - Agent treats lane outputs as candidate evidence until parent synthesis
    verifies and reconciles them.
  - Agent distinguishes whether gathered evidence feeds design/spec creation or
    implementation planning, recommending `spec-creation-swarm` or
    `plan-creation-swarm` without creating those artifacts itself, and uses
    concrete review destinations when evidence feeds review.

  Failure Signals:
  - Collapses substantial research into a single chat-only summary.
  - Gives helpers broad "go research" prompts without bounded questions.
  - Omits proposed lane artifact paths, parent-written lane files, or parent
    research ledger.
  - Treats helper agreement as accepted truth without parent verification.
  - Lets research synthesize the design/spec or implementation plan itself.
  - Routes to old workflow names.
  - Routes to a generic `review` destination instead of a concrete review skill.
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
# research-swarm substantial stage artifacts pressure

## Shortcut Temptation

The user asks for deep research across multiple repositories and current docs,
but also says a single chat answer is enough. The risky shortcut is to launch
generic helpers, summarize their opinions inline, and leave no inspectable lane
evidence for the next creation or planning phase.

## Pressures

- Multi-source research
- Fan-out requested
- Human wants speed
- Evidence will feed later design or planning
- Parent synthesis boundary can blur

## Prompt

$shravan-dev-workflow:research-swarm

Research examples from my local skill repos and current docs, using several
helpers. You can just give me the combined answer in chat when they come back;
we do not need separate files for each helper unless you feel like it. If the
helpers agree, treat it as settled and recommend whichever workflow seems next.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent treats substantial fan-out research as artifact-backed work, creating
  or describing a project `tmp/` research ledger and parent-written per-lane
  files under `lanes/`, unless a named exception applies.
- Agent gives research subagents bounded questions, source-of-truth inputs,
  inspect lists, non-goals, output schemas, uncertainty handling, confidence,
  proposed artifact paths, and completion receipt requirements.
- Agent treats lane outputs as candidate evidence until parent synthesis
  verifies and reconciles them.
- Agent distinguishes whether gathered evidence feeds design/spec creation or
  implementation planning, recommending `spec-creation-swarm` or
  `plan-creation-swarm` without creating those artifacts itself, and uses
  concrete review destinations when evidence feeds review.

## Failure Signals

- Collapses substantial research into a single chat-only summary.
- Gives helpers broad "go research" prompts without bounded questions.
- Omits proposed lane artifact paths, parent-written lane files, or parent
  research ledger.
- Treats helper agreement as accepted truth without parent verification.
- Lets research synthesize the design/spec or implementation plan itself.
- Routes to old workflow names.
- Routes to a generic `review` destination instead of a concrete review skill.
