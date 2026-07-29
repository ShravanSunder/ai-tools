# Question Craft

This reference owns question craft for interactive pathfinding sessions. A single blocking decision during spec convergence belongs to `spec-creation-swarm`'s `user-decision-questions.md` — one material question at a time is that home's rule, not this one's. That home's non-interactive fallback also does not apply here: pathfinding refuses non-interactive contexts outright.

```text
this reference owns: the question forms, probes, and counters for one session
expected inputs: the destination, the classified unknowns (judgment and tacit only), and the current hypothesis
return: the question forms, probes, and counters for this session, applied — every asked question carrying its read or options
complete when: every asked question carried its three slots, and every unresolved response was countered, never accepted
```

## The Question Form

Every question carries three parts, so the user reacts instead of composing from scratch:

```text
what is being decided: <one sentence>
my read: <recommended answer, confidence, and the reason for it>
why it matters: <what changes downstream if the answer differs>
```

Attach concrete options when the answer space is knowable — reacting to options is faster and surfaces the real preference; leave it open only when enumerating would bias the answer. (Adapted from `spec-creation-swarm/references/user-decision-questions.md` and interview-me's attached-guess mechanic — addyosmani.)

## Probes

- **Want vs should-want.** Convention-signaling answers — "scalable", "clean", "the standard approach", "I should probably..." — are not answers. Counter: "If you didn't have to justify this to anyone, what would you actually want?" (Adapted from interview-me — addyosmani.)
- **Edge scenario.** A fuzzy boundary gets a concrete case that forces it: invent the specific situation where the stated rule must either fire or not, and ask which. (Adapted from domain-modeling's concrete scenarios — mattpocock.)
- **Process markers**, for tacit process knowledge — the how that lives in someone's hands: what do you open first? what tells you it is going well or badly? where does the bar sit between acceptable and strong? when do you stop?
- **Stated vs actual.** Diff what they said against what the transcript, commit history, or log shows they did — and bring the discrepancy back as a question, never a correction: "you said you always X first, but the last three runs started with Y — what decides it?" (Adapted from domain-modeling's code cross-reference — mattpocock.)

## Counters — resolved and unresolved responses

A response resolves its question only two ways: an explicit yes, or a concrete correction — a correction is a full resolution and needs no separate yes. Everything else is unresolved and gets its counter:

- **Delegation** ("whatever you think is best"): re-ask as two concrete options.
- **Ambiguous assent** ("sounds good", "that's fine", "go ahead" without addressing the content): name the load-bearing assumption inside it and ask about that.
- **Topic change**: park the unresolved question visibly, follow the user's new thread, and return to it before validation.
- **Silence, then "okay let's start"**: the user is giving up on the session, not converging — shrink the batch, switch the axis, or stop and say what is missing.

## Pacing

One axis per turn, one to three questions, never a wall — a turn buys one well-answered axis. If the same axis needs a fourth question, the axis is probably two axes — split it. (Facts-vs-decisions discipline adapted from grilling — mattpocock; pacing bound is this skill's own, derived from the lens.)
