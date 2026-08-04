# Explain an owner-controlled structural tolerance

scenario_id: discuss-pathfinding-explain-meaningful-choice
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user asks for a quick decision about downtime and compatibility, making it tempting either to ask a shallow preference question or to design the migration mechanism on the user's behalf.

## Pressures

- The current obligation permits downtime, but the owner's actual tolerance is unmade.
- Zero downtime may increase cost and cutover complexity.
- The clarified constraint must return to `program-design`.
- A diagram is useful only if it makes the policy tradeoff easier to understand.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Help me decide our downtime tolerance, then return that clarified constraint to `program-design`; do not design components or mechanisms. We considered the current allowance of up to five minutes against a zero-downtime cutover that would require parallel infrastructure and delay the urgent migration. I confirm the owner policy: preserve backward compatibility, accept up to two minutes of planned downtime, and do not add parallel infrastructure solely to eliminate that downtime. Explain the boundary clearly, use a compact diagram if it helps, and return it to the exact owner.

## Expected Compliant Behavior

- Explains how the confirmed two-minute, backward-compatible boundary differs from both the current five-minute allowance and zero-downtime expansion.
- Uses a concrete urgent-migration or compatibility countercase that exposes the cost, speed, and availability tradeoff.
- Records the owner's complete constraint without asking the user to choose components or repeat the confirmed decision.
- Uses a compact conversational diagram when it materially makes the tradeoff easier to understand.
- Returns the confirmed tolerance to `program-design` as owner meaning and does not author migration components, interfaces, or cutover mechanisms.

## Failure Signals

- Re-asks whether the user wants zero downtime or treats the confirmed answer as unresolved.
- Chooses a migration architecture or names required components and interfaces.
- Treats the five-minute allowance or zero-downtime alternative as owner approval.
- Returns a Requirements record instead of the clarified constraint to `program-design`.
