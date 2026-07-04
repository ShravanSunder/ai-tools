---
name: discuss-clarify-mental-models
description: Use when either side notices drift or misalignment - repeated corrections, hollow or instant agreement, surprise at a plan or architecture, the same term meaning different things - or when the user asks to reconverge, share understanding, reflect back, clarify a mental model, or force an alignment check before specs, plans, docs, or code.
---

# Discuss Clarify Mental Models

## Stance

Use this skill to rebuild the shared picture before artifact work. The job is
not to facilitate, summarize politely, or force a decision ritual. The job is
to make the current model inspectable: what we think is true, what could be
wrong, what evidence was checked, and what route follows.

Stay read-only. Do not write specs, plans, docs, code, review findings, or
research ledgers. If the next useful move is broad evidence gathering, route to
`research-swarm`; if the model is stable enough for a durable artifact, route
to the owning phase skill.

This is a drift signal card: either side calls it the moment something feels
off -- a repeated correction, a too-quick agreement, a surprising plan.
Invocation interrupts: stop in-flight edits and queued artifact work; this
contract owns the turn. An unaligned model exported into specs, plans, or
code multiplies the repair cost downstream.

## Drift Signals

Self-invoke on these, even when the user has not asked to discuss anything:

- the user corrects the same point twice;
- agreement arrives instantly on something complex;
- evidence contradicts the stated model;
- the user says "that's not what I meant" or "something feels off";
- the agent is surprised by the user's reaction to a plan or architecture.

## Output Contract

Show the full contract on the first response, again when the model
materially changes, and once more at close. Interim turns may carry only the
fields that changed since it was last shown in full. Use the smallest shape
that makes the model clear:

```text
model:
assumptions:
branches:
countercase:
evidence_checked:
recommended_default:
open_or_confirmed:
next_workflow:
```

The fields are obligations, not a fixed template. A compact paragraph, TUI map,
or small ledger is fine if all fields are present. Ask questions only when they
select a real branch or expose missing evidence; do not force exactly one
question when the useful discussion has multiple axes.

## Workflow

1. Frame the mismatch. Name what is unstable: terms, boundaries, assumptions,
   source of truth, tradeoffs, or competing framings.
   Completion: `model` names the user's apparent frame and the unstable part.

2. Check bounded evidence. Read the specific code, docs, or saved artifact
   that can sharpen the model in this turn. If nothing was read, write `none
   -- answering from session memory`; never imply evidence you did not check.
   Completion: `evidence_checked` distinguishes direct observation from
   inference or missing evidence.

3. Map the branches. Show the viable framings or say there is only one live
   branch. Branches are alternatives that need different evidence, not pieces of
   one already-chosen solution.
   Completion: `branches` names each live branch or states the single-branch
   reason.

4. Pressure the model. State the strongest countercase and the load-bearing
   assumption or tradeoff.
   Completion: `countercase` says what would actually break the current model.

5. Converge or route. Recommend the default, mark whether the model is
   confirmed or still open, and name the next owning workflow. When real
   branches remain and the user must choose, end with the question that
   selects between them -- and only then; never a ritual
   exactly-one-question rule.
   Completion: `recommended_default`, `open_or_confirmed`, and `next_workflow`
   are all explicit.

## Route Targets

- `research-swarm`: evidence gathering, prior art, current docs, memory/session
  mining, or source ledgers.
- `spec-creation-swarm`: durable product/design/architecture contract.
- `plan-creation-swarm`: implementation sequencing after a spec or clear
  design exists.
- open in this skill: blocked work, broken model, conflicting artifacts,
  repeated loop, or missing authority when no shipped owner exists yet.

## Red Flags

| Rationalization | Reality |
| --- | --- |
| "I summarized the request, so we share the model." | A summary without assumptions, branches, and countercase is not reconvergence. |
| "I should end with one required question." | This skill rejects ritual single-question pressure when several axes need exploration. |
| "I can start the plan and refine as we go." | Planning exports a broken model into a stronger-looking artifact. |
| "The user said yes, so the model is confirmed." | Agreement without the load-bearing assumption is weak convergence. |
| "I need a full research sweep first." | Broad evidence belongs to `research-swarm`; this skill checks only bounded evidence. |
| "I'll capture this in a doc while it is fresh." | Discussion surfaces stay read-only until another workflow owns the artifact. |

## Completion Blockers

Do not route onward while any of these hold:

- the output contract fields are missing at a full-contract point (first
  response, material model change, or close);
- evidence checked vs inferred is blurred;
- competing framings are hidden inside one chosen solution;
- the countercase is a hedge rather than a real falsifier;
- the next workflow is named before the model is confirmed or explicitly open;
- the response writes or edits artifacts instead of clarifying the model.
