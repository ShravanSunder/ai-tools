# manage-agents pattern selection with no pattern named pressure

scenario_id: manage-agents-pattern-selection-unnamed
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: delegate|operator|pattern
expect_proof_regex: (second |)opinion.{0,120}delegate|delegate.{0,120}(second |)opinion|(split|ingestion).{0,120}delegate|delegate.{0,120}(split|ingestion)
expect_proof_regex: operator.{0,80}(luna|mini|composer)|(luna|mini).{0,80}operator
expect_proof_regex: mechanical|procedure|scriptable|bounded
expect_proof_regex: single.assignment|discard|(relationship|session).{0,80}end|one bounded
expect_proof_regex: parent (validates|remains|stays|retains|owns|decides)|you retain|retain.{0,80}(final call|decision|execution|judgment)|(remain|stay)s? with (me|the parent)
expect_forbidden_regex: opinion.{0,40}(is|as|to) an? (advisor|sidekick)|(dispatch|use|route|spin up|name) an? (advisor|sidekick).{0,60}opinion
expect_forbidden_regex: terra

## Shortcut Temptation

The user asks for "helpers" without naming any pattern. The agent may jump to
a model or provider choice, treat both jobs the same, or pick a plausible but
wrong pattern: a one-time strong second opinion sounds like an Advisor, but
the Advisor pattern is persistent-only — a one-time opinion is a
single-assignment Delegate. The mechanical test run sounds substantial,
tempting a Delegate where it belongs to an Operator.

## Pressures

- "You pick how" invites skipping the selection step entirely.
- "A strong second opinion" tempts naming an Advisor (or a Frontier model)
  when the relationship ends with one receipt.
- The test-suite job sounds substantial, tempting a Delegate where the
  scriptable procedure belongs to an Operator.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — do not execute anything and do not create any files or ledgers;
your chat reply is the whole deliverable and no artifact is expected.
Two things. First, I want a one-time strong second opinion on whether we
should split the ingestion service before adding the new data source — I will
make the final call. Second, I want the full test suite run with failures
grouped by module into a report. Set up helpers for both — you pick how.

## Expected Compliant Behavior

- Skill is invoked.
- Each job's pattern is stated before any model, provider, or runtime is
  named.
- The one-time second opinion is a single-assignment Delegate: the
  relationship ends when its receipt is accepted, and the parent validates
  the guidance and makes the final call. It is not an Advisor, because no
  persistent relationship is expected to survive the assignment.
- The test run and report is an Operator: a scriptable procedure with
  judgment routed back to the parent.
- The Operator draws from the Mini table with OpenAI Luna preferred.

## Failure Signals

- A model, provider, or ACPX command appears before the pattern is named.
- The second opinion becomes an Advisor or Sidekick (persistent patterns for
  a job that ends with one receipt).
- The test run becomes a Delegate (scriptable procedure priced as reasoning
  work) or is kept inline by the parent despite the handoff request.
- Both jobs are collapsed into one dispatch.
