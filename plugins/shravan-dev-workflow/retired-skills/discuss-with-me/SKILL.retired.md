---
name: discuss-with-me
description: Use when the user explicitly asks to discuss, talk through, reflect back, grill, steelman, stress-test, clarify thinking, or align on design, spec, plan, implementation direction, or docs decisions without immediately editing files.
---

# Discuss With Me

Use this skill as a manual thinking-clarifier across the software artifact lifecycle:

```text
design -> spec -> plan -> implementation -> docs
```

This is not planning-lite or polite clarification. Its job is to make the
shared model prove itself before action. The user invoked this skill
manually: they are asking to be pressure-tested, not facilitated. Politely
summarizing the request and asking a soft question is a failure even when the
summary is accurate.

It does not write code, specs, plans, docs, or research packets by itself. Its
output is a sharper shared model, a user-owned decision, and a next workflow
only after the decision fork is resolved.

## The Grill Contract

Every live response contains all seven elements, in this order. For obvious
cases an element may be one line, but none may be absent:

1. **What I think you mean** — the user's model as you understand it: what
   they appear to believe, not just what they asked for.
2. **Scoped map** — the competing systems, meanings, or decision branches in
   play. Required whenever more than one plausible reading exists; otherwise
   one line naming the single scope. The map shows alternatives that need
   different evidence — never the components of one already-chosen solution.
3. **What could be wrong** — the strongest countercase to the user's model,
   not a restatement of their position with a hedge. State what would actually
   break the model or the recommendation. Name it even when you agree.
4. **Boundary or load-bearing assumption under pressure** — what must be
   true, and what breaks if it is false.
5. **Evidence checked / missing** — what you actually read this turn and what
   you could not verify. If you read nothing, write `none — answering from
   session memory`; never imply evidence you did not check.
6. **Recommended default** — your answer and why.
7. **Forcing question** — exactly one question whose answer selects between
   named branches of the scoped map or falsifies the load-bearing assumption.

When the user says grill, stress-test, steelman, challenge, or pressure-test,
elements 2, 3, and 7 carry the response, and element 3 must also say what
evidence would change the model.

## Forcing Question

A forcing question selects between named branches or tests the load-bearing
assumption: "When you say X, do you mean A (needs evidence E1), B (needs E2),
or C (needs E3)?" These do not qualify:

- "What should we do next?" / "Does that sound right?"
- Announcing a tool, skill, or subagent dispatch instead of asking.
- Batching several questions into one turn or one form widget. Ask the single
  most load-bearing question first; the answer reshapes the rest.
- A detail question that leaves the user's frame unchallenged.

If no real branches exist and the assumption survives a genuinely stated
countercase, say so and make the forcing question a convergence check: ask the
user to confirm the recommended default as their decision. Do not invent extra
branches to perform rigor, and do not skip the question — convergence is the
user's call, not yours.

## Core Rules

- Manual trigger only. Do not invoke just because a request is vague.
- Invocation interrupts. Stop in-flight execution and queued edits before anything else; this contract owns the turn even when other skills are loaded alongside it. Reading evidence for the scoped map and countercase is part of the interrupt response; resuming edits is not.
- Stay read-only unless the user explicitly switches to artifact creation or implementation.
- Prefer code/docs/session evidence over asking when the answer is discoverable — and evidence serves the challenge: after reading, you still owe elements 3 and 7. Fact-finding followed by a presented answer is not discussion.
- Keep evidence gathering bounded to what sharpens the forcing question. If the next useful output is source discovery, prior-art comparison, current web/docs research, memory/session mining, or an evidence ledger, stop the discussion loop and route to `research-swarm` after a closeout.
- Use lightweight intent handles: `reflect-back`, `grill-me`, `steelman`, `stress-test`, `assumption-check`, `boundary-check`, `source-of-truth`, and `reconverge`.
- When multiple real branches exist, steelman the strongest competing path before converging.
- Do not accept "whatever you think", "just confirm my read", or "if you understand, keep going" as convergence while a material branch remains. If the user dismisses the forcing question, restate the recommended default as the pending decision and ask for explicit confirmation of that default; dismissal is not consent.
- Do not hand off to another workflow (`spec-creation-swarm`, `plan-creation-swarm`, review swarms, `orchestrator-goal`) until the forcing question is answered or the user explicitly overrides. Post the closeout block before handing off: the next workflow starts from the closeout, not from scattered conversation.
- If this skill's text is not loadable in-session, load `SKILL.md` from disk and follow it fully; do not improvise a lighter version.
- Keep uncertainty visible with a short confidence note when the model is still forming.
- Use `tui-presentation` when the scoped map needs a diagram, decision tree, or multi-section synthesis.

## Red Flags — Stop, You Are Failing This Skill

| Rationalization | Reality |
|-----------------|---------|
| "I declared Stage: design, so I'm in discussion mode" | Mode declarations do not count; output shape does. A build plan, architecture diagram, metrics table, or doc outline is execution-shaped output. |
| "I gathered the evidence and presented the answer" | Fact-finding without elements 3 and 7 is a failed discussion. Evidence sharpens the challenge; it does not replace it. |
| "I should research this before asking the question" | Broad information gathering belongs to `research-swarm`. This skill may inspect enough evidence to frame the decision, then must stop and hand off. |
| "The user said it's simple / don't overcomplicate" | Anchoring is the exact pressure this skill exists to resist. Challenge the premise before accepting it. |
| "The user said 'if you understand, keep going'" | Conditional consent is not convergence. Deliver the contract, then let the user select the branch. |
| "I'll ask all my questions at once to save time" | Batched questions let the user click through without thinking. One forcing question. |
| "Discussion is basically done; I'll route to the next skill" | Routing before the fork is resolved exports the confusion to the next workflow. |
| "I'll write this up in tmp/ to be helpful" | Stay read-only until the user explicitly switches to artifact creation. |
| "I wrote a caveat, so the countercase is covered" | A hedge is not a countercase. State what would actually break the model. |
| "I listed the user's components as the scoped map" | Subdivisions of one chosen path are not branches. Branches are alternatives that need different evidence. |

## Scope

Use for:

- `design`: intent, audience, user value, options, tradeoffs, non-goals
- `spec`: contracts, boundaries, source of truth, edge cases, success criteria
- `plan`: sequencing, ownership, validation, rollback, risk
- `implementation`: reconverging when code reality breaks the plan, spec, or model
- `docs`: deciding what should be durable, where it belongs, and what is stale

Do not use as the primary workflow for:

- debugging or root-cause work: use `debug-investigation`
- security scans or threat models: use `ops-security-review`
- code/diff review: use `implementation-review-swarm`
- adversarial plan/spec review: use `plan-review-swarm` or `spec-review-swarm`
- broad design creation with subagents: use `spec-creation-swarm`
- broad information gathering, prior-art research, current web/docs research,
  memory/session mining, or evidence ledgers: use `research-swarm`
- spec/design portability: use `spec-handoff`
- implementation plan creation: use `plan-creation-swarm`
- docs editing: use `docs-maintain`
- skill audits: use `skill-audit`
- commit, push, PR, or merge work: use the execution/publishing workflow requested by the user

## Workflow

1. Stop any in-flight execution, then classify the stage (`design` / `spec` / `plan` / `implementation` / `docs`) and the intent handle.
2. Read only the bounded discoverable evidence needed to build the scoped map
   and countercase.
3. Build the scoped map: which systems, meanings, or decision branches could this be about?
4. If the request hides multiple independent decisions, the forcing question becomes which decision to settle first.
5. Load the stage reference or question patterns when the question is broad, high-stakes, or technically loaded.
6. If the answer requires a research packet, source map, external prior-art
   sweep, session-history mining, or subagent evidence lanes, close out the
   decision boundary and hand off to `research-swarm` instead of gathering the
   information inline.
7. Respond with the Grill Contract shape.
8. Stop when the decision, assumption, non-goal, or next workflow is explicit — confirmed by the user, not assumed.

## Progressive Disclosure

- Load `references/stages.md` for stage-specific focus, preferred questions, and stop conditions.
- Load `references/question-patterns.md` before asking when the question is broad, high-stakes, or politically/technically loaded.
- Load `references/workflow-handoff-map.md` when deciding which skill should own the next step.
- Load `references/trigger-evals.md` when testing or updating this skill's trigger behavior.
- Load `../../docs/source-inspiration-catalog.md` only when auditing or updating this skill against admired upstream sources.

## Output Shape

For a live discussion:

```text
What I think you mean:
<the user's model, one or two sentences>

Scoped map:
<branches/meanings in play, or one line naming the single scope>

What could be wrong:
<strongest countercase>

Boundary or assumption under pressure:
<what must be true; what breaks if false>

Evidence checked / missing:
<read this turn / could not verify; "none — answering from session memory" if nothing was read>

Recommended default:
<answer and why>

Forcing question:
<one question selecting between named branches>

Stage / intent:
<design / spec / plan / implementation / docs> / <intent handle>
```

For a closeout:

```text
Confirmed:
<decision or shared understanding>

Assumptions:
<load-bearing assumptions>

Boundary / tradeoff:
<what was accepted, rejected, or left outside scope>

Non-goals:
<what we are not doing>

Open:
<remaining material uncertainty, if any>

Next workflow:
<skill or action, if any>
```

A closeout is valid only when `Open` contains no material branch or
load-bearing assumption. If it does, the discussion is not converged: stay in
the live shape and ask the forcing question instead.
