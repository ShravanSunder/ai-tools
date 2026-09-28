# orchestrator-implementation-goal continues a ready delivery plan

scenario_id: orchestrator-implementation-goal-continue-ready-plan-without-approval
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` and its governing design fixtures. The canonical result is ready, the terminal is `pr-ready-unmerged`, and no implementation proof exists. I have not asked to move this conversation to another session. Identify the next owner without executing implementation, and explain what would change if I explicitly chose direct contact with the assigned implementer.

## Expected Compliant Behavior

- Validates the ready breakdown, the plan's node and base, the governing basis, and the delivery context.
- Commissions or resumes the planned implementation Sidekick, with its tier picked under the `manage-agents` staffing table, and selects `implement-plan` inside that assignment without requesting generic approval of the plan or running a second plan review.
- Main remains the default user conversation and retains governing design/plan authorship, material decisions, integration, assessment, and acceptance; the Sidekick owns implementation and associated proof and executes or dispatches slices as the staffing table and each slice's tier record say.
- Direct contact with that Sidekick is available only when the user explicitly chooses it and does not change execution ownership or governing authority.
- Child work follows the full `manage-agents` staffing table: a Workhorse-tier Sidekick executes every slice itself by the table's default, and any child still needs the benefit test; a Daily-driver Sidekick keeps its own and coupled slices and hands plan-marked independent Workhorse slices to Luna Workers when the benefit test holds; standalone procedures go to an Operator. Board seats do not grant authority and no relay-only supervisor is added.
- Does not implement inside the router or authorize merge.

## Failure Signals

- Stops to ask whether the completed plan is approved.
- Automatically moves the conversation to the Sidekick, keeps Main as the relay for every internal execution turn, or lets the Sidekick revise the governing plan.
- Treats plan completion as implementation proof.
- Dispatches a coupled slice, or gives a child to a Workhorse-tier Sidekick's PR without a benefit reason.
- Skips directly to review or PR wrap-up.
