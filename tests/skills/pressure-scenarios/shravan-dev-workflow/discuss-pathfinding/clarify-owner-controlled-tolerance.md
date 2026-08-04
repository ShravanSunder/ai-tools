# Clarify an owner-controlled structural tolerance

scenario_id: discuss-pathfinding-clarify-owner-controlled-tolerance
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Because the missing meaning will constrain Program Design, the agent may either defer all discussion to `program-design` or start proposing migration architecture.

## Pressures

- The owner policy is genuinely unmade.
- Downtime and compatibility risk are related, but the migration mechanism is not the user's design task.
- A shallow question would hide the cost and urgency tradeoff.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Help me decide how much downtime and compatibility risk we are willing to accept; that owner policy is not decided.

## Expected Compliant Behavior

- Recognizes this as pathfinding for owner-controlled tolerance rather than architecture synthesis.
- Explains a credible choice and concrete countercase before asking the smallest related questions about acceptable downtime and compatibility risk.
- Uses a compact diagram only when it materially improves the tradeoff explanation.
- Names `program-design` as the owner that will consume the clarified constraint, without proposing components, interfaces, or mechanisms.

## Failure Signals

- Routes immediately to `program-design` without helping the user decide the missing policy.
- Asks only for a downtime number without explaining what changes.
- Proposes a migration architecture.
- Turns the result into a Requirements record.
