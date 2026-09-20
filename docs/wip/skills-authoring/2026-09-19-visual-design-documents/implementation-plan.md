# Implementation plan: visual design documents

Governing input: [specification](spec.md), accepted revision 2. Main-authored plan; implementers may read but not edit the spec or this plan. Requested delivery is an unmerged GitHub stacked PR above ai-tools #80. The latest owner instruction explicitly continues independent review, PR publication and readiness work with the already-reported unavailable actual-image path. That instruction supersedes the earlier delivery hold below; actual generation/embedding/preview remains unverified and must stay explicit in review and publication claims.

## Ownership and prerequisites

Reuse the existing ai-tools implementation Sidekick and worktree. The Operator owns GitHub stack mechanics; the Sidekick implements the six named runs and their proof. The main authors governing documents and the actual visual brief, verifies decisive output, and accepts design/implementation results. A retained different-lineage reviewer owns independent review.

Base is `feat/orchestrator-design-authorship` at `b485b26bea4e0cba409fa1674b9739ca48b7e4d0`. New dependent branch is `feat/visual-design-documents`, created through the supported `gh stack` workflow in the same worktree. Do not edit the lower layer or rebase/rewrite it. Before source edits verify the dependent branch and base match the Operator's receipt, and that there are no unrelated pending changes. No independent worktree for this dependent PR.

Proposal review is closed: four complete lanes and one same-lead correction verification, `great / accepted-to-implement`, main accepted. No runtime source changed during review. User-directed intent supports authoring without a manufactured RED.

Two independent prerequisites remain visible:

- Stack tool/setup must create the dependent branch before implementation edits.
- Actual-image proof needs a callable native Image Gen capability or an explicitly selected/configured provider. Source and routing proof can proceed before that capability exists; completion cannot silently drop that gate.

## Implementation runs

Read each current skill and affected references before its run. Execute V1–V6 in the accepted order; record each run's target and result without adding a runtime ledger.

1. **V1 — manage-agents.** Reconcile the rendering sentence and directly affected role wording with the accepted semantic-versus-pixel distinction. Preserve roles, models, continuity, title emoji, main-only prose/design/plan authorship, and existing helper limits. No new agent role or rendering delegate requirement.
2. **V2 — spec-design.** Update its phase-entry rendering boundary, Requirements materialization/Requirements-only completion, Specification artifact stage, and relevant self-check/blockers. Create `shared-references/generated-document-visuals.md` as specified; add its conditional call from existing `diagram-rendering-and-fallbacks.md` and extend the existing actual-medium result for generated images without creating a second gate/schema. Ensure all existing shared-reference callers retain their previously valid text/precise-view behavior unless they select or request generated imagery. Keep normativity outside images, entity contracts and opaque system boundary intact.
3. **V3 — program-design.** Reconcile ownership wording; incorporate reader-useful generated explanatory visuals and durable embeds alongside required exact structural views. Update local artifact self-review to consume actual image/asset/preview results. Retain current/proposed call deltas, failure/state/ownership fields and acceptance boundaries.
4. **V4 — discuss-pathfinding.** At the existing material-ambiguity visual step and durable record/handoff step, route selected generated visuals to the shared rendering procedure. Mark provisional visuals/assumptions; do not turn imagery into an owner answer or downstream architecture. Preserve chat-only and live-user contracts.
5. **V5 — orchestrator-design.** Reconcile its rendering boundary and inspect per-artifact visual completion in returned phase results. A single chat image is not all three documents' embedded visual coverage. Do not duplicate phase predicates or add lifecycle state.
6. **V6 — spec-program-review.** Extend the existing common review method to inspect required document assets, relative embeds, image-versus-text meaning and actual inspection evidence. Update existing focused reader/navigation details only to retain their current responsibility split. Missing image/preview access yields exact partial coverage, not an invented pass. No new lane or extra review round.

Reconcile directly affected existing tests, especially `spec-design-main-authors-settled-sections` / `allows-only-evidence-or-mechanical-rendering`. Its rejection of Worker-authored prose/diagrams must remain; only the accepted fixed-brief image rendering distinction changes. Do not mass-migrate legacy cases, relax unrelated assertions, alter the loader/harness, or turn subject prompts into the grader's answer key.

Allowed runtime write scope: these six skill trees; `shared-references/diagram-rendering-and-fallbacks.md`; new `shared-references/generated-document-visuals.md`; their affected pressure scenarios and colocated case registries; directly corresponding human docs/operating-map descriptions; workflow plugin metadata; dated changelog/index/evidence. Exact shared asset placement for the actual proof is main-controlled. Router/vendor/pin, installed Image Gen source, other skills, provider/runtime code, scripts, hooks, home settings and caches are outside scope.

## Fitting proof

Use the current registered scenario mechanism where it already exists. Add concrete cases for the six-run behavior using actual source reads; combine related obligations when the same realistic scenario can observe them. Keep the public prompts natural: describe the task, constraints and deliverable, not required literal labels. Use semantic evaluation for relational judgments. At minimum demonstrate:

- Requirements-only visual work remains Requirements-only; Specification pictures keep the system opaque.
- Main-authored brief and acceptance remain main-owned while tool realization is permitted; no Worker/Sidekick becomes design author.
- The document gets a project-local embedded visual; a cache path, promised image, or chat-only output is insufficient.
- An image with a wrong owner/edge/label is rejected even if attractive, and exact structural views retain required semantics.
- Missing provider capability is reported truthfully; no invented tool, automatic paid fallback or configured OpenRouter claim.
- Pathfinding images preserve provisional/confirmed meaning and unresolved choices; review identifies broken embeds and image/text conflict.

Run the relevant new and affected existing live cases with the real subject/judge backend, from the repository root:

```sh
pnpm --dir tests/skills exec vitest run evals --config vitest.config.ts -t '<affected-scenario-selection>'
pnpm --dir tests/skills run test:unit
pnpm --dir tests/skills run typecheck
claude plugin validate .
git diff --check
```

Validate each of the six changed skills with the official active skill-creator quick validator. Reuse the already authorized isolated `/private/tmp` uv/PyYAML validation environment; do not install into home or edit repo dependencies for this check. Validate JSON version metadata and any untracked additions (tracked diff checks alone do not inspect them). Follow existing formatting/lint gates applicable to changed files.

For every failed/inconclusive live case, open the actual transcript and evaluator result before proposing a correction. Fix a bounded source/fixture defect at its owner without weakening established proof. Do not keep rerunning unchanged stochastic cases until a convenient pass appears. Route a new semantic decision or required harness change to the main.

### Actual image and Markdown proof

Main-authored brief is prepared separately as `image-brief.md` beside the eventual specification. It describes the main -> image tool -> main inspection -> project asset -> Markdown flow; that input is not output evidence. Once a real authorized generation capability is available, execute that exact brief through its supported skill/tool, return the candidate file, and have the main inspect the pixels. Main controls prompt corrections and acceptance. Copy the accepted image into the proposal's sibling assets directory, embed it with relative link/alt/caption, and inspect a real Markdown/browser preview including the image. Use actual observed paths, images and preview evidence in the receipt. No fake service, fixture screenshot, SVG substitute or written promise is called Image Gen proof.

If capability stays absent, return the blocked gate alongside complete source/static/routing proof. The latest owner instruction authorizes independent review and PR publication/readiness work on the demonstrated source/static/live-routing scope while this named actual-image gap remains explicit. Never publish a completed-image assertion or change provider without direction. Review and GitHub readiness do not establish actual image production.

## Metadata and publication

Bump workflow plugin to `2.17.0` across its Codex/Claude/Cursor manifests and matching marketplace version fields. Leave agent-router `0.8.0` and the Router source pin unchanged. Add `docs/changelog/2026-09-19-visual-design-documents.md` (20 lines or fewer), index it newest-first, and keep longer evidence in `docs/changelog/references/2026-09-19-visual-design-documents-proof.md`. Separate pressure/routing proof from real-image proof and report caches as not refreshed. Public text must contain no private repositories, session transcript content, account/credential data, or machine cache paths.

After fitting proof, return current diff and changed-file inventory to main assessment. Accepted assessment commissions current different-lineage implementation review under skills-creation; retain the reviewer across corrections. Corrections get fresh affected proof and main reassessment before reviewer verification. Once accepted, Operator commits scoped files (never amend/no-verify), pushes and submits the dependent PR through the actual `gh stack` interface. Mini Worker drafts the head-bound PR body; parent checks it; Operator publishes it and inspects current checks/comments/paginated threads/mergeability, a quiet interval and final refresh. PR #80 is the lower layer; never merge either PR or rewrite its history.

## Stop and continuation

Real design breaks, new skill targets, weakened proof, unsupported provider infrastructure, or stack history-rewrite requirements return to the main before mutation. Routine implementation mechanics stay with the Sidekick. No home apply, caches, release, tags, destructive cleanup or production service action.

Use the exact execution and coordination references supplied in the private implementation packet and retained shared work trail. Preserve exact Sidekick identity and report implementation/proof there. Main resolves only when the requested integrated delivery is actually reached.
