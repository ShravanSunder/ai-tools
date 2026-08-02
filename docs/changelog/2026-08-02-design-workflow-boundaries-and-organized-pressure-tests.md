# 2026-08-02 Design Workflow Boundaries And Organized Pressure Tests

Plugin: `shravan-dev-workflow` 1.7.7

## User-visible behavior

- Makes `discuss-pathfinding` independently distinguish observed, owner-authorized, provisional, and unresolved meaning; challenge material alternatives; use compact conversational diagrams when they improve understanding; and return confirmed, provisional, and open boundaries without promoting caller summaries into authority.
- Keeps `spec-design` responsible for authoritative Why/What while routing unmade or unconfirmed owner meaning through pathfinding. Requirement coverage tables are now proportional; one obvious trace can remain inline.
- Keeps `program-design` responsible for structural How while requiring explicit added, removed, and changed call-path edges. Unchanged edges are labeled only when preservation is requirement-critical, safety-critical, or contested.
- Reduces `program-design` and `spec-program-review` ceremony by keeping invariant lane behavior in lane references, assignment-specific evidence in packets, and review consequence in one failure-and-downstream-ambiguity field.
- Reorganizes active and retired pressure scenarios under `<pressure-root>/<plugin>/<skill>/`, validates active paths against namespaced `skill_under_test`, and keeps scenario IDs as the CLI selectors.

## Changed surfaces

- `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` skill instructions and references.
- Skill pressure scenarios, recursive Vitest discovery, environment-based selection, placement validation, unit contracts, and test documentation. Legacy shell reducers and one-off shell tests were removed.
- Codex and Claude plugin manifests plus Claude marketplace metadata.

## Validation

- Skill harness unit tests and TypeScript checks pass.
- Focused Luna high-reasoning pressure scenarios cover pathfinding ambiguity, specification human views, program-design rendering semantics, and review reader understanding.
- `git diff --check` passes.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.7.
- Local Codex and Claude caches are not refreshed by this source change.
