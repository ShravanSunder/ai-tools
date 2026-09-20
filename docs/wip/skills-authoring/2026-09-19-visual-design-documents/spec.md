# Visual Requirements, Specifications, and Program Designs

Revision 2 — accepted-to-implement after one bounded proposal-review correction. Actual image generation remains capability-blocked; no implementation or shipping completion is claimed.

## User-directed outcome

Requirements, Specifications, and Program Designs must help the human understand the problem and proposed system visually. The user explicitly requested Image Gen in the Markdown documents, conditional use of other image generation such as OpenRouter when supplied, investigation of recent visualization failures, and a GitHub stacked PR above ai-tools PR #80. This is user-directed intent; historical examples inform the change but do not establish a reproduced failure or RED-to-GREEN claim.

Success means a newly authored substantial Markdown artifact has a meaningful visual beside the explanation it supports, the selected image is stored with the project and embedded with a working relative link, and the main has inspected its meaning and readability. An available, authorized Image Gen route produces explanatory imagery instead of being ignored in favor of an all-text document. Precise semantic views remain available where exact relationships require them. A provider, image, or rendered-preview gap is reported rather than disguised as completed visual work.

## Current source and problem

The PR #80 base is `b485b26bea4e0cba409fa1674b9739ca48b7e4d0`, branch `feat/orchestrator-design-authorship`.

- `shared-references/diagram-rendering-and-fallbacks.md` owns medium selection and inspection, but its medium list is Mermaid, tables, presentation layouts, and fenced text. It has no generated-image, durable-asset, or Markdown-embed procedure.
- `spec-design/SKILL.md` selects journey, context, entity, and coverage views. Its Requirements-only route can finish before the later Specification artifact-view stage. Requirements must receive their own visual treatment without inventing a Specification.
- `program-design/SKILL.md` requires structural views and meaningful render inspection. Those controls should be retained, not replaced by a decorative generated overview.
- `manage-agents/SKILL.md:84` allows tools to “mechanically render unchanged main-authored input” and prohibits them from choosing or expressing governing content. `orchestrator-design/SKILL.md:76` and `spec-design/SKILL.md:28` say “without choosing prose, diagram source, layout, or design meaning”; `program-design/SKILL.md:10` says “without choosing design meaning or layout.” The new user direction requires an explicit bounded distinction between main-authored visual meaning and image-model execution in all four homes.
- `spec-program-review` checks semantic comprehension, but the common method does not explicitly inspect image-file presence, Markdown embedding, or generated labels against governing meaning.
- The installed `imagegen` skill specifies native generation by default, inspection, and copying project-bound selected output into the workspace. A listed skill alone is not tool availability. The current author session exposes no callable generation tool; that is a live-proof blocker, not proof that Codex universally lacks Image Gen.

One inspected September 19 collaboration-design set has distinct Requirements, Specification, and Program Design documents with meaningful fenced text views but no embedded images. This is consistent with the existing permitted medium choices and falls short of the newly requested image experience; it is not proof that those agents violated a then-required Image Gen rule. Recent-session evidence is retained in the private research ledger with exact anchors. Public artifacts summarize verified patterns without copying private session text or machine/account details.

## Design and ownership

```text
Main: settled meaning + reader question + visual composition + exact labels
                               |
                               v
                available, authorized image generator
                               |
                               v
            candidate image (no governing authority)
                               |
                               v
 Main: inspect meaning/readability -> accept or correct -> embed project asset
                               |
                               v
       reader sees explanation, image, and precise normative detail together
```

The main continues to author all governing prose, architecture, relationships, diagram source, and plans. For generated images it authors the prompt, required labels/edges, intended composition and invariants, and accepts the result. Image generation is a bounded form of rendering unchanged main-authored input: the input is the fixed visual brief. Semantic layout—what belongs together, which arrows connect which entities, order, ownership and boundary placement—stays main-authored. The tool may realize pixels, typography, spacing and visual styling within that composition; it cannot decide those semantic relationships or express a different design. Invented entities, arrows, states, or behavior are rejected. Apply this same distinction to the four ownership homes named above, replacing the unqualified no-layout wording while preserving the prohibition on delegated governing authorship. Helpers may run a prescribed generation/copy/render procedure on an unchanged main-authored brief, and report output and errors; they may not redesign the brief or accept the visual.

The existing shared rendering reference remains the single medium-selection and visual-verification owner. Run V2 creates `shared-references/generated-document-visuals.md` as its single conditional production reference. The rendering reference calls it when a generated image is selected or explicitly requested; its return feeds the existing visual pass/gap result. V3–V6 reuse that owner instead of teaching another image procedure. No new image-generation skill, provider framework, adapter, registry, executable, configuration, or credential store is introduced.

The new reference teaches the selected branch in this order:

1. Verify capability and authority: load the available `imagegen` skill by name for actual generation mechanics, distinguish a callable tool from a listed skill, and retain its explicit CLI-fallback/provider rules. A supplied alternative provider uses its supported documentation and route. Missing capability returns the exact blocked input; it does not silently select another service.
2. Execute the main-authored brief: consume the reader question, settled source meaning, exact labels/relationships, semantic composition, exclusions and destination. The main inspects the candidate and gives any targeted correction; helper execution cannot revise the brief. A prompt on disk is not image output.
3. Persist and embed: copy selected output into the artifact's existing asset convention or sibling `assets/`; use a descriptive filename, relative Markdown embed, meaningful alt text and reader-focused caption. Cache-only files, expiring URLs and claims of an uncreated image are failures.
4. Inspect actual pixels and document placement: open the generated image; compare names, arrows, groups and boundaries with the main's brief and written contract; check text legibility at intended document size and caption/alt accuracy. Open a supported document preview to verify its embed/placement, or return the exact destination-preview gap separately from image inspection. A beautiful but incorrect edge fails.
5. Preserve freshness: reuse only after checking against current meaning; update affected images/captions when meaning changes. Keep the main's brief or deterministic source in the existing document/evidence home so a future author can revise the image without guessing; no mandatory new record schema.

Return selected capability, main-authored brief/source pointer, final asset and Markdown paths, semantic/readability inspection, embed/preview result and exact unresolved gap. Complete only when the actual asset is project-local, its embed resolves, the main accepts its accuracy/readability and the required destination inspection passes; otherwise return the concrete gap. This production evidence is consumed by the existing shared rendering owner's per-view verdict, not a parallel acceptance protocol.

## Decisions

| Decision | Default and rationale |
| --- | --- |
| Visuals in each artifact | Newly authored or substantively revised Requirements, Specification, and Program Design documents each carry a reader-useful visual. This is the user's explicit outcome, not a decorative image quota. Start with the document's real reader question and show its journey, comparison, boundary or composition. Reuse a correct existing embedded visual when it still explains current meaning. If no meaningful image can be produced, state that exact conflict and seek owner-directed deferral rather than add filler or silently waive the requirement. A typo-only edit does not regenerate images. A companion's image link alone does not make the current document visually understandable. |
| Image Gen use | Use an available, authorized Image Gen capability for an explanatory overview, journey illustration, storyboard, or other view that helps understand the document. Do not satisfy an explicit image-generation request solely with Mermaid/table/text. Exact user format choices take precedence. |
| Precision | Keep normative meaning in prose/tables and exact complex relationships in inspectable semantic views. A generated overview may simplify only what its caption and adjacent precise view make explicit; it cannot claim to replace a required view while omitting that view's fields. No decorative quota-fillers. |
| Requirements altitude | Show affected people, their job, current pain, and desired outcome without invented interfaces or internal components. Requirements-only work stays Requirements-only. Specification keeps the system opaque; Program Design explains owners, interactions, state, and failure. |
| Provider route | Load the available Image Gen skill and verify an actual callable capability. Prefer native Image Gen. Use OpenRouter or another provider only when the user supplied/configured an authorized, callable route and selected any material provider/model choice. Never infer availability from a skill listing, firewall rule, or environment-variable name. |
| Missing capability | Preserve useful precise visuals and drafting work, name the missing generation capability, and request the supported enablement or explicit provider choice. Do not silently switch to a paid/API route, generate fake assets, or claim a prompt is an image. An explicit image requirement remains open until produced or user-deferred. |
| Durable images | Save selected output under the artifact's existing asset convention, otherwise a sibling `assets/` directory with descriptive filenames. Embed with relative Markdown image links, meaningful alt text, and a caption explaining what to notice and any illustrative simplification. Keep cache paths and external expiring URLs out of document references. |
| Inspection | Open the actual image and inspect exact labels, relationships, boundaries, readability, and agreement with the written model. Verify the Markdown resolves the asset and inspect a supported rendered preview when available. File existence or syntax alone is not visual proof. Report image inspection separately from destination-preview availability. |
| Freshness | A substantive change to meaning updates affected images and captions in the same changeset. Reinspect reused assets against current meaning. Preserve editability through the main-authored brief or deterministic source at the existing artifact/evidence home; no new persistent receipt schema. |
| Pathfinding | Use visual comparisons during meaningful ambiguity and preserve useful visual context in a durable handoff when one is requested. Provisional images remain visibly provisional and cannot settle owner meaning or author downstream architecture. Chat-only remains chat-only. |
| Review | Reviewers inspect the embedded assets and compare them with text; missing/unreadable/misleading visuals or broken links are concrete findings. A reviewer without image/preview access reports partial visual coverage. No new review lane or lifecycle. |
| Publication | One dependent ai-tools PR above #80 using the supported GitHub stack workflow. Workflow plugin version 2.17.0; agent-router stays 0.8.0 with its existing pin. No merge, release, cache refresh, or home apply. |

## Sequenced named skill runs

Each run is behavior-changing, user-directed intent, and keeps existing model/user invocation boundaries. No trigger rewrite is needed merely to list image tools.

| Run | Target | Main path / depth | Proof |
| --- | --- | --- | --- |
| V1 | manage-agents | Distinguish main-authored visual briefs and acceptance from bounded image-tool execution. Preserve all prose/design/plan ownership and role/title rules. | Existing main-authorship case plus a modern source-read case that permits generation from the main brief but rejects delegated design. Do not migrate unrelated legacy fixtures. |
| V2 | spec-design | Reconcile the ownership rule at SKILL.md:28 using the same bounded rendering distinction as V1/V3/V5. Add visual treatment for Requirements materialization and Requirements-only completion as well as Specification; call existing rendering owner. Own creation of `shared-references/generated-document-visuals.md` and the generated-image call from `diagram-rendering-and-fallbacks.md`, using the detailed production method above. Local self-check/blockers consume its results. Preserve entity/authority/Why-What contracts. | Registered cases cover Requirements-only visual output, opaque Specification view, source retrieval, absent-provider honesty, and cache-only/broken embed rejection. |
| V3 | program-design | Add explanatory generated imagery alongside required exact views; update ownership wording and artifact self-check. Preserve required fields, current/proposed deltas, state/failure and proof semantics. | Registered realistic case challenges attractive but inaccurate imagery, missing assets, and pressure to declare prose-only work complete. |
| V4 | discuss-pathfinding | Route material visual comparisons and requested durable record visuals through shared rendering guidance; mark provisional meaning. Preserve live-user and destination ownership. | Registered case preserves the genuine choice, unknowns and return owner; generation failure does not answer the user's question. |
| V5 | orchestrator-design | Reconcile tool-rendering wording and verify each returned document's visual result before handoff, without copying the phase predicates or adding workflow state. | Registered orchestration case retains main authorship and requires each artifact's visual coverage rather than one chat-only picture. |
| V6 | spec-program-review | Common review method checks assets, links, rendered evidence, and image/text agreement; focused reader/navigation references retain existing responsibilities. Preserve lane set and review limits. | Registered review case catches an invented image edge and a cache-only asset without redesigning or accepting the artifact. |

Bounded companion surfaces: current maintainer diagram vocabulary/README and repository operating map where they describe affected behavior; workflow manifests/marketplace version fields; dated changelog and evidence reference. The existing `spec-design-main-authors-settled-sections` case in `tests/skills/pressure-scenarios/shravan-dev-workflow/spec-design/cases.ts:271–280` includes `allows-only-evidence-or-mechanical-rendering` and prohibits layout choice. Reconcile that concrete criterion with the bounded image-rendering distinction while preserving its rejection of Worker-authored prose or Worker-selected governing diagrams. Create the new image-specific cases listed above; no claim is made that an existing generated-image case exists. No historical proposal rewrite, unrelated skill audit, or Router/vendor change.

## Proof and limits

Separate four claims:

1. Static integrity: changed skill validators, unit suite, TypeScript check, plugin validation, metadata/link/diff checks.
2. Agent behavior: fresh registered pressure cases with source retrieval and semantic judgments; inspect each failure transcript before a bounded repair. Prompts present realistic tasks, not hidden grader answers. Existing affected ownership and diagram cases remain passing.
3. Actual artifact production: use the real available generation route with a main-authored brief; persist the selected image in project assets; embed it in a representative Markdown document; open the image and inspect the document preview. A routing case alone does not prove image generation or Markdown rendering. No fake backend or hand-drawn substitute is called Image Gen proof.
4. Review/publication: current implementation proof -> main assessment -> different-lineage review -> scoped commit/push/stacked PR gates. Missing live generation evidence blocks a complete/PR-ready claim unless the user explicitly accepts that named gap; a draft PR may expose incomplete work honestly when authorized.

Current unresolved input: native image generation is not callable in this session, and the user has not yet selected a fallback provider. Independent design and static work may proceed; actual generation remains blocked. OpenRouter compatibility is conditional guidance, not a claim of exercised provider integration.

## Sensitive surfaces

Sensitive surfaces: generated documentation assets and existing-provider network use. Entry point: the main-authored visual brief. Untrusted inputs: generated pixels/text and external renderer output. Privileged actions: none; no credential installation, home refresh, or runtime service changes. Third-party source: installed imagegen instructions are referenced by skill name, not copied or vendored. Permission: user explicitly requested generated visuals; provider-specific access remains capability- and authorization-dependent. Decision: documentation/routing changes allowed; actual asset generation blocked until the selected capability is available. Required proof: image/content inspection, relative-link and document-preview verification, and no secret/private-source leakage in public artifacts.

## Coordination and review

Base PR: https://github.com/ShravanSunder/ai-tools/pull/80. Dependent branch name: `feat/visual-design-documents`. Existing ai-tools worktree is reused; do not create an independent worktree for this dependent slice. Stack initialization must preserve the base commit and existing PR. Main authors this specification and subsequent implementation plan. Retained implementation Sidekick executes accepted runs sequentially in the dependent branch, with helpers limited to bounded implementation/evidence/procedures. Independent review uses a retained different-lineage relationship with no inherited author history.

The exact execution and coordination references remain in the private implementation packet and shared work trail; they are omitted from this public proposal.

Proposal review: revision 1 received targeted-revision with all four required lanes complete. Main accepted F1's four-home semantic-layout clarification and F2's explicit reference ownership/teaching. F3's suggestion to make the user's image requirement optional was rejected; revision 2 clarifies meaningful content and explicit owner deferral rather than filler. F4's claim that no rendering criterion exists was rejected against the exact current `spec-design-main-authors-settled-sections` criterion; revision 2 names that source and distinguishes new image cases. The same independent lead verified both corrections and both source-backed rejections, withdrew F4, and returned `great / accepted-to-implement` with no residual proposal issue. Main accepts revision 2. Original four complete lane receipts plus one bounded verification establish closure; this record update is process-only. Implementation, actual-image proof, and shipping remain separate gates.

Latest delivery direction: after source/static/live-routing proof completed, the owner explicitly instructed continuation through independent review and PR publication/readiness despite the disclosed unavailable generator. Carry actual-image production/embedding/preview as unverified; this changes the delivery hold, not runtime visual requirements or proof claims.
