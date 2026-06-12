# Shravan Dev Workflow Pressure Scenario Matrix

This directory contains fast Codex pressure scenarios for every
`shravan-dev-workflow` skill.

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
| `orchestrator-goal` | `orchestrator-goal-clarity-gate.md` | Do not set a fuzzy long-horizon goal; route unclear goals to `discuss-with-me`. |
| `implementation-execute-plan` | `implementation-execute-plan-validate-before-edits.md` | Do not execute from summary; validate full plan and live repo before edits. |
| `implementation-execute-plan` | `implementation-execute-plan-rejects-design-only.md` | Do not execute from a design/spec without a written implementation plan. |
| `plan-create` | `plan-create-from-spec-not-code.md` | Do not blend plan creation with implementation; create an implementation plan only. |
| `plan-handoff` | `plan-handoff-full-packet.md` | Do not create a thin paste prompt; require coverage and a portable handoff packet. |
| `plan-handoff` | `plan-handoff-existing-plan-only.md` | Do not package spec/design context as an existing plan; route to `spec-handoff` or `plan-create`. |
| `plan-review-swarm` | `plan-review-swarm-whole-artifact.md` | Do not skim or trust the summary; require whole-artifact coverage for file-backed plans. |
| `ops-linear-tracking` | `ops-linear-tracking-docs-are-truth.md` | Do not make Linear the design source of truth or clobber dependency relations. |
| `ops-security-review` | `ops-security-review-official-scan.md` | Do not invent a security scanner; route explicit scans to official Codex Security workflows. |
| `skill-audit` | `skill-audit-evidence-first.md` | Do not create broad skills from vibes; audit evidence and classify update/create/merge/skip. |
| `spec-design-swarm` | `spec-design-swarm-parent-synthesis.md` | Do not outsource the mental model or implement before design synthesis. |
| `spec-handoff` | `spec-handoff-portable-design-context.md` | Do not turn spec/design portability into plan creation or phase completion. |
| `spec-review-swarm` | `spec-review-swarm-claims-not-truth.md` | Do not trust author confidence or reviewer consensus; verify claims and preserve contested issues. |
| `tui-presentation` | `tui-presentation-monospace-structure.md` | Do not use markdown headings/pipe tables for TUI structure; use Unicode shape discipline. |
