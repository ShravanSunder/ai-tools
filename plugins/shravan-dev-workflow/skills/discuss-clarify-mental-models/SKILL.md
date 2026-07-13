---
name: discuss-clarify-mental-models
description: Use when either side notices drift or misalignment - repeated corrections, hollow or instant agreement, surprise at a plan or architecture, the same term meaning different things - or when the user asks to reconverge, share understanding, reflect back, clarify a mental model, force an alignment check, or build a shared map of how something works, including what agents in a swarm session are doing, before specs, plans, docs, or code.
---

# Discuss Clarify Mental Models

## Stance

Use this skill to rebuild the shared picture before artifact work. The job is not to facilitate, summarize politely, or force a decision ritual. The job is to make the current map inspectable: what shape it has, what it hides, what was inherited, what is evidenced, what remains assumed, what could be wrong, and what route follows.

Stay read-only. Do not write specs, plans, docs, code, review findings, or research ledgers. If the next useful move is broad evidence gathering, route to `research-swarm`; if the model is stable enough for a durable artifact, route to the owning phase skill.

This is a drift signal card: either side calls it the moment something feels off -- a repeated correction, a too-quick agreement, a surprising plan. Invocation interrupts: stop in-flight edits and queued artifact work; this contract owns the turn. An unaligned model exported into specs, plans, or code multiplies the repair cost downstream.

The territory may be a system, codebase, decision, or in-flight agent work in a swarm session. For agent work, `evidence_checked` means reading the actual ledgers, lane artifacts, diffs, task state, and run outputs available in this turn. An agent's summary of its own work is `inherited_frame`, not `first_principles`.

## Drift Signals

Self-invoke on these, even when the user has not asked to discuss anything:

- the user corrects the same point twice;
- agreement arrives instantly on something complex;
- evidence contradicts the stated model;
- the user says "that's not what I meant" or "something feels off";
- the agent is surprised by the user's reaction to a plan or architecture.

## Output Contract

Show the full contract on the first response, again when the model materially changes, and once more at close. Interim turns may carry only the fields that changed since it was last shown in full. Use the smallest shape that makes the model clear:

```text
model:
evidence_checked:
inherited_frame:
first_principles:
assumptions:
branches:
countercase:
rebuilt_model:
open_or_confirmed:
next_workflow:
```

Field obligations:

- `model`: current map; start with one literal shape word from this list: `terms`, `boundary`, `flow`, `state`, `ownership`, `constraint`, or `tradeoff`, then name what the map hides or simplifies.
- `evidence_checked`: read this turn vs inferred; use `none -- answering from session memory` when no direct evidence was checked.
- `inherited_frame`: what we believe because of analogy, old names, prior specs, agent reports, habit, or convention; `none surfaced` is legal.
- `first_principles`: directly evidenced truths and hard constraints from code, docs, run output, artifacts, or the user's stated goal.
- `assumptions`: unproven beliefs carried knowingly; do not use this slot for inherited claims or direct evidence.
- `branches`: competing framings or model types that need different evidence.
- `countercase`: what would falsify or weaken the rebuilt map, including the load-bearing assumption or tradeoff.
- `rebuilt_model`: the clarified map to carry forward.
- `open_or_confirmed`: whether the model is confirmed or what remains open.
- `next_workflow`: route plus the decision this map improves.

The fields are obligations, not a fixed template. A compact paragraph, TUI map, or small ledger is fine if all fields are present. Ask questions only when they select a real branch or expose missing evidence; do not force exactly one question when the useful discussion has multiple axes.

Branch references:

- Load `references/model-shapes.md` when drawing the chosen shape would help and the shape is not obvious in prose.
- Load `references/provenance-decomposition.md` when `inherited_frame`, `first_principles`, and `assumptions` start collapsing, or the user asks for first-principles reconstruction.

## Workflow

1. Frame the map. Name what is unstable: terms, boundary, flow, state, ownership, constraint, tradeoff, source of truth, or competing framing. Completion: `model` starts with a literal shape word from the contract and names what the map hides or simplifies.

2. Check bounded evidence. Read the specific code, docs, or saved artifact that can sharpen the model in this turn. If nothing was read, write `none -- answering from session memory`; never imply evidence you did not check. Completion: `evidence_checked` distinguishes direct observation from inference or missing evidence.

3. Decompose provenance and map branches. Separate inherited frame, first principles, and assumptions before choosing a model. Show the viable framings or say there is only one live branch. Branches are alternatives that need different evidence, not pieces of one already-chosen solution. Completion: `inherited_frame`, `first_principles`, and `assumptions` are filled distinctly, and `branches` names each live branch or states the single-branch reason.

4. Pressure the rebuilt map. State the strongest countercase and the load-bearing assumption or tradeoff. If the user stops in-flight work, say what should not proceed before that assumption is confirmed. Completion: `countercase` says what would actually break the rebuilt model and names the load-bearing assumption or tradeoff.

5. Rebuild and route. State the model to carry forward, mark whether it is confirmed or still open, and name the next owning workflow plus the decision this map improves. When real branches remain and the user must choose, end by placing the branch-selecting question inside `open_or_confirmed` or `next_workflow` -- and only then; never call it a forcing question or revive the old exactly-one-question rule. Completion: `rebuilt_model`, `open_or_confirmed`, and `next_workflow` are all explicit.

## Route Targets

- `research-swarm`: evidence gathering, prior art, current docs, memory/session mining, or source ledgers.
- `spec-creation-swarm`: durable product/design/architecture contract.
- `plan-creation-swarm`: implementation sequencing after a spec or clear design exists.
- open in this skill: blocked work, broken model, conflicting artifacts, repeated loop, or missing authority when no shipped owner exists yet.

## Red Flags

| Rationalization | Reality |
| --- | --- |
| "I summarized the request, so we share the model." | A summary without assumptions, branches, and countercase is not reconvergence. |
| "I should end with one required question." | This skill rejects ritual single-question pressure when several axes need exploration. |
| "I'll label the remaining branch as a forcing question." | The retired forcing-question label is not mental-model reconvergence. |
| "I can start the plan and refine as we go." | Planning exports a broken model into a stronger-looking artifact. |
| "The user said yes, so the model is confirmed." | Agreement without the load-bearing assumption is weak convergence. |
| "I need a full research sweep first." | Broad evidence belongs to `research-swarm`; this skill checks only bounded evidence. |
| "I'll capture this in a doc while it is fresh." | Discussion surfaces stay read-only until another workflow owns the artifact. |
| "I summarized how it works, so we have a model." | A walkthrough without a named map shape is not a model. |
| "The agent's report says it's done." | A report is inherited framing; first principles are artifacts, diffs, run output, or verified state. |

## Completion Blockers

Do not route onward while any of these hold:

- the output contract fields are missing at a full-contract point (first response, material model change, or close);
- evidence checked vs inferred is blurred;
- `inherited_frame`, `first_principles`, and `assumptions` carry identical or copy-pasted content;
- competing framings are hidden inside one chosen solution;
- the countercase is a hedge rather than a real falsifier;
- the next workflow is named before the model is confirmed or explicitly open;
- the response writes or edits artifacts instead of clarifying the model.
