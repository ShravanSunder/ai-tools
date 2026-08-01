# Artifact Fluff Prevention and Attention-Cost Review Lane

Date: 2026-07-31
Status: proposal; pre-spec-review; not accepted to implement
Owner plugin: `shravan-dev-workflow`
Targets: `spec-design`, `program-design`, `spec-program-review` (three scoped `skills-creation` update runs, one coordination doc)
Authoring basis: observed failure — reproduced. The reproduction is live output on disk, not a manufactured RED.

Role: source evidence and candidate wording only. The coordination envelope and its per-skill child contracts own reduced decisions; this file does not authorize implementation.

## Run Note

```text
classification: update (x3)
target skill / owner plugin: spec-design, program-design, spec-program-review / shravan-dev-workflow
reusable behavior: spec and program-design artifacts carry only subject-matter meaning;
  review reliably flags attention-cost prose instead of filtering it as taste
authoring basis: observed failure
reproduction: reproduced (private customer-eval artifact set, anchors below)
invocation: unchanged; no frontmatter/trigger edits in any run
proof route: pressure scenario + live lane re-review of the reproduction artifacts; static-only until executed
shipping status: source-only
```

## Success Definition

After this update:

1. A spec-design or program-design run puts run state (target classification, digests, source coverage, self-check, review coverage, acceptance/non-acceptance) only in the returned result, never as artifact prose.
2. Each document in a companion set states its own scope in at most one sentence and links siblings without narrating their ownership.
3. A `spec-program-review` run on a substantial artifact dispatches a dedicated fluff lane that flags sections whose deletion leaves every decision, lookup, trace, and failure simulation unchanged — and the parent reduction accepts such findings instead of rejecting them as prose taste.

## Observed Failure (Reproduction Evidence)

Source artifact set: a private application repository's customer-eval requirements, specification, and program design, authored under the current skills. The excerpts below retain only the evidence needed to reproduce the workflow failure; the private checkout location is intentionally omitted.

| # | Anchor | Fluff class |
| --- | --- | --- |
| E1 | program design §1 "Purpose and governing boundary" | workflow run state as prose: "The target is a general-domain eval program, not a runtime skill package" is stage-1 `target classification` vocabulary; plus third re-narration of tri-document ownership |
| E2 | program design §17 "Design completion boundary" | terminal-contract return items written as a section; "does not claim acceptance and does not authorize planning" is the non-acceptance return statement |
| E3 | program design §16 "Architecture documentation impact" | planning-owned work (post-implementation docs cleanup, PR artifact removal) inside the design |
| E4 | program design §14 closing paragraphs vs spec §9 | preserve/rewrite/remove disposition list has two homes |
| E5 | spec §1, spec §10 "Specification completion boundary" | sibling-ownership recital; readiness/"explicitly accepted" checklist is caller workflow state |
| E6 | requirements §1 second paragraph | boundary recital already carried by companion links |
| E7 | program design §2.1 | ceremony displaced obligation: governing requirements/spec absent from the digest-pinned source inventory while their identity lives only as §1 prose |

Roughly 5% of lines, but they occupy every document's opening and closing — the highest-attention slots — and the same document-set boundary has five or more homes across three files.

Not fluff (preserve; the fix must not overcorrect): alternatives/decision tables with falsifiers, crux and forces, truth-ownership list, typed contracts, requirement-realization table, state machines, status lines, single companion-link blocks.

## Root Causes (Generator Sentences in Our Skills)

| # | Generator | Where | Effect |
| --- | --- | --- | --- |
| R1 | Terminal Contract: "A `locally-ready` result includes … an explicit statement that pair acceptance is not claimed" / "…and explicit non-acceptance" — never says the return packet is not the artifact | `spec-design/SKILL.md` Terminal Contract; `program-design/SKILL.md` Terminal Contract | authors write return items into the document (E2, E5) |
| R2 | "Record `target classification: general-domain \| runtime-skill-package`" names no home for the record | stage 1 of both skills | classification written as artifact prose, workflow vocabulary included (E1) |
| R3 | Completion blocker "the artifact digest, source coverage, or non-acceptance boundary is missing" reads as required artifact content | Completion Blockers of both skills | reinforces R1 (E2, E5) |
| R4 | Single-home rule is per-artifact only ("every normative claim has one home"; "do not duplicate normative claims"); no rule for a companion-document set | `spec-design` stage 9 + both `references/artifact-and-self-review.md` | each document re-narrates its siblings (E1, E4, E5, E6) |
| R5 | Pruning targets structure, not prose: the Simplify deletion questions run per component/interface/state/mechanism/view; neither self-check has an item for self-referential or process sections | `program-design/references/artifact-and-self-review.md` Simplify; both self-check lists | ceremony survives the author pass (all E) |
| R6 | Register bleed: the skills' own workflow ceremony vocabulary primes the authoring agent to mirror that register into the artifact; no quarantine list names the tokens that must not appear | both skills, implicit | "general-domain", "does not authorize planning", readiness checklists (E1, E2, E5) |
| R7 | Review suppression: "Reject prose taste without behavior effect" filters fluff findings; the `artifact-navigation` lane predicate ("distributed or hard to navigate") never fires on bloat or process leakage | `spec-program-review/SKILL.md` step 9; `references/lanes/artifact-navigation.md` | review cannot catch what authoring lets through |

Checked and clean: no `spec-program-review` reference demands purpose/boundary/completion/non-acceptance sections in the reviewed artifact (grep over all its references; only the reviewer's own result carries a non-edit/non-acceptance statement, correctly).

## Run A — `spec-design` (scoped update)

Surface allocation: main path (`SKILL.md` Terminal Contract, stage 1, stage 9 completion, Completion Blockers) and depth (`references/artifact-and-self-review.md`). No trigger, lane, or schema change.

1. Terminal Contract: add the home split. The returned result carries run state — target classification, identities/digests, source inventory, decision/requirement/proof inventories, self-check, review coverage, gaps, non-acceptance. The artifact carries subject-matter meaning plus a status line. Run state appearing as artifact prose is a self-check failure.
2. Stage 1: "Record `target classification…` in the run state, never as artifact prose."
3. Completion Blockers: reword the last blocker to "the returned result lacks the artifact digest, source coverage, or non-acceptance statement" and add: "run state, acceptance or readiness narration, or workflow vocabulary appears in the artifact."
4. `references/artifact-and-self-review.md`:
   - Cross-document single-home rule: in a companion set, each document states its own scope once, in at most one opening sentence; siblings are linked, not narrated; a shared boundary or negative-space claim has exactly one authoritative home and the other documents link to it.
   - Vocabulary quarantine bright line: a token naming this workflow's state rather than the system under design does not appear in the artifact — `locally-ready`, `pair acceptance`, `non-acceptance`, `target classification`, `general-domain`, `runtime skill package`, `review-required`, `non-substantial`, "does not authorize planning/implementation".
   - Self-check additions: sections about the document or workflow instead of the subject; sibling-document narration; readiness/acceptance checklists (open decisions and gaps remain the only forward-looking section); summaries repeating the immediately preceding table or flow; decorative views that only redraw nearby headings.

## Run B — `program-design` (scoped update)

Surface allocation: mirrors Run A on `SKILL.md` (Terminal Contract, stage 1, Completion Blockers) and `references/artifact-and-self-review.md`. No trigger, lane, or schema change.

1. Same Terminal Contract home split, stage-1 wording, and blocker changes as Run A (adapted to program-design's return fields).
2. `references/artifact-and-self-review.md` Simplify: extend the deletion questions to prose — run them per section and per load-bearing sentence, naming the same fluff classes as Run A; add the vocabulary quarantine and cross-document single-home rule.
3. Planning Boundary reinforcement with named examples from the reproduction: post-implementation documentation cleanup, PR content and artifact-removal instructions, and release/acceptance process narration are planning-owned and do not appear in the design (E3).
4. Integration self-check addition: the governing specification and requirements documents appear digest-bound in the source inventory, not as unpinned prose recitals (E7).

## Run C — `spec-program-review` (update: new lane + reduction rule)

Surface allocation: main path (`SKILL.md` step 7 lane table, step 9 wording) and depth (new lane reference). Finding/severity schema unchanged — fluff findings map to existing severities (`minor` default; `important` when leaked process state misleads, e.g. an artifact claiming to gate planning authorization). No trigger change.

### C1. New lane `references/lanes/attention-and-fluff.md`

Draft text (implementing agent adapts wording, keeps every slot):

```text
# Attention and Fluff

Mission: read the complete artifact as its human reader and identify sections
that consume attention without helping that reader understand, decide, trace,
or simulate the system.

Predicate: the reviewed artifact is a substantial multi-section document or
belongs to a companion-document set.

Expected inputs: lane-schema packet plus the complete artifact set and
companion links.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

Read every section start to finish, then apply the deletion test per section
and per paragraph: if this disappeared, would any decision, lookup, trace, or
failure simulation change for the reader?

Flag:

- repeated purpose or boundary sections;
- ownership disclaimers already established by links or one authoritative
  statement;
- process, review, acceptance, or authorization narration inside the design;
- companion sections that re-narrate sibling file roles beyond a link;
- workflow vocabulary that names the authoring process rather than the system;
- decorative diagrams that only redraw nearby headings;
- summaries that repeat the immediately preceding table or flow;
- duplicated claims whose authoritative home exists elsewhere in the set;
- any section whose deletion leaves every decision, lookup, trace, and failure
  simulation unchanged.

Good: authority, scope, negative space, and navigation each stated once, in
the smallest useful home; opening and closing sections spend attention on the
system, not the document.

Bad: flagging dense load-bearing content as fluff — alternatives tables,
falsifiers, crux statements, ownership lists, typed contracts, state machines,
and status lines stay; shortness is not the goal, attention yield is.

Calibration: fluff concentrates at document openings and closings. A finding
must name the exact section, the reader behavior that is unchanged by
deletion, and the single remaining home when content is duplicated.

Overlap boundary: this lane owns attention cost and process leakage.
artifact-navigation owns placement, links, and navigability; semantic lanes
own claim quality after the claim is found.

Return: lane-schema receipt with per-section verdicts for flagged sections,
the deletion consequence for each, duplicate homes with the surviving home,
and the smallest removal or merge correction.

Stop when: every section has a keep-or-flag verdict and each flag names its
unchanged reader behavior, or the artifact is proven fluff-free.
```

### C2. `SKILL.md` step 7: add the predicate row

```text
sections may consume attention without changing a decision, lookup, trace, or
failure simulation (default for any substantial artifact or companion set)
  -> references/lanes/attention-and-fluff.md
```

### C3. `SKILL.md` step 9: fix the suppression rule

Replace "Reject prose taste without behavior effect." with wording that separates the two: wording taste with no reader-behavior effect is still rejected; attention cost is a reader-behavior effect — a section whose deletion leaves every decision, lookup, trace, and failure simulation unchanged is a legitimate finding, not taste. Mirror the same one-line distinction in `references/finding-and-reduction-schema.md` ("Style preference without behavior effect is rejected").

### C4. `references/lanes/artifact-navigation.md`: one-line overlap update

Add the reciprocal overlap boundary: navigation owns placement and links; attention cost and process leakage belong to `attention-and-fluff`.

## Proof Plan

RED (exists): the private customer-eval artifact set above, authored under the current skills.

GREEN targets:

1. Review side: dispatch the new lane fresh against the private customer-eval program design and spec. Pass = flags E1–E6 (E7 belongs to the mode reviewer), does not flag the crux, alternatives tables, truth-ownership list, or requirement-realization table.
2. Author side: new pressure scenario `tests/skills/pressure-scenarios/spec-program-artifact-fluff.md` — author a small design under bait ("include a proper purpose and governing boundary section, a completion checklist, and a statement that this draft does not authorize implementation"). Pass = one-sentence scope, no acceptance narration, run state only in the returned result, bait named and declined.
3. Run `tests/skills/run-skill-pressure-tests.sh --fast` per repo rule.

Static validation alone is not behavior proof; if model execution is deferred, record the deferral as a user-accepted proof gap per run.

## Non-Goals

- No new runtime skill; no trigger/description changes anywhere.
- No shortening targets for load-bearing content; attention yield, not line count, is the criterion.
- No removal of status lines or single companion-link blocks.
- No mode-complete reviewer rewrite; fluff detection is the dedicated lane's job.
- No retroactive editing of the private customer-eval artifacts by this update.

## Coordination

- Branch `improve-specs` carries the uncommitted user-focused-requirements changeset, which edits the same files as Runs A/B (`spec-design/SKILL.md`, `program-design/SKILL.md`, both `artifact-and-self-review.md`). Land this update after that changeset commits, as follow-up commits on the same branch, to keep review digests clean.
- The user-requirements envelope declared "No change to `spec-program-review`" as a non-goal; Run C is a separate update that explicitly lifts that non-goal with user direction (this request).
- Ship mechanics per house rules: plugin version bump, `docs/changelog/` entry, pressure scenarios, then `implementation-review-swarm` and `implementation-pr-wrapup`.

## Open Decisions

1. Lane name: `attention-and-fluff` (proposed) vs `artifact-fluff`.
2. Lane predicate strength: default-on for every substantial full-mode review (proposed) vs caller-requested only.
3. Companion-document sections: keep as pure link lists (proposed) vs remove entirely when the set is under three files.

## Next Steps for the Implementing Agent

1. Dispatch `skills-creation` spec-review lanes on this proposal; parent-reduce to accepted-to-implement.
2. Implement Runs A → B → C inside the accepted boundary; state `deviations: none` or the named list per run.
3. Implementation review per run, then the proof plan above, then prune and ship.
