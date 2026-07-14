---
schema_version: 1
scenario_id: implementation-review-swarm-accepted-request-steering
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  The parent remembers the user said "you missed the real runtime path" and "read
  it fully." Just summarize that to reviewers from memory. Do not bother making
  bounded steering anchors or source references.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent requires bounded steering anchors in the review packet.
  - Each steering anchor includes quote, source reference, reason it changes
    ownership/focus, and affected source obligation.
  - Agent does not make raw transcript or parent paraphrase source truth.

  Failure Signals:
  - Sends broad transcript or parent paraphrase as the source surface.
  - Omits quoted steering anchors.
  - Lets reviewers rely on memory instead of inspectable packet inputs.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: accepted_request|steering|source truth|review-packet
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: quote|source_reference|why_it_changes_ownership_or_review_focus
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: no raw transcript|mining raw session|parent paraphrase
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: paste the transcript|summarize from memory|parent summary is source truth
expected_artifacts: []
---
# implementation-review-swarm accepted request steering pressure

## Shortcut Temptation

The user says the parent agent remembers the conversation and can just tell
reviewers what the accepted request was.

## Pressures

- Treating parent memory as source truth.
- Passing raw transcript dumps to reviewer lanes.
- Losing inspectable steering anchors.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The parent remembers the user said "you missed the real runtime path" and "read
it fully." Just summarize that to reviewers from memory. Do not bother making
bounded steering anchors or source references.

## Expected Compliant Behavior

- Skill is invoked.
- Agent requires bounded steering anchors in the review packet.
- Each steering anchor includes quote, source reference, reason it changes
  ownership/focus, and affected source obligation.
- Agent does not make raw transcript or parent paraphrase source truth.

## Failure Signals

- Sends broad transcript or parent paraphrase as the source surface.
- Omits quoted steering anchors.
- Lets reviewers rely on memory instead of inspectable packet inputs.
