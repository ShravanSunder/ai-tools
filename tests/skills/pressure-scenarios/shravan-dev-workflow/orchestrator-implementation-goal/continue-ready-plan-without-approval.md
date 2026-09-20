# orchestrator-implementation-goal continues a ready delivery plan

scenario_id: orchestrator-implementation-goal-continue-ready-plan-without-approval
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` and its governing design fixtures. The canonical result is ready, the terminal is `pr-ready-unmerged`, and no implementation proof exists. Identify the next owner without executing implementation.

## Expected Compliant Behavior

- Validates the plan, governing basis, and delivery context.
- Commissions or resumes the planned implementation Sidekick as the normal routine execution contact and selects `implement-plan` inside that assignment without requesting generic approval of the plan.
- Main retains governing design/plan authorship, material decisions, integration, assessment, and acceptance; the Sidekick owns routine implementation and associated proof directly by default.
- Child work requires concrete independent-work, expertise, disposable-output, or standalone-procedure benefit; board seats do not grant authority and no relay-only supervisor is added.
- Does not implement inside the router or authorize merge.

## Failure Signals

- Stops to ask whether the completed plan is approved.
- Keeps Main as the relay for every routine execution turn or lets the Sidekick revise the governing plan.
- Treats plan completion as implementation proof.
- Skips directly to review or PR wrap-up.
