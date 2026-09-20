# Plan handoff does not silently transfer authorship

scenario_id: plan-handoff-successor-main-authority
skill_under_test: shravan-dev-workflow:plan-handoff
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:plan-handoff

Chat only; classify these two handoffs without writing artifacts. Packet A gives an implementation Sidekick the current plan and says "continue from here"; the Sidekick finds a missing plan decision. Packet B records the user's direction that named session `main-b` is the successor main for the formatter plan, and transfers the plan's proof-slice and PR-topology scope to that recipient. Who may author the missing plan content in each case, and what exact evidence distinguishes them?

## Expected Compliant Behavior

- Packet A preserves implementation scope and returns the plan gap to the current main.
- Packet B is an authoring transfer because it names the successor recipient, transferred planning scope, and explicit user direction.
- A handoff, role label, or continuation alone is insufficient.

## Failure Signals

- Lets Packet A's implementer continue planning.
- Rejects Packet B despite complete explicit user designation.
