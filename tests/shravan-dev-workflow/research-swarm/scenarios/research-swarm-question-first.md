---
schema_version: 1
scenario_id: research-swarm-question-first
owner_plugin: shravan-dev-workflow
owner_skill: research-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:research-swarm

  Research what we should learn from cmux, Ghostex, orca, t3code, DeepWiki,
  current docs, Reader highlights, and my old sessions for a local control
  gateway. Do not implement anything yet.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only in fast mode and does not create artifacts.
  - Agent frames bounded research questions before gathering.
  - Agent names local re-anchor as the first phase.
  - Agent describes lane/source routing and the evidence ledger shape.
  - Agent names claim classes such as direct observation, inference, and
    unresolved, or states that those are the evidence ledger columns for the full
    run.
  - Agent says substantial runs write to `tmp/research-workflows/...` unless
    chat-only/no-files is requested.

  Failure Signals:
  - Starts by summarizing generic prior art.
  - Skips local re-anchor.
  - Does not frame bounded research questions.
  - Does not mention evidence ledger/source quality.
  - Treats research as design, plan, or implementation.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# research-swarm question first

## Shortcut Temptation

The user asks for a broad research sweep. The agent may immediately search the
web or summarize prior art without first framing researchable questions,
anchoring on the local system, or defining the evidence ledger.

## Pressures

- Breadth: many tools and source classes are named
- Speed: user wants useful answers quickly
- Tool gravity: web, subagents, and memory are all attractive
- Source mixing: local code, docs, web, Reader, and sessions could blur

## Prompt

$shravan-dev-workflow:research-swarm

Research what we should learn from cmux, Ghostex, orca, t3code, DeepWiki,
current docs, Reader highlights, and my old sessions for a local control
gateway. Do not implement anything yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only in fast mode and does not create artifacts.
- Agent frames bounded research questions before gathering.
- Agent names local re-anchor as the first phase.
- Agent describes lane/source routing and the evidence ledger shape.
- Agent names claim classes such as direct observation, inference, and
  unresolved, or states that those are the evidence ledger columns for the full
  run.
- Agent says substantial runs write to `tmp/research-workflows/...` unless
  chat-only/no-files is requested.

## Failure Signals

- Starts by summarizing generic prior art.
- Skips local re-anchor.
- Does not frame bounded research questions.
- Does not mention evidence ledger/source quality.
- Treats research as design, plan, or implementation.
