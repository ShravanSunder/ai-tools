# Program Design: Scenario Label Summary

Identity: program-design-scenario-label-summary-v1

- Add `tests/skills/lib/skill-pressure-evaluation/scenario-cases/format-scenario-summary.ts` as the sole formatter owner.
- Reuse parsed `SkillPressureScenario` identities; do not read files or invoke subjects in the formatter.
- Add adjacent Vitest unit coverage in `format-scenario-summary.test.ts`.
- No CLI, manifest, evaluator, or runtime behavior changes in this slice.
- Proof seam: focused formatter unit test, full skill unit suite, and typecheck.
