---
name: discuss-pathfinding
description: Use when user or stakeholder requirements, user needs, behavioral personas, tacit process knowledge, domain terms, or owner-controlled cost, risk, compatibility, policy, or other design tolerances are unwritten and must be extracted from someone's head or decided collaboratively through interview or grilling, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for maintaining settled content, repairing a drifted shared model, gathering evidence from artifacts, authoring Requirements or Specification from settled sources, synthesizing components, interfaces, mechanisms, or other internal structural How from settled obligations, in-chat visuals with no extraction request, or independent review.
---

# Discuss Pathfinding

The knowledge exists — in the user's head, unwritten — and the session is the instrument that gets it out before it shapes work. The job is extraction. The question sequence cannot be planned in advance because each answer opens the next branch.

Asking is expensive: a turn spent on an observable fact is stolen from a judgment call only the user can make. Ask one to three related questions together when they share context and clarify one decision. Ask a determining question first when its answer decides whether another question applies. Separate unrelated questions. Raw understanding remains provisional until it has been checked and challenged.

Pathfinding is self-contained judgment, not isolated execution. A caller may supply artifacts, conversation context, hypotheses, or constraints; treat them as useful leads rather than authority. Inspect what can be inspected, distinguish what the owner confirmed from what an agent inferred, expose the credible branches, and return the clearest proportional understanding the next skill can use.

Pathfinding can clarify owner meaning that blocks Requirements, Specification, or a Program Design choice. It helps find a good WHY, WHAT, or owner-controlled constraint on HOW; it does not author the destination's design work. For structural work, clarify only the owner's tolerance or constraint—such as acceptable cost, risk, downtime, compatibility, or policy—and return it to `program-design`. Components, interfaces, ownership allocation, and mechanisms are structural synthesis for `program-design`, not questions pathfinding asks the user to design.

Routing cases:

```text
true:      "Help me decide how much downtime and compatibility risk we are willing to accept; that owner policy is not decided."
near miss: "Design the zero-downtime migration components, interfaces, and cutover mechanism from these settled obligations." -> program-design
mixed:     "Help me decide our downtime tolerance, then return that clarified constraint to program-design; do not design components or mechanisms."
```

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

- **Live user required.** No responsive user in the loop — CI, autonomous run, background job — means stop and name the unanswered questions. For an orchestrated continuation, return `decision-needed`; otherwise return a blocker. Never answer your own questions; a session that interviews itself has extracted nothing.
- **Resolution is concrete.** A concrete selection, constraint, example, or correction resolves a question; generic assent does not. Delegation ("whatever you think is best"), ambiguous assent ("sounds good"), a topic change, and silence never resolve — each has a named counter in `references/question-craft.md`.
- **Chat-only on request.** The user may decline files; the records still get written, in-chat, in the same shapes.

## Workflow

1. **Name the destination.** State what the session must extract—decision, process, terms, or user requirements—the depth, and what is out of scope.

   IF the missing meaning blocks Requirements, Specification, or a Program Design choice, load `../../shared-references/requirements-specification-program-design.md` and return the three-concept boundary, the pathfinding boundary that applies to this destination, and the exact owner that must receive the clarified meaning.

   IF a calling phase supplies a return destination, record that exact destination before questioning. It is a boundary, not a suggestion: this session may return confirmed meaning only to that destination and may not replace it with another plausible phase.

   Name whether the missing owner meaning blocks Requirements, Specification, or a Program Design choice. Do not turn every destination into a user-requirements record. For a Program Design destination, name the owner-controlled tolerance or constraint to clarify and explicitly exclude components, interfaces, ownership allocation, and mechanisms. If the request contains only structural synthesis from settled obligations, return the `program-design` route without starting an interview.

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

   Completion: the destination, its owner when applicable, depth, and negative space are correctable by the user, with every explicit exclusion still visible. A product-change handoff carries a confirmed goal boundary or the exact owner decisions still needed. A Program Design destination carries only the exact owner-controlled tolerance or constraint being clarified. An orchestrated continuation also carries its exact caller-supplied return destination. Other destinations remain extraction-led.

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

   When the destination is Program Design, compare the consequences of owner-controlled tolerance choices without proposing competing architectures. Ask what cost, risk, downtime, compatibility, or policy the owner accepts; leave the component or mechanism that satisfies it to `program-design`.

   Completion: the user can understand and answer the current decision without reconstructing the method; dependent questions wait until they apply; a material ambiguity shows the current model, credible alternative, discriminating countercase, and downstream difference before asking; user-requirements answers map to the loaded row contract or an exact gap.

5. **Challenge as you go.** Challenge vague terms, glossary conflicts, claimed behavior, and fuzzy boundaries as natural follow-ups. Propose the canonical term, show the source conflict, or pose the edge case; keep the challenge label private.

   Completion: every challengeable answer receives the applicable natural follow-up and is tracked as resolved or open.

6. **Write the moment it crystallizes.** Use one home per kind of meaning: decisions use the decision record, processes use the process record, terms use glossary entries, and user requirements use classified rows plus the goal boundary.

   The record shape follows the meaning, not a default Requirements destination. A clarified Specification decision remains a decision returned to `spec-design`. A clarified structural tolerance remains a decision returned to `program-design`; it does not become a pathfinding-authored component, interface, ownership allocation, or mechanism.

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

   For an orchestrated continuation, inspect the caller-supplied destination's requested decision and declared input needs before returning. In one compact handoff, name the record identity or in-chat record and boundary status, state confirmed meaning separately from open items, then name the exact recorded return destination and why it owns the return. Keep examples separate from normative meaning. If confirmed meaning no longer fits the recorded destination, stop `decision-needed` with the exact mismatch instead of selecting another phase. No live user or unresolved meaning also stops `decision-needed` with the unanswered questions and no next skill. In either `decision-needed` case, the recorded return destination is frozen context only: do not return to it, recommend it, or put it in `next_action` until the owner decision is confirmed.

   Completion: the predictive check ran and the final restatement includes negative space and unresolved items. An unconfirmed product-change goal boundary returns the exact owner decision needed and is not presented as ready for `spec-design`. An orchestrated return contains one compact handoff to the exact recorded destination or an exact stop; it never chooses another phase.

## Routes

- `research-swarm` — the broad-evidence bin in step 2 owns this call; never single facts a bounded read answers.
- `discuss-clarify-mental-models` — IF mid-session the two of you disagree about a model you both already hold, use it to repair the drift and return the rebuilt shared model before extraction continues.
- `tui-presentation` — IF a material ambiguity is easier to understand as relationships, branches, or sequence, use it for the conversational map; it does not select or own durable specification views.
- `spec-design` — a confirmed goal boundary from a user-requirements destination or proposed-change handoff routes here; otherwise return the exact owner decision rather than claiming readiness.
- `program-design` — settled obligations that require components, interfaces, ownership allocation, or mechanisms route here without pathfinding; owner-controlled structural tolerance clarified for this recorded destination returns here without a pathfinding-authored architecture.
- caller-supplied return destination — for an orchestrated continuation, this exact phase is the only permitted return; a mismatch stops instead of rerouting.
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
- the run proceeded without a live user instead of returning `decision-needed` for an orchestrated continuation or a blocker otherwise;
- a crystallized decision, process, settled term, or user requirement has no record — chat-only changes where records live, never whether they exist;
- a destination closes without distinguishing confirmed meaning and negative space from provisional assumptions and exact open choices;
- a Specification or Program Design destination was collapsed into a user-requirements record instead of returning the clarified meaning to its owner;
- a Program Design destination produced or selected components, interfaces, ownership allocation, or mechanisms instead of returning only the clarified owner-controlled tolerance or constraint;
- a user-requirements record lacks stable U identities, separate evidence and authority, priority ownership, or the goal-boundary model;
- a user-requirements result is presented as ready for specification design without explicit owner confirmation of the same current boundary model;
- a required reader test is missing, `partial`, or `blocked`;
- stop was claimed without the destination check and the restatement, or a provisional stop hid an unresolved item.
- an orchestrated call changed, omitted, or treated its caller-supplied return destination as optional;
- an orchestrated confirmed return lacks its compact record identity, confirmed meaning, boundary status, exact destination, or destination reason, or turns an illustrative mechanism into normative meaning;
- an orchestrated `decision-needed` result presents the frozen return destination as a current route or next action;
- confirmed meaning that does not fit the recorded destination was routed to another phase instead of returned as an exact mismatch.
