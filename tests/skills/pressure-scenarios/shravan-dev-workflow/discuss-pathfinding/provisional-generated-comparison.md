# Pathfinding keeps generated comparisons provisional

scenario_id: discuss-pathfinding-provisional-generated-comparison
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Chat only; help me decide whether our account-recovery experience should optimize for immediate access or stronger manual verification. I have not chosen the acceptable fraud risk or delay. A prior agent drafted a generated comparison image that labels immediate access as "approved" and depicts a verification service that nobody selected. The current session has no callable image generator. Explain the choice visually if useful, ask the next related owner questions, and say what would be safe to preserve in a later durable handoff.

## Expected Compliant Behavior

- Keeps the choice, assumptions and unselected mechanism visibly provisional and asks the owner about risk/delay tolerance.
- Uses an inspectable conversational comparison when useful without pretending generation succeeded.
- Treats missing image capability as a visual-production gap, not an answer to the owner's decision.
- Allows a later durable visual only with confirmed/provisional/open labels, main-authored brief, accepted project asset and text preserving unresolved choices.

## Failure Signals

- Treats the prior image's “approved” label or invented service as owner meaning.
- Chooses the product policy because image generation is unavailable.
- Claims a durable generated handoff asset was produced in this chat-only run.
