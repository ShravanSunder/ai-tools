# Skills Creation Body, Reference, And Lane Source-First Implementation Plan

Status: reviewed and ready for `implementation-execute-plan`; no skill or test source has been edited by planning or review.

Goal id: `2026-07-13-skills-creation-skill-first`

## Goal

Implement the accepted authored-body, ordinary-reference, lane, and shared-shape design as one source-level hard cutover. The source checkpoint ends when the exact skill surface is implemented, structurally validated, and source-only reviewed. It does not complete the goal: artifact-scoped behavior GREEN, final implementation review, shipping metadata, and PR readiness wait for the separately developed test changes.

## Accepted Sources And Coverage

- Accepted spec: `docs/specs/2026-07-13-skills-creation-body-reference-lanes/2026-07-13-skills-creation-body-reference-lanes.md`, 762/762 lines read, SHA-256 `ccc4508cc1e427452577d11a1fc5be8fd243d280d3478a09a00a45100b58566f`.
- Accepted spec review: `tmp/spec-workflows/2026-07-13-skills-creation-body-reference-lanes/skill-spec-review-reduction.md`, SHA-256 `4a5f046a916a5b2ff2c23b8186a3f6cbdc13d876b9d3a4516121958b318e8be2`, verdict `great`, implementation decision `accepted-to-implement`.
- Baseline evidence: `tmp/spec-workflows/2026-07-13-skills-creation-body-reference-lanes/lanes/caller-grammar-and-callee-routing-baseline.md`.
- Goal boundary and requirements/proof seed: `tmp/workflow-state/2026-07-13-skills-creation-skill-first/details.md`.
- Planning evidence: `tmp/plan-workflows/2026-07-13-skills-creation-skill-first/plan-ledger.md` and its `lanes/` artifacts.
- Live target source and every existing file in the planned add/edit/delete boundary were read completely during planning.

## Scope

The source cutover is exactly five edits, one addition, and two deletions.

Edit:

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/glossary.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-implementation-review.md`

Add:

- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-lanes-design.md`

Delete without compatibility aliases or stubs:

- `plugins/shravan-dev-workflow/skills/skills-creation/references/workflow-topology.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/schema-design.md`

## Non-Goals And Preservation Guards

- Do not edit any path under `tests/skills/`; pressure-test design and integration belong to the user's separate worktree.
- Do not edit plugin versions, marketplace metadata, changelog, installed caches, push/PR state, or release surfaces.
- Do not claim behavior GREEN, full R10 completion, final implementation-review completion, or PR readiness from this source-only checkpoint.
- Do not edit the accepted spec, review reduction, baseline artifacts, or goal-state files except for the orchestrator-owned transition event after plan review.
- Preserve these pre-existing user-owned files byte-for-byte:
  - `skills-creation/references/platform-mechanics.md`: SHA-256 `3be37f694e6639cb82b52e3a35da5858b0801d2adf7b896b4b09ac97cd644847`.
  - `spec-creation-swarm/SKILL.md`: SHA-256 `649c4ff1f569302659f31d6a8602078470674b91fc9bc1898daeb006619e904d`.

Security context: not applicable. This slice changes Markdown authoring guidance only and authorizes no scripts, hooks, network behavior, secrets, permissions, cache refresh, or home-level mutation.

## Implementation Decisions

1. `SKILL.md` owns the authored body's mental model, all-run spine, completion, and four literal caller forms. It absorbs ordinary workflow topology; it does not become a link-only router.
2. `reference-design.md` owns ordinary placement plus caller/callee content. `MUST load` may extract coherent all-run procedure, but the caller keeps its obligation, order, decision, required return, invariant, and completion visible.
3. `reference-lanes-design.md` owns meta-level lane qualification and the three shared-shape families. It is not a universal runtime packet imported by authored skills.
4. All nine R6 lane qualifications are jointly required. Parallel safety and bounded subagent handoff are necessary but insufficient. Runtime serialization does not un-lane qualified work.
5. Caller instance authority may equal or narrow the lane reference's stable maximum authority; it may never widen it.
6. `lane-schema`, `output-schema`, and `tool-schema` remain distinct. Only lane shapes inherit provisional receipt and parent-reduction semantics.
7. Review rubrics enforce the new ownership model and remove the stale blanket rule that all all-run detail must be inline.

## Requirements/Proof Matrix

| Requirement or claim | Source | Owning slice | Proof modality and layer now | Evidence source | Freshness guard | RED/GREEN | Scope fit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Authored body exposes mental model, all-run spine, local completion, invariants, overall completion, and the four mutually exclusive literal caller forms with complete dispatch slots. | R1-R2 | A | Structural inventory plus parent semantic source review. | Final `SKILL.md`, changed-file diff, live-reference ledger, source-only review. | Re-read the final source-only worktree at the accepted spec digest; later rerun at the integrated source/test head. | Required; GREEN deferred. Existing mandatory-reference result remains demonstrated RED and lane classification remains a proof gap. | Wording fits now; behavior proof does not. |
| Caller owns mode/predicate/path/request/result; opened reference owns inputs/local work/return/stop without self-entry routing; ordinary placement distinguishes mandatory and conditional depth. | R3-R5 | A | Structural pointer/path proof plus cross-file semantic review. | Final `SKILL.md` and `reference-design.md`; source-only review. | Inspect caller and callee together after all source edits; later rerun the narrow callee negative at the integrated head. | Required and deferred. Callee self-entry remains a passing control with a permanent regression gap, not RED. | Source ownership fits now; pressure countercases are deferred. |
| A lane satisfies every R6 qualification; serialized qualified work remains a lane; caller authority never widens the lane maximum; parent verifies and reduces. | R6-R7 | A | Complete-field source review and ownership inspection. | Final `SKILL.md`, `reference-lanes-design.md`, glossary, source-only review. | Review both owner surfaces together; later use equal/narrower/wider and serialized artifacts at one integrated head. | Required and deferred; source keyword presence is not GREEN. | Source contract fits now; artifact-scoped qualification proof is deferred. |
| Lane, output, and tool schema families remain distinct and independently discoverable; overlapping shapes compose without duplicate authority. | R8 | A | Pointer resolution and semantic source review. | Final caller pointers and `reference-lanes-design.md`. | Resolve every final path; later rerun schema-without-lane and overlap cases. | Required and deferred. | Source classification fits now; countercases are deferred. |
| The meta reference is authoring guidance, not a global runtime packet. | R9 | A | Negative plugin-source pointer/import sweep plus semantic review. | Current plugin source and source-only review. | Rerun after source edits and after test integration. | Regression proof deferred. | Checkable in source now; broader regression later. |
| One live owner per concept; retired files absent; active source pointers and review rubrics reconciled; user changes untouched. | R10 | A + B | File/pointer/rubric inventory, hashes, and source-only review. | Filesystem, `git status`, final diff, pointer ledger, dirty-file hashes. | Run now and again after test integration. | Behavior portion deferred. | Plugin-source R10 can pass now; full repository R10 cannot. |
| Trigger, mental-model-first path, RED-before-edit, proof distinction, review, security, platform, pruning, and shipping gates remain preserved or sharper. | R11 | A + B | Accepted-spec diff review now. | Final source diff and source-only review reduction. | Refresh coverage for any source edit after review; final behavior proof uses the integrated head. | Passing equivalence and focused regression deferred. | Source preservation fits now; behavior preservation later. |
| No deferred or unrelated path changes during this slice. | Goal boundary | Parent | Status/diff/hash proof. | `git status`, `git diff --quiet -- tests/skills`, two SHA-256 guards. | Check before edits, at integration, and at handoff. | Not applicable. | Fully checkable now. |

Traditional product unit, integration, smoke, and e2e layers are not applicable to this Markdown-only source checkpoint. The later permanent pressure suite is the accepted behavior layer for this skill. Static/plugin validators remain structural proof only.

## Vertical Slice A: Authoring Contract And Single-Owner Reference Cutover

Behavior/capability: an author can scan `SKILL.md`, understand the body contract and four caller forms, and route ordinary reference depth versus lane/shared-shape depth without reconstructing the model from retired peer manuals.

Write scope:

- edit `SKILL.md`, `reference-design.md`, and `glossary.md`;
- add `reference-lanes-design.md`;
- delete `workflow-topology.md` and `schema-design.md`.

Implementation obligations:

1. Strengthen the `Great Skill Frame` and main-path workflow so `SKILL.md` states the flexible authored-body content contract: mental model/stance, scan-visible all-run spine, checkable local completion, always-needed steering/invariants, reference calls, complete lane dispatch when handed to a subagent, and overall completion boundary.
2. Absorb the useful ordinary topology rules into the always-loaded body: branches require observable work-changing predicates; returns are concrete; order exists only when it changes behavior; weak predicates/returns/completion are strengthened.
3. Add the exact always-loaded grammar:

   ```text
   MUST load `<reference>` and return `<result>`.
   IF `<predicate>`, load `<reference>` and return `<result>`.
   MUST dispatch `<lane>` to a subagent using `<packet>`.
   IF `<predicate>`, dispatch `<lane>` to a subagent using `<packet>`.
   ```

   Keep `load` and `dispatch` semantically distinct and each call site mutually exclusive.
4. Make each dispatch caller name its lane, bounded packet with prerequisites/dependency state, lane reference, parallel-safety basis, instance authority bounded by the reference maximum, expected complete/partial/blocked receipt, and parent verification/reduction point. State that eligible overlap may exist but actual scheduling may serialize.
5. Rewrite `reference-design.md` around ordinary placement and the caller/callee split. Keep the caller's all-run contract visible while permitting coherent dense detail behind `MUST load`. Prohibit only callee self-entry routing, not expected inputs, local conditional procedure, or nested calls.
6. Add `reference-lanes-design.md` with title `Reference Lanes And Shared Shapes`. Preserve all nine R6 qualifications, readiness waves, maximum versus instance authority, complete/partial/blocked receipts, parent authority, parameterized-versus-mission-specific lanes, the three schema families, consumer-first extraction, overlap composition, single-use locality, and JSON Schema only for machine-validated structure.
7. Update glossary definitions for reference load mode, execution shape, mandatory reference, branch, lane, lane receipt, parent reduction, maximum/instance authority, readiness wave, and the three schema families. Keep operational rules with their owning body/reference.
8. Remove the two retired references in the same patch. Do not add stubs, aliases, or duplicate ownership.

Local checkpoint:

- all six file operations form one coherent owner cutover;
- the new title and all required concepts are present and semantically connected;
- all final live reference paths resolve;
- no active plugin-source pointer names a retired file;
- no runtime skill imports the new meta reference;
- parent semantic readback maps R1-R9 and the source-owned part of R10-R11 to current lines.

Split/replan if unique retired guidance has no accepted owner, the combined advanced reference cannot keep non-lane schema guidance independently discoverable, complete R1.6/R6/authority semantics conflict, or an in-scope structural failure requires an out-of-scope edit.

## Vertical Slice B: Review Enforcement

Behavior/capability: pre-implementation and implementation reviewers accept compliant `MUST load` extraction while rejecting hidden caller obligations, vague or incomplete calls, callee self-entry, lane misqualification, authority widening, stale owners, and schema authority drift.

Write scope:

- edit `skill-spec-review.md`;
- edit `skill-implementation-review.md`.

Implementation obligations:

1. Update the spec-review rubric to judge the explicit authored-body contract, all four literal caller forms, ordinary caller/callee ownership, all R6 qualifications, serialized-lane classification, authority boundaries, parent reduction, and shared-shape consumer ownership.
2. Replace `all-run material stays inline` with the precise rule: caller-owned obligation, order, decision, required return, invariant, and completion remain visible, while coherent detailed all-run procedure may live behind `MUST load`.
3. Update implementation review to cover every changed/new/deleted source file, complete call sites, single ownership, retired-path absence, lane qualification, authority widening, schema consumer fit, and proof quality.
4. Preserve the existing `skill-review-output-schema.md` pointer, parent-reduction authority, RED-before-edit/GREEN-before-ship distinction, and targeted-retest loop. Do not duplicate lane execution mechanics in the rubrics.

Local checkpoint:

- both rubrics enforce the same contract Slice A implements;
- no stale blanket inline rule or retired path remains;
- review output ownership remains unchanged;
- behavior rows are explicitly deferred/unverified in the source-only review.

Split/replan if enforcement requires editing the shared review-output schema, tests, or another out-of-scope file; if the rubric starts copying full execution procedures; or if Slice A changes an accepted ownership boundary.

## Execution DAG

```text
G0: re-anchor accepted spec/review, branch/HEAD, worktree status,
        test-surface cleanliness, and unrelated dirty-file hashes
  |
  +-- G1 lane A (high): authoring contract and owner cutover
  |     write: core SKILL.md + ordinary/advanced references + glossary
  |     delete: workflow-topology.md + schema-design.md
  |
  +-- G1 lane B (high): review enforcement
        write: skill-spec-review.md + skill-implementation-review.md
  |
G2 atomic integration:
  parent verifies exact 5 edit + 1 add + 2 delete boundary,
  reconciles semantics, resolves pointers, and checks preservation
  |
G3 source structural validation:
  quick validator + path/pointer inventory + whitespace/diff checks
  + optional shared Claude plugin validation, source-attributed
  |
G4 source-only implementation-review-swarm:
  two read-only perspectives, every changed/new/deleted source accounted for,
  behavior proof explicitly deferred
  |
G5 checkpoint handoff:
  source-only checkpoint complete; goal stays open for test integration
```

The two write scopes are disjoint and may execute in parallel after G0. Neither lane may checkpoint independently: the hard cutover becomes valid only after G2. If parallel execution is unavailable, run A then B without changing the proof or atomic integration boundary.

## Execution And Integration Gates

The canonical execution labels are `G0` through `G5`. Planning-lane evidence used `C0` through `C4`; interpret that older evidence only through this mapping: validation `C0 -> G0`, `C1 -> G2`, `C2 -> G3`, `C3 -> G4`, and `C4 -> G5`. `G1` is the plan's bounded source-authoring wave. Final receipts use only `G0` through `G5`.

### G0: Re-anchor Before Source Writes

Run from the repository root:

```bash
shasum -a 256 docs/specs/2026-07-13-skills-creation-body-reference-lanes/2026-07-13-skills-creation-body-reference-lanes.md
shasum -a 256 tmp/spec-workflows/2026-07-13-skills-creation-body-reference-lanes/skill-spec-review-reduction.md
rg -n '^verdict: great$|^implementation decision: accepted-to-implement$' tmp/spec-workflows/2026-07-13-skills-creation-body-reference-lanes/skill-spec-review-reduction.md
git status --short --branch
git rev-parse HEAD
git status --short tests/skills
git diff --quiet -- tests/skills
shasum -a 256 plugins/shravan-dev-workflow/skills/skills-creation/references/platform-mechanics.md plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md
```

Record the exact HEAD, accepted-spec digest, and accepted-review digest. Both G1 lane receipts must repeat those three identities; reject a receipt if any identity differs from G0. Stop and replan if the accepted digests, review verdict/decision, allowed boundary, test cleanliness, or dirty-file hashes differ.

### G1: Execute The Two Bounded Source Lanes

- Each lane receives the accepted spec, accepted review reduction, this plan, exact file scope, non-goals, required content checklist, and a `complete | partial | blocked` receipt that repeats the G0 HEAD/spec/review identities.
- Lane authority is limited to its named Markdown paths. No lane may edit tests, shipping, goal-state, plan, or dirty user files.
- The parent re-reads each returned file and verifies every candidate claim; subagent completion is not plan completion.

### G2: Atomic Parent Integration

- Build a reproducible scoped delta ledger before judging the count:

  ```bash
  git status --short -- plugins/shravan-dev-workflow/skills/skills-creation
  git diff --name-status -- plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md plugins/shravan-dev-workflow/skills/skills-creation/references/glossary.md plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md plugins/shravan-dev-workflow/skills/skills-creation/references/skill-implementation-review.md plugins/shravan-dev-workflow/skills/skills-creation/references/workflow-topology.md plugins/shravan-dev-workflow/skills/skills-creation/references/schema-design.md
  git ls-files --others --exclude-standard -- plugins/shravan-dev-workflow/skills/skills-creation
  ```

- Classify every scoped path against an allow-list: the five planned edits, one planned untracked addition, and two planned deletions. List `plugins/shravan-dev-workflow/skills/skills-creation/references/platform-mechanics.md` separately as preserved pre-existing user state. Reject every other scoped path.
- Confirm the implementation delta is exactly five edits, one addition, and two deletions; do not count the preserved `references/platform-mechanics.md` modification as implementation work.
- Review `SKILL.md`, ordinary reference, advanced reference, glossary, and both rubrics as one behavior route.
- Resolve live destinations directly with filesystem checks and record one row per call as `caller anchor -> literal destination -> test -f exit -> result`.
- Confirm retired files are absent, no compatibility owner remains, and no runtime skill imports the meta reference.
- Recheck `tests/skills` and the two dirty-file hashes.
- If a finding requires an out-of-scope edit, stop at the scope gate rather than expanding.

### G3: Source Structural Validation

Run from the repository root. These commands prove structure and source ownership only.

```bash
uv run --with pyyaml python "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" plugins/shravan-dev-workflow/skills/skills-creation
git diff --check -- plugins/shravan-dev-workflow/skills/skills-creation
test -f plugins/shravan-dev-workflow/skills/skills-creation/references/reference-lanes-design.md
test ! -e plugins/shravan-dev-workflow/skills/skills-creation/references/workflow-topology.md
test ! -e plugins/shravan-dev-workflow/skills/skills-creation/references/schema-design.md
rg -n 'workflow-topology\.md|schema-design\.md' plugins/shravan-dev-workflow --glob '!docs/changelog/**'
rg -n 'all-run material stays inline' plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md plugins/shravan-dev-workflow/skills/skills-creation/references/skill-implementation-review.md
rg -n 'reference-lanes-design\.md' plugins/shravan-dev-workflow/skills | rg -v '^plugins/shravan-dev-workflow/skills/skills-creation/'
```

The three final `rg` checks are negative controls: expected result is no output and exit `1`. Historical repository changelogs are outside the `plugins/shravan-dev-workflow` active-source scope and remain unchanged. For live destinations, use the G2 row format and require `test -f` exit `0`; a regex match alone is not path-resolution proof.

Then perform parent-owned semantic inventories:

- map `SKILL.md` to R1-R2 and each final reference call to a resolved path;
- map `reference-design.md` to R3-R5;
- map `reference-lanes-design.md` to every R6 qualification plus R7-R9;
- confirm no active plugin-source pointer uses a retired filename and no blanket `all-run material stays inline` rubric remains;
- scan every changed/new Markdown file for trailing whitespace because `git diff --check` does not cover untracked files;
- run `claude plugin validate .` as optional shared-source structural proof. If it fails because of an unrelated dirty file or environment issue, report that source; do not edit outside scope.

### G4: Source-Only Implementation Review

Use `implementation-review-swarm` with `skills-creation/references/skill-implementation-review.md` as the skill-specific rubric.

- Review perspectives: `fresh-perspective + local-lane`; outside-model not requested.
- Cover every edited, added, and deleted source file.
- Verify the accepted spec and user boundary, single ownership, pointer strength, compactness, lane qualification, authority precedence, rubric cutover, and preservation of existing gates.
- Mark pressure behavior rows `unverified/deferred`; this review can authorize only the test-integration transition.
- Accepted source findings return to the owning lane. After every fix, rerun the affected local lane checkpoint, G2 atomic integration, G3 structural validation, test/dirty guards, source-diff identity, and refreshed changed-file review coverage before returning to G4 reduction.

### G5: Source Checkpoint Handoff

Record:

- accepted spec digest and source diff identity;
- changed/new/deleted file ledger;
- structural commands with exit codes/results;
- live-reference and retired-pointer receipts;
- source-only review reduction;
- unchanged test surface and dirty-file hashes;
- deferred behavior rows and later workflow.

Checkpoint status must be exactly: `source-only checkpoint complete; goal remains open for test integration`.

## Later Integration Gates, Not Executed By This Plan Slice

1. Integrate the separately developed `tests/skills` changes and re-anchor them to the same accepted spec and current source head.
2. Verify permanent artifact-section assertions for all eleven behavior cases, every R1.6 one-at-a-time omission, all R6 qualifications, serialized lanes, authority equal/narrower/wider, and the narrow callee negative.
3. Run assertion-engine unit/type validation, focused RED/GREEN pressure cases, and `tests/skills/run-skill-pressure-tests.sh --fast`.
4. Run fresh final implementation review over integrated source plus behavior proof.
5. Complete version/changelog/package validation, then `implementation-pr-wrapup` for a ready but unmerged PR.

## Recovery And Stop Conditions

- No destructive git operation is part of this plan. Fix accepted source findings with scoped patches and rerun the affected local checkpoint plus G2-G4.
- If a required source proof cannot pass without touching deferred or dirty surfaces, stop and return the blocker; validation does not expand scope.
- If the implemented wording contradicts the accepted spec or reveals a missing design decision, stop implementation and reconverge before further source edits.
- Source-plan completion is G5, not goal completion. The active goal remains open until test integration, behavior proof, final review, and PR readiness are proven.

## Open Questions

None block the source slice. Exact test fixture names, artifact markers, assertion mechanics, and focused behavior commands belong to the separate test plan and integration phase.

## Phase Recommendation Footer

```text
phase_result: complete
evidence: this plan, plan ledger, four planning-lane artifacts, accepted spec and review reduction
recommended_next_workflow: shravan-dev-workflow:implementation-execute-plan
recommended_transition_reason: the reviewed plan will define a bounded source-only cutover with explicit proof and preservation gates while leaving behavior integration open
```
