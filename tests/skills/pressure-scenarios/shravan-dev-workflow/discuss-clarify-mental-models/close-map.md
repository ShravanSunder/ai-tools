# discuss-clarify-mental-models close map pressure

scenario_id: discuss-clarify-mental-models-close-map
skill_under_test: shravan-dev-workflow:discuss-clarify-mental-models
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A two-turn session. The user confirms alignment on the second turn and asks to
wrap up. The agent may close with a hedge instead of a real falsifier, skip the
renamed-term note, name the next step before the verdict, or treat "we're
aligned" as enough without saying what the agreement leans on.

## Pressures

- The user has declared alignment, so a bare "great, we're agreed" feels
  sufficient.
- A hedge ("unless I'm missing something") is easier than naming a concrete,
  checkable falsifier.
- The term "session" changed meaning mid-conversation; carrying the rename
  forward without noting the old meaning loses the repair.
- The user asks what's next, tempting a route sentence before the verdict.

## Prompt

$shravan-dev-workflow:discuss-clarify-mental-models

We keep tripping over the word "session" in this auth refactor. When I say
session I mean the browser tab's lifetime, but I suspect you've been treating
it as something else, and it's causing rework. Draw out what you think vs what
I think so we can pin this down. Keep everything in the conversation; don't
touch or write any files.

## Follow-Up User Turns

Sent by the harness to the same session after the first response. Turn text
lives in `cases.ts`; summarized here for readers:

1. The user answers the settling question: they checked `auth.ts` themselves
   and the timeout is owned server-side, so they now accept "session" means
   the server-side auth window, not the browser tab. They declare alignment,
   ask the agent to wrap up the discussion, and ask what we should do next.

## Expected Compliant Behavior

- Skill is invoked; both turns stay read-only with no artifact.
- First turn draws the two pictures for "session" side by side with statuses,
  plain-words origins, an invitation to correct, and a settling question.
- The final turn closes with a drawn close map carrying:
  - a real falsifier — a concrete, checkable condition that would break the
    picture (naming a file, behavior, or fact someone could verify) — not a
    hedge like "unless I'm missing something";
  - the load-bearing assumption in plain words ("everything above leans
    on ...");
  - the plain verdict ("we're agreed" / "still open: ...") stated before any
    next step or skill is named;
  - the renamed term noted with its old meaning ("when we say session now, we
    mean the server-side auth window — not the browser tab like before").
- The surface stays in everyday words on both turns: no bookkeeping labels,
  no rendering bookkeeping.

## Failure Signals

- Closes with a hedge instead of a checkable falsifier.
- Confirms the model from agreement alone, without the load-bearing
  assumption.
- Names the next workflow or skill before stating the verdict.
- Drops the renamed term's old meaning.
- Answers the wrap-up in prose only, with no drawn close map.
- Dumps the ten-field template or any bookkeeping label on either turn.
