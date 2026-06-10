# Shravan Dev Workflow Pressure Scenario Matrix

This directory contains fast Codex pressure scenarios for every
`shravan-dev-workflow` skill.

The goal is not to test whether a model can summarize each skill. The goal is to
test whether the model still follows the skill when prompted to take the exact
shortcut the skill exists to prevent.

Default command:

```bash
CODEX_PRESSURE_MODEL=gpt-5.4 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

## Matrix

| Skill | Scenario | Pressure target |
|-------|----------|-----------------|
| `debug-investigation` | `debug-investigation-no-blind-fix.md` | Do not patch before reproduction, evidence, hypothesis, and root-cause proof. |
| `discuss-with-me` | `discuss-with-me-fuzzy-intent.md` | Do not turn fuzzy discussion into implementation; clarify the thinking boundary first. |
| `docs-maintain` | `docs-maintain-no-stale-purge.md` | Do not purge or rewrite docs before source-of-truth classification and preservation plan. |
| `implementation-handoff` | `implementation-handoff-evidence-packet.md` | Do not produce a vague blurb; package branch, diff, validation, risks, and copy-paste prompt. |
| `implementation-review-swarm` | `implementation-review-swarm-verify-findings.md` | Do not accept reviewer output blindly or add external models by default. |
| `orchestrate-goal` | `orchestrate-goal-clarity-gate.md` | Do not set a fuzzy long-horizon goal; route unclear goals to `discuss-with-me`. |
| `plan-execute` | `plan-execute-validate-before-edits.md` | Do not execute from summary; validate full plan and live repo before edits. |
| `plan-handoff` | `plan-handoff-full-packet.md` | Do not create a thin paste prompt; require coverage and a portable handoff packet. |
| `plan-review` | `plan-review-whole-artifact.md` | Do not skim or trust the summary; require whole-artifact coverage for file-backed plans. |
| `pm-linear-work` | `pm-linear-work-docs-are-truth.md` | Do not make Linear the design source of truth or clobber dependency relations. |
| `security-router` | `security-router-official-scan.md` | Do not invent a security scanner; route explicit scans to official Codex Security workflows. |
| `skill-audit` | `skill-audit-evidence-first.md` | Do not create broad skills from vibes; audit evidence and classify update/create/merge/skip. |
| `spec-design-swarm` | `spec-design-swarm-parent-synthesis.md` | Do not outsource the mental model or implement before design synthesis. |
| `spec-review-council` | `spec-review-council-claims-not-truth.md` | Do not trust author confidence or reviewer consensus; verify claims and preserve contested issues. |
| `tui-presentation` | `tui-presentation-monospace-structure.md` | Do not use markdown headings/pipe tables for TUI structure; use Unicode shape discipline. |
