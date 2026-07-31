# User-Focused Requirements, Design Views, and Human-Readable Artifacts — Coordination Envelope

Date: 2026-07-31
Status: proposed coordination spec; child contracts require `skills-creation` review before implementation
Owner plugin: `shravan-dev-workflow`

## Goal

Make it easy for a human to express what they want and then verify, before planning, that the agent understood it. `spec-design` must explain the authoritative Why/What clearly enough for the human to confirm or correct the problem, users, outcomes, obligations, boundaries, and proof. `program-design` must explain structural How clearly enough for the human to confirm or correct ownership, calls, state, flows, failure behavior, tradeoffs, and proof seams. Use purpose-selected views when they make those relationships easier to see, and remove words or sections that do not help a human confirm, correct, decide, or trace something.

The customer goal remains the invariant for every later design and review decision. A proposed requirement, component, contract, mechanism, reviewer, finding, or durable document element earns its place only when the workflow can name which confirmed need it serves and what becomes false, unimplementable, unsafe, or materially harder to understand if it is removed.

Preserve the four existing identities: `discuss-pathfinding` extracts unwritten meaning, `spec-design` owns authoritative Why/What, `program-design` owns structural How, and `spec-program-review` independently reviews the current meaning and reader experience. Do not create another runtime skill.

## Problem

The current workflow names consumers but does not teach an agent how to separate user and stakeholder classes, distinguish evidence from hypotheses, force priority tradeoffs, or carry user needs into specification traceability. The current skills also select design views inconsistently: `program-design` teaches structural views, `spec-design` does not teach Why/What views, and rendering/fallback rules are duplicated across runtime files.

The authored artifacts can also mirror workflow state into durable prose: target classification, acceptance/non-acceptance, review status, companion-file ownership recitals, and planning or PR lifecycle instructions. Existing author deletion tests focus on design elements rather than every reader-facing element, while review rejects prose taste and has no focused pass for whether a human can understand and challenge the model efficiently. Humans therefore spend review effort on text whose deletion would leave the system model unchanged, while the relationships they actually need to confirm can remain buried or implicit.

Two recent design runs exposed a second failure. A small extension to an existing eval harness grew into persistence, digests, journals, certification, and governance; an observability design grew as completeness reviewers treated every category as applicable. Review concerns became requirements, each invented component created more review findings, and broad focused-lane predicates multiplied reviewers until the host hit `Too many open files`. The workflow needs to make proportionality and boundary confirmation explicit before it asks for more completeness.

A third run failed in the opposite direction. The user asked to remove unrelated Upload machinery from an overengineered program design while preserving six accepted skill-default contracts. The agent rewrote the customer requirements and specification as Upload-only, then produced a locally coherent Upload-only design. Simplification of How destroyed accepted What. Cross-document consistency and exact file identity could not detect the loss because every current artifact shared the same wrong narrowed scope.

## Target Flow

```text
unwritten user or stakeholder meaning
  -> discuss-pathfinding extracts a user-requirements record and useful user-job sequence inputs
  -> boundary check 1 confirms the goal, existing foundation, missing pieces, non-goals, and complexity budget
  -> spec-design classifies the record or an equivalent authoritative source
  -> user/stakeholder need U -> problem P -> outcome O -> requirement R
       -> observable contract C -> proof obligation V
  -> spec-design renders required Why/What views
  -> program-design renders required structural How views
  -> boundary check 2 confirms the proposed architecture still fits the accepted goal and complexity budget
  -> spec-program-review runs one complete proportional review, then only the focused follow-up needed for a concrete unresolved risk
```

## Progressive Disclosure Spine

```text
user / customer / developer / contract / library need
  who needs what, why it matters, evidence, priority, and negative space
    -> specification
       what the system must make true, why, observable behavior,
       constraints, failure expectations, and proof obligations
         -> program design
            how architecture and implementation realize it through owners,
            interfaces, calls, state, flows, failure/recovery, and proof seams
              -> implementation plan
                 work slices, order, files, commands, and delivery proof
```

Each artifact owns one level and links rather than repeats. A human starts from the smallest useful overview, then follows stable identifiers and links into the detail they need. Requirements link needs to specification obligations; the specification links requirements to observable contracts and proof; program design binds the governing specification and links its obligations to structural realization and proof. When companion artifacts exist, expose the chain once as a compact breadcrumb or map, not as repeated purpose paragraphs.

Progressive disclosure also applies inside each artifact. Lead with the smallest map that lets a human explain the model, then reveal detailed requirements, contracts, components, calls, state, failures, and evidence. Do not force the reader through source inventories, schemas, or workflow status before they can see what the artifact says.

Intermediate work may be staged without polluting the final chain. Follow the repository's scratch convention; otherwise use the ignored `tmp/design-workflows/<date>-<slug>/` for research notes, source inventories, alternative wording, prototype diagrams, temporary trace matrices, and unresolved mappings. Scratch supports authoring and review but never owns normative meaning or becomes required reading. Promote only accepted meaning into the requirements, specification, or program design under `docs/specs/`.

## Goal Boundary and Complexity Budget

The first boundary check happens after requirements discovery and before specification or program design can widen the solution. It shows the authorized owner a compact model of the customer, developer, contract, or library goal; affected classes and outcomes; existing behavior or foundation that should be reused; the actual missing capabilities or observable differences; explicit non-goals; unresolved decisions; and the complexity budget. The owner confirms or corrects that model. Silence is not confirmation, while an explicit confirmation of the same current model may be reused instead of asking ceremonially again.

The complexity budget is a design constraint, not a universal number. It states the expected change shape and the kinds of new machinery that would require renewed approval. For the customer-eval incident, an honest budget would have been “extend the existing Voyager/Vitest path with scenarios, synthetic data, truth, assertions, semantic judgment, and the two proven seams; no run database, cross-run history, certification, or governance platform.”

The second boundary check happens after the integrated program design exists and before review or planning treats its architecture as the accepted problem shape. It shows the owner the reused foundation, every new component or contract, the representative entrypoint-to-effect path, the complexity spent, retained non-goals, and every deviation from the first boundary. The owner confirms or corrects the architecture. Review may still find defects, but a finding that would expand this confirmed boundary returns as a scope decision rather than silently becoming design work.

These checks are user-facing alignment moments, not new durable governance artifacts. The requirements and design retain the confirmed subject-matter boundaries that later readers need. Confirmation state, reviewer state, and workflow receipts stay in the returned result.

The accepted requirements set reuses the stable identifiers and links already needed for traceability. It is not a new ledger, digest, or companion document. `spec-design` owns its acceptance and recovery contract in `authority-and-problem-framing.md`: prefer the current owner-confirmed requirements record and boundary-check-1 result, otherwise use the last inspectable owner-accepted governing baseline, and stop with an authority conflict when neither source exists or they disagree. Mutually narrowed current files never establish the baseline by themselves. Quick work may show a compact list; substantial work may reuse its existing coverage view. The purpose is to catch added or lost meaning, not to create another artifact to maintain.

## Shared Decisions

1. A user-requirement row separates evidence from authority. Each row carries a stable U identifier, affected user or stakeholder class, need/outcome, evidence anchor/type, authority state (`authorized | observational | advisory | unresolved`), priority with assigner, and hypothesis state when unresolved. Only `authorized` rows are normative-eligible.
2. End users, developer users, customers/buyers, operators, and downstream agents are classified independently. A customer who does not touch the surface remains a stakeholder whose needs and constraints are captured; they are not erased or mislabeled as a direct user journey.
3. Declining extraction selects no specification terminal label inside `discuss-pathfinding`; it returns the refusal, available sources, established rows/evidence, and exact gaps. `spec-design` then classifies the full source inventory: continue when another authoritative source establishes the needed meaning; return `decision-needed` when owner meaning is missing; return `evidence-blocked` when necessary evidence is missing; keep only non-load-bearing uncertainty as a visible hypothesis gap. Hypotheses never authorize normative requirements or `locally-ready`.
4. `discuss-pathfinding` owns user-requirements elicitation and the full pathfinding record shape. `spec-design` owns the acceptance and recovery contract for boundary check 1, the accepted requirements set, and equivalent authoritative sources. Equivalent sources need not copy pathfinding fields; `spec-design` normalizes their meaning into its stable identities, authority classifications, and coverage links.
5. Artifact scale follows the existing pathfinding depth: quick work returns an in-chat record unless durable handoff is needed or requested; standard, deep, or substantial handoff writes `docs/specs/<slug>/user-requirements.md`.
6. Why/What view predicates belong to `spec-design`: journey map, context diagram, and requirement coverage table. `discuss-pathfinding` may capture user-job sequence inputs but does not select or render the journey view. Structural views belong to `program-design`: component, call/sequence, proof call, state, data/event, failure/recovery, trust-boundary, and requirement/design/proof trace views.
7. `plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md` owns the runtime choice among Mermaid, Markdown table, plain-text fallback, and `tui-presentation`, plus semantic-preservation and visual-check results. `spec-design` and `program-design` load it. Each target `SKILL.md` owns when its views are required and what they must expose; skill-local artifact references consume those decisions and own examples, discrimination, pruning, visual-check application, and stop conditions.
8. `plugins/shravan-dev-workflow/docs/diagram-vocabulary.md` is a maintainer index of view names, altitude, runtime owner, and consumers. It does not own or duplicate runtime procedure.
9. `spec-design` gains trigger language for adding or semantically correcting specification views and diagrams. “Add a journey map to the specification” and “place this journey map in the correct authoritative artifact” route to `spec-design`. Pure format-only conversion of settled diagrams routes to `docs-maintain`. `program-design` frontmatter remains structural-How-only.
10. U-root traceability already carries user benefit. Do not add an optional `user goal / benefit` field to observable-contract processing without a separately taught consumer.
11. Durable specification and program-design prose carries subject-matter meaning. Target classification, source/review coverage, self-check state, readiness, acceptance, and similar workflow state live in the returned result, not in narrative sections. A `Status: Draft for review` to `Status: Accepted` edit is process bookkeeping unless readers or tooling genuinely use that lifecycle state as governing authority metadata. Compact durable metadata may identify the artifact and governing sources when it helps later lookup, but never substitutes for the returned result.
12. Across a companion-document set, shared authority, boundary, or navigation meaning has one smallest useful home. Other artifacts link to that home instead of re-narrating sibling roles. This does not remove load-bearing scope, negative space, authority, or governing-source pointers.
13. A specification succeeds for its human reader when they can say who is affected, what is wrong today, what must become true, what must not change, how success and failure will be observed, and where their intent may have been misunderstood. A program design succeeds when they can trace an obligation through owner, interface, call/flow, state, failure/recovery, tradeoff, and proof seam and point to any structural assumption they reject.
14. Author self-review applies the human deletion test to every heading, paragraph, list, table, and diagram. The mode-complete independent review performs a proportional section/view-level deletion pass and flags obvious process residue or duplication. The focused `reader-understanding` lane performs the deeper element-by-element audit only when a concrete comprehension risk or explicit review request justifies it. In every form, removal is valid when it changes no human confirmation, correction, decision, trace, failure simulation, proof path, or later authoritative lookup.
15. Every mode-complete `spec-program-review` includes a compact reader-reconstruction and deletion pass. The focused lane `reader-understanding` is selected only when that pass exposes a concrete unresolved comprehension risk, or when the caller explicitly requests a deep reader-understanding review. It tests whether a human can reconstruct and challenge the intended model without process residue or filler; `artifact-navigation` retains placement, links, and navigability.
16. Clear explanation is not forced brevity. Preserve authority and governing-source pointers that affect decisions, scope and negative space, singular ownership, constraints and forbidden edges, alternatives and falsifiers, failure/recovery policy, proof seams, and the smallest useful navigation home. Use enough words and views to make the model understandable, but no word-count target, fixed template, or blanket vocabulary ban.
17. Choose the form that explains each idea best: concise prose for one rule or rationale, an example for observable behavior, a table for exact mappings or comparisons, a tree for composition/ownership, and a flow or sequence for behavior over time. A format earns its place only when it makes the intended requirements or design easier to express, confirm, or correct.
18. Use plain, specific words. Keep a domain term only when it names a necessary concept and its meaning is clear. Remove jargon, abstract workflow labels, and paragraphs that sound formal but add no decision, relationship, rationale, boundary, example, or correction point. Every material design choice states why it exists and what tradeoff it resolves.
19. A heading tells the human what question the section answers. Prefer “How Each Requirement Works and How We Verify It” over compressed labels such as “Requirement realization and proof seams.” Keep the underlying requirement-to-design-to-proof mapping; remove the decoding burden.
20. Keep authoring, acceptance, PR, release, and post-implementation documentation work outside the durable specification or program design unless that work is itself a governing product obligation. Design-readiness checks and acceptance status stay in the returned workflow result; implementation and documentation tasks move to planning or `docs-maintain`.
21. Cross-artifact traceability is bidirectional without duplicate prose: user-requirement U identifiers map to specification requirements and observable contracts; specification requirement identifiers map to program-design owners, calls/flows, state/failure behavior, and proof seams. A missing link is a gap; copied paragraphs are not a substitute.
22. Staging is scaled, not ceremonial. Quick work may stay in private working state or chat. Substantial work may use repo-local ignored scratch when intermediate evidence or prototypes need inspection. Final artifacts stand on their own; scratch files remain optional evidence and are not committed unless the user explicitly promotes them.
23. Requirements discovery ends with boundary check 1. `spec-design` consumes the confirmed boundary or performs the same compact check when it starts from another authoritative source. New normative meaning outside that boundary returns as an owner decision instead of being inferred.
24. Program design starts from the existing foundation and the minimal-change realization. A design dimension may be required, satisfied by the existing system, not applicable, or unresolved. Categories are inspection questions, not mandatory sections or invitations to invent a subsystem.
25. Every new component, state store, identity, contract, mechanism, dependency, migration, or operating surface names the confirmed requirement it serves, what breaks without it, and the complexity it spends. If removal breaks no confirmed requirement, deletion is the default correction.
26. Boundary check 2 is required before review or planning. New persistence, durable history or identity, governance or certification, control planes, external services, or similarly material scope that was absent from boundary check 1 must be explicitly confirmed rather than normalized by design completeness.
27. Review findings are candidate risks. Parent reduction first tests goal relevance and whether removing the questioned mechanism is the smaller correction. A finding may repair the confirmed design; it may not enlarge the product boundary without an explicit owner decision.
28. `spec-program-review` dispatches one mode-complete reviewer first and reduces it before selecting focused follow-up. The default invocation dispatches at most one focused lane, then returns its coverage and remaining gaps. Another focused lane requires explicit user or caller authorization for the named residual risk after the current coverage and cost are visible. Broad predicates alone do not justify a reviewer.
29. Classify each correction before editing as requirements/Why/What, structural How, or both. A request to remove unrelated mechanisms changes How unless the authorized owner explicitly changes outcomes, users, scope, or proof obligations.
30. Simplification preserves the `spec-design`-owned accepted requirements set: affected classes, stable identities and requirements, priorities and assigners, named skill or scenario variants, defaults, observable contracts, constraints, and proof obligations. Program design may remove owners, components, interfaces, or mechanisms only while that set remains covered.
31. Cross-document agreement is insufficient when all current artifacts may share one scope regression. Author self-check and pair review compare the current artifact set with boundary check 1 and the accepted requirements set. Any removed or superseded obligation names explicit owner authority.
32. A program design for material runtime behavior exposes the call path as a first-class design result. It shows the source-anchored current entrypoint-to-effect path and the proposed path, or proposed-only with an explicit no-predecessor case, and marks added, removed, changed, and intentionally unchanged owners, caller/callee edges, state reads/writes or effects, and result/error propagation. Requirements sharing one path may cite it. The existing `call graph/sequence` view owns this output; no new call-stack view token is created. Program-only and pair review treat a missing applicable visible call path or edge status as a core design gap.

Validated source basis:

- [Artifact Fluff Prevention and Attention-Cost Review Lane](sources/2026-07-31-artifact-fluff-prevention.md)
- [Perseus Human-Document Review](sources/2026-07-31-perseus-human-document-review.md)
- [Perseus Requirements Fidelity Loss During Design Simplification](sources/2026-07-31-perseus-requirements-fidelity-loss.md)
- [Scope Inflation Session Analysis](sources/2026-07-31-scope-inflation-session-analysis.md)
- [Missing Visible Current/Proposed Call-Path Deltas](sources/2026-07-31-missing-call-path-deltas.md)

These remain source evidence and candidate wording rather than implementation contracts.

## Child Contracts

- [Run A — discuss-pathfinding](2026-07-31-user-focused-requirements-discuss-pathfinding.md)
- [Run B — spec-design](2026-07-31-user-focused-requirements-spec-design.md)
- [Run C — program-design](2026-07-31-user-focused-requirements-program-design.md)
- [Run D — spec-program-review](2026-07-31-user-focused-requirements-spec-program-review.md)

Each child is one named `skills-creation` update with its own success definition, surface allocation, proof posture, and implementation boundary. This envelope coordinates their shared interfaces and landing order.

## Change Ownership

| Outcome | Runtime owner | Implementation home |
| --- | --- | --- |
| Extract and confirm unwritten user, customer, developer, operator, or downstream-agent needs | `discuss-pathfinding` | `SKILL.md` destination branch and `references/user-requirements-extraction.md` |
| Elicit and confirm the goal boundary before specification expansion | `discuss-pathfinding` elicits it; `spec-design` owns acceptance, recovery, and accepted-set comparison | User-requirements teaching and `spec-design/references/authority-and-problem-framing.md`; confirmation state returns in chat/result |
| Turn settled needs into authoritative, traceable Why/What | `spec-design` | `SKILL.md`, authority/problem, requirements/traceability, and artifact/self-review references |
| Turn the specification into human-checkable structural How, including call-stack analysis | `program-design` | `SKILL.md` and `references/artifact-and-self-review.md` |
| Confirm the architecture still fits the accepted goal and complexity budget | `program-design` | Terminal human-confirmation check and returned result |
| Choose Mermaid, table, plain text, or chat TUI without losing meaning | `program-design` creates the shared procedure; `spec-design` and `program-design` consume it | `shared-references/diagram-rendering-and-fallbacks.md` and maintainer index `docs/diagram-vocabulary.md` |
| Keep the requirements → specification → program-design chain progressively discoverable | Each authoring skill owns its level; `spec-program-review` verifies reconstruction | Each child `SKILL.md` and local teaching reference |
| Stage research and prototype views without making scratch authoritative | The active authoring skill | Private working state or ignored `tmp/design-workflows/<date>-<slug>/` |
| Prevent and detect filler, process narration, obscure headings, and decorative diagrams | `spec-design` and `program-design` prevent; the mode-complete review always checks and `reader-understanding` deepens a concrete unresolved risk | Artifact/self-review references, common review method, and conditional `reader-understanding` lane |
| Keep review proportional and within host resources | `spec-program-review` | Mode-first sequential selection and parent reduction before focused dispatch |

Each outcome has one runtime owner. Shared references own only behavior genuinely shared by multiple skills.

## Landing Order

```text
Run C program-design creates the shared rendering contract
  -> Run A discuss-pathfinding defines the user-requirements source
  -> Run B spec-design consumes both contracts
  -> Run D spec-program-review verifies the complete reader experience
```

A shared file change must satisfy every child whose runtime behavior consumes it.

## Integrated Proof Boundary

Static proof must verify every fired view predicate has the required semantic fields in a supported medium, every applicable runtime-behavior design exposes its current/proposed call path or explicit no-predecessor case with marked edge deltas, every shared-reference consumer resolves, trigger metadata remains aligned, the maintainer index covers all view owners and runtime consumers, author-side deletion checks cover reader-facing elements, the U→specification→program-design chain has stable links and one owner per meaning, both boundary checks have explicit owners and returns, program-design applicability cannot manufacture subsystems, corrections preserve the accepted requirements set, and review runs mode-complete first with conditional serialized focused follow-up. Manual proof previews each applicable child contract's required view media, including the same call-path delta in durable and chat-readable form, and records whether a human can reconstruct the intended model, move top-down into detail, identify the available correction points, reject one reviewer-proposed scope expansion, and simplify an overengineered six-skill design without narrowing the six-skill requirements or proof coverage; unavailable rendered proof remains an explicit gap rather than a pass.

Pressure scenario files are added for later execution, but model pressure execution is deferred by explicit user direction and remains a user-accepted behavior-proof gap for this source update. Static validation and manual rendering preview are not behavior proof.

## Non-Goals

- No new runtime skill or orchestration layer.
- No persona-template ceremony.
- No change to retired swarm skills.
- No Mermaid syntax engine or fixed-width prose formatting.
- No arbitrary document length, sentence-count, heading, or vocabulary quota.
- No removal of load-bearing material merely because it is dense or lengthy.
- No claim that a reviewer receipt, static validator, commit, or PR proves runtime behavior.

## Scope Boundary

This changeset updates only the four existing runtime skills, their shared diagram support, the maintainer index, focused static checks, deferred pressure-scenario files, plugin metadata, and changelog. It does not create `orchestrator-spec`, retire `skill-audit`, modify retired skills, or redesign the wider planning and implementation workflow. The generic `manage-agents` resource budget remains a separate focused follow-up; this changeset closes the reproduced failure inside `spec-program-review` by using mode-first serialized dispatch and no automatic reviewer multiplication.
