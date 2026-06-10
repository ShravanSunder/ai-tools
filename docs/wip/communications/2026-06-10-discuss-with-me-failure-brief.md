# discuss-with-me Failure Brief

Date: 2026-06-10

Purpose: give another agent a compact, concrete packet for analyzing why
`$shravan-dev-workflow:discuss-with-me` is failing its intended job and what
needs to be sharpened.

## User Intent

The skill is supposed to create shared understanding before action. When the
user invokes it, the agent should slow down, inspect available evidence, map the
problem space, and ask scoped questions that force the user's mental model to
become explicit.

The user does not want a generic chat facilitator. The skill should actively
grill the user's model: what is assumed, what could be wrong, what boundary is
unclear, what system is actually in scope, and what decision must be made before
planning or editing.

## Current Observed Failures

1. The skill is too soft under execution pressure.
   It says "teach back, stress, and clarify" but an agent can satisfy that by
   politely summarizing and asking a vague question. The skill does not force
   the agent to challenge the user's current model.

2. The point of the skill is not stated sharply enough.
   The real point should be: make the shared model prove itself before action.
   The current text reads partly like lifecycle routing and partly like
   facilitation.

3. "Grill me" is only an intent handle, not a hard mode.
   The skill lists `grill-me` beside `reflect-back`, `steelman`, and
   `assumption-check`, but it does not define a stricter output contract for
   grilling.

4. The questions are not scoped with a visible decision map.
   The user expects the skill to diagram or otherwise map the decision boundary
   when the problem space is fuzzy. Current output shape starts with labels like
   `Stage` and `Intent handle`, but it does not require a scoped diagram,
   decision tree, system map, or option boundary before asking.

5. The skill asks questions, but not always the right kind.
   It should ask forcing questions tied to an assumption or boundary. A weak
   question like "what should we do next?" fails. A compliant question should
   be closer to: "Are we discussing Voyager Feeds enrichment behavior, PR
   closure, RETL v2 state, or deployment proof? Those require different
   evidence and different next workflows."

6. The pressure test is too weak.
   `tests/skills/pressure-scenarios/discuss-with-me-fuzzy-intent.md` verifies
   read-only behavior, stage classification, and a boundary/tradeoff mention,
   but it does not verify that the agent actually challenges the user model,
   presents a scoped map, or asks a forcing question.

7. Voyager Feeds exposed the failure mode.
   In a real repo with strong execution gravity, the agent drifted toward
   acting/reviewing rather than pausing to build shared understanding. The skill
   did not seize control strongly enough when explicitly invoked.

8. Cache/version drift confused the diagnosis.
   Some Voyager Feeds sessions referenced older `shravan-dev-workflow` cached
   versions. Restart/cache pickup matters, but it does not fully explain the
   failure because the current source skill is still too soft.

9. External review handling was mishandled.
   The user asked for Claude/Fable 5 max. The first outside review used a
   GPT-5.5 subagent instead. A later `claude -p --model fable --effort max`
   attempt was delayed by command syntax and did not produce a usable result
   before the user redirected the work.

10. Reviewer role config was wrong.
    Codex reviewer config was pinned to `gpt-5.4`, which violates the user's
    stated preference that reviewer should not use 5.4. Live and template
    reviewer config were patched to `gpt-5.5`, but this is adjacent to, not a
    fix for, `discuss-with-me`.

## Desired Behavior

When invoked, `discuss-with-me` should do this before any plan or code:

```text
1. State what the user appears to believe.
2. Draw or list the scoped decision map.
3. Identify what could be wrong with that model.
4. Name the load-bearing assumption or boundary.
5. Say what evidence was checked and what evidence is missing.
6. Give the recommended default.
7. Ask one forcing question tied to the boundary.
```

## Example Expected Shape

```text
What I think you mean:
You want to decide whether this is a workflow/review problem, not start editing.

Scoped map:
Voyager Feeds issue
  -> enrichment/backfill behavior
  -> PR/review closure
  -> RETL v2 state or checkpointing
  -> deployment proof / Helm boundary

What could be wrong:
"Simple workflow issue" may be collapsing multiple systems that need different
evidence.

Boundary under pressure:
Which Voyager subsystem is actually in scope?

Recommended default:
Start by choosing the subsystem, then inspect that repo evidence before any
plan or review.

Forcing question:
When you say Voyager Feeds here, do you mean enrichment/backfill behavior,
PR/review closure, RETL v2 state, or deploy-boundary proof?
```

## Proposed Skill Changes To Analyze

1. Add a "Grill Contract" near the top of `SKILL.md`:

```text
When the user asks to grill, stress-test, steelman, challenge, or
pressure-test, do not merely reflect back. A compliant response must name what
could be wrong, why it matters, what evidence would change the model, and one
forcing question the user must answer before action.
```

2. Rewrite the job sentence:

```text
This is not planning-lite or polite clarification. Its job is to make the
shared model prove itself before action.
```

3. Promote `grill-me` into a real mode:

```text
For `grill-me`, include the user's model as understood, the strongest
countercase, the load-bearing assumption, what breaks if the assumption is
false, the recommended default, and one forcing question.
```

4. Change live output shape to lead with pressure and scope:

```text
What I think you mean:
Scoped map:
What could be wrong:
Boundary under pressure:
Evidence checked / missing:
Recommended default:
Forcing question:
Stage / intent:
```

5. Add a stronger Voyager-like pressure scenario:

```text
$shravan-dev-workflow:discuss-with-me

We are in Voyager Feeds. Before acting, grill my understanding of how this
works. I think this is just a simple review/workflow issue, so do not
overcomplicate it.
```

Expected compliant behavior:

- Stay read-only.
- Inspect available artifacts when discoverable.
- Draw or list the scoped decision map.
- Challenge the premise that this is one simple issue.
- Name the load-bearing assumption.
- Ask one forcing question that determines the next workflow.

Failure signals:

- Only summarizes.
- Only routes to another skill.
- Asks "what should we do next?"
- Produces a plan.
- Does not diagram or scope the decision space.
- Does not challenge the user's model.

## What Should Not Change

- Manual trigger only.
- Read-only default.
- One material question at a time.
- Recommended default included with the question.
- Evidence before asking when evidence is discoverable.
- Routing away from debug, security, implementation review, docs editing, and
  execution workflows when those are the actual task.

## Open Questions For Another Agent

1. Should diagram/scoped-map output be mandatory for every live
   `discuss-with-me` response, or only when there are multiple possible systems,
   meanings, or decision branches?

2. Should `grill-me` become the default behavior for every explicit
   `discuss-with-me` invocation, or only when the user says grill/stress-test/
   challenge?

3. How can the skill force sharper questions without becoming a scripted
   interview that slows down obvious cases?

4. Should the OpenAI agent default prompt in `agents/openai.yaml` be changed
   from "clarify and pressure-test" to language that explicitly says "make the
   shared model prove itself before edits"?

