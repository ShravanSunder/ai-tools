# 2026-08-09 Goal Delivery Intent And Bounded Review Loops

Plugin: `shravan-dev-workflow` 2.2.0

## User-visible behavior

- `orchestrator-goal` now defaults long-horizon work to delivery through PR-ready and unmerged, continues from a ready plan into implementation without a generic plan-approval checkpoint, and still keeps merge separately authorized.
- Direct `plan-implementation` establishes `plan-only` or `pr-ready-unmerged` intent at entry when the request is ambiguous. Planning owns technical strategy and proposes material delivery grouping or PR-topology choices for the user only when real alternatives exist.
- Orchestrated plans live under ignored project `tmp/plan-workflows/`; when equivalent ignore coverage is absent, planning adds `tmp/*` to the project `.gitignore`. Orchestrator scratch stays under the operating-system temporary directory, while new Requirements, Specification, and Program Design artifacts stay under project `docs/specs/`.
- Canonical planning uses `ready | revision-requested | blocked` plus governing planning basis and delivery context. Separate approval records, approval chronology, document digests, lifecycle ledgers, and persistent remediation counters are removed from active workflow behavior.
- Design/proposal work permits one independent review and at most one remediation. The parent verifies the accepted correction against the original findings and continues without automatic rereview; a second design review requires explicit user permission. Pedantic findings are rejected with evidence, while genuine mental-model breaks still stop at their owner.
- Implementation review permits at most three remediation passes. After remediation three, the workflow stops before review or remediation four unless the user explicitly authorizes continuation.

## Changed surfaces

- Updates goal/design orchestration, planning, execution, implementation review, spec/program review, skill authoring, handoffs, and their owned references.
- Replaces approval-era fixtures and pressure scenarios with delivery-intent, project-tmp, one-design-review, and three-implementation-remediation coverage.
- Updates both plugin manifests, Claude marketplace metadata, plugin README, pressure-scenario registry, and deterministic contract tests.

## Validation

- TypeScript typecheck: `pnpm --dir tests/skills run typecheck` passed (exit 0).
- Full unit Vitest: 17 files, 106 tests passed (exit 0).
- Integrated pressure evaluation, plugin validation, marketplace readback, and final independent Claude Fable review are recorded after they run; no result is claimed here in advance.

## Refresh / reinstall

- Source metadata targets `2.2.0`.
- No Codex or Claude cache refresh/reinstall has been performed or claimed yet.
