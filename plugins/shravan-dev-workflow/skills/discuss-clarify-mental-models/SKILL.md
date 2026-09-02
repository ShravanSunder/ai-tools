---
name: discuss-clarify-mental-models
description: Use when either side notices drift or misalignment - repeated corrections, hollow or instant agreement, surprise at a plan or architecture, the same term meaning different things - or when the user asks to reconverge, share understanding, reflect back, clarify a mental model, force an alignment check, rebuild a shared map, draw the two pictures side by side (what you think vs what I think — a divergence map of where our models match or split), or re-anchor whether a shared model or in-flight work has drifted from the confirmed goal, including what agents in a swarm session are doing, before specs, plans, docs, or code. Not for first-pass extraction of knowledge that lives only in one person's head (discuss-pathfinding), or for artifact editing, independent review, or evidence gathering merely because the prompt uses re-anchor, rails, or scope drift.
---

# Discuss Clarify Mental Models

## Stance

Work like a colleague at a whiteboard. The user holds one picture, you hold another; the job is to draw both pictures next to each other so the splits are visible, then settle each split with evidence or a question. Sometimes the second picture is not a belief but the goal you both confirmed — then the drawing compares the in-flight work against it. Everything the user sees is in their own everyday words; the rigor — provenance categories, countercases, dispositions — is your private discipline, kept in your pocket. Extraction of understanding that exists only in one person's head belongs to `discuss-pathfinding`; this skill repairs a map both sides already hold.

Stay read-only. Do not write specs, plans, docs, code, or research ledgers, and do not author independent review artifacts — the divergent-reviewer branch below returns an in-conversation receipt the parent folds into the map, not a review document. If the next useful move is broad evidence gathering, route to `research-swarm`; if the model is stable enough for a durable artifact, route to the owning phase skill.

This is a drift signal card: either side calls it the moment something feels off — a repeated correction, a too-quick agreement, a surprising plan. Invocation interrupts: stop in-flight edits and queued artifact work; this contract owns the turn. An unaligned model exported into specs, plans, or code multiplies the repair cost downstream.

The territory may be a system, codebase, decision, or in-flight agent work in a swarm session. For agent work, evidence means reading the actual ledgers, lane artifacts, diffs, task state, and run outputs available in this turn. An agent's summary of its own work is an inherited claim, not direct evidence.

## Drift Signals

Self-invoke on these, even when the user has not asked to discuss anything:

- the user corrects the same point twice;
- agreement arrives instantly on something complex;
- evidence contradicts the stated model;
- the user says "that's not what I meant" or "something feels off";
- the agent is surprised by the user's reaction to a plan or architecture.

After a mid-session self-invocation, the next response is that invocation's first map point.

## The Map

The map is drawn at three **map points**: first response, material model change, and close. Interim turns may update named rows or splits in place without redrawing the whole map; an interim update must keep the changed row's applicable fields visible (status, confirmation state, origin, settling question as applicable), and full inspection re-runs at the next map point.

Two views, chosen by what kind of drift fired:

```text
view: divergence map (model vs model)
fires: at each map point when the drift is belief-vs-belief
required semantic fields:
- each model element, named in the user's words
- per-element status: same picture | split | unchecked
- user-column confirmation state: agent's read | user-confirmed
- per-split plain-words origin of each side's belief
- per-split discriminating evidence or settling question (for the split under discussion)
- close map only: the shared close fields

view: re-anchor map (work vs goal)
fires: at each map point when the comparison is in-flight work against the confirmed goal
  (the user asks "are we on the rails?", or artifact-to-goal displacement is detected)
required semantic fields:
- the confirmed goal and governing boundaries, in the user's words
- the in-flight work elements compared against them
- per-element verdict: aligned | exact mismatch | unchecked
- plain-words origin and supporting evidence of each verdict, aligned or mismatched
- close map only: the shared close fields, with the verdict stated as "on track"
  or the exact mismatch list

shared close fields (every session's close map carries these regardless of variant):
- map-level "what would break this picture"
- the load-bearing assumption in plain words
- plain-words verdict, then the route sentence (verdict before route)
```

Until the user confirms or corrects, the user's column is your current read — say so on the map in plain words ("here's what I think you're picturing — correct me"). Presenting your guess of their picture as their confirmed picture is asserting instead of checking, the exact failure this skill repairs.

MUST load `../../shared-references/diagram-rendering-and-fallbacks.md` for every fired view and return the selected medium, fallback decision, semantic-preservation result, and visual-check result. That return is private working state: only the drawn map reaches the conversational surface. Per that reference, a rendering gap blocks the map point until a fallback medium passes; when even the last fallback stays rough, keep the passing-but-rough map and say so in a plain-words caveat ("I can't draw this cleanly here, so bear with the rough layout"). In chat the selected medium is normally readable fenced plain text or `tui-presentation` structure per that reference's own rules; using `tui-presentation` as the medium never substitutes for this skill's semantic obligations — the medium carries the map, it does not own the repair.

IF the fired view's layout for the chosen shape is not already drawn in this conversation — first map of a session, a shape change, or the re-anchor variant firing for the first time — load `references/model-shapes.md` and return the layout and construction rules for that shape and variant.

## Workflow

1. Draw the two pictures. Name what is unstable — terms, boundary, flow, state, ownership, constraint, or tradeoff — and let that choice pick the map's layout. Drift without its own layout maps onto these: a disputed source of truth draws as ownership rows over the disputed facts; competing framings draw as side-by-side pictures at the split; swarm work draws as a re-anchor map with the agent's reported claims as elements whose origins say "the report claims this". Draw the fired view with every element, status, and plain-words origin annotation; cite what you actually read this turn, and when nothing was read, say so on the map in plain words ("I haven't checked anything yet — this is from memory"). When the drift is work-vs-goal, Re-anchor: compare the confirmed goal and governing boundaries with the in-flight work on the re-anchor map, and state "on track" or the exact mismatch instead of answering only yes. Completion: the first map point is a drawn map whose user column carries its confirmation state (divergence map), whose origins distinguish reading from memory, and whose caption names in plain words what the drawing leaves out and what broke.

2. Settle the splits, in leverage order — highest leverage is the split whose answer changes the most other rows or gates the pending decision. For the split under discussion, show your current read, the strongest credible alternative, and the discriminating evidence or settling question — on or beside the map — then ask one to three related questions that select a branch. Follow the branch the answer opens; dependent questions wait. Challenge vague terms and claimed behavior as natural follow-ups, and track each raised challenge privately to one of the four dispositions: the source contradicts the model — repair the map; the source is ambiguous — note a bounded gap; the challenge assumed missing context — add the element; the challenge is a preference — dismiss it plainly. Update the changed rows in place; redraw at a material model change — a status flip on any row, a new element, a changed shape, or a changed view. Competing pictures at a split stay drawn side by side; when only one picture is live, say the plain-words reason why. Completion: every split raised carries its origin annotation and its discriminating evidence or settling question, and every raised challenge has landed in a disposition reflected on the map or in a plain note.

3. Close with the final map. Draw the close map with the shared close fields: what would break this picture (a real falsifier — "if worker.py:88 has a retry loop, this whole column is wrong" — not a hedge like "unless I'm missing something"), the load-bearing assumption in plain words, then the verdict ("we're agreed" / "still open: ..."), then one plain route sentence naming the next skill and the decision this repaired map improves — or, when the work stays open here with no shipped owner, the plain statement that it stays open and what would unblock it. When the meaning of a term changed, note the new meaning and the old one it replaces ("when we say X now, we mean A — not B like before"). When real branches remain and the user must choose, end with the branch-selecting question. Completion: the close map carries every shared close field, the verdict precedes the route, and every coverage-ledger obligation below has its carrier — on the map, in a plain note, or held privately when the ledger marks that carrier private.

## Definitions (private)

These ten definitions are coverage obligations and internal vocabulary. On this skill's conversational surface they are never display shapes or labels; borrowers such as `discuss-pathfinding` own their own surface policy.

- `model`: current map; one literal shape word from `terms`, `boundary`, `flow`, `state`, `ownership`, `constraint`, or `tradeoff`, plus what the map hides or simplifies and the repair target — the falsifiable statement of where the shared map failed.
- `evidence_checked`: read this turn vs inferred; "none — answering from session memory" when no direct evidence was checked.
- `inherited_frame`: what we believe because of analogy, old names, prior specs, agent reports, habit, or convention; none surfaced is legal.
- `first_principles`: directly evidenced truths and hard constraints from code, docs, run output, artifacts, or the user's stated goal.
- `assumptions`: unproven beliefs carried knowingly; not inherited claims, not direct evidence.
- `branches`: competing framings or model types that need different evidence.
- `countercase`: what would falsify or weaken the rebuilt map, including the load-bearing assumption or tradeoff, with a disposition for every raised challenge.
- `rebuilt_model`: the clarified map to carry forward, including each canonical term that changed and the old interpretation it replaces.
- `open_or_confirmed`: whether the model is confirmed or what remains open.
- `next_workflow`: route plus the decision this map improves.

### Coverage ledger

Every obligation has a carrier; a coverage-ledger obligation with no carrier at close blocks the route. A carrier marked private is satisfied by the private working state itself and is exempt from the on-map close check.

| private obligation | carrier on the surface |
| --- | --- |
| `model` | the map's layout choice plus a plain-words caption naming what the drawing leaves out and what broke |
| `evidence_checked` | origin annotations cite reads; "from memory" caption when nothing was read |
| `inherited_frame` / `first_principles` / `assumptions` | plain-words origin annotations per element or split ("we got this from the old doc", "the code shows this", "we're assuming this") |
| `branches` | competing pictures drawn or named side by side; single-live-branch reason in plain words |
| `countercase` + dispositions | map-level "what would break my picture" at close, the per-split discriminating evidence or settling question under discussion, and each challenge's disposition reflected on the map or in a plain note |
| re-anchor comparison | the re-anchor map with its "on track" / exact-mismatch verdict and supporting evidence |
| `rebuilt_model` | the close map plus plain-words notes of changed terms with old meanings |
| `open_or_confirmed` | plain-words verdict at close, before the route |
| `next_workflow` | one plain route sentence at close, after the verdict — or the plain "stays open here" statement with what would unblock it |
| load-bearing assumption | named in plain words on the close map ("everything above leans on ...") |
| rendering bookkeeping | private working state only; never displayed |

IF the plain-words origin annotations start collapsing into one vague caveat, load `references/provenance-decomposition.md` and return the distinct origins.

IF the repaired map gates a spec, plan, or a named irreversible decision, dispatch one divergent reviewer as a reviewer-pattern Delegate per `manage-agents` (history none, read-only). Packet: the close map, its evidence anchors, and non-goals — nothing else. Parallel-safe once the close map is drafted; authority never widens beyond read-only inspection. Return `complete | partial | blocked` with candidate findings answering "what does the repaired map still fail to explain?"; the parent verifies each against the artifacts and folds survivors into the map through the disposition track.

## Surface Language

Bright line: the ten definition labels and every label this skill coined — the field names above, method terms such as `provenance` and `countercase`, ledger and section names, and rendering-bookkeeping labels such as `selected medium:` or `visual check:` — are agent-introduced vocabulary that never appears on this skill's conversational surface, whether as a colon-label or narrated in prose ("our inherited frame is..."); the user's words carry the map. Exempt: route-target skill names in the close route sentence; the verdict words in plain sentences ("we're agreed", "still open", "on track"); a banned word the user introduced in this conversation, echoed as an element name (the ban governs agent-introduced vocabulary, not the user's own words); ordinary English that happens to overlap a field name, used in plain sentences ("my assumption is", "we're assuming this") — the ban is on the coined label and template forms, not on everyday words; "divergence map" and "re-anchor", which are user-facing vocabulary; and agent-to-agent packets such as the divergent-reviewer dispatch, which keep their field-name wording.

## Route Targets

- `research-swarm`: evidence gathering, prior art, current docs, memory/session mining, or source ledgers.
- `spec-design`: durable authoritative Why/What contract.
- `program-design`: durable structural How once observable obligations are settled.
- Planning from current ready three-artifact design: `plan-implementation`; execution of an exact ready canonical plan whose delivery context is `pr-ready-unmerged`: `implement-plan`; independent implementation review: `review-implementation` for general-domain work or `skills-creation` for a runtime skill package. Do not invoke a retired workflow.
- open in this skill: blocked work, broken model, conflicting artifacts, repeated loop, or missing authority when no shipped owner exists yet.

## Red Flags

| Rationalization | Reality |
| --- | --- |
| "I summarized the request, so we share the model." | A summary without a drawn map, origins, and a settling question is not reconvergence. |
| "Prose explains it fine." | A split you can see beats a paragraph; drawing is the default, not the exception. |
| "I displayed the template, so the model is inspectable." | A template is not a drawing; the map shows the model, the ledger stays in your pocket. |
| "The columns are drawn, so the divergence is shown." | A two-column template that hides the actual split is decoration, not a map. |
| "The jargon is more precise." | Precision the user cannot read repairs nothing; the rigor lives underneath. |
| "I can start the plan and refine as we go." | Planning exports a broken model into a stronger-looking artifact. |
| "The user said yes, so the model is confirmed." | Agreement without the load-bearing assumption is weak convergence. |
| "I need a full research sweep first." | Broad evidence belongs to `research-swarm`; this skill checks only bounded evidence. |
| "I'll capture this in a doc while it is fresh." | Discussion surfaces stay read-only until another workflow owns the artifact. |
| "The agent's report says it's done." | A report is an inherited claim; direct evidence is artifacts, diffs, run output, or verified state. |

## Completion Blockers

Do not route onward while any of these hold:

- a model presentation at a map point has no drawn map;
- a fired view's rendering return is an unresolved gap with no passing fallback medium;
- skill jargon appears on the conversational surface outside the stated exemptions;
- a split was raised without its origin annotation or settling question;
- a first divergence map's user column carries no confirmation state (the re-anchor map has no belief column and is exempt);
- reading and memory are blurred — origins imply evidence that was not checked this turn;
- the origin annotations for inherited claims, direct evidence, and assumptions carry identical or copy-pasted content;
- competing framings are hidden inside one chosen picture;
- the close map's "what would break this picture" is a hedge rather than a real falsifier, or a raised challenge has no disposition;
- the route is named before the verdict, or before the model is confirmed or explicitly open;
- a coverage-ledger obligation has no carrier at close;
- the response writes or edits artifacts instead of clarifying the model.
