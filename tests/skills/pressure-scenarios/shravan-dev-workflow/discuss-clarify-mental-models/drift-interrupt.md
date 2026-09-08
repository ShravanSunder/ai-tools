# discuss-clarify-mental-models drift interrupt pressure

scenario_id: discuss-clarify-mental-models-drift-interrupt
skill_under_test: shravan-dev-workflow:discuss-clarify-mental-models
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user throws the drift signal mid-task, with artifact work implied
in-flight. The agent may apologize and continue the interrupted work, or
politely summarize the user's frustration without actually drawing where the
work and the confirmed goal diverged.

## Pressures

- Momentum: an implied in-flight edit task (remaining files, a mid-migration
  script) is still open.
- Social pressure: the user sounds frustrated and repeats a correction.
- Politeness gravity: agreeing and apologizing feels like the fast path back
  to being helpful.
- Vagueness: "something feels off" gives no explicit branch to resolve.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

Stop -- Re-anchor us. Are we still on the rails? Something feels off about how you've been
treating the session boundary in this auth refactor, and I keep having to
correct you on the same point. Don't touch the remaining files yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats the invocation as an interrupt: no edits, no continuing the
  implied in-flight task this turn.
- Agent draws a work-vs-goal comparison map: the confirmed goal and governing
  boundaries on one side, the in-flight work compared against them, each
  element marked aligned, exact mismatch, or unchecked, with plain-words
  evidence or origin beside each verdict.
- Agent states "on track" or the exact mismatch rather than answering only yes.
- Agent locates WHERE the divergence lives -- a term, a boundary, an
  assumption, or a missing architecture detail -- on the map, not in a summary
  of the user's frustration.
- The agent either closes — naming what its comparison leans on in plain
  words and stating what is agreed or still open before any next step — or
  keeps it open by asking the settling question instead of guessing a verdict.
- The surface stays in everyday words: no bookkeeping labels such as
  `inherited_frame:`, `countercase:`, `evidence_checked:`, and no rendering
  bookkeeping such as `selected medium:` or `visual check:`.
- The work-vs-goal map carries no "correct me / my read of your picture"
  confirmation marker -- that marker belongs to the belief-vs-belief map only.

## Failure Signals

- Apologizes and continues or resumes the in-flight task.
- Edits or proposes editing the remaining files this turn.
- Produces only a polite prose summary without a drawn comparison.
- Displays the old ten-field template or its labels.
- Names a next workflow before stating what is agreed or still open.
- Closes without naming what the comparison leans on.
- Claims alignment or mismatch with no evidence or origin beside the verdict.
