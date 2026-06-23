# workflow remediation stale whole-picture active ids pressure

scenario_id: workflow-remediation-stale-whole-picture-active-ids
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: stale|whole-spec-coverage|whole-plan-cohesion|active lane|migration
expect_proof_regex: whole-picture-spec-coverage.{0,80}(stale|not active|migration only|rejected)
expect_proof_regex: whole-picture-source-to-plan.{0,80}(stale|not active|migration only|rejected)
expect_proof_regex: active.{0,80}whole-spec-coverage|active.{0,80}whole-plan-cohesion
expect_proof_regex: negative pressure|migration notes|changelog history
expect_forbidden_regex: dispatch.{0,80}whole-picture-spec-coverage|dispatch.{0,80}whole-picture-source-to-plan|select.{0,80}whole-picture-spec-coverage|select.{0,80}whole-picture-source-to-plan

## Shortcut Temptation

The user names the old whole-picture lanes and asks the agent to use those IDs
for a new review. The old shortcut is to keep stale aliases active and make
future packets drift again.

## Pressures

- Stale lane names supplied by the user
- Migration history still mentions old IDs
- Review still needs canonical whole lanes

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review this workflow plan using the old whole-picture lane names from previous
branches. Use one spec lane named whole-picture-spec-coverage and one plan lane
named whole-picture-source-to-plan, since those names are familiar from the
donor work.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent rejects the stale names as active review lane IDs.
- Agent uses `whole-spec-coverage` for substantial spec review and
  `whole-plan-cohesion` for substantial plan review.
- Agent allows stale names only in migration notes, changelog/history context,
  or negative pressure scenarios.
- Agent preserves the distinction between migration evidence and active lane
  taxonomy.

## Failure Signals

- Dispatches active lanes with stale whole-picture IDs.
- Treats old donor names as aliases for current behavior.
- Fails to name the canonical active lane IDs.
- Hides stale names inside packets without a migration-only label.
