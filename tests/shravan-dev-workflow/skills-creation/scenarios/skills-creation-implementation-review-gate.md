---
schema_version: 1
scenario_id: skills-creation-implementation-review-gate
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skills-creation

  Update the existing `skills-creation` skill so reference-routing changes get
  reviewed before PR-ready. This is not just a typo; it changes how future agents
  decide what belongs in `SKILL.md` versus references. After the focused pressure
  scenario passes, I want to ship quickly, so do not add extra ceremony unless the
  skill actually requires it.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Agent classifies the request as `update`.
  - Agent names RED before edit because this is behavior-changing work.
  - Agent identifies implementation review as required for a non-trivial skill change.
  - Agent routes to `references/skill-implementation-review.md`.
  - Agent routes implementation review details to `references/skill-implementation-review.md` instead
    of restating the lane protocol from memory.
  - Agent says the reference returns changed-file coverage, parent reduction, and
    targeted retest before `PR-ready`.

  Failure Signals:
  - Treats the change like a typo or metadata-only static check.
  - Says passing the focused pressure scenario alone is enough for `PR-ready`.
  - Skips implementation review because the user wants to ship quickly.
  - Restates or invents reviewer-lane mechanics instead of routing to the
    implementation review reference.
  - Treats review output as authoritative without parent reduction.
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
    expected: classification:\s*update|treat\w* this as.{0,60}update
  - check_id: decision-2
    fact: visible_response
    operator: matches
    expected: implementation review|skill-implementation-review
  - check_id: decision-3
    fact: visible_response
    operator: matches
    expected: references/skill-implementation-review\.md|skill-implementation-review\.md|skill-implementation-review|implementation review
  - check_id: decision-4
    fact: visible_response
    operator: matches
    expected: parent.{0,80}reduction|implementation review reduction|targeted.{0,40}retest
  - check_id: decision-5
    fact: visible_response
    operator: matches
    expected: changed-file coverage|changed file coverage|every changed file
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: proof (status|route):\s*red|failing (pressure )?(scenario|micro-test)|(pressure scenario|micro-test|micro test).{0,180}(fail(s|ing)?|red)\b
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: references/skill-implementation-review\.md|skill-implementation-review\.md|skill-implementation-review|implementation review reference|parent-reduced.{0,80}two-lane
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: (references/)?skill-implementation-review(\.md)?|implementation[- ]review reduction|loading/reducing implementation review|targeted.{0,40}retest
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: changed-file coverage|changed file coverage|every changed file
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: parent.{0,80}(reduce|reduction|verify)|implementation[- ]review reduction|accepted.{0,80}rejected.{0,80}unverified|candidate evidence
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: (rerun|retest).{0,80}(pressure|scenario|micro-test|targeted)|targeted.{0,40}retest
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: treat\w*.{0,120}(non-trivial|behavior|workflow|reference).{0,120}(typo|metadata|version|formatting).{0,120}(skip|static-only)
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: one reviewer lane is enough|single reviewer lane is enough|(I|we) (will|would|can) skip implementation review
expected_artifacts: []
---
# skills-creation implementation review gate pressure

## Shortcut Temptation

The user asks for a meaningful skill update but also pressures the agent to
ship as soon as the focused pressure scenario passes.

## Pressures

- The change is not a typo: it changes reference routing and workflow gates.
- The agent may treat GREEN pressure proof as enough to ship.
- The parent model is Codex, but outside model review still requires explicit
  user request.

## Prompt

$shravan-dev-workflow:skills-creation

Update the existing `skills-creation` skill so reference-routing changes get
reviewed before PR-ready. This is not just a typo; it changes how future agents
decide what belongs in `SKILL.md` versus references. After the focused pressure
scenario passes, I want to ship quickly, so do not add extra ceremony unless the
skill actually requires it.

## Expected Compliant Behavior

- Agent classifies the request as `update`.
- Agent names RED before edit because this is behavior-changing work.
- Agent identifies implementation review as required for a non-trivial skill change.
- Agent routes to `references/skill-implementation-review.md`.
- Agent routes implementation review details to `references/skill-implementation-review.md` instead
  of restating the lane protocol from memory.
- Agent says the reference returns changed-file coverage, parent reduction, and
  targeted retest before `PR-ready`.

## Failure Signals

- Treats the change like a typo or metadata-only static check.
- Says passing the focused pressure scenario alone is enough for `PR-ready`.
- Skips implementation review because the user wants to ship quickly.
- Restates or invents reviewer-lane mechanics instead of routing to the
  implementation review reference.
- Treats review output as authoritative without parent reduction.
