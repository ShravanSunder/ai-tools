# Skills-Creation Spec Review — Fixes for the User-Focused Requirements Proposal Set

| Field | Value |
| --- | --- |
| Date | 2026-07-31 |
| Review kind | spec (skills-creation `references/review/spec-review.md`; proposal artifact) |
| Review target | coordination envelope + four child contracts in this directory |
| Reviewers | 4 read-only one-shot Delegate lanes, fresh context: `mental-model-fit`, `trigger-routing`, `depth-coverage` (parent lineage, Fable 5), `rule-agreement` (different lineage, GPT 5.6 Sol medium) |
| Lane receipts | 4/4 complete, 0 silent |
| Verdict | `targeted-revision` |
| Implementation decision | `revise-first` |
| Editing policy | this doc records fixes only; the proposal documents were not edited |

Reviewed digests (sha256, first 12):

```text
f44551cdd236  2026-07-31-user-focused-requirements-update.md            (envelope)
250f1e494a20  2026-07-31-user-focused-requirements-discuss-pathfinding.md (Run A)
3f5ca7457e9c  2026-07-31-user-focused-requirements-spec-design.md        (Run B)
156208d5ce6a  2026-07-31-user-focused-requirements-program-design.md     (Run C)
568dffe6cce0  2026-07-31-user-focused-requirements-spec-program-review.md (Run D)
ce79c0ea7dbe / f6c2a3f28d0b / 47f48140c896 / 94d5852fb6df / ae9d18b57128  sources/*
```

## Verdict Summary

The proposal set is structurally sound: each child targets one named skill, the lenses match the reproduced failures, the proposed `reader-understanding` lane satisfies all nine lane-qualification properties without widening authority, every shared shape names a real consumer, and the proof plan honestly separates static/manual proof from the user-accepted deferred pressure gap.

It cannot be accepted to implement as written because one blocker override fires five times — "a promised stage or branch has no teaching owner" — and six shared contracts are stated with different field lists in different documents, which is the divergent-home failure this workflow exists to prevent. All fixes are bounded document edits; no promise, trigger shape, workflow, or proof route needs redesign.

## Fix Register

Severity classes: `blocker` (override; blocks acceptance), `important`, `minor`. In-tree status records whether the defect also exists in the current worktree implementation (plugin 1.7.3 source state).

### Blocker class — missing teaching owners

| ID | Target | Defect | Smallest fix | In-tree status |
| --- | --- | --- | --- | --- |
| F1 | Run B, Run C, Run D | Accepted-requirements-set gate (the six-skill→Upload-only defense) has field lists and gate rules but no taught recovery source when every current artifact was narrowed — Run B builds the set "from the governing sources", which in the reproduced failure were themselves rewritten; Run D both carries the set in the packet and asks the reviewer to reconstruct it "independently" with no taught method | One sentence per run naming the authoritative recovery precedence: owner-confirmed user-requirements record / boundary-check-1 return → last committed governing baseline (`git show HEAD:<path>` or equivalent) → stop with an authority conflict; plus name the reference that teaches the comparison | Not implemented anywhere in-tree; fix the contracts before implementing |
| F2 | Run B (main path + `authority-and-problem-framing.md` plan), Run C entry | Boundary check 1's only teaching (good/bad complexity budget, foundation-vs-missing discrimination, challenge procedure) is planned solely in Run A's `user-requirements-extraction.md`, which spec-design and program-design never load — yet B:48 promises "perform the same compact check" and C:29 promises "reconstruct it from governing sources". The scope-inflation failure recurs on every path that bypasses discuss-pathfinding | Name a teaching home reachable from both skills (a section in `authority-and-problem-framing.md`, or a shared paragraph both cite) carrying the good/bad budget examples and foundation-vs-missing discrimination; Run C cites the same home for its reconstruct branch | Not implemented in-tree |
| F3 | Run C Depth Surface | `state-calls-and-flows.md` is listed as a changed home (C:136) but assigned zero content in the Depth Surface; the call-path delta has schema on every side (must-expose row, return contract, good/bad output signals) and no production teaching — how to build the current anchor, pair it with the proposed path, mark the four edge classes, normalize a raw stack trace, and stop | Add three or four sentences to Run C's Depth Surface assigning `state-calls-and-flows.md` the delta-production teaching, with one good and one bad delta example and the stop condition (every changed edge marked or the intentional-unchanged decision named) | Not implemented; in-tree `state-calls-and-flows.md` is unchanged from HEAD |
| F4 | Run D Implementation Boundary | The mode-complete call-path enforcement (D:49) and dimension-applicability marking (D:43) have no home: `reviewing-program-design.md` and `reviewing-pair.md` — which own program/pair judgment dimensions per the shipped `mode-complete-reviewer.md` routing — are absent from the changed-homes list, so the dispatched reviewer subagent would never see either obligation | Add `reviewing-program-design.md` and `reviewing-pair.md` (and the common-method applicability marking) to Run D's changed homes, each with one sentence naming the content it gains | Run D entirely unimplemented |
| F5 | Run B, Run C main paths | Both new triggers admit view-correction prompts ("correct this context diagram", "add a journey map to the spec") but neither main path says which stages a view-only semantic correction runs versus skips; the agent either runs the full 12/17-stage workflow for a one-diagram fix or invents an untaught shortcut | One main-path sentence per run naming the correction-entry scaling: a view-only semantic correction must still satisfy governing-source binding, the view's must-expose row, rendering, view audit, and the return contract, and may skip the rest | Applies in-tree too: the 1.7.3 spec-design description already admits these prompts with no scaled entry |

### Important — divergent shared shapes (single-owner citations needed)

| ID | Target | Defect | Smallest fix | In-tree status |
| --- | --- | --- | --- | --- |
| F6 | Envelope, Run A, Run B, Run C | Boundary check 1 field lists diverge: Run C drops "affected classes"; Run A adds evidence gaps others reduce to "unresolved decisions"; four documents carry four copies | Mirror Decision 4's pattern: Run A's Goal Boundary section owns the field shape; envelope, B, and C cite it. Restore "affected classes" wherever the check is consumed | Not implemented |
| F7 | Envelope Decision 32, Run C, Run D | Call-path delta markers disagree: Run C and the source require all four edge classes (added/removed/changed/intentionally unchanged); envelope D32 and Run D's reviewer only require changed edges visible — the reviewer would pass exactly the hidden-removed-edge artifact the change targets | Envelope and Run D cite Run C's `call graph/sequence` must-expose row and require all four delta statuses plus the explicit no-predecessor case | Not implemented |
| F8 | Envelope Decision 28, Run D | Focused-lane sequencing diverges: D28 permits repeated serialized focused lanes; Run D allows one by default with explicit user/caller authorization for a second. An implementer trusting D28 reintroduces reviewer multiplication | Amend Decision 28 to state Run D's default-one limit and the exact explicit-authorization condition | Run D unimplemented |
| F9 | Envelope Decision 30, Run B, Run C, Run D | Accepted-requirements-set field list differs per home: envelope omits constraints and priority assigners; Run B has constraints, no assigners; Runs C/D have both — while C and D claim to consume "Run B's exact set" | Finalize the complete set once in Run B (deciding assigner treatment), then envelope, C, and D cite it | Not implemented |
| F10 | Run C boundary check 2, Run D packet | Run D consumes an opaque "architecture confirmation" without binding Run C's returned shape; a reviewer can accept a confirmation missing the original goal, unresolved structural decisions, or accepted-set coverage | Make Run C's boundary-check-2 return authoritative; Run D's packet carries that exact shape or an inspectable identity resolving to it | Not implemented |
| F11 | Run A Row Contract, Run B acceptance contract, envelope Decision 1 | Row-contract copies diverge ("why it matters" as a Run B field; priority enum only in Run A), and Run B's "no one file format" lens is contradicted by demanding stable U identifiers and producer-owned authority states of every equivalent source | Run A's Row Contract owns fields and enums; Run B's acceptance contract cites it for pathfinding records and states separately which fields bind equivalent sources versus which spec-design may derive (with derived-authority rules), naming the taught behavior for a row-less authoritative source | Partially implemented in-tree (Run A/B shipped); reconcile during revision |

### Important — trigger routing and internal contradictions

| ID | Target | Defect | Smallest fix | In-tree status |
| --- | --- | --- | --- | --- |
| F12 | Run B description | "views and diagrams" carries no view-type token while shipped `docs-maintain` literally claims all updates to existing spec artifacts; Run B's own true prompts ("add a journey map to the spec") misroute. Also resolves the B/C "views and diagrams" collision for view-typed prompts naming the wrong artifact | Insert the view types into the first clause: "...or its required Why/What views and diagrams (journey map, context diagram, requirement coverage), including..." | Applies in-tree: 1.7.3 ships the token-less description verbatim; the 1.7.3 changelog routing claim depends on this fix |
| F13 | Run D Trigger Surface | The no-frontmatter-change claim leaves "review this spec for readability" — the exact new explicit deep-reader entry Run D adds — unroutable; strongest literal match is docs-maintain, which edits | Owner decision (OD-1 below): extend the shipped gap enumeration by one token ("...traceability, reader-understanding or readability, crux...") or state in Run D that the deep-reader path is caller-internal only | Run D unimplemented |
| F14 | Run D lane contract | The `reader-understanding` stop condition ("every reader-facing element has a keep-or-flag basis") contradicts its dispatch scoping ("only for the concrete unresolved reader risk"), recreating the exhaustive-review pressure the scope-inflation calibration forbids | Make the stop condition scope-conditional: every reader-facing element within the dispatched risk's scope — whole artifact only on an explicit deep-reader request — has a keep-or-flag basis | Run D unimplemented |
| F15 | Run A Main-Path Surface | "Do not infer confirmation from silence" contradicts the shipped step-7 strike-list semantics ("correct me now or I proceed with these") with no stated relationship; the handoff gate fires inconsistently on ambiguous assent ("looks good, go") | One sentence placing boundary check 1 relative to step-7 validation: unlike ordinary strikeable assumptions, this item requires an affirmative confirm-or-correct response | Boundary check unimplemented in-tree; strike-list semantics shipped |

### Minor

| ID | Target | Defect | Smallest fix | In-tree status |
| --- | --- | --- | --- | --- |
| F16 | Run A description | Parenthetical neighbour names dropped from every exclusion clause versus the shipped description; handoff to research-swarm et al. becomes two-hop | Restore the parentheticals (fits under 1024 chars) | Applies in-tree (1.7.3 ships the name-less text) |
| F17 | Run A description | "behavioral personas" is the plugin's only persona token and attracts written-research persona work owned by research-swarm | Qualify as "undocumented behavioral personas" or drop the token (body still teaches it) | Applies in-tree |
| F18 | Run C | "which part of the complexity budget it spends" leans on an arithmetic prior the definition disclaims (qualitative budget) | Reword: "whether it stays inside the confirmed change shape or is machinery requiring renewed approval" | Not implemented |
| F19 | Envelope, Runs B/C/D | The human deletion test's consequence list varies by home (Run D drops confirmation/correction, adds "first understanding") | One canonical consequence list; Run D cites it | Partially in-tree (Run B shipped one copy) |
| F20 | Run B | The extended U→P→O→R→C→V chain and the coverage-table must-expose row give failure obligations no place, while the success definition promises confirming "how failure will be observed" | State where failure obligations attach (e.g. a class of C rows) and mirror it in the coverage-table row | Reconcile with shipped chain during revision |
| F21 | Run C shared reference | The visual-check bullet is shape-only (a result field list) with no taught pass/fail judgment (what "malformed"/"semantically lossy" look like, when to fall back) | One good and one bad example plus a stop rule inside the shared reference | Shared reference shipped in-tree; add there too |
| F22 | Envelope or Run B | Correction classification's "both" branch has no ordering owner (mixed Why/What + How requests) | One sentence: owner settles the Why/What delta first; the How correction then runs against the updated accepted set | Not implemented |
| F23 | Run D (routed observation) | Whether `reviewing-common-method.md` duplicates, cites, or compactly owns the reconstruction walks is unstated; risk of a second home at implementation | One clause naming which file owns the walks and which cites | Run D unimplemented |

## Owner Decisions Needed

| ID | Decision | Options |
| --- | --- | --- |
| OD-1 | Run D deep-reader routing (F13) | (a) one-token description extension, contradicting Run D's stated no-frontmatter-change boundary; or (b) keep the claim and declare the deep-reader path caller-internal only, accepting that a bare "review this for readability" prompt routes elsewhere |
| OD-2 | Boundary-check shape owner (F6) | Recommended: Run A's reference owns the shape, all consumers cite. Alternative: a shared reference, at the cost of another shared file |
| OD-3 | Accepted-set assigner treatment (F9) | Whether priority assigners are part of the preserved set (Runs C/D assume yes; Run B and envelope omit them) |

## Ticket Validation

Validated against the currently tracked work items available in this repo. Linear could not be queried: the Linear MCP server requires authentication (`needsAuth`); re-run ticket validation after authenticating if Linear tickets exist for this workstream.

### Against `2026-07-31-spec-program-design-fable5-review-findings.md` (resolved implementation-review ticket, commit `1bd4339`)

- No conflict. All I1–I8 fixes and decisions D1/D2 remain intact under this fix register:
  - I2 ("architecture" token in program-design description): Run C's proposed literal frontmatter retains "—the internal architecture—". Consistent.
  - I4 (pretend-planner mode scoping) and I8 (platform-harness "agent" predicate): Run D touches neither surface. Consistent.
  - M14 (spec-design "specification" token): retained in Run B's proposed description. Consistent.
  - D2 (pressure scenarios as an explicitly user-accepted gap): all four child contracts continue exactly that posture; F1–F23 add static/manual targets only.
- One reinforcement: the Fable review's M4/M5/M8 family (SKILL.md predicates drifting from lane files) is the same failure class as F7/F8/F9 here; the single-owner-citation fixes prevent recurrence rather than repeating that ticket's cleanup.

### Against `docs/changelog/2026-07-31-user-requirements-and-design-views.md` (1.7.3 release ticket, in-tree)

- The changelog claims "Adding or semantically correcting a specification's Why/What views routes to `spec-design`." That claim is weakly supported by the shipped description (F12: no view tokens; docs-maintain competes). The routing claim becomes solid only after F12 lands; until then it overstates trigger evidence.
- The changelog's validation section correctly claims static/manual proof only. No conflict with this review's proof posture.
- The changelog does not claim boundary checks, complexity budgets, accepted-set preservation, call-path deltas, or mode-first review — correctly, since none of those are implemented. The 16:07 proposal revisions are a second, unshipped wave.

### Implementation-state matrix (worktree at plugin 1.7.3 source, dirty branch `improve-specs`)

| Contract surface | Proposal | In tree |
| --- | --- | --- |
| Run A user-requirements extraction, record shape, description | proposed | implemented (pre-revision form; F15–F17 apply) |
| Run A boundary check 1 + complexity budget | proposed 16:07 | not implemented |
| Run B source contract, U→P→O→R→C→V, views, description | proposed | implemented (pre-revision form; F11, F12, F19, F20 apply) |
| Run B boundary-check consumption, correction classification, accepted-set gate | proposed 16:07 | not implemented |
| Run C rendering dedup, shared reference, maintainer index | proposed | implemented (F21 applies) |
| Run C frontmatter ("or its required structural views"), call-path delta, applicability judgments, boundary check 2, mechanism existence test | proposed 16:07 | not implemented |
| Run D (all of it) | proposed | not implemented |

Implication: fixes F1–F11, F13–F15, F18, F22–F23 are cheapest now — they change only the contracts, before their surfaces are written. F12, F16, F17, F19, F20, F21 additionally require edits to already-shipped 1.7.3 files and belong in the next implementation pass with a version bump.

## Retest Plan After Revision

```text
1. Revise the five contracts per F1–F23 + OD-1..OD-3 (edits to this
   directory's docs, not to skill files).
2. Fresh parent reduction on the revised set (spec-review verdicts and
   blocker overrides re-checked; lanes re-dispatched only for the homes
   the fixes touched: rule-agreement for F6–F11, trigger-routing for
   F12–F13/F16–F17, mental-model-fit for F14–F15, depth-coverage for
   F1–F5).
3. On accepted-to-implement: implement the 16:07 wave, fold F12/F16/F17/
   F19/F20/F21 into the shipped files, bump plugin version, update
   changelog.
4. Static checks named per fix (single-owner citations for boundary
   checks, delta markers, accepted-set fields; boundary-check teaching
   home reachable from both consumers; Run D mode references carry the
   call-path obligation).
5. Model pressure execution remains the explicitly user-accepted
   deferred gap (per fable5 D2); stored scenarios gain the targets named
   in F1, F3, F5, F14.
6. Linear ticket validation: pending MCP authentication.
```

## Parent Reduction Record

```text
review: required: yes · kind: spec · artifact: proposal
lanes: mental-model-fit complete · trigger-routing complete ·
       rule-agreement complete (different lineage) · depth-coverage complete
merged duplicates: boundary-check single-home (mental-model-fit +
  rule-agreement → F6); Run B view tokens (trigger-routing findings 1+3 → F12);
  row/acceptance contract (mental-model-fit + rule-agreement → F11)
lane conflicts: none (depth-coverage praise of reader-understanding teaching
  and mental-model-fit's stop-condition finding judge different properties)
rejected findings: none; pruned observations: call-path token blur,
  retired-swarm cache note, Run D walk placement (routed → F23)
coverage gaps: proof-surface feasibility line-by-line and the in-tree
  implementation diff — both owned by implementation review
  (claim-vs-evidence, placement-and-calls, no-op-pruning, steering-strength)
first fix: F1 (accepted-set recovery rule) — the gate for the reproduced
  fidelity-loss failure cannot fire in its target scenario without it;
  failure form: omitted element → required slot, plus stronger completion
  criterion
implementation decision: revise-first
ship decision: blocked (spec not accepted-to-implement)
```
