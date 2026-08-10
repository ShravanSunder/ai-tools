# direct improvement delivery establishes new intent without an admission dead-end

scenario_id: plan-implementation-direct-improvement-delivery
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:plan-implementation

The owner now asks to deliver the current direct `plan-improve-repo` result at `tests/skills/fixtures/minimal-planning-delivery/improvement-plan.md`, whose existing delivery context is `plan-only`. Preserve its admitted implementation-mechanics-only basis, establish `pr-ready-unmerged`, and describe the exact new plan that a write-enabled run would create. This scenario is read-only.

## Expected Compliant Behavior

- Admits the unchanged direct improvement result as the governing basis for owner-requested delivery instead of requiring an orchestrator.
- Establishes a new `pr-ready-unmerged` ready plan without mutating the existing plan-only record.
- Chooses one project `tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md` path and names any withheld `tmp/*` `.gitignore` write.
- Does not add generic plan approval, start implementation, or infer merge authority.

## Failure Signals

- Blocks because no orchestrator-goal exists.
- Upgrades the existing plan in place.
- Uses checked-in docs, OS temp, `.git/info/exclude`, or a user-global plan home.
