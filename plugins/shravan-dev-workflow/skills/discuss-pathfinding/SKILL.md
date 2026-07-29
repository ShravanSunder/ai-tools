---
name: discuss-pathfinding
description: Use when understanding lives only in someone's head or an unmade decision — interview or grill the user to extract requirements, tacit process knowledge, domain terms, or design decisions, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want", recording decisions and glossary entries as they crystallize. Not for repairing a drifted shared model (discuss-clarify-mental-models), gathering evidence from artifacts (research-swarm), or adversarial review of a drafted spec or plan (spec-review-swarm, plan-review-swarm).
---

# Discuss Pathfinding

The knowledge exists — in the user's head, unwritten — and the session is the instrument that gets it out and onto the page before it shapes work. The job is extraction; pathfinding names the route discipline: the question sequence cannot be planned in advance, each answer opens the next branch, and every step still pays extraction's economics. Asking is expensive — a user turn spent on an observable fact is a turn stolen from a judgment call only the user can make, and a turn buys one well-answered axis where a wall of questions buys a half-answered mess. Raw extract is vague and contaminated until challenged: extraction includes the assay.

## Bright Lines

- **Live user required.** No responsive user in the loop — CI, autonomous run, background job — means return a blocker naming the unanswered questions. Never answer your own questions; a session that interviews itself has extracted nothing.
- **Explicit yes only.** "Sounds good", "whatever you think is best", and silence never confirm. Re-ask as two concrete options.
- **Chat-only on request.** The user may decline the docs trail; the spine still runs and the records stay in-chat.

## Workflow

1. **Name the destination.** State what this session must extract — the decision, the process, the terms — and what is out of scope; half of misalignment is silent disagreement about what is not being decided. Completion: destination and out-of-scope are stated where the user can strike them.

2. **Classify before asking.** Sort every unknown into three bins: observable now — read the file, doc, or log in this session, bounded; broad evidence — route to `research-swarm` (its floor is researchable questions and evidence ledgers, not single facts) and continue; judgment or tacit knowledge — only the user can answer, and this is what questions are for. Completion: no question remains in the queue whose answer is readable from an artifact.

3. **Hypothesize first.** Before the first question, state your current read and a confidence with its reason. A wrong guess is faster to correct than a blank page is to fill. Completion: the guess and confidence are on the record before any question is asked.

4. **Ask in batches, one axis at a time.** One to three questions per turn, all on one axis of the unknown; attach options where the answer space is knowable and your read where it is not; follow the branch the answers open before starting the next axis. MUST load `references/question-craft.md` and return the question forms, probes, and counters for this session. Completion: each turn's questions share one axis and each carries options or your read.

5. **Challenge as you go.** A vague term gets a proposed canonical. A term that conflicts with the existing glossary gets called out at the moment it appears. A claimed behavior gets cross-referenced against the code — "the code does X, you said Y — which is it?". A fuzzy boundary gets a concrete edge scenario. Completion: no answer is accepted while a named vagueness stands.

6. **Write the moment it crystallizes.** Decisions and terms go onto the page in the user's own language as they land, not at session end. MUST load `references/decisions-and-docs.md` and return the recorded decisions and glossary entries. IF the user asked for chat-only, keep the records in-chat in the same shapes. Completion: every crystallized decision has a record.

7. **Validate.** Reflect the understanding back split by provenance — what the user said, what the evidence shows, what you still assume — using the slot semantics owned by `discuss-clarify-mental-models`; this skill owns only the strike-list mechanics: present the assumptions as a block the user can strike, "correct me now or I proceed with these." Explicit yes only, per the bright line. Completion: the user confirmed or corrected each assumption, and no non-yes was accepted.

8. **Stop test.** Can you predict the user's answers to the next three questions you would ask? Then stop: restate what was extracted, including out-of-scope, and hand off. If several rounds pass and prediction still fails, say that something foundational is missing rather than grinding on. Completion: the predictive test and the restatement are both delivered.

## Routes

- `research-swarm` — broad evidence, prior art, multi-source research; never single facts a bounded read answers.
- `discuss-clarify-mental-models` — mid-session drift on a model both sides already hold: repair there, then return here.
- `manage-agents` — the reader test in `references/decisions-and-docs.md` dispatches through its reviewer rules.

## Completion Blockers

The session is not done while any of these hold:

- a question was asked whose answer was readable from an artifact;
- a turn carried questions across more than one axis, or a wall of questions;
- a non-yes was accepted as confirmation;
- the run proceeded without a live user instead of returning a blocker;
- a crystallized decision has no record and the user did not ask for chat-only;
- stop was claimed without the predictive test and restatement.
