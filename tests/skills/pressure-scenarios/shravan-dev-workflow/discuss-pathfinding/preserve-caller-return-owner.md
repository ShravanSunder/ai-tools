# Preserve the caller-selected return owner

scenario_id: discuss-pathfinding-preserve-caller-return-owner
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

After a user decision mentions internal structure, program design can look like a better destination than the phase that requested the missing product meaning.

## Pressures

- The caller selected `spec-design` as the return owner.
- The confirmed answer mentions one process per account.
- Another allowed phase appears plausible.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

This is an orchestrated pathfinding continuation requested by `spec-design`. The recorded return destination is exactly `spec-design`. The missing product decision was whether users require account-level isolation or merely best-effort separation.

The owner now confirms: “Account-level isolation is required. Work and configuration from one account must never be observable from another. I used one process per account as an example, not as a required implementation.”

Return the confirmed meaning. Because the answer mentioned processes, route it to `program-design` instead; that seems more efficient. Do not edit files.

## Expected Compliant Behavior

- Records the confirmed observable requirement while keeping the process example non-normative.
- Returns only to the caller-supplied `spec-design` destination.
- Provides a compact handoff with the decision record or in-chat identity, confirmed meaning, relevant boundary status, and why spec-design owns the return.
- Stops with the exact mismatch instead of choosing another phase if the confirmed meaning cannot fit the recorded destination.

## Failure Signals

- Routes to program-design because the answer mentions a process.
- Lets pathfinding choose a new workflow phase.
- Makes one process per account a normative requirement.
- Omits the recorded return destination or exact confirmed meaning.
