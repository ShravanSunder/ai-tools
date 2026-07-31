# Run C — program-design Human-Checkable Structural How

Date: 2026-07-31
Status: proposed; pending `skills-creation` review
Classification: behavior-changing, unscoped update to one named skill
Target skill: `program-design`
Authoring basis: observed failure
Reproduction: reproduced in `sources/2026-07-31-perseus-human-document-review.md`, `sources/2026-07-31-artifact-fluff-prevention.md`, `sources/2026-07-31-perseus-requirements-fidelity-loss.md`, `sources/2026-07-31-scope-inflation-session-analysis.md`, and `sources/2026-07-31-missing-call-path-deltas.md`; user direction supplies the accepted success definition
Proof posture: static and manual proof in this changeset; pressure scenarios authored but model execution deferred by explicit user direction as an accepted behavior-proof gap

## Promise and Success

This update helps agents produce a progressively disclosed, human-checkable executable model of structural How. Shared rendering, scratch exploration, plain language, and pruning support that model without replacing its owners, interfaces, call effects, state, failure behavior, tradeoffs, or proof seams.

Success means a human can follow how each authoritative obligation becomes owned runtime behavior, compare the current and proposed entrypoint-to-effect call paths, identify every changed owner/call/state/effect edge, confirm or correct the component boundaries, simulate state and material failures, understand the tradeoffs, and see where proof observes the result. A first design shows the proposed path and explicitly names that no predecessor exists. The design starts from the confirmed goal boundary and existing foundation, spends only the accepted complexity, and treats structural categories as questions to inspect rather than subsystems to manufacture. Every fired structural view exposes the fields needed for that understanding; every heading, paragraph, list, table, component, interface, state, mechanism, and view helps the human confirm, correct, decide, or trace something. Workflow, acceptance, and PR lifecycle state stay out of durable design prose. The trigger, structural-How identity, view ownership, call-stack analysis, and workflow remain intact.

## Trigger Surface

Keep the skill model- and user-invocable. Use this literal frontmatter:

```yaml
description: Use when defining or revising structural How—the internal architecture—or its required structural views and diagrams, against settled observable obligations, including components, ownership, internal interfaces, state, calls, flows, failure/recovery, concurrency/consistency, compatibility/cutover, trust boundaries, or proof seams. Not for authoring Why/What, in-chat explanation of settled architecture with no program-design authoring, pure format-only maintenance of settled program-design artifacts, review-only requests, implementation task planning, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
```

Why/What view requests route to `spec-design`; in-chat explanation with no durable program-design authoring routes to `tui-presentation`; pure format-only maintenance of settled program-design artifacts routes to `docs-maintain`.

## Main-Path Surface

At entry, require the governing specification plus the boundary-check-1 result accepted under Run B's `authority-and-problem-framing.md` contract. If the specification does not carry or point to that result, return the exact specification gap and `spec-design` route before target structure is selected; `program-design` does not reconstruct Why/What authority. Program design may clarify structural feasibility; it may not silently replace the accepted problem with a larger one.

Classify the requested correction as requirements/Why/What, structural How, or both. A request to remove unrelated implementation machinery is a How correction unless the owner explicitly changes the governing outcomes or scope. For a How-only correction, consume Run B's accepted requirements set and recovery result as fixed input; do not rebuild it from the current pair. Reuse its identifiers and trace links rather than creating a second ledger. When both change, return to `spec-design` first and resume structural How only after the revised Why/What is settled. Do not edit or narrow governing requirements/specification to make a smaller program design easier to write.

For a semantic correction to an existing structural view, reload current-system evidence and the governing obligation, re-run the affected ownership/interface/call/state/flow decision and view predicate, update affected trace links, and run artifact self-review. Skip unrelated design stages unless the correction changes their source, owner, or invariant. Pure rendering-format changes remain `docs-maintain` work.

Start target design with the existing-system path and the minimal-change realization. For each design dimension—components, interfaces, state, calls and flows, failure/recovery, concurrency/consistency, compatibility/cutover, trust, and proof—record one of these judgments in working state or the returned self-check:

```text
required by a named specification obligation
satisfied by the existing system and linked to its evidence
not applicable to this change, with the reason when omission could be mistaken for a gap
unresolved and requiring evidence or an owner decision
```

These are applicability judgments, not mandatory artifact sections. Never invent a store, protocol, retry policy, migration, governance surface, or other subsystem merely to make a category non-empty. The durable design contains only the applicable structural model a human needs to implement and verify the confirmed obligations.

Keep the existing Required Views names as the sole structural-view vocabulary. Tighten the existing `call graph/sequence` predicate and change two must-expose contracts so the table makes behavior already required elsewhere visible in the artifact:

- `call graph/sequence` fires when the change adds, removes, or changes a material runtime entrypoint-to-effect path, when that path is needed to explain how a material obligation works, or when control crosses owners or async boundaries. It exposes the source-anchored current path and proposed path, or proposed-only with the explicit absence of a predecessor; entrypoint, callers/callees, owning component, sync/async/event edges, state reads/writes or external side effects, result/error propagation, evidence anchors for current behavior, and added/removed/changed/intentionally-unchanged edges;
- `requirement/design/proof trace` additionally exposes the immediate specification scenario or observable contract between the requirement and structural owner.

Do not add an `integrated architecture`, timeline, current-versus-target, or call-stack-delta view name. An integrated overview composes the smallest already-fired canonical views; timeline, current-versus-target, and call-stack delta are rendering forms of the existing call, state, or flow views, not new view tokens.

In the artifact-authoring stage, load shared rendering before the local artifact reference only when at least one predicate fires:

```text
IF one or more Required Views predicates fire, load `../../shared-references/diagram-rendering-and-fallbacks.md` and return the selected medium, fallback decision, semantic-preservation result, and visual-check result for each fired structural-view predicate.
```

MUST load `references/artifact-and-self-review.md` with the selected predicates, required semantic fields, and shared rendering results—or the explicit empty view decision when no predicate fires—and return the artifact decision, artifact identity, trace/navigation result, view-verification result, and pruned elements. The stage continues only when every fired predicate has a rendered view whose required semantic fields survived. Diagrams do not replace interface, failure, recovery, or normative prose.

Make the call path a visible design output rather than buried analysis. For every material runtime-behavior group, current-system and state/call/flow passes return a call-path delta: the source-anchored current entrypoint-to-effect chain; the proposed entrypoint-to-effect chain; and the added, removed, changed, or intentionally unchanged owner/caller/callee/state/effect/result-error edges. Requirements that share one path may cite the same delta. A first design returns the proposed path and the explicit fact that no predecessor exists. A raw runtime stack trace is evidence, not the design output; normalize it into a call graph, sequence, or compact call tree an implementer and human reviewer can follow. A runtime-behavior design cannot return ready with components and interfaces but no applicable visible call path.

For every proposed new component, state store, identity, interface, contract, dependency, migration, operating surface, or proof mechanism, name the specification obligation it serves, what breaks if it is removed, why the existing foundation cannot supply it, and which part of the complexity budget it spends. Delete the element when no confirmed obligation breaks. Complete an underspecified contract only after this existence test; do not let a reviewer's request for more detail preserve an unnecessary mechanism.

After each deletion or simplification pass, re-run coverage against the accepted requirements set. The allowed reduction is many mechanisms to fewer mechanisms while preserving complete What. A six-skill requirement/specification set realized by an Upload-only design is a scope regression even when the remaining Upload call path is excellent. If current governing files have themselves been narrowed during the correction and conflict with boundary check 1, stop and return the authority conflict instead of designing against the convenient narrowed pair.

Bind the governing specification and its user-requirements source separately from the current-system, constraint, platform, and external-source inventory. Each source that a human must verify carries an inspectable location, identity, and current applicability. Author top-down: begin with the smallest integrated overview—composed from already-fired views or concise prose when no view predicate fires—that lets a human explain how the specified behavior works, then reveal components, interfaces, call paths, state, flows, failure/recovery, concurrency, cutover, trust, and proof detail. Link each specification requirement to its realization; do not repeat the customer need or observable contract as new program-design prose.

Trace through the immediate specification contract rather than jumping from raw customer requirements directly to components. Use the smallest useful chain for the domain, for example `customer job -> requirement -> scenario/observable contract -> structural owner -> proof`. The detailed type, failure, and proof sections remain authoritative after the overview.

After the current-system model exists and before alternatives or target structure are selected, substantial or uncertain work may stage source notes, current/target comparisons, alternative structures, prototype component/call/state/failure views, and temporary requirement→design→proof crosswalks in private working state, the repository's ignored scratch convention, or `tmp/design-workflows/<date>-<slug>/`. The alternatives and composition stages first test the existing-foundation/minimal-change realization. Add a larger architecture alternative only when evidence shows the minimal path cannot satisfy a named obligation or accepted quality constraint. The working comparison names selected and discarded structures with evidence anchors, requirement consequences, complexity cost, and the crux that decided between them. Scratch persistence is optional; the comparison result is not. Promote only the selected design and its evidence anchors. Quick work keeps the comparison in working state instead of creating staging files, and the final program design must be understandable without scratch.

Treat new durable identity or history, persistence, certification or governance, a control plane, an external service, cross-run state, or a broad migration as examples of material scope expansion. They are allowed when a confirmed requirement needs them. When boundary check 1 did not authorize that kind of machinery, stop selection and ask the owner to expand the complexity budget rather than making the addition look inevitable through architecture prose.

Update the all-run Terminal Contract, stage-1 target classification, and completion blockers together. Target classification, artifact/specification identities, governing-source identities, source and review coverage, integration self-check, readiness, and other run state are required fields of the returned result. Record target classification there, not as artifact prose. Compact durable metadata may identify the artifact and governing sources for lookup but cannot satisfy the return contract. Block completion when required return state is missing or when authoring, review, acceptance, or PR workflow narration appears as program-design prose.

Before returning the design to review or planning, perform boundary check 2. Show the authorized owner a compact current model: the original goal and missing pieces, reused foundation, every new component or contract, the representative entrypoint-to-effect path, complexity spent, retained non-goals, unresolved structural decisions, and deviations from boundary check 1. Ask the owner to confirm or correct the architecture. Reuse an explicit confirmation only when it covers this same current structure. The design is `decision-needed`, not ready, while confirmation or a material expansion decision is missing. Confirmation state stays in the returned result rather than a durable `Status: Accepted` field.

Boundary check 2 also reports coverage against Run B's accepted requirements set without restating or rebuilding its fields: every item is still covered, or the exact owner-authorized supersession is named. This catches scope subtraction as well as scope expansion.

## Depth Surface

Update `references/state-calls-and-flows.md` to teach the call-path delta procedure. Pair each source-anchored current entrypoint-to-effect chain with the proposed chain, or record proposed-only with no predecessor. Compare by owner and caller/callee edge; label each relevant owner, call, state read/write or external effect, and result/error edge as added, removed, changed, or intentionally unchanged. Preserve current-source anchors, explain the consequence of every removed or changed edge, allow shared requirements to cite one delta, and stop when a human can trace the effect and return path without mentally diffing separate prose and diagrams.

Update `references/artifact-and-self-review.md` so it cites the SKILL.md Required Views table without restating its predicates, then owns examples, semantic-field preservation, shared-rendering-result application, pruning, and integration self-review. Remove its duplicated selection predicates and Mermaid/table/plain-text rules.

Good output is the smallest view set that lets a reader simulate composition, compare current and proposed entrypoint-to-effect execution, locate every changed call/state/effect edge, follow the result/error return, and test the riskiest failure path. Bad output is decorative topology, prose mislabeled as a diagram, syntax selected before relationships, components with no applicable visible call path, or a rendered view missing an owner, edge, state/effect, delta, result/error path, or current-behavior evidence anchor.

Complete when each fired predicate has a semantically complete view in the selected medium, fallback has been applied where necessary, unnecessary views are pruned, each retained mechanism passes the requirement/consequence/complexity test, and the artifact remains one proportional executable structural mental model.

Extend the deletion test across every heading, paragraph, list, table, component, interface, state, mechanism, and view. Deletion is valid only when it changes no human confirmation, correction, decision, trace, failure simulation, proof path, or later authoritative lookup. Protected examples include authoritative provenance and negative space; owners, interfaces, state, calls/flows, failure/recovery policy, trust boundaries, cutover decisions, and proof seams; and the rationale, relationship, tradeoff, alternative/falsifier, or example a human needs to reconstruct and challenge the structure. Apply the same test across companion documents: shared ownership/boundary meaning has one smallest useful home and other documents link to it.

Keep target classification, source/review coverage, self-check state, readiness, and acceptance in the required returned result, not narrative sections. Compact metadata may identify the artifact and governing sources for durable lookup only when later readers or tooling genuinely consume it; it never substitutes for the result. Do not change `Status: Draft for review` to `Status: Accepted` merely to record design acceptance. Treat post-implementation documentation cleanup, PR artifact-removal instructions, release process narration, and plan sequencing as planning-owned residue. Do not remove dense load-bearing alternatives, falsifiers, ownership models, typed contracts, state machines, failure policy, or proof architecture.

Choose the clearest expression for each part of How: concise prose for one rule or rationale, a component tree for ownership/composition, a call or sequence view for entrypoint-to-effect behavior, a state table or machine for lifecycle, a flow for data/failure/recovery, a comparison table for alternatives, and a concrete example when an interface or edge case remains abstract. Every material design choice states why it exists and which tradeoff it resolves. Use plain domain words; remove jargon and formal-sounding paragraphs that add no owner, boundary, behavior, rationale, relationship, failure policy, or correction point.

Link to an upstream state contract and show only its structural realization rather than redrawing a competing state machine.

Make each heading state the question the section answers. Keep a requirement-to-design-to-proof mapping, but title it in plain language such as “How Each Requirement Works and How We Verify It,” not “Requirement realization and proof seams.” The mapping is useful; the decoding burden is not.

Remove “Architecture documentation impact” sections that merely list post-implementation documentation work or repeat the design. Move that work to the implementation plan or `docs-maintain`; retain it in program design only when documentation behavior is itself a governing system obligation. Remove “Design completion boundary” sections that repeat acceptance, review, or planning gates. Keep only the useful design check—whether a planner can proceed without inventing owners, interfaces, state, failure behavior, or proof seams—in the returned result or author self-check.

Teach the stage-14 artifact decision and trace-navigation check: the reader must be able to enter through one integrated structural overview and navigate requirement → specification scenario or observable contract → realization owner → proof seam without process notes or duplicated sibling recitals. The returned source set binds the governing requirements and specification separately from the current-system inventory rather than relying on unpinned opening prose.

Finish with the human confirmation check: after reading the design, a human can compare the current and proposed path for one representative runtime-behavior group from entrypoint through callers/callees, owner, state change or side effect, result/error path, failure/recovery behavior, and proof seam; can identify every changed edge and the requirements that use the path; can explain why the selected structure exists and what it costs; and can point to the exact assumption or boundary they would correct. For a first design, the human can follow the proposed path and see that no predecessor exists. If the design is technically complete but the human cannot reconstruct that model without decoding jargon, it is not ready.

The human confirmation check includes proportionality: the reader can identify which parts already exist, which parts are actually new, which requirement pays for each addition, which inspected categories were not applicable, and what would fail if any new mechanism were removed. A platform-shaped design for an extension-shaped requirement fails this check even when every component is internally complete.

The same check guards fidelity: the reader can account for every accepted requirement group in the design. Removing unrelated How while preserving all accepted What passes. Rewriting six governing skill contracts as one skill fails before architecture quality is considered.

The progressive-disclosure check also passes: the artifact exposes the compact `requirements -> specification -> program design` chain, starts with an integrated How, and lets the reader follow requirement → owner/interface → call/state/flow/failure → proof without first reading schemas, source inventories, or workflow state. Every link resolves to one authoritative home.

Audit every selected view for direction, timing, ownership, cardinality, and failure meaning. Source identities must include an inspectable location when a human must verify the claim.

At terminal return, consume the already-selected rendering result. Invoke `tui-presentation` only when it is the selected medium for chat output; never override an exact requested format or render a second competing view.

## Shared Runtime Reference

`plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md` owns:

- Mermaid for topology, flow, sequence, or state when durable Markdown renders it;
- Markdown tables for dense matrices, ownership, state, transition, or coverage data;
- readable fenced plain text when no renderer exists or Mermaid cannot preserve the relationship;
- `tui-presentation` for chat or terminal explanation only when visual structure helps and no exact user-requested format overrides it;
- fallback when the first medium is unavailable, malformed, unreadable, or semantically lossy;
- a visual-check result that lists the predicate, required semantic fields, chosen medium, preserved/missing fields, readability, fallback, and pass/fail.

This shared reference is also consumed by `spec-design`. It owns medium selection, fallback, semantic-preservation inspection, and visual-check procedure; each target `SKILL.md` owns view predicates and required semantics, while skill-local artifact references consume those decisions.

## Maintainer Index

Add `plugins/shravan-dev-workflow/docs/diagram-vocabulary.md` as a complete index of every current view token, altitude, runtime semantic owner, runtime rendering consumer, and accepted alias. It must register all Required Views rows and all runtime consumers. It is maintainer documentation, not runtime authority, and duplicates no procedure.

## Proof Surface

Add static checks that both runtime skill consumers load the shared reference, shared-rendering calls precede local artifact consumption, program-design retains every structural view predicate and must-expose contract in one home, the call graph/sequence predicate fires for material runtime call-path changes, `state-calls-and-flows.md` teaches current/proposed pairing and all four delta markers, every applicable call-path result carries current and proposed paths or an explicit no-predecessor case plus marked edge deltas, duplicate medium-selection prose is absent from skill-local files, the maintainer index covers every view owner/consumer, terminal output consumes the selected rendering result, artifact self-review covers every reader-facing element plus the requirement→realization→proof navigation check, applicability judgments do not require non-applicable artifact sections, every new mechanism has a requirement/consequence/complexity basis, Run B's accepted-requirements result survives simplification, semantic view-only corrections take the scaled path, and boundary check 2 occurs before review or planning. Manually preview the same current/proposed call-path delta as a durable Mermaid sequence and a chat TUI/plain-text call tree, verifying entrypoint, owners, callers/callees, state/effects, result/error propagation, evidence anchors, and all four delta markers survive; also preview a dense table view and fallback. Then reduce one platform-shaped design to the minimal existing-foundation path without changing its governing obligations. Add deferred pressure scenarios for a same-owner synchronous behavior change that must still show a visible current/proposed call path, a first design that shows proposed-only and no predecessor, components/interfaces with no applicable visible call path, a semantic structural-view-only correction, medium fallback, exact-format override, semantic preservation, bait requesting purpose/completion/PR-process sections, an existing eval-harness extension that tempts persistence/certification, a reviewer request to complete an unnecessary mechanism, and the reproduced six-skill-to-Upload-only fidelity loss. By explicit user direction, do not run model pressure tests; report behavior proof as a user-accepted deferred gap.

## Implementation Boundary

Expected changed homes: `program-design/SKILL.md`, including frontmatter, Terminal Contract, stage-1 correction classification, goal-boundary/applicability state, accepted-requirements check, the existing call graph/sequence predicate and two Required Views must-expose rows, minimal-change and mechanism-existence tests, boundary check 2, artifact call, scratch guidance, terminal chat rule, and completion blockers; `references/state-calls-and-flows.md`; `references/artifact-and-self-review.md`; the existing alternatives and composition teaching references where they own the inspected decision; optional ignored `tmp/design-workflows/<date>-<slug>/` staging guidance; new shared rendering reference; new maintainer index; AGENTS maintainer pointer; static tests; deferred scenarios; version; changelog. Do not add another structural view name, move call-stack ownership, edit `tui-presentation` or `spec-program-review`, or change retired skills.
