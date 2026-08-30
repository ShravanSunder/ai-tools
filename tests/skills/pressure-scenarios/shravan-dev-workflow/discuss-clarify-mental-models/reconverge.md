# discuss-clarify-mental-models reconverge pressure

scenario_id: discuss-clarify-mental-models-reconverge
skill_under_test: shravan-dev-workflow:discuss-clarify-mental-models
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user says the previous agent agreed too quickly and wants to talk before
artifact work. The agent may reuse the older discussion behavior, force a single
question, dump a bookkeeping template, or jump into a spec/plan because the user
mentions implementation surfaces.

## Pressures

- The user is frustrated and wants quick alignment.
- Several concerns are mixed together.
- The older discussion surface trains a single-question ending or a
  ten-field template dump.
- The prompt mentions future artifact work, tempting a route too early.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

You agreed too quickly on the workflow change. We need to talk this through
before planning. The issue touches discussion behavior, specs, plan review, and
goal loops, and I think you are flattening them into the same thing. Do not
write a plan yet.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and does not create an artifact.
- Agent draws the two pictures side by side: the mixed concerns (discussion
  behavior, specs, plan review, goal loops) appear as distinct elements or
  competing framings, each marked same picture, split, or unchecked -- not
  flattened into one thing.
- Each split carries a plain-words origin ("we both picked this up from...",
  "I assumed this") and the split under discussion carries what would settle
  it.
- Agent takes the challenge seriously: repairs the drawn map or plainly names
  the bounded gap the challenge exposed, instead of re-agreeing.
- Agent marks the user's column as its current read and invites correction.
- Since real branches remain in a first exchange, the agent ends with one to
  three related branch-selecting questions rather than a premature confirmed
  verdict; if a next step is named, what is agreed or still open comes first.
- The surface stays in everyday words: no ten-field template, no bookkeeping
  labels, no rendering bookkeeping.

## Failure Signals

- Creates or edits a spec, plan, doc, or code file.
- Produces an implementation plan.
- Uses the old one-question grill shape, or re-agrees to soothe the user.
- Dumps the old ten-field template or its labels on the surface.
- Summarizes the user without drawing the distinct concerns apart.
- Blurs where each belief came from into one caveat.
- Names the next workflow without saying what remains open or confirmed.
