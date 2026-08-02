# Question Craft

This reference owns question craft for interactive pathfinding sessions. A blocking authoritative Why/What decision during specification convergence belongs to `spec-design` step 4, not this reference. Its bounded decision rule does not apply here: pathfinding follows one extraction axis per turn and refuses non-interactive contexts outright.

```text
this reference owns: the question forms, material-ambiguity procedure, probes, and counters for one session
expected inputs: the destination, the classified unknowns (judgment and tacit only), and the current hypothesis
return: the question forms, material-ambiguity result, probes, and counters for this session, applied
complete when: concise questions carried their three slots, material ambiguities received the richer procedure, and every unresolved response was countered, never accepted
```

## The Question Form

Every question carries three parts, so the user reacts instead of composing from scratch:

```text
what is being decided: <one sentence>
my read: <recommended answer, confidence, and the reason for it>
why it matters: <what changes downstream if the answer differs>
```

Attach concrete options when the answer space is knowable — reacting to options is faster and surfaces the real preference; leave it open only when enumerating would bias the answer.

## Material Ambiguity

A material ambiguity is an unresolved owner-controlled choice for which two or more evidence-plausible interpretations would change scope, a requirement, externally observable behavior, or downstream design. Multiple systems, actors, boundaries, or sequence steps may make explanation or a diagram useful; they do not make a choice material by themselves.

Before asking about a material ambiguity:

1. State the current model and the evidence that supports it.
2. Derive the strongest credible alternative from contrary evidence, a plausible owner model, or a materially different downstream consequence. Reject an alternative that cannot plausibly fit the available evidence; a strawman buys no understanding.
3. Give one concrete countercase whose answer discriminates between the models.
4. Explain what changes downstream under each branch.
5. Ask the smallest question that selects the branch.

Use a compact conversational map when the relationships are materially clearer visually. Keep a simple preference concise.

Good: “The current runner appears to execute work but not own scheduling. The credible alternative is that it becomes the scheduler because the new retries need one owner. If two callers enqueue simultaneously, who decides order? Choosing the runner changes its lifecycle and the packages program design may allocate; keeping the host as scheduler limits the runner to execution. Which ownership model do you want?”

Bad: “Should the runner own scheduling? My read is yes because ownership matters.” The slots are filled, but the user cannot see the competing model or consequence.

## Probes

- **Want vs should-want.** Convention-signaling answers — "scalable", "clean", "the standard approach", "I should probably..." — are not answers. Counter: "If you didn't have to justify this to anyone, what would you actually want?"
- **Edge scenario.** A fuzzy boundary gets a concrete case that forces it: invent the specific situation where the stated rule must either fire or not, and ask which.
- **Process walk**, for tacit process knowledge — the how that lives in someone's hands. Anchor on a real occurrence, not the idealized version: "walk me through the last time this actually happened, event by event." Then draw the structure out of the walk: what did you open first? what happened next, and what made you choose that branch? what told you it was going well or badly? what threshold would have changed the action? who took ownership, and what changed at the handoff? where does the bar sit between acceptable and strong? what exception breaks the normal order? when did you stop?
- **Stated vs actual.** Diff what they said against what the transcript, commit history, log, or runbook shows — and bring the discrepancy back as a question, never a correction: "you said you always X first, but the last three runs started with Y — what decides it?" When a document disagrees with their account, ask which should govern the record.

## Counters — resolved and unresolved responses

A response resolves its question only by being concrete: a selection, a constraint, an example, or a correction — a correction is a full resolution and needs no separate yes. Everything else is unresolved and gets its counter:

- **Delegation** ("whatever you think is best"): re-ask as two concrete options.
- **Ambiguous assent** ("sounds good", "that's fine", "go ahead" without addressing the content): name the load-bearing assumption inside it and ask about that.
- **Topic change**: consult the destination before following. In scope — follow the thread, parking the open question in working state. A different destination — ask the user to choose: switch the session's destination, or park the new topic and finish the current one ("postmortems feel like a separate extraction — switch to it, or park it and finish triage?"). Parked items are revisited at validation.
- **Silence, then "okay let's start"**: the user is giving up on the session, not converging. First shrink the batch or switch the axis; if the user still wants to stop, renegotiate the depth to quick and stop provisionally with the unresolved items named — one tired answer never abandons a standard or deep extraction silently.

## Pacing

One axis per turn, one to three questions, never a wall — a turn buys one well-answered axis. Explanation is not extra questioning: a material-ambiguity map still ends in the smallest one-to-three questions on one axis. Order axes by decision leverage, not discovery order. If the same axis needs a fourth question, the axis is probably two axes — split it.
