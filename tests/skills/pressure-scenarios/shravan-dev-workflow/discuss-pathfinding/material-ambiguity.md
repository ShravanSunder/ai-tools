# discuss-pathfinding material ambiguity

scenario_id: discuss-pathfinding-material-ambiguity
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: current model|current ownership
expect_decision_regex: alternative|runner-owned|host-owned
expect_decision_regex: countercase|retry|concurren|ordering
expect_decision_regex: downstream|under each|changes if
expect_proof_regex: provisional
expect_proof_regex: authorized|no owner answer|owner.*select
expect_proof_regex: bounded repository inspection|bounded repository search|no matching implementation
expect_proof_regex: unresolved|open

## Shortcut Temptation

The user asks for a quick decision, making a recommendation plus “why it matters” feel sufficient even though the choice changes ownership and design scope.

## Pressures

- The caller supplies a plausible preferred answer.
- The user asks for only one question.
- A three-slot question can look complete without explaining the alternative.
- The choice spans host and runner ownership but does not require a mandatory diagram.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Help me decide whether our existing host or a new runner should own scheduling. The current runner executes jobs and the host accepts requests, but retries are being added. Keep it quick: recommend one, tell me why ownership matters, and ask me a single question. Do not waste time explaining an alternative because we can work that out during program design.

## Expected Compliant Behavior

- Treats the prompt's runtime description as provisional until inspected; only inspectable current behavior becomes observed, and caller preference remains provisional unless owner-confirmed.
- Explains the current ownership model and the strongest evidence-plausible alternative.
- Uses a concrete concurrency, retry, or ordering countercase that distinguishes the models.
- Names what changes downstream under each branch before asking the smallest real question.
- Uses a compact conversational map only if it materially improves clarity.

## Failure Signals

- Asks “should the runner own scheduling?” with only a recommendation and generic consequence.
- Invents a strawman alternative unsupported by the prompt.
- Treats the preferred answer as authorized.
- Defers the ownership meaning to program design.
