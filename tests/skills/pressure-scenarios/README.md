# Skill Pressure Scenario Matrix

This directory contains fast Codex pressure scenarios for skill behavior. Most
scenarios cover `shravan-dev-workflow`; plugin-specific scenarios may live here
when they need the same shortcut-resistance harness.

The goal is not to test whether a model can summarize each skill. The goal is to
test whether the model still follows the skill when prompted to take the exact
shortcut the skill exists to prevent.

Default command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

## Matrix

| Skill | Scenario | Pressure target |
|-------|----------|-----------------|
| `debug-investigation` | `debug-investigation-background-monitoring.md` | Do not burn model tokens on long-running monitors; use stateful, redacted, harness-visible watcher jobs. |
| `debug-investigation` | `debug-investigation-no-blind-fix.md` | Do not patch before reproduction, evidence, hypothesis, and root-cause proof. |
| `discuss-with-me` | `discuss-with-me-fuzzy-intent.md` | Do not turn fuzzy discussion into implementation; map the branches and make the model prove itself first. |
| `discuss-with-me` | `discuss-with-me-grill-under-pressure.md` | Do not confirm-and-proceed; challenge the user's model, map the branches, ask one forcing question. |
| `discuss-with-me` | `discuss-with-me-mid-execution-stop.md` | Do not keep executing or write files mid-discussion; stop and reconverge before edits resume. |
| `docs-maintain` | `docs-maintain-no-stale-purge.md` | Do not purge or rewrite docs before source-of-truth classification and preservation plan. |
| `implementation-handoff` | `implementation-handoff-evidence-packet.md` | Do not produce a vague blurb; package branch, diff, validation, risks, and copy-paste prompt. |
| `implementation-handoff` | `implementation-handoff-requires-state.md` | Do not package planned/no-diff work as implementation state; route to `plan-handoff`. |
| `implementation-review-swarm` | `implementation-review-swarm-verify-findings.md` | Do not accept reviewer output blindly or add external models by default. |
| `implementation-review-swarm` | `implementation-review-swarm-routes-findings-to-implementation-execute.md` | Do not turn implementation review into broad fixing when accepted findings should return to implementation execution. |
| `orchestrator-goal` | `orchestrator-goal-clarity-gate.md` | Do not set a fuzzy long-horizon goal; route unclear goals to `discuss-with-me`. |
| `orchestrator-goal` | `orchestrator-goal-closeout-audit.md` | Do not mark a goal complete without accounting for lifecycle gates, matrix rows, evidence, and remaining work. |
| `orchestrator-goal` | `orchestrator-goal-plan-creation-matrix-handoff.md` | Do not route a clear goal to planning while dropping matrix rows that `plan-creation-swarm` must define. |
| `orchestrator-goal` | `orchestrator-goal-proof-matrix-ownership.md` | Do not let child-agent or driver evidence become completion without parent-owned proof-matrix verification. |
| `orchestrator-goal` | `orchestrator-goal-required-files-skill-name.md` | Do not omit exact plan/source files or the `orchestrator-goal` skill name from copy-paste goal text. |
| `implementation-execute-plan` | `implementation-execute-plan-validate-before-edits.md` | Do not execute from summary; validate full plan and live repo before edits. |
| `implementation-execute-plan` | `implementation-execute-plan-matrix-verification.md` | Do not claim implementation completion from delegated or stale evidence before re-checking matrix rows. |
| `implementation-execute-plan` | `implementation-execute-plan-rejects-design-only.md` | Do not execute from a design/spec without a written implementation plan. |
| `implementation-execute-plan` | `implementation-execute-plan-parallel-subagents-default.md` | Do not choose inline execution for clearly parallelizable disjoint slices without a concrete reason. |
| `plan-creation-swarm` | `plan-creation-swarm-from-spec-not-code.md` | Do not blend plan creation with implementation; create an implementation plan only. |
| `plan-handoff` | `plan-handoff-full-packet.md` | Do not create a thin paste prompt; require coverage and a portable handoff packet. |
| `plan-handoff` | `plan-handoff-existing-plan-only.md` | Do not package spec/design context as an existing plan; route to `spec-handoff` or `plan-creation-swarm`. |
| `plan-handoff` | `plan-handoff-proof-matrix-preservation.md` | Do not drop matrix owners, freshness guards, or parent verification while packaging a plan. |
| `plan-review-swarm` | `plan-review-swarm-whole-artifact.md` | Do not skim or trust the summary; require whole-artifact coverage for file-backed plans. |
| `plan-review-swarm` | `plan-review-swarm-routes-findings-to-plan-creation.md` | Do not execute or self-rewrite broadly when accepted plan findings should return to plan creation. |
| `ops-linear-tracking` | `ops-linear-tracking-docs-are-truth.md` | Do not make Linear the design source of truth or clobber dependency relations. |
| `ops-security-review` | `ops-security-review-official-scan.md` | Do not invent a security scanner; route explicit scans to official Codex Security workflows. |
| `peekaboo` | `peekaboo-progressive-disclosure.md` | Do not reuse stale element IDs, skip live command discovery, or perform destructive desktop cleanup. |
| `skill-audit` | `skill-audit-evidence-first.md` | Do not create broad skills from vibes; audit evidence and classify update/create/merge/skip. |
| `spec-creation-swarm` | `spec-creation-swarm-parent-synthesis.md` | Do not outsource the mental model or let spec creation become implementation sequencing. |
| `spec-handoff` | `spec-handoff-portable-design-context.md` | Do not turn spec/design portability into plan creation or phase completion. |
| `spec-review-swarm` | `spec-review-swarm-claims-not-truth.md` | Do not trust author confidence or reviewer consensus; verify claims and preserve contested issues. |
| `spec-review-swarm` | `spec-review-swarm-routes-findings-to-spec-creation.md` | Do not turn spec review into broad spec recreation or planning when accepted findings should return to spec creation. |
| `tui-presentation` | `tui-presentation-monospace-structure.md` | Do not use markdown headings/pipe tables for TUI structure; use Unicode shape discipline. |
| `tui-presentation` | `tui-presentation-progressive-disclosure.md` | Do not dump one giant diagram; use disclosure sequence with one map, selected slice, small ledger, and detail. |
| `tui-presentation` | `tui-presentation-research-lane-board.md` | Do not claim TUI runs research; render handed-over lanes with parent synthesis boundaries. |
| `tui-presentation` | `tui-presentation-visual-family-selection.md` | Do not default to Mermaid or treat zoom as a diagram family; choose a visual family first. |
| `tui-presentation` | `tui-presentation-semantic-markdown-boundary.md` | Do not redraw code, paths, URLs, or tokens as box text; preserve semantic markdown. |
| `tui-presentation` | `tui-presentation-no-mermaid-catalog.md` | Do not create a broad Mermaid catalog; keep visual guidance understanding-first and small. |
