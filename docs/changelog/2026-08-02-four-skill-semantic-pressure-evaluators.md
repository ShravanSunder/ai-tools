# 2026-08-02 Four-Skill Semantic Pressure Evaluators

Plugin: `shravan-dev-workflow` 1.7.9

## User-visible behavior

- Moves the active scenarios for `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` onto typed evaluator companions: stable local checks run first, then one Terra-medium semantic judge evaluates the same stored Luna-high result.
- Runs subject and judge model calls through configurable ACPX Codex runners while leaving deterministic TypeScript evaluation local. Vitest retains scenario selection, concurrency, test identity, and native Vitest Evals reporting.
- Fails semantic uncertainty closed and saves the criterion judgments, scenario prompt, subject response, tool evidence, rationale, and follow-up in the scenario artifact directory for parent inspection.
- Documents the temporary caller-owned `CODEX_CONFIG` and `MODEL_PROVIDER` bridge needed while Codex profiles do not apply to `codex app-server`; local profiles are never read or copied automatically.
- Clarifies that program design must render a readable fallback after rejecting a lossy requested medium and must continue inside an already-confirmed minimal boundary instead of treating rejected scope pressure as a new owner decision.

## Changed surfaces

- `tests/skills/lib/skill-pressure-evaluation/`, `tests/skills/evals/skill-pressure.eval.ts`, Vitest configuration, the eight in-scope Markdown fixtures and colocated `.case.ts` evaluator definitions, package metadata, and test documentation.
- `program-design/SKILL.md` and `manage-agents/references/acpx-provider-codex.md`.
- Codex and Claude plugin manifests plus Claude marketplace metadata.

## Validation

- The skill-pressure unit suite passes 77 tests across 16 files, including deterministic evaluator ordering/gating, ACPX cancellation propagation and cleanup, and complete case pairing.
- TypeScript type checking and `git diff --check` pass.
- Live Luna-high/Terra-medium runs passed the pathfinding and spec-program-review scenarios. A corrected program-design run reached the semantic judge with every deterministic evaluator passing; parent inspection confirmed the resulting design satisfies all three stated criteria and identified the old judge packet's missing scenario context. The saved spec-design prose-plus-JSON output parses successfully through the corrected production parser without another model run.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.9.
- Local Codex and Claude caches are not refreshed by this source change.
