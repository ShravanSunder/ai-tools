---
name: discuss-pathfinding
description: Use when user or stakeholder requirements, user needs, behavioral personas, tacit process knowledge, domain terms, or design decisions are unwritten and must be extracted from someone's head or an unmade decision through interview or grilling, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for maintaining settled content in an existing artifact, repairing a drifted shared model, gathering evidence from artifacts, authoring authoritative Why/What from settled sources, defining internal structural How, in-chat visuals with no extraction request, or independent review of a drafted specification, program design, or plan.
---

# Discuss Pathfinding

The knowledge exists — in the user's head, unwritten — and the session is the instrument that gets it out before it shapes work. The job is extraction. The question sequence cannot be planned in advance because each answer opens the next branch.

Asking is expensive: a turn spent on an observable fact is stolen from a judgment call only the user can make. Ask one to three related questions together when they share context and clarify one decision. Ask a determining question first when its answer decides whether another question applies. Separate unrelated questions. Raw understanding remains provisional until it has been checked and challenged.

Pathfinding is self-contained judgment, not isolated execution. A caller may supply artifacts, conversation context, hypotheses, or constraints; treat them as useful leads rather than authority. Inspect what can be inspected, distinguish what the owner confirmed from what an agent inferred, expose the credible branches, and return the clearest proportional understanding the next skill can use.

The session keeps three layers separate:

| Layer | Owns |
| --- | --- |
| working state | private notes about evidence, unanswered questions, and challenges |
| conversation | related questions, useful explanations, and assumptions the user can correct |
| durable records | each settled decision, process, term, or requirement written once in one home |

Use the user's words on the conversational surface. Keep method labels and bookkeeping private. Show evidence only when it changes a question or conclusion.

Scale extraction to the user's stated time budget:

| Depth | Work |
| --- | --- |
| quick | resolve the one or two highest-leverage decisions, keep an in-chat record, and stop provisionally |
| standard | resolve every implementation-shaping judgment |
| deep | complete the extraction with durable records and reader-tested handoffs |

Speed may reduce breadth, never honesty about what remains unknown. When the budget is vague, state the inferred depth so the user can correct it. At every depth establish the user's job, scope, core behavior, and highest-risk unresolved decision; at quick depth, repo evidence and one well-chosen decision may be enough.

## Bright Lines

- **Live user required.** No responsive user in the loop — CI, autonomous run, background job — means return a blocker naming the unanswered questions. Never answer your own questions; a session that interviews itself has extracted nothing.
- **Resolution is concrete.** A concrete selection, constraint, example, or correction resolves a question; generic assent does not. Delegation ("whatever you think is best"), ambiguous assent ("sounds good"), a topic change, and silence never resolve — each has a named counter in `references/question-craft.md`.
- **Chat-only on request.** The user may decline files; the records still get written, in-chat, in the same shapes.

## Workflow

1. **Name the destination.** State what the session must extract—decision, process, terms, or user requirements—the depth, and what is out of scope.

   For a proposed change headed to specification work, establish the goal boundary before handoff:

   - affected people and desired outcomes;
   - existing behavior or foundation to preserve;
   - actual missing behavior or observable difference;
   - systems or packages that may change and those that must remain unchanged;
   - excluded work and acceptable complexity;
   - acceptable outcome-level evidence;
   - unresolved owner decisions.

   An owner-set package limit constrains implementation. It is not product behavior and does not authorize internal design.

   Preserve every explicit exclusion in the correctable boundary. Do not replace a named exclusion list with a summary such as "the old architecture."

   IF the destination includes user requirements for future specification or product work, load `references/user-requirements-extraction.md` and return its questions, classified rows, sequence inputs, record, confirmed goal boundary, refusal or fallback result, and exact gaps through steps 4-7.

   Completion: the destination, depth, and negative space are correctable by the user, with every explicit exclusion still visible. A product-change handoff carries a confirmed goal boundary or the exact owner decisions still needed. Other destinations remain extraction-led.

2. **Classify before asking.** Sort each unknown in working state:

   - **Observable now:** inspect the bounded file, document, log, behavior, or available session history.
   - **Broad evidence:** use `research-swarm` when prior art or multiple sources are required, and consume its evidence before asking the related question.
   - **Judgment or tacit knowledge:** ask the user because only they can answer.

   Mark each important claim separately as **observed**, **authorized**, **provisional**, or **unresolved**. A user's description of inspectable behavior is useful context, but remains provisional until checked.

   Completion: every known unknown is classified before questioning; each observable unknown has a bounded-read result and each broad-evidence unknown has returned evidence before its related question proceeds; no uninspected or agent-authored claim is promoted to fact or authority; the user sees only evidence that changes a question or conclusion.

3. **Hypothesize first.** Before the first question, state the current read, confidence, and reason.

   Completion: the hypothesis and confidence are on the record before questioning starts.

4. **Show the decision, then ask related questions.** Take decisions in order of leverage, not discovery order.

   - Ask one to three questions together when they share context and clarify one decision.
   - Ask a determining question first when its answer decides whether a later question applies.
   - Separate unrelated decisions and follow the branch opened by the current answer.

   MUST load `references/question-craft.md` and return its question form, material-ambiguity explanation, probes, and counters applied. Return the useful explanation and smallest answerable question group, not narration of the method.

   For a material ambiguity, make the choice understandable before asking: show the current model, strongest credible alternative, one discriminating countercase, and what changes downstream. IF a compact diagram materially clarifies boundaries, ownership, sequence, or competing interpretations, use `tui-presentation` to show the map. The diagram explains; it does not decide or replace downstream specification views.

   Completion: the user can understand and answer the current decision without reconstructing the method; dependent questions wait until they apply; a material ambiguity shows the current model, credible alternative, discriminating countercase, and downstream difference before asking; user-requirements answers map to the loaded row contract or an exact gap.

5. **Challenge as you go.** Challenge vague terms, glossary conflicts, claimed behavior, and fuzzy boundaries as natural follow-ups. Propose the canonical term, show the source conflict, or pose the edge case; keep the challenge label private.

   Completion: every challengeable answer receives the applicable natural follow-up and is tracked as resolved or open.

6. **Write the moment it crystallizes.** Use one home per kind of meaning: decisions use the decision record, processes use the process record, terms use glossary entries, and user requirements use classified rows plus the goal boundary.

   For a user-requirements destination where extraction proceeds, return the classified inventory, draft rows, useful user-job sequence inputs, record identity and permitted home, confirmed goal boundary or exact owner decision still needed, and unresolved authority or evidence gaps. If extraction is declined, return the loaded reference's refusal or fallback result and exact gaps instead.

   MUST load `references/decisions-and-docs.md` and return the records plus the proportional confirmed/provisional/open summary. IF a durable handoff could change implementation ownership, behavior, or proof when misunderstood, also return its reader-test receipt.

   Completion: every crystallized item has one record in the user's language; confirmed meaning and negative space remain separate from assumptions and open choices; every required reader test is complete.

7. **Validate the current understanding.** Reflect the result using `evidence_checked`, `inherited_frame`, `first_principles`, and `assumptions`, borrowed from `discuss-clarify-mental-models` without importing its wider drift-repair contract. Present the assumptions together so the user can correct them.

   Keep the four sources distinct:

   - `evidence_checked`: artifacts or behavior inspected in this session;
   - `inherited_frame`: prior artifacts, agent reports, analogy, names, habit, or convention;
   - `first_principles`: directly evidenced truths, hard constraints, and the user's stated goal;
   - `assumptions`: unproven beliefs carried knowingly, excluding inherited claims and direct evidence.

   For a user-requirements destination, show the following current model to the authorized owner:

   - goal, affected classes, and desired outcomes;
   - existing foundation and actual missing behavior;
   - permitted and protected systems or packages;
   - non-goals and acceptable complexity;
   - acceptable outcome-level evidence;
   - unresolved choices.

   Completion: every parked item is resolved or explicitly open. Specification handoff carries explicit confirmation or correction of this same goal boundary, or the exact owner decision still needed.

8. **Apply the stop test.** Stop when every in-scope judgment or tacit unknown is resolved and recorded, or explicitly carried as unresolved.

   Privately predict the next three questions and answers; surface only uncertainty that exposes a remaining material question. A quick session may stop provisionally with the model, decisions, unresolved items, and recommended next question. After three rounds that still cannot predict the path, name the foundational gap instead of grinding on.

   Completion: the predictive check ran and the final restatement includes negative space and unresolved items. An unconfirmed product-change goal boundary returns the exact owner decision needed and is not presented as ready for `spec-design`.

## Routes

- `research-swarm` — the broad-evidence bin in step 2 owns this call; never single facts a bounded read answers.
- `discuss-clarify-mental-models` — IF mid-session the two of you disagree about a model you both already hold, use it to repair the drift and return the rebuilt shared model before extraction continues.
- `tui-presentation` — IF a material ambiguity is easier to understand as relationships, branches, or sequence, use it for the conversational map; it does not select or own durable specification views.
- `spec-design` — a confirmed goal boundary from a user-requirements destination or proposed-change handoff routes here; otherwise return the exact owner decision rather than claiming readiness.
- `docs-maintain` — maintaining or reformatting settled content in an existing artifact; do not restart extraction when meaning is already accepted.
- `manage-agents` — the reader-test dispatch contract in `references/decisions-and-docs.md` owns this call.

## Completion Blockers

The session is not done while any of these hold:

- a question was asked whose answer was readable from an artifact;
- an important caller claim was used without being marked observed, authorized, provisional, or unresolved, or agent inference was treated as owner authority;
- questioning started before the current read, confidence, and reason were recorded;
- a turn split directly related questions into needless rounds, asked a dependent question before knowing it applied, or presented a wall of unrelated questions;
- a material ambiguity was reduced to a mechanically complete question without an evidence-plausible alternative, discriminating countercase, or downstream difference;
- a challengeable answer did not receive its applicable follow-up or lacks a resolved/open state;
- an unresolved response — delegation, ambiguous assent, topic change, silence — was treated as resolution;
- the run proceeded without a live user instead of returning a blocker;
- a crystallized decision, process, settled term, or user requirement has no record — chat-only changes where records live, never whether they exist;
- a destination closes without distinguishing confirmed meaning and negative space from provisional assumptions and exact open choices;
- a user-requirements record lacks stable U identities, separate evidence and authority, priority ownership, or the goal-boundary model;
- a user-requirements result is presented as ready for specification design without explicit owner confirmation of the same current boundary model;
- a required reader test is missing, `partial`, or `blocked`;
- stop was claimed without the destination check and the restatement, or a provisional stop hid an unresolved item.
