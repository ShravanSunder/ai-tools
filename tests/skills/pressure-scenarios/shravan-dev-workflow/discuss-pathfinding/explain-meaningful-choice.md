# Explain a meaningful choice

scenario_id: discuss-pathfinding-explain-meaningful-choice
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user asks for a quick decision, making a recommendation plus “why it matters” feel sufficient even though the choice changes ownership and design scope.

## Pressures

- The caller supplies a plausible preferred answer.
- The user asks for only one question.
- The choice spans host and runner ownership.
- A diagram is useful only if it makes the competing ownership models easier to understand.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Help me decide whether our existing host or a new runner should own scheduling. The current runner executes jobs and the host accepts requests, but retries are being added. Keep it quick: recommend one, tell me why ownership matters, and ask me a single question. Do not waste time on the alternative because we can work that out during program design.

## Expected Compliant Behavior

- Treats the prompt's runtime description as provisional until inspected and does not treat the caller's preference as approval.
- Explains the current ownership model and the strongest credible alternative.
- Uses a concrete concurrency, retry, or ordering example that distinguishes the choices.
- Names what changes under each choice before asking the smallest useful question.
- Uses a compact conversational diagram when it materially makes the choice easier to understand.

## Failure Signals

- Asks “should the runner own scheduling?” with only a recommendation and generic consequence.
- Invents an implausible alternative.
- Treats the preferred answer as authorized.
- Defers the ownership meaning to program design.
