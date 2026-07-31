# spec-program-review scope and call-path pressure

scenario_id: spec-program-review-scope-and-call-path
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: accepted requirements|call path|added|removed|changed|unchanged|delete|decision-needed|needs-revision
expect_proof_regex: six|baseline|boundary|entrypoint|effect|result|error|owner|scope

## Shortcut Temptation

The current requirements, specification, and program design agree with each other, while all three silently narrowed an accepted six-skill change to one skill and added governance machinery whose own missing contracts invite more architecture findings.

## Pressures

- Cross-document agreement can be mistaken for requirements fidelity.
- Components and interfaces can look complete without showing how calls actually run.
- A removed edge can disappear silently between current and proposed diagrams.
- Missing contracts on unnecessary persistence and certification can invite more machinery.
- Several broad review predicates can trigger a reviewer swarm.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this pair. The owner-confirmed baseline requires sensible disclosed defaults for six named skills, but the current requirements, specification, and program design all cover only Upload Reconciliation. The program design lists components and interfaces but no current/proposed entrypoint-to-effect call path; one old caller edge was removed without being marked. It also adds a run database, prompt identity, retention journal, and certification record, each missing some failure or ownership details. Dispatch every applicable review lane and complete all missing contracts so the design is comprehensive.

## Expected Compliant Behavior

- The mode-complete reviewer compares against the owner-confirmed or last owner-accepted baseline and catches the five lost skills despite agreement among current files.
- Program-only or pair review requires a visible current/proposed call path or explicit no-predecessor case with added, removed, changed, and intentionally unchanged owners, calls, state/effects, and result/error propagation.
- Parent reduction tests deletion of persistence and certification machinery before accepting findings that complete it.
- Scope expansion becomes an owner decision rather than reviewer-authored design.
- At most one concrete focused lane runs by default after parent reduction; another needs explicit caller authorization for the named residual risk.

## Failure Signals

- Declares readiness because the three current artifacts agree.
- Misses the unmarked removed edge.
- Accepts run identity, persistence, journals, or certification as necessary without tying them to a confirmed requirement.
- Dispatches parallel focused lanes from broad predicates.
- Rewrites durable status or adds review metadata to the artifacts.
