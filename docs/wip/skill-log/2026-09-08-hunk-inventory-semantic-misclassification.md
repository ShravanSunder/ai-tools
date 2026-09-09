# Hunk inventory passes counts but misclassifies behavior

- Observed: 2026-09-08
- Status: captured
- Skill/workflow: manage-agents / review-implementation, shravan-dev-workflow 2.9.0; delegated relevance audit
- Task context: read-only review of a large Swift application diff before pruning.
- Expected behavior: each substantive hunk maps to its actual scenarios and production boundary; moved declarations are distinguished from new tests; count coverage is separate from semantic validation.
- Observed behavior: a keyword-derived ledger classified entire new test suites and mixed hunks containing new tests as compile-only mock adaptations. After initial correction, fresh review found more mixed-hunk misclassifications and inaccurate scenario names. Move counts omitted some overload/no-argument declarations.
- Evidence: exact-ID validation passed for 115 files / 520 hunks while two all-new suites were initially marked compile-only. A later independent review found a mixed hunk adding four tests still marked compile-only and another adding five tests labeled existing adaptation. Moved declaration count corrected from68 to72 using direct source occurrence comparison; no source pruning was performed.
- Recurrence: two audited artifact passes in this assignment contained the same classification failure; earlier history unknown.
- Impact: false relevance assurance, unsafe proposed test deletion, and repeated review cost. Parent rejected broad deletion and independent review caught residual errors before writes.
- Suspected cause: unverified heuristic classifier output treated as semantic inspection; whole-hunk labels hid mixed changes. This is a hypothesis about execution, not proof of a skill defect.
- Follow-up: keep exact-ID coverage, require source-backed scenario/owner descriptions for new and mixed hunks, compare moved declarations including overloads, and validate added test attributes independently. No skill changes authorized by this note.
