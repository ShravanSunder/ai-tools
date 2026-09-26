# Domain model and through-line in design

Revision 2 (Revision 1 plus its one bounded remediation after two `targeted-revision` reviews). Main-authored multi-run skill-change spec. Owner plugin: `shravan-dev-workflow`. Supersedes runs R2-R4 of `docs/wip/skills-authoring/2026-09-17-domain-model-and-trace/proposal.md` (its R1, `spec-design` entities, merged in #79). The old R2/R3 branches (`feat/program-design-entity-trace-gates`, `feat/spec-program-review-trace-confirmation`) are salvage sources only; they are not merged.

## Owner's core needs (2026-09-25)

1. The domain is defined properly: nouns have one owner.
2. Boundaries hold: decoupling and separation of concerns, with a clear home for each thing.
3. The line holds: what is in the Requirements is referenced in the Specification and used in the Program Design, checkably.
4. The documents are human-readable: diagrams lead, tables and code follow.

Out of scope from the old R2-R4 work: truncated-read re-read rule, gate byte-offset test, size cap, review receipt field, orchestrator routing change, mandatory fenced Zod.

## Problem and evidence

Observed failure: Codex session `01a08255-70ed-7f00-9f3e-8e40c13c1d92` (2026-09-08/09, `relay-coordination-platform`, `orchestrator-design` -> `program-design` -> `spec-program-review`). Detailed analysis: the superseded proposal's P1-P6 table and `~/dev/memory-logs/skills/authoring/2026-09-17-domain-model-and-trace/`.

Current `main` (4d124d72), verified 2026-09-25 (paths under `plugins/shravan-dev-workflow/skills/`):

- `spec-design` defines entities with `E` identifiers (R1); `shared-references/requirements-specification-program-design.md:25,82` says Program Design consumes them. No `program-design` text binds an entity to an owner, home, or shape: "entity", "data model", and "wire shape" appear nowhere under `program-design/`.
- The design's opening chain (`program-design/SKILL.md:16-28`) goes alternatives -> selected composition -> component, with no entity step, and "Select the target composition" (step 5, `:142-150`) builds the component tree.
- The trace is prose. The requirement/design/proof view (`:285`) carries requirement, scenario or observable contract, realization owner, and proof seam, with no interface or data column; `:57` calls the requirement-realization inventory "returned workflow state, not narrative sections"; `:226` keeps crosswalks private; so a paragraph tagged "(R1)" passes as realization.
- `spec-program-review/references/reviewing-three-artifact-design.md:13-15,37` asks for bidirectional traceability and term agreement in words, with no table to check against; `reviewing-program-design.md:10-26` (loaded by program-only and three-artifact review) has no binding or shape check.
- The owner confirmation exists (`program-design/SKILL.md:240`, step 15) and returns `decision-needed`; when the skill is read whole, it already stopped the turn in the old baseline (salvage changelog `docs/changelog/2026-09-25-program-design-entity-binding.md:8`). The real gaps: it does not show the entities, their homes, or the trace, and step 16 ("Obtain fresh local review", `:246`) reads as the next step of the same run. `orchestrator-design` preserves a producer's owner stop (`:8,:43,:45`).
- Required Views with Mermaid rendering and generated visuals exist (`:214-224`, table at `:272-287`); a data/event flow row exists at `:282`.

## Success definition

Given a Specification with Requirements (`U`), obligations (`R`), and entities (`E`), an agent following `program-design`, unprompted:

1. leads with diagrams: an entity -> home map, and the existing data/event flow view naming the shape on each boundary-crossing edge;
2. binds every `E` after generating alternatives and before composing components: semantic owner, package or module home (`new | modified | existing`, with the code name on `existing` rows), schema/type home, shape at each boundary it crosses, `persisted | derived | cached`, and the type convention followed (or `none found`);
3. writes contracts in the repository's type conventions, found in `AGENTS.md`/`CLAUDE.md`, rule and language-rule files, or the pattern existing schemas in touched packages use (for example a Zod discriminated union with `z.infer`); with none found, fields, nullability, and discriminant; results and decisions are closed variants with bounded reasons;
4. derives components from the bindings; a design-only concept names the `E` or `R` it serves; an existing type with a different name is a binding, not a synonym; an identity or cardinality mismatch with existing code is a structural choice (`decision-needed` when it exceeds the goal boundary); only a missing noun or conflicting meaning returns `specification-gap`;
5. carries one trace table in the artifact, the requirement/design/proof view: `U · R · E · owner · interface · shape and home · state · failure · proof`, one row per requirement; the `R` cell names its scenario or observable contract; `U` and `E` may read `none: <why>` and `E` may list several ids; the owner and interface cells of a cross-cutting row cite the mechanism owner; `gap: <why>` marks missing design only; the returned coverage disposition is derived from these rows;
6. ends the turn by showing the owner the binding table, the trace table, one entry-to-effect path, and "deviations and unresolved decisions: none | list", returning `decision-needed` (structural-realization confirmation); review starts only on a later turn after the owner replies. An explicit owner waiver is recorded as `structural-realization confirmation: waived by owner`, with the same views shown; a packet claim, goal-boundary confirmation, or silence is not a waiver.

An agent following `spec-program-review` checks bindings, shapes, and closed variants in program-only and three-artifact review; in three-artifact review it also checks the trace table row by row and that each term means the same in all three artifacts, routing a design noun with no entity as `Route: spec-design` and a synonym as `Route: program-design`; it accepts `waived by owner` as the confirmation.

## Decisions (owner may strike any row)

| # | Decision | Rationale |
| --- | --- | --- |
| D1 | The Specification defines the domain; Program Design realizes it and never renames it in prose. Code identifiers appear in shape and home cells. | Owner; review finding on existing-code names. |
| D2 | New step 5, "Bind the domain model", after "Generate viable alternatives" and before "Select the target composition" (renumber 5-17 to 6-18); the opening chain gains `-> entity binding` after the alternatives line; the `components-ownership-interfaces.md` load moves to step 5 and the binding table is its first return. | Owner: "how do you start a design with a data model?"; review blocker: binding after composition is the component-first failure. |
| D3 | Code-shaped data in the repository's type conventions, introduced by progressive disclosure: diagram, then binding table, then code shape. `components-ownership-interfaces.md` carries one filled example (binding row plus its code shape) as the positive output template. | Owner, 2026-09-25; the old binding scenario never produced code shape without a template. |
| D4 | The trace table replaces the `:285` view's columns and predicate becomes "any file-backed design"; `:57` and `:226` point to it; the coverage disposition (`:234`, `artifact-and-self-review.md:65`) is derived from its rows. `proof-architecture-and-traceability.md` is its single builder. | Owner: requirements visibly carry into the design; review: one home, no competing owners. |
| D5 | Package detail stops at the binding table; exact files, order, and commands stay with planning. | Owner: "we don't need to be pedantic on the packages". |
| D6 | Owner gate, simple: step 15's show-list becomes binding table, trace table, one entry-to-effect path, and deviations; its complexity and coverage items move into those tables; `artifact-and-self-review.md:97` cuts over; step 15 ends the turn; step 16 runs only on a later turn after the reply. `decision-needed` (`:66`) gains the missing-confirmation case. Basis: user-directed intent. | Owner, 2026-09-25 ("keep simple"). |
| D7 | Owner waiver: an explicit "skip the gate, just review" is recorded as `waived by owner` and review proceeds; `spec-program-review` accepts it. | Main's default while the owner was away (decide-and-record); owner may strike. |
| D8 | Views: extend the existing data/event flow row (`:282`) to expose the shape on each boundary-crossing edge; add one row, entity -> home map (any file-backed design with a new or modified contract); the trace table is the requirement/design/proof row. | Owner need 4; review: no duplicate data/event row. |
| D9 | No repo glossary file; the entity section lives in each Specification. | Owner. |
| D10 | Phases name no orchestrator; review findings use the existing `Route:` vocabulary. | Between-levels DAG rule; review finding. |
| D11 | Salvage, don't merge: port text and scenarios from the old branches only where they fit these decisions, rewriting their criteria (conventions-conditioned shape, U column, new gate list). | Old branches conflict in 11 files and carry dropped assumptions. |

## Runs in sequence

| # | Target | Class | Surfaces | Proof |
| --- | --- | --- | --- | --- |
| 1 | `program-design` | behavior-changing | trigger: `"Use when defining or revising structural How and its views: binding Specification entities to owners, homes, and schemas, then components, interfaces, state, flows, failure, trust boundaries, and proof seams. Not for defining what entities mean (spec-design)."` (259 characters); main path: D2 step and chain, D4 trace cutover in step 14 and at `:57`/`:226`/`:234`, D6 gate and `:66`, D8 view rows; depth: entity binding, convention discovery, existing-code rule, closed variants, and the filled template in `components-ownership-interfaces.md`; trace builder and `none:`/`gap:` rules in `proof-architecture-and-traceability.md`; shapes on edges in `state-calls-and-flows.md`; binding, trace, and term checks plus the `:65`/`:97` cutover in `artifact-and-self-review.md` | RED on current `main`, then GREEN: `bind-entities-before-components` (criteria rewritten per D3, D11) and `carry-durable-trace-table` (U column); `stop-for-owner-before-review` as a control or regression check, no improvement claim; `choose-helpful-diagrams` criterion rewritten for the entity -> home row and shapes on edges; descriptions-only trigger evaluation reusing the old eight prompts plus "bind these entities to packages and schemas" (true) and "define what a Reminder is and its states" (-> `spec-design`) |
| 2 | `spec-program-review` | behavior-changing | main path: three-artifact mode names the trace-row and term checks; confirmation check accepts `waived by owner`; depth: binding, shape, and closed-variant checks in `reviewing-program-design.md`; trace-row and term checks with `Route:` vocabulary in `reviewing-three-artifact-design.md` | `check-trace-table-rows` RED then GREEN; `catch-noun-leak` as a control; one program-only case for a missing binding, or the gap named |

## Authoring basis and proof plan

Basis: observed failure (CX session) for D2-D4 and D8; user-directed intent for D3's template, D6, and D7. Each ported scenario reruns against current `main` for a fresh RED before any improvement claim. Subject and judge: `gpt-6-luna` with `SKILL_PRESSURE_CODEX_PATH` (owner rule). While Codex credits are unavailable, behavior claims read "drafted from intent; not yet evaluated". Named risk: code shape never passed in the old runs; D3's template is the steering answer, unproven until the rerun. Structural proof: `pnpm --dir tests/skills run test`, typecheck, `claude plugin validate .`, and `rg -n 'orchestrator-(design|implementation-goal)' plugins/shravan-dev-workflow/skills/{program-design,spec-program-review}` returning nothing.

## Coordination

- Branch `feat/domain-model-trace` from `main` at 4d124d72; one PR for both runs.
- Next minor of `shravan-dev-workflow`; one changelog entry.
- Old branches stay local until the owner decides to delete them.

## Non-goals

Orchestrator changes; review receipt fields; truncated-read handling (named residual: step 15 sits past the byte offset where the CX read truncated, and this change adds text above it); size or offset tests; repo glossary; file-level design detail; changes to `spec-design`.

## Spec-review record

- Revision 1 (62240eaa): Opus 5.5 🔎 Review Sidekick — `targeted-revision`, `revise-first`, three bounded blocker overrides (bind placement, trigger/view proof, competing homes) and 12 other findings; Grok 4.6 high 🔎 Review Sidekick (ACPX cursor; Codex out of credits, so no Sol/Astra) — `targeted-revision`, `revise-first`, no overrides, seven findings. All accepted except each lead's rejected list.
- Revision 2 (8dfee2a1): Opus lead verified all 15 findings resolved, verdict `great`, `accepted-to-implement`. Its three minor residuals are implementation notes: (1) the description boundary reads "Not for defining what entities mean or other Why/What (spec-design)"; (2) after the D2 renumber the gate and review are steps 16 and 17; (3) an owner waiver given up front lets review run in the same turn after the three views are shown. Grok lead verified F1-F7 resolved, verdict `great`, `accepted-to-implement`, with one implementation note: step 15's completion line (`program-design/SKILL.md:244`) and the completion blocker at `:331` accept `waived by owner` so a waived run can reach `locally-ready`. Its note that the record swaps the two leads is rejected: the ACPX session ran `grok-4.6` and the Opus review was a separate Cursor session. **Accepted to implement, 2026-09-25.**
