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
| `orchestrator-design` | `orchestrator-design-enters-post-review-correction` | Move pair-review corrections into the matching post-review allowance before invoking them. |
| `orchestrator-design` | `orchestrator-design-blocks-pathfinding-return-mismatch` | Block a completed pathfinding handoff that names a different phase than its initiating handoff. |
| `orchestrator-design` | `orchestrator-design-bounds-pre-review-recovery` | Keep specification-gap recovery within pre-review allowances and preserve post-review capacity. |
| `docs-maintain` | `docs-maintain-no-stale-purge.md` | Do not purge or rewrite docs before source-of-truth classification and preservation plan. |
| `implementation-handoff` | `implementation-handoff-evidence-packet.md` | Do not produce a vague blurb; package branch, diff, validation, risks, and copy-paste prompt. |
| `implementation-handoff` | `implementation-handoff-requires-state.md` | Do not package planned/no-diff work as implementation state; route to `plan-handoff`. |
| `implementation-review-swarm` | `implementation-review-swarm-verify-findings.md` | Do not accept reviewer output blindly or add external models by default. |
| `implementation-review-swarm` | `implementation-review-swarm-routes-findings-to-implementation-execute.md` | Do not turn implementation review into broad fixing when accepted findings should return to implementation execution. |
| `implementation-review-swarm` | `implementation-review-swarm-source-trigger-classifier.md` | Do not classify risky runtime/source-backed reviews by diff size; require source trace or explicit `diff_only_limited`. |
| `implementation-review-swarm` | `implementation-review-swarm-source-ledger-row-shape.md` | Do not replace reducer-friendly source trace ledger rows with narrative summaries. |
| `implementation-review-swarm` | `implementation-review-swarm-accepted-request-steering.md` | Do not use parent memory or raw transcript as source truth; require bounded accepted-request and steering anchors. |
| `implementation-review-swarm` | `implementation-review-swarm-reanchor-missed-system.md` | Do not ignore user steering that says the implementation missed the requested system. |
| `implementation-review-swarm` | `implementation-review-swarm-deviation-classification.md` | Do not let reviewer lanes own accepted deviation buckets or route targets. |
| `implementation-review-swarm` | `implementation-review-swarm-runtime-reachability.md` | Do not approve schema/docs/config as proof for runtime or authority claims. |
| `implementation-review-swarm` | `implementation-review-swarm-route-back-by-owner.md` | Do not route findings by severity alone; route by implementation, plan, spec, or human-decision ownership. |
| `implementation-review-swarm` | `implementation-review-swarm-false-positive-substitute.md` | Do not approve weaker substitutes that pass while the desired system is still missing. |
| `implementation-review-swarm` | `implementation-review-swarm-report-text-contract.md` | Do not defer schema expansion without a complete text-contract report proof. |
| `implementation-review-swarm` | `implementation-review-swarm-source-matrix-required.md` | Do not replace source/spec/plan/code/proof matrix rows with prose-only source trace summaries. |
| `implementation-review-swarm` | `implementation-review-swarm-manage-agents-pointer.md` | Do not copy agent-call mechanics into review skills; point to `manage-agents` while preserving review packets, reduction, and verdict ownership. |
| `implementation-pr-wrapup` | `implementation-pr-wrapup-gh-watch-cadence-defaults.md` | Use a 120-second watch cadence by default and 240 seconds for slow jobs or systems; do not preserve shorter polling exceptions. |
| `orchestrator-goal` | `orchestrator-goal-clarity-gate.md` | Do not set a fuzzy long-horizon goal; route unclear goals to `discuss-clarify-mental-models`. |
| `orchestrator-goal` | `orchestrator-goal-closeout-audit.md` | Do not mark a goal complete without accounting for lifecycle gates, matrix rows, evidence, and remaining work. |
| `orchestrator-goal` | `orchestrator-goal-plan-creation-matrix-handoff.md` | Do not route a clear goal to planning while dropping matrix rows that `plan-creation-swarm` must define. |
| `orchestrator-goal` | `orchestrator-goal-proof-matrix-ownership.md` | Do not let child-agent or driver evidence become completion without parent-owned proof-matrix verification. |
| `orchestrator-goal` | `orchestrator-goal-required-files-skill-name.md` | Do not omit exact plan/source files or the `orchestrator-goal` skill name from copy-paste goal text. |
| `implementation-execute-plan` | `implementation-execute-plan-validate-before-edits.md` | Do not execute from summary; validate full plan and live repo before edits. |
| `implementation-execute-plan` | `implementation-execute-plan-matrix-verification.md` | Do not claim implementation completion from delegated or stale evidence before re-checking matrix rows. |
| `implementation-execute-plan` | `implementation-execute-plan-rejects-design-only.md` | Do not execute from a design/spec without a written implementation plan. |
| `implementation-execute-plan` | `implementation-execute-plan-parallel-subagents-default.md` | Do not choose inline execution for clearly parallelizable disjoint slices without a concrete reason. |
| `manage-agents` | `manage-agents-queue-vs-steer.md` | Do not call ACPX `--no-wait` queueing immediate steering or treat queue acknowledgement as completion. |
| `manage-agents` | `manage-agents-json-flows-exit-codes.md` | Do not parse ACPX JSON as a synthetic event envelope; handle raw ACP JSON-RPC, flows, and exit codes in automation. |
| `manage-agents` | `manage-agents-session-ledger-reduction.md` | Do not treat multi-agent consensus as truth without session ledgers and parent-owned verification. |
| `manage-agents` | `manage-agents-custom-agent-boundary.md` | Do not overload custom-agent invocation with adapter building; split agent-registry from building-custom-agents and route sensitive surfaces. |
| `manage-agents` | `manage-agents-pattern-selection.md` | Do not choose ACPX commands before selecting the right subordinate-agent pattern: swarm, persistent sidekick, advisor, ephemeral subagent, or workflow handoff. |
| `plan-creation-swarm` | `plan-creation-swarm-from-spec-not-code.md` | Do not blend plan creation with implementation; create an implementation plan only. |
| `plan-creation-swarm` | `plan-creation-swarm-lane-packet-contract.md` | Do not give planning subagents thin generic prompts; require skill-local lane packets, security context, candidate evidence, and receipts. |
| `plan-creation-swarm` | `plan-creation-swarm-vertical-slice-proof.md` | Do not organize plans as horizontal buckets with terminal validation; require source-owned vertical slices with local proof units. |
| `plan-handoff` | `plan-handoff-full-packet.md` | Do not create a thin paste prompt; require coverage and a portable handoff packet. |
| `plan-handoff` | `plan-handoff-existing-plan-only.md` | Do not package spec/design context as an existing plan; route to `spec-handoff` or `plan-creation-swarm`. |
| `plan-handoff` | `plan-handoff-proof-matrix-preservation.md` | Do not drop matrix owners, freshness guards, or parent verification while packaging a plan. |
| `plan-review-swarm` | `plan-review-swarm-whole-artifact.md` | Do not skim or trust the summary; require whole-artifact coverage for file-backed plans. |
| `plan-review-swarm` | `plan-review-swarm-independent-source-coverage.md` | Do not let review lanes trust controller summaries; require independent source/plan reads and coverage ledgers. |
| `plan-review-swarm` | `plan-review-swarm-routes-findings-to-plan-creation.md` | Do not execute or self-rewrite broadly when accepted plan findings should return to plan creation. |
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
| `research-swarm` | `research-swarm-substantial-stage-artifacts.md` | Do not collapse substantial fan-out research into chat-only summaries; require lane artifacts and parent synthesis. |
| `spec-handoff` | `spec-handoff-portable-design-context.md` | Do not turn spec/design portability into plan creation or phase completion. |
| `tui-presentation` | `tui-presentation-monospace-structure.md` | Do not use markdown headings/pipe tables for TUI structure; use Unicode shape discipline. |
| `tui-presentation` | `tui-presentation-progressive-disclosure.md` | Do not dump one giant diagram; use disclosure sequence with one map, selected slice, small ledger, and detail. |
| `tui-presentation` | `tui-presentation-research-lane-board.md` | Do not claim TUI runs research; render handed-over lanes with parent synthesis boundaries. |
| `tui-presentation` | `tui-presentation-visual-family-selection.md` | Do not default to Mermaid or treat zoom as a diagram family; choose a visual family first. |
| `tui-presentation` | `tui-presentation-semantic-markdown-boundary.md` | Do not redraw code, paths, URLs, or tokens as box text; preserve semantic markdown. |
| `tui-presentation` | `tui-presentation-no-mermaid-catalog.md` | Do not create a broad Mermaid catalog; keep visual guidance understanding-first and small. |
