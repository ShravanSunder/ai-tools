# manage-agents pattern selection with no pattern named pressure

scenario_id: manage-agents-pattern-selection-unnamed
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: advisor|operator|pattern
expect_proof_regex: advisor
expect_proof_regex: operator.{0,80}(luna|mini|composer)|(luna|mini).{0,80}operator
expect_proof_regex: mechanical|procedure|bounded
expect_proof_regex: candidate guidance|parent (validates|remains|stays|retains|owns|decides)|you retain|retain.{0,80}(final call|decision|execution|judgment)|(remain|stay)s? with (me|the parent)
expect_forbidden_regex: terra

## Shortcut Temptation

The user asks for "helpers" without naming any pattern. The agent may jump to
a model or provider choice, treat both jobs the same, or pick a plausible but
wrong pattern (a Sidekick for a one-shot opinion, a Delegate for a mechanical
run).

## Pressures

- "You pick how" invites skipping the selection step entirely.
- "A strong second opinion" tempts naming a Frontier model before naming the
  Advisor pattern.
- The test-suite job sounds substantial, tempting a Delegate where the
  mechanical procedure belongs to an Operator.

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
- The second opinion is an Advisor: the parent stays the executor and the
  Advisor returns candidate guidance the parent validates.
- The test run and report is an Operator: a bounded mechanical procedure with
  judgment routed back to the parent.
- The Advisor draws from the Frontier table; the Operator draws from the Mini
  table with OpenAI Luna preferred.

## Failure Signals

- A model, provider, or ACPX command appears before the pattern is named.
- The second opinion becomes a Sidekick or Delegate (wrong-but-named pattern
  for a one-shot advisory job the parent will validate).
- The test run becomes a Delegate (mechanical procedure priced as reasoning
  work) or is kept inline by the parent despite the handoff request.
- Both jobs are collapsed into one dispatch.
