---
name: discuss-pathfinding
description: Use when user or stakeholder requirements, user needs, behavioral personas, tacit process knowledge, domain terms, or design decisions are unwritten and must be extracted from someone's head or an unmade decision through interview or grilling, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for maintaining settled content in an existing artifact, repairing a drifted shared model, gathering evidence from artifacts, authoring authoritative Why/What from settled sources, defining internal structural How, in-chat visuals with no extraction request, or independent review of a drafted specification, program design, or plan.
---

# Discuss Pathfinding

The knowledge exists — in the user's head, unwritten — and the session is the instrument that gets it out and onto the page before it shapes work. The job is extraction; pathfinding names the route discipline: the question sequence cannot be planned in advance, each answer opens the next branch, and every step still pays extraction's economics. Asking is expensive — a user turn spent on an observable fact is a turn stolen from a judgment call only the user can make, and a turn buys one well-answered axis where a wall of questions buys a half-answered mess. Raw extract is vague and contaminated until challenged.

The session runs on three layers, and keeping them apart is what keeps it conversational: **working state** (your classification bins, parked questions, challenge tracking — private, never shown as ceremony), the **conversational surface** (one axis per turn, plus the validation strike-list), and **durable records** (each decision, process, or term written once, in one home). Show the user evidence that changes a question or a conclusion; never show them your bookkeeping.

Scale extraction to the user's stated time budget. Quick: the one or two highest-leverage judgment axes, one compact batch each, records as an in-chat ledger, and a provisional stop. Standard: resolve every implementation-shaping judgment. Deep: full extraction with durable records and reader-tested handoffs. Speed may reduce breadth, never honesty about what remains unknown. When the stated budget is vague ("don't take forever"), name the depth you inferred — it is strikeable like any assumption. The minimum viable destination at any depth: the user's job, the scope, the core behavior, and the highest-risk unresolved decision — at quick depth, repo evidence and one well-chosen axis may satisfy it.

## Bright Lines

- **Live user required.** No responsive user in the loop — CI, autonomous run, background job — means return a blocker naming the unanswered questions. Never answer your own questions; a session that interviews itself has extracted nothing.
- **Resolution is concrete.** A concrete selection, constraint, example, or correction resolves a question; generic assent does not. Delegation ("whatever you think is best"), ambiguous assent ("sounds good"), a topic change, and silence never resolve — each has a named counter in `references/question-craft.md`.
- **Chat-only on request.** The user may decline files; the records still get written, in-chat, in the same shapes.

## Workflow

1. **Name the destination.** State what this session must extract — the decision, process, terms, or user requirements — the depth the user's time budget buys, and what is out of scope; half of misalignment is silent disagreement about what is not being decided. IF the destination includes user requirements for future specification or product work, load `references/user-requirements-extraction.md` and return the grill axes, user/stakeholder classification contract, row contract, user-job sequence contract, record-scale decision, and goal-boundary procedure to apply through steps 4-7. Completion: destination, depth, and out-of-scope are stated where the user can strike them; for a user-requirements destination, the extraction contract is loaded before questioning begins.

2. **Classify before asking.** Sort each unknown as it surfaces, in working state: observable now — read the file, doc, or log in this session, bounded; broad evidence — IF an unknown needs prior art or multi-source research, use `research-swarm` and return the evidence consumed before that axis is asked; judgment or tacit knowledge — only the user can answer, and this is what questions are for. Completion: every currently known unknown is classified before it is asked; each observable unknown carries its bounded-read result and each broad unknown its returned evidence before its axis proceeds; the user sees only evidence that changed a question or a conclusion.

3. **Hypothesize first.** Before the first question, state your current read and a confidence with its reason. Completion: the guess and confidence are on the record before any question is asked.

4. **Ask in batches, one axis at a time.** Take axes in order of decision leverage, not discovery order. One to three questions per turn, all on one axis. Each question carries its three slots — what is being decided, your read with confidence, why it matters — with options attached where the answer space is knowable. Follow the branch the answers open before starting the next axis. MUST load `references/question-craft.md` and return the question forms, probes, and counters applied — every asked question carrying its three slots and options or your read. For a user-requirements destination, apply the already-loaded grill axes and build classified rows as answers crystallize. Completion: each turn's questions share one axis and each carries all three slots; user-requirements answers are mapped to the loaded row contract or an exact gap.

5. **Challenge as you go.** When a vague term, a glossary conflict, a claimed behavior, or a fuzzy boundary appears, apply the matching challenge as a natural follow-up — propose the canonical, call out the conflict, cross-reference the code ("the code does X, you said Y — which is it?"), pose the edge case. Track privately whether each resolved or stays open; never announce the challenge category. Completion: each challengeable answer encountered was challenged and is tracked as resolved or open.

6. **Write the moment it crystallizes.** For a user-requirements destination, use the already-loaded extraction reference to return the classified inventory, draft rows, useful user-job sequence inputs, record identity and permitted home, unresolved authority/evidence gaps, and the goal-boundary model (boundary check 1). Decisions use the decision record; processes use the process record; terms use glossary entries; user requirements use the classified rows and boundary model — each written once, in the user's own language, as it lands, not at session end. MUST load `references/decisions-and-docs.md` and return the records — and, IF a record is a durable handoff artifact whose ambiguity could change implementation ownership, behavior, or proof, the reader-test receipt. Completion: every crystallized decision, process, settled term, and user requirement has its record, the user-requirements record has a stable identity, and any required reader test returned `complete`.

7. **Validate.** Reflect the understanding back using the four provenance slots owned by `discuss-clarify-mental-models` — `evidence_checked`, `inherited_frame`, `first_principles`, `assumptions`, borrowed alone; that skill's wider contract stays with drift repair — and this skill's strike-list mechanics: present the assumptions as a block the user can strike, "correct me now or I proceed with these." Counters own resolution mid-session; validation revisits only items still parked in working state. For a user-requirements destination, show the goal, affected classes and outcomes, existing foundation, actual missing behavior, non-goals, complexity budget, and unresolved choices to the authorized owner. Ordinary non-gating assumptions may proceed under the strike list; specification handoff requires explicit confirmation or correction of this same current boundary model. Completion: every parked item is resolved concretely or explicitly carried as unresolved, and a user-requirements result carries either the explicit boundary confirmation or the exact owner decision still needed.

8. **Stop test.** Stop when the destination is satisfied at the agreed depth: every in-scope judgment or tacit unknown is resolved and recorded, or explicitly carried as unresolved. Run the predictive test privately as a self-check — write the next three questions you would ask and your predicted answers; surface only a prediction whose uncertainty exposes a remaining material question. A quick session may stop provisionally: state the provisional model, decisions reached, unresolved items, and the recommended next question. IF three consecutive rounds fail the predictive self-check, name what is foundationally missing and return it to the user rather than grinding on. Completion: the predictive self-check ran with its questions and predictions in working state, and the destination check and the restatement — including out-of-scope and unresolved items — are delivered. A user-requirements record without explicit confirmation of its current goal boundary returns with the exact decision needed and is not presented as ready for specification design.

## Routes

- `research-swarm` — the broad-evidence bin in step 2 owns this call; never single facts a bounded read answers.
- `discuss-clarify-mental-models` — IF mid-session the two of you disagree about a model you both already hold, use it to repair the drift and return the rebuilt shared model before extraction continues.
- `docs-maintain` — maintaining or reformatting settled content in an existing artifact; do not restart extraction when meaning is already accepted.
- `manage-agents` — the reader-test dispatch contract in `references/decisions-and-docs.md` owns this call.

## Completion Blockers

The session is not done while any of these hold:

- a question was asked whose answer was readable from an artifact;
- a turn carried questions across more than one axis, or a wall of questions;
- an unresolved response — delegation, ambiguous assent, topic change, silence — was treated as resolution;
- the run proceeded without a live user instead of returning a blocker;
- a crystallized decision, process, settled term, or user requirement has no record — chat-only changes where records live, never whether they exist;
- a user-requirements record lacks stable U identities, separate evidence and authority, priority ownership, or the goal-boundary model;
- a user-requirements result is presented as ready for specification design without explicit owner confirmation of the same current boundary model;
- a required reader test is missing, `partial`, or `blocked`;
- stop was claimed without the destination check and the restatement, or a provisional stop hid an unresolved item.
