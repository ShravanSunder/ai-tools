# Skill Pressure Scenario Matrix

This directory contains fast Codex pressure scenarios for skill behavior. Most
scenarios cover `shravan-dev-workflow`; plugin-specific scenarios may live here
when they need the same shortcut-resistance harness.

Every active scenario lives at:

```text
<plugin-name>/<skill-name>/<scenario-name>.md
```

The first two path segments must exactly match the namespaced
`skill_under_test: <plugin-name>:<skill-name>` metadata. Keep the filename local
to the skill (`explain-meaningful-choice.md`, not
`discuss-pathfinding-explain-meaningful-choice.md`); `scenario_id` remains the stable,
globally unique CLI selector.

The goal is not to test whether a model can summarize each skill. The goal is to
test whether the model still follows the skill when prompted to take the exact
shortcut the skill exists to prevent.

Retired-skill scenarios live under `../retired-pressure-scenarios/` and are
preserved as historical behavior records outside the active runner.

Default command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.6-luna CODEX_PRESSURE_REASONING_EFFORT=xhigh \
SKILL_PRESSURE_TIMEOUT_SECONDS=900 \
  pnpm --dir tests/skills run test:evals
```

## Matrix

| Skill | Scenario ID | Pressure target |
|-------|----------|-----------------|
| `debug-investigation` | `debug-investigation-background-monitoring.md` | Do not burn model tokens on long-running monitors; use stateful, redacted, harness-visible watcher jobs. |
| `debug-investigation` | `debug-investigation-no-blind-fix.md` | Do not patch before reproduction, evidence, hypothesis, and root-cause proof. |
| `discuss-clarify-mental-models` | `discuss-clarify-mental-models-reconverge.md` | Do not collapse unstable shared understanding into the old one-question grill or premature artifact work. |
| `discuss-clarify-mental-models` | `discuss-clarify-mental-models-drift-interrupt.md` | Do not apologize-and-continue or summarize past a drift signal; treat invocation as an interrupt and locate where the models diverged. |
| `discuss-clarify-mental-models` | `discuss-clarify-mental-models-map-building.md` | Do not turn agent-work uncertainty into status prose; name the map shape, separate inherited report/direct evidence/assumptions, and say what the evidence does not prove when that split is the hard part. |
| `discuss-pathfinding` | `discuss-pathfinding-ask-related-questions-together` | Ask related questions together without creating a wall of unrelated questions. |
| `discuss-pathfinding` | `discuss-pathfinding-recover-after-major-misunderstanding` | Reorient to the corrected goal and boundary after a major misunderstanding. |
| `discuss-pathfinding` | `discuss-pathfinding-explain-meaningful-choice` | Explain the real alternatives and consequence before asking the user to choose. |
| `discuss-pathfinding` | `discuss-pathfinding-confirm-agent-summary` | Treat another agent's summary as provisional until the owner confirms it. |
| `discuss-pathfinding` | `discuss-pathfinding-gather-requirements-from-affected-people` | Preserve different affected groups, evidence, authority, priorities, and open decisions. |
| `discuss-pathfinding` | `discuss-pathfinding-preserve-caller-return-owner` | Return orchestrated decisions only to the caller-recorded phase without promoting examples into requirements. |
| `discuss-pathfinding` | `discuss-pathfinding-no-live-user-return` | Stop `decision-needed` with unanswered questions when an orchestrated pathfinding call has no live owner. |
| `discuss-pathfinding` | `discuss-pathfinding-direct-no-live-user-blocker` | Preserve the existing blocker and omit orchestration state for a direct pathfinding call with no live owner. |
| `discuss-pathfinding` | `discuss-pathfinding-confirmed-meaning-does-not-fit-return-owner` | Expose confirmed meaning that cannot fit the recorded return owner without rerouting it. |
| `spec-design` | `spec-design-return-one-program-design-handoff` | Return one compact program-design handoff from a locally ready specification and no orchestration state for a direct call. |
| `spec-design` | `spec-design-establish-goal-boundary` | Establish affected groups, outcomes, permitted changes, protected systems, non-goals, and missing decisions before normative requirements. |
| `spec-design` | `spec-design-stay-within-confirmed-requirements` | Do not turn adjacent completeness machinery into authorized product requirements. |
| `spec-design` | `spec-design-separate-evidence-from-requirements` | Keep observations and hypotheses non-normative until an authorized source establishes product meaning. |
| `spec-design` | `spec-design-use-helpful-diagrams` | Select specification views by the reader question and keep internal structural How out. |
| `spec-design` | `spec-design-keep-implementation-choices-out-of-requirements` | State observable Why/What without promoting implementation mechanisms into requirements. |
| `program-design` | `program-design-stay-within-specification` | Realize only accepted requirements inside permitted and protected system boundaries. |
| `program-design` | `program-design-make-smallest-necessary-change` | Start from the working system, add only required structure, and remove unsupported machinery. |
| `program-design` | `program-design-show-current-and-proposed-system` | Show current and proposed entrypoint-to-effect behavior and mark actual changes. |
| `program-design` | `program-design-choose-helpful-diagrams` | Choose each structural view and medium by the relationship a reader needs to understand. |
| `program-design` | `program-design-explain-design-choices-clearly` | Explain what changes, what remains, the tradeoff, its cost, and when to reconsider. |
| `program-design` | `program-design-route-specification-gap` | Return missing observable product meaning to spec-design with one compact handoff and no direct-call orchestration state. |
| `spec-program-review` | `spec-program-review-find-unapproved-design` | Catch machinery that document agreement or existing code did not authorize. |
| `spec-program-review` | `spec-program-review-find-missing-requirements-or-design` | Catch lost accepted requirements and missing executable structural behavior. |
| `spec-program-review` | `spec-program-review-check-tests-match-claims` | Compare each claimed outcome with evidence that can actually observe it. |
| `spec-program-review` | `spec-program-review-check-diagrams-explain-system` | Check that diagrams answer their reader question and agree with written meaning. |
| `spec-program-review` | `spec-program-review-give-useful-findings` | Return concrete findings, consequences, smallest corrections, owners, and confirming evidence in ordinary language. |
| `spec-program-review` | `spec-program-review-route-only-validated-findings` | Let only parent-validated findings select one correction owner and keep direct review outside orchestration state. |
| `orchestrator-design` | `orchestrator-design-starts-with-spec-design` | Start a fresh full cycle with spec-design and leave requirements admission to that phase. |
| `orchestrator-design` | `orchestrator-design-resumes-exact-handoff` | Resume from the exact stored phase handoff without reconstructing meaning from chat. |
| `orchestrator-design` | `orchestrator-design-blocks-invalid-route` | Block a target outside the design cycle without repairing or replacing it. |
| `orchestrator-design` | `orchestrator-design-stops-before-second-review` | Stop with stale review after a semantic correction instead of automatically reviewing again. |
| `orchestrator-design` | `orchestrator-design-enters-post-review-correction` | Move three-artifact design review corrections into the matching post-review allowance before invoking them. |
| `orchestrator-design` | `orchestrator-design-blocks-pathfinding-return-mismatch` | Block a completed pathfinding handoff that names a different phase than its initiating handoff. |
| `orchestrator-design` | `orchestrator-design-bounds-pre-review-recovery` | Keep specification-gap recovery within pre-review allowances and preserve post-review capacity. |
| `docs-maintain` | `docs-maintain-no-stale-purge.md` | Do not purge or rewrite docs before source-of-truth classification and preservation plan. |
| `implementation-handoff` | `implementation-handoff-evidence-packet.md` | Do not produce a vague blurb; package branch, diff, validation, risks, and copy-paste prompt. |
| `implementation-handoff` | `implementation-handoff-requires-state.md` | Do not package planned/no-diff work as implementation state; route to `plan-handoff`. |
| `implementation-pr-wrapup` | `implementation-pr-wrapup-gh-watch-cadence-defaults.md` | Use a 120-second watch cadence by default and 240 seconds for slow jobs or systems; do not preserve shorter polling exceptions. |
| `manage-agents` | `manage-agents-queue-vs-steer.md` | Do not call ACPX `--no-wait` queueing immediate steering or treat queue acknowledgement as completion. |
| `manage-agents` | `manage-agents-json-flows-exit-codes.md` | Do not parse ACPX JSON as a synthetic event envelope; handle raw ACP JSON-RPC, flows, and exit codes in automation. |
| `manage-agents` | `manage-agents-session-ledger-reduction.md` | Do not treat multi-agent consensus as truth without session ledgers and parent-owned verification. |
| `manage-agents` | `manage-agents-custom-agent-boundary.md` | Do not overload custom-agent invocation with adapter building; split agent-registry from building-custom-agents and route sensitive surfaces. |
| `manage-agents` | `manage-agents-pattern-selection.md` | Do not choose ACPX commands before selecting the right subordinate-agent pattern: swarm, persistent sidekick, advisor, ephemeral subagent, or workflow handoff. |
| `plan-handoff` | `plan-handoff-full-packet` | Do not create a thin paste prompt; require coverage and a portable handoff packet. |
| `plan-handoff` | `plan-handoff-existing-plan-only` | Do not package spec/design context as an existing plan; route portability to `spec-handoff` and current ready design planning to `plan-implementation`. |
| `plan-handoff` | `plan-handoff-proof-matrix-preservation` | Do not drop obligation/proof ownership, freshness guards, or parent verification while packaging a plan. |
| `plan-handoff` | `plan-handoff-routes-ready-design-to-planner` | Route exact ready design with no plan to `plan-implementation` without fabricating a handoff. |
| `plan-implementation` | `plan-implementation-admit-reviewed-design` | Translate current ready three-artifact design into one repo-grounded proof-bearing plan and stop before later phases. |
| `plan-implementation` | `plan-implementation-route-stale-without-plan` | Route stale design coverage without creating a plan or phantom tuple. |
| `plan-implementation` | `plan-implementation-preserve-existing-plan-on-blocked-admission` | Preserve an existing plan record and approval record when admission fails. |
| `plan-implementation` | `plan-implementation-keep-small-plan-proportional` | Keep a small plan compact without dropping authority, proof, or stop conditions. |
| `plan-implementation` | `plan-implementation-reject-combined-design-and-route-gap` | Reject a combined Requirements/Specification identity and route the missing contract without planning. |
| `plan-implementation` | `plan-implementation-slice-collisions-and-proof-fit` | Bind contract slices to consumers, serialize collisions, place integration gates, and split false-green proof. |
| `plan-implementation` | `plan-implementation-revision-requested-result` | Return an immutable completed revision-requested plan record without guessing, approval, or execution. |
| `plan-implementation` | `plan-implementation-runtime-skill-package-route` | Route named runtime skill packages to skills-creation without creating a plan or tuple. |
| `implement-plan` | `implement-plan-admit-approved-draft` | Admit only the exact approved draft, re-anchor current source, and return one proof-bearing ready frontier without fabricating read-only execution. |
| `implement-plan` | `implement-plan-reject-unapproved-plan` | Preserve the tuple and stop before execution when separate exact-revision approval is absent. |
| `implement-plan` | `implement-plan-route-revision-requested` | Route a non-executable revision-requested result to its recorded originating planner. |
| `implement-plan` | `implement-plan-stop-on-design-break` | Stop before editing when current reality requires missing observable or structural design. |
| `implement-plan` | `implement-plan-preserve-proof-gate` | Preserve a required proof gate and separate scoped evidence from an out-of-scope failure. |
| `implement-plan` | `implement-plan-runtime-skill-package-route` | Route named runtime skill packages to skills-creation before plan admission or execution. |
| `implement-plan` | `implement-plan-inline-default-colliding-slices` | Keep colliding writes inline and serial instead of creating default worker/controller machinery. |
| `implement-plan` | `implement-plan-accepted-review-remediation` | Accept only implementation-owned routed correction and require fresh affected proof before later review. |
| `implement-plan` | `implement-plan-refuse-false-completion` | Keep missing manual/runtime and integration evidence visible instead of claiming completion from unit tests. |
| `implement-plan` | `implement-plan-route-blocked-result` | Preserve a canonical blocked result and stop at its recorded blocker and unblock owner. |
| `implement-plan` | `implement-plan-stop-on-stale-plan` | Re-anchor current source and stop instead of silently translating an approved stale plan. |
| `implement-plan` | `implement-plan-admit-approved-improvement-plan` | Admit an exact later-approved canonical draft from the plan-improve-repo origin. |
| `implement-plan` | `implement-plan-eligible-disjoint-delegation` | Permit only plan-proven disjoint delegation through manage-agents without default controller machinery. |
| `implement-plan` | `implement-plan-scoped-slice-proof-report` | Bind slice proof to the exact tuple while keeping incomplete full and integration rows open. |
| `implementation-pr-wrapup` | `implementation-pr-wrapup-missing-implementation-review` | Stop PR readiness when meaningful implementation lacks current independent review coverage. |
| `implementation-handoff` | `implementation-handoff-context-free-canonical-plan` | Preserve exact plan authority and bound implementation proof in the actual context-free prompt. |
| `plan-improve-repo` | `plan-improve-repo-direct-authority-boundary` | Keep admitted improvement findings separate from direct reviewed-design planning. |
| `plan-improve-repo` | `plan-improve-repo-validation-does-not-approve` | Keep current-state validation separate from exact-revision approval and execution. |
| `plan-improve-repo` | `plan-improve-repo-deep-no-default-delegation` | Keep deep improvement audits in-parent unless an explicit or concrete bounded delegation predicate exists. |
| `plan-improve-repo` | `plan-improve-repo-runtime-skill-package-route` | Route named runtime skill packages to skills-creation without a mechanics-only bypass. |
| `plan-improve-repo` | `plan-improve-repo-completed-blocked-result` | Return an immutable completed blocked plan record without guessing external authority or advancing. |
| `ops-linear-tracking` | `ops-linear-tracking-docs-are-truth.md` | Do not make Linear the design source of truth or clobber dependency relations. |
| `ops-security-review` | `ops-security-review-official-scan.md` | Do not invent a security scanner; route explicit scans to official Codex Security workflows. |
| `peekaboo` | `peekaboo-progressive-disclosure.md` | Do not reuse stale element IDs, skip live command discovery, or perform destructive desktop cleanup. |
| `skill-audit` | `skill-audit-evidence-first.md` | Do not create broad skills from vibes; audit evidence, classify update/create/merge/skip, and include progressive skill shape plus pressure-proof recommendations. |
| `skill-audit` | `no-global-runtime-lane-contract.md` | Do not create a global runtime lane contract; keep packet contracts skill-local and authoring lessons in meta skills. |
| `skills-creation` | `skills-creation-workflow-spine.md` | Do not route named skill authoring to broad portfolio audit, upstream writing references, or link-only routers; require receipt, workflow spine, branch returns, and placement audit. |
| `skills-creation` | `skills-creation-update-existing-skill.md` | Do not turn existing-skill updates into create work or broad audits; preserve the owner and require update classification plus branch return contracts. |
| `skills-creation` | `skills-creation-evaluate-draft.md` | Do not call a weak draft great without deterministic verdicts, blocker overrides, first revision, retest, and failure-form matching. |
| `skills-creation` | `skills-creation-draft-artifact.md` | Do not refuse a requested draft artifact or require fake observed RED for a new skill; use a hypothesized baseline and produce real draft text. |
| `skills-creation` | `skills-creation-platform-artifact-scale.md` | Do not treat one platform's validation or static proof as behavior proof for shared Codex/Claude skill changes. |
| `skills-creation` | `skills-creation-security-and-cache-boundary.md` | Do not treat scripts, hooks, assets, package scripts, third-party source adoption, or installed-cache/home mutation as ordinary prose work. |
| `skills-creation` | `skills-creation-spec-review-gate.md` | Do not implement non-trivial skill workflow changes before pre-implementation spec review unless the user explicitly skips review. |
| `skills-creation` | `skills-creation-implementation-review-gate.md` | Do not advance non-trivial skill changes to PR-ready without implementation review reduction, changed-file coverage, and targeted retest. |
| `research-swarm` | `research-swarm-question-first` | Frame bounded questions, re-anchor locally, and define an evidence ledger before broad gathering. |
| `research-swarm` | `research-swarm-substantial-stage-artifacts` | Do not collapse substantial fan-out research into chat-only summaries; require lane artifacts and parent synthesis. |
| `review-implementation` | `review-implementation-classify-non-substantial` | Skip independent review only for verified non-semantic mechanical work. |
| `review-implementation` | `review-implementation-block-missing-input` | Block rather than infer missing governing authority, canonical plan approval, source identity, diff, or proof boundary. |
| `review-implementation` | `review-implementation-reject-stale-non-substantial-evidence` | Refuse a mechanical bypass when consumer-search evidence is stale for the reviewed source identity. |
| `review-implementation` | `review-implementation-refuse-ready-from-partial-receipt` | Refuse readiness when the mandatory complete-reviewer receipt remains partial. |
| `review-implementation` | `review-implementation-complete-source-trace` | Trace every material obligation through the approved plan, real implementation caller, and fitting proof. |
| `review-implementation` | `review-implementation-detect-false-green-proof` | Reject weaker proof substitutes and stale or mismatched evidence. |
| `review-implementation` | `review-implementation-verify-runtime-reachability` | Trace runtime claims through the real front door, routing owner, executor, and proof. |
| `review-implementation` | `review-implementation-verify-candidate-finding` | Treat reviewer findings as candidates until the parent verifies their current anchors and consequence. |
| `review-implementation` | `review-implementation-route-by-semantic-owner` | Route accepted findings by root cause to design, planning, implementation, or caller ownership. |
| `review-implementation` | `review-implementation-limit-focused-review` | Permit one focused reviewer only for one concrete unresolved material risk after complete-review reduction. |
| `review-implementation` | `review-implementation-invalidate-corrected-coverage` | Invalidate affected review coverage after correction and require fresh review of corrected source and proof. |
| `review-implementation` | `review-implementation-preserve-read-only-authority` | Keep reviewer and workflow authority read-only, candidate-only, and outside remediation or PR lifecycle work. |
| `review-implementation` | `review-implementation-runtime-skill-package-route` | Route runtime skill-package review to `skills-creation`, not through product implementation review. |
| `orchestrator-goal` | `orchestrator-goal-start-at-design` | Route a fresh long-horizon goal to the bounded design owner without creating lifecycle state. |
| `orchestrator-goal` | `orchestrator-goal-route-ready-design-to-planning` | Route current ready reviewed design to `plan-implementation` without fabricating a plan. |
| `orchestrator-goal` | `orchestrator-goal-stop-for-plan-approval` | Stop at the caller when a completed draft lacks later exact-revision owner approval. |
| `orchestrator-goal` | `orchestrator-goal-route-approved-plan-to-implementation` | Route an exact later-approved draft to `implement-plan` without acting as an executor. |
| `orchestrator-goal` | `orchestrator-goal-route-proof-to-review` | Route implementation proof without current independent review to `review-implementation`. |
| `orchestrator-goal` | `orchestrator-goal-route-review-finding` | Preserve cause-based correction ownership and require fresh affected review. |
| `orchestrator-goal` | `orchestrator-goal-route-ready-implementation-to-pr` | Route ready implementation to `implementation-pr-wrapup` and require its fresh receipt. |
| `orchestrator-goal` | `orchestrator-goal-bypass-direct-phase` | Let an explicit one-phase request bypass long-horizon orchestration. |
| `orchestrator-goal` | `orchestrator-goal-optional-tracking-projection` | Keep optional ops tracking a projection of the canonical plan, never gate authority. |
| `orchestrator-goal` | `orchestrator-goal-respect-narrow-terminal` | Honor an explicit narrower terminal without claiming or running later gates. |
| `orchestrator-goal` | `orchestrator-goal-default-pr-ready-no-merge` | Default to fresh PR readiness while keeping merge separately authorized. |
| `orchestrator-goal` | `orchestrator-goal-reject-producer-incomplete-results` | Open current producer contracts and reject generic-floor results missing owner-required fields. |
| `orchestrator-goal` | `orchestrator-goal-reject-stale-phase-evidence` | Reject stale status and reconstruct from the earliest affected phase-owned gate. |
| `orchestrator-goal` | `orchestrator-goal-runtime-skill-package-route` | Route runtime skill-package goals to `skills-creation` without bypassing authoring review. |
| `orchestrator-goal` | `orchestrator-goal-runtime-skill-package-composed` | Validate the existing accepted multi-run commission before allowing one named child phase. |
| `orchestrator-goal` | `orchestrator-goal-reject-invalid-composition-commission` | Reject stale, wrong-target, wrong-phase, or wrong-revision commission identities. |
| `spec-handoff` | `spec-handoff-portable-design-context` | Do not turn spec/design portability into plan creation or phase completion. |
| `spec-handoff` | `spec-handoff-routes-ready-design-to-planner` | Preserve ready design in the handoff and recommend exactly `plan-implementation`. |
| `tui-presentation` | `tui-presentation-monospace-structure.md` | Do not use markdown headings/pipe tables for TUI structure; use Unicode shape discipline. |
| `tui-presentation` | `tui-presentation-progressive-disclosure.md` | Do not dump one giant diagram; use disclosure sequence with one map, selected slice, small ledger, and detail. |
| `tui-presentation` | `tui-presentation-research-lane-board.md` | Do not claim TUI runs research; render handed-over lanes with parent synthesis boundaries. |
| `tui-presentation` | `tui-presentation-visual-family-selection.md` | Do not default to Mermaid or treat zoom as a diagram family; choose a visual family first. |
| `tui-presentation` | `tui-presentation-semantic-markdown-boundary.md` | Do not redraw code, paths, URLs, or tokens as box text; preserve semantic markdown. |
| `tui-presentation` | `tui-presentation-no-mermaid-catalog.md` | Do not create a broad Mermaid catalog; keep visual guidance understanding-first and small. |
