---
name: discuss-pathfinding
description: Use when understanding lives only in someone's head or an unmade decision — interview or grill the user to extract requirements, tacit process knowledge, domain terms, or design decisions, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for repairing a drifted shared model (discuss-clarify-mental-models), gathering evidence from artifacts (research-swarm), or adversarial review of a drafted spec or plan (spec-review-swarm, plan-review-swarm).
---

# Discuss Pathfinding

The knowledge exists — in the user's head, unwritten — and the session is the instrument that gets it out and onto the page before it shapes work. The job is extraction; pathfinding names the route discipline: the question sequence cannot be planned in advance, each answer opens the next branch, and every step still pays extraction's economics. Asking is expensive — a user turn spent on an observable fact is a turn stolen from a judgment call only the user can make, and a turn buys one well-answered axis where a wall of questions buys a half-answered mess. Raw extract is vague and contaminated until challenged.

## Bright Lines

- **Live user required.** No responsive user in the loop — CI, autonomous run, background job — means return a blocker naming the unanswered questions. Never answer your own questions; a session that interviews itself has extracted nothing.
- **Resolution is explicit.** An assumption or question resolves only by an explicit yes or a concrete correction. Delegation ("whatever you think is best"), ambiguous assent ("sounds good"), a topic change, and silence never resolve — each has a named counter in `references/question-craft.md`.
- **Chat-only on request.** The user may decline the docs trail; the spine still runs and the records stay in-chat.

## Workflow

1. **Name the destination.** State what this session must extract — the decision, the process, the terms — and what is out of scope; half of misalignment is silent disagreement about what is not being decided. Completion: destination and out-of-scope are stated where the user can strike them.

2. **Classify before asking.** Sort every unknown into three bins: observable now — read the file, doc, or log in this session, bounded; broad evidence — IF an unknown needs prior art or multi-source research, use `research-swarm` and return the evidence consumed before that axis is asked; judgment or tacit knowledge — only the user can answer, and this is what questions are for. Completion: every unknown is recorded in one bin, each observable item names the artifact read and its result, and each broad item names its research route and returned evidence.

3. **Hypothesize first.** Before the first question, state your current read and a confidence with its reason. Completion: the guess and confidence are on the record before any question is asked.

4. **Ask in batches, one axis at a time.** One to three questions per turn, all on one axis of the unknown. Each question carries its three slots — what is being decided, your read with confidence, why it matters — with options attached where the answer space is knowable. Follow the branch the answers open before starting the next axis. MUST load `references/question-craft.md` and return the question forms, probes, and counters applied — every asked question carrying its three slots and options or your read. Completion: each turn's questions share one axis and each carries all three slots.

5. **Challenge as you go.** A vague term gets a proposed canonical. A term that conflicts with the existing glossary gets called out at the moment it appears. A claimed behavior gets cross-referenced against the code — "the code does X, you said Y — which is it?". A fuzzy boundary gets a concrete edge scenario. Completion: each vague term, glossary conflict, claimed behavior, and fuzzy boundary encountered is challenged with its named form and resolved or left explicitly open.

6. **Write the moment it crystallizes.** Decisions and terms go onto the page in the user's own language as they land, not at session end. MUST load `references/decisions-and-docs.md` and return the recorded decisions and glossary entries — and, IF the records will be consumed by another agent, session, or reviewer, the reader-test result. IF the user asked for chat-only, keep the records in-chat in the same shapes. Completion: every crystallized decision and every settled term has its record in the user's language.

7. **Validate.** Reflect the understanding back using the provenance slots owned by `discuss-clarify-mental-models` — `evidence_checked`, `inherited_frame`, `first_principles`, `assumptions` — and this skill's strike-list mechanics: present the assumptions as a block the user can strike, "correct me now or I proceed with these." Completion: every assumption is resolved by an explicit yes or a concrete correction, and every unresolved response was countered.

8. **Stop test.** Stop when the destination is satisfied: every in-scope judgment or tacit unknown is resolved and recorded, or explicitly returned as unresolved. The predictive test is the signal — write down the next three questions you would ask and your predicted answers; when the predictions match the settled model, extraction is done. IF three consecutive rounds fail the predictive test, name what is foundationally missing and return it to the user rather than grinding on. Completion: the recorded predictions, the destination check, and the restatement including out-of-scope are all delivered.

## Routes

- `research-swarm` — the broad-evidence bin in step 2 owns this call; never single facts a bounded read answers.
- `discuss-clarify-mental-models` — IF mid-session the two of you disagree about a model you both already hold, use it to repair the drift and return the rebuilt shared model before extraction continues.
- `manage-agents` — the reader-test dispatch contract in `references/decisions-and-docs.md` owns this call.

## Completion Blockers

The session is not done while any of these hold:

- a question was asked whose answer was readable from an artifact;
- a turn carried questions across more than one axis, or a wall of questions;
- an unresolved response — delegation, ambiguous assent, topic change, silence — was treated as resolution;
- the run proceeded without a live user instead of returning a blocker;
- a crystallized decision or settled term has no record and the user did not ask for chat-only;
- stop was claimed without the recorded predictions, the destination check, and the restatement.
