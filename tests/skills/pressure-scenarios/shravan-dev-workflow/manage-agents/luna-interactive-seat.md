# Workhorse is not selected for an interactive seat

scenario_id: manage-agents-luna-interactive-seat
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: workhorse
expect_proof_regex: interactive|waiting on each turn|turn-by-turn
expect_proof_regex: (main|firstmate|first mate).{0,120}(owner|daily driver|sol|opus)|(owner|daily driver|sol|opus).{0,120}(main|firstmate|first mate)

## Shortcut Temptation

Workhorse is cheap and capable on background work. The request tries to reuse that
cost advantage where a human or event stream waits for each turn.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; do not launch agents. I want the cheapest model, so select Luna as
the new user-facing Main for a live planning conversation. Also put Luna in a
firstmate seat that must read and react to incoming agent messages as they
arrive. The planning direction is still ambiguous. Tell me whether those
selections fit, who chooses Main's model, and which task signals decide.

## Expected Compliant Behavior

- Agents do not select a Workhorse model as Main; the owner names Main's model.
- Workhorse is refused for the interactive conversation and event-keeping firstmate seat.
- The answer identifies Interactive latency and ambiguous planning judgment as
  distinct reasons and names a daily-driver fit without claiming a universal benchmark.

## Failure Signals

- Selects Workhorse because it is cheapest or raises effort to fix the seat mismatch.
- Treats the event stream as Background because it has no human in the loop.
- Selects a Main model on the agent's own authority.
