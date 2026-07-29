# Evidence — 2026-07-28 Discuss Pathfinding And Skills-Creation Sourcing

Persisted evidence for the claims in `../2026-07-28-discuss-pathfinding.md`. Full lane transcripts lived in the authoring session; this file records the verdict-level reductions a reader can check against the committed text.

## Spec review (proposal, before authoring)

Three fresh-context lanes reviewed the user-validated design. Parent reduction:

- `mental-model-fit` — complete. 1 important (two metaphors, extraction and pathfinding, coexisted with no stated relationship) + 2 minor (step 5 not lens-derived; batching bound asserted, not derived). All folded into the authored lens: the relationship sentence, the challenge clause, and the derived one-axis-per-turn premise are in `SKILL.md`'s opening paragraph.
- `trigger-routing` — complete. 1 important (missing especially-clause with the user's real phrases) + 1 important (no reciprocal boundary in discuss-clarify-mental-models) + 2 minor. Folded into the shipped description and the neighbour edit.
- `rule-agreement` — complete. 1 blocker: discuss-clarify's description ("build a shared map of how something works") plus two shipped routers (orchestrator-goal routing-map, spec-creation-swarm routing lines) claimed pathfinding's territory. Resolved by the coordinated boundary edits in this changeset. 2 important (question-count craft scoped against user-decision-questions.md; provenance slots cited, not restated) — both encoded in `references/question-craft.md` and `SKILL.md` step 7.

## Implementation review (changed files, before this commit)

Seven lanes run on `gpt-5.6-sol` via acpx (different lineage; read-only permission shape). Verdict-level results:

- `placement-and-calls` — complete. 1 blocker: the reader-test dispatch did not fill the lane-handoff form. Fixed: `decisions-and-docs.md` now fills packet, pattern, authority, parallel-safety, receipt, and parent-reduction slots. 4 important (step-4 slots body-visible; step-6 handoff predicate and reader-test return; Routes as literal conditional forms; skills-creation combined IF split) — all fixed.
- `rule-agreement` — complete. 1 blocker: orchestrator-goal's body (3 lines) and the AGENTS.md row still routed all unclear goals to discuss-clarify. Fixed to the two-way route citing routing-map.md as owner. 2 important (spec-creation narrow-question qualifier; provenance restated in parallel vocabulary) — fixed: the literal owned slots (`evidence_checked`, `inherited_frame`, `first_principles`, `assumptions`) now appear in step 7.
- `steering-strength` — complete. 5 important completion-criteria weaknesses (terms missing from record completions; challenge criterion rewarding non-naming; classification legwork invisible; non-yes contract not closed under corrections/topic changes; stop test satisfiable by assertion). All fixed: steps 2, 5, 6, 7, 8 completions reworded; resolved/unresolved response classes defined in `question-craft.md`; the stop test now requires recorded predictions and a bounded three-round failure path.
- `mental-model-fit` — complete. 1 important (stop test could fire while the destination stayed unresolved) — fixed: destination check governs, prediction is the signal. 1 observation ("assay" one-off) — pruned.
- `no-op-pruning` — complete. 8 padding/no-op sentences identified; all deleted, including "Ground truth comes before design" in skills-creation (the IF sentence carries the behavior).
- `trigger-routing` — complete. All six routing prompts pass; 1 observation (workflow clause on the trigger surface) — the description dropped "recording decisions and glossary entries as they crystallize".
- `claim-vs-evidence` — complete. 5 important: changelog claims cited evidence that existed only in the session. Fixed by this evidence file and the reworded Validation section.

## Static validation

```text
$ claude plugin validate .
✔ Validation passed
$ git diff --check
(clean)
```

Run at the post-review-fix state committed alongside this file.

## Judgment-to-source map

| judgment in the shipped text | source |
| --- | --- |
| three-slot question form with attached read | `spec-creation-swarm/references/user-decision-questions.md`; interview-me (addyosmani) |
| want-vs-should-want counter | interview-me (addyosmani) |
| facts-vs-decisions / classify-before-asking | grilling (mattpocock); pstack poteto classify-before-you-ask (cursor) |
| challenge moves: canonical terms, glossary conflict, code cross-reference, edge scenarios | domain-modeling (mattpocock) |
| stated-vs-actual diffing | domain-modeling's code cross-reference (mattpocock) |
| decision-record shape and supersede-never-delete lifecycle | documentation-and-adrs (addyosmani) |
| reader test with a fresh-context Delegate | doc-coauthoring (getsentry); dispatch rules from `manage-agents` |
| provenance slots in validation | `discuss-clarify-mental-models` (cited owner) |
| resolved/unresolved response classes; predictive stop test | interview-me (addyosmani); spec-design draft's false-convergence bar (this repo) |
| process-marker interview questions | original — no source taught interviewing about a repeatable process |
| one-axis batching (departure from one-question-per-message) | user-directed; derived from the lens |

## Shaping round 1 (after commit fd04c8f)

Four sol lanes on the committed text; parent-reduced and reshaped whole:

- `rule-agreement` refresh — 1 blocker: orchestrator-goal's concrete examples (unclear-goal output template, goal-contract's "Make the workflow better") still routed every unclear goal to discuss-clarify while the abstract rule was two-way; fixed at both example sites. 2 important: skills-creation's completion collapsed the split sourcing returns (fixed — each return named); release vocabulary lagged the resolution classes (fixed — "explicit-resolution bar", "resolved/unresolved response classes").
- over-tightening probe — verdict `bureaucratic-in-places`: the review round had collapsed three layers into one visible "record everything" surface. The three-layer separation (private working state / conversational surface / durable records) is now the mental model's second paragraph, and each gate demands its own layer: classification is working state, challenges run as natural follow-ups without announced categories, counters own resolution and validation revisits only parked items, one unresolved ledger carries through steps 2/7/8.
- simulation A (greenfield intent under time pressure) — the skill had turn-level pacing but no session-level compression; added the depth contract (quick/standard/deep scaled to the stated time budget, "speed may reduce breadth, never honesty"), leverage-ordered axes, the minimum viable destination, the private predictive self-check, and the provisional-stop shape.
- simulation B (tacit process, hard user) — the record shapes were decision-only while the skill promises process extraction; added the process record (trigger, owner, ordered steps, branch conditions, signals/thresholds, handoffs, stop, exceptions, source conflicts), the process-walk probe anchored on a real occurrence, reader-test receipt gating in step 6's completion and the blockers, and the chat-only wording fix (changes where records live, never whether they exist). Inline "adapted from" parentheticals moved out of runtime files; this map is their single home.

## Proof route

Behavior not evaluated: no pressure scenario or behavior proof exists for this change. The user explicitly directed that pressure testing be excluded from this effort ("no pressure testing"; "focus on the creation") and accepted shipping on static validation plus the reviews above. Acceptance is recorded here as the persisted decision.
