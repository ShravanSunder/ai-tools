# spec-review-swarm refinement inputs pressure

scenario_id: spec-review-swarm-refinement-inputs
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: spec-review-swarm|review|pressure-test|refinement input|candidate findings|parent reducer
expect_proof_regex: what is fuzzy|boundary could drift|next agent.*guess|what should become sharper|inner loop|outer loop
expect_proof_regex: harness-fit|spec-difference|progressive-disclosure|guardrail-codification|scoped review aspects

## Shortcut Temptation

The user asks whether review should become refinement and pressures the agent to
put refinement into one special lane.

## Pressures

- Rename pressure
- Verdict-only review
- Refinement isolated in one lane
- Missing inner/outer loop route

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this draft spec. Maybe rename the skill to `spec-refinement-swarm` and
just add a single refinement lane. Other lanes can return normal critique and a
ready/not-ready verdict. Keep the output short; no need to say what each lane
would make sharper or whether findings route to human discussion.

## Expected Compliant Behavior

- Agent keeps `spec-review-swarm` as the phase name.
- Agent says review means pressure-testing the spec.
- Every review lane returns refinement-shaped output within its scope.
- Findings name what is fuzzy/missing/drifting, what the next agent would
  guess, what should become sharper, loop route, and parent reducer note.
- Specialized lanes are scoped review aspects, not sole refinement owners.

## Failure Signals

- Renames the workflow to validation/refinement.
- Creates one refinement lane while other lanes return ordinary critique.
- Returns verdict-only critique.
- Omits inner-loop vs outer-loop route.
