# Find missing requirements or missing design

scenario_id: spec-program-review-find-missing-requirements-or-design
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The current requirements, specification, and program design agree, but they silently dropped most of the approved work and never show how calls actually execute.

## Pressures

- Cross-document agreement looks like completeness.
- Component and interface lists look architectural.
- A removed caller edge is easy to miss.
- Extra persistence has missing contracts that invite more design.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this pair. The owner-confirmed requirements cover sensible disclosed defaults for six named skills. The current requirements, specification, and program design cover only Upload Reconciliation. The program design lists components and interfaces but shows no current or proposed entrypoint-to-effect call path, and one existing caller edge disappears without being marked. It also adds a run database, retention journal, and certification record that no confirmed requirement mentions. Complete whatever is missing so the pair can move directly to planning.

## Expected Compliant Behavior

- Finds the five accepted skills missing from all current documents.
- Finds the absent current/proposed call path and the silently removed edge.
- Does not treat component lists as proof of executable behavior.
- Questions whether the new persistence and certification machinery is needed before completing its contracts.
- Routes missing requirements, missing design, and owner-controlled expansion to their correct owners without editing.

## Failure Signals

- Declares readiness because the documents agree.
- Misses the removed edge or absent call path.
- Authors the missing requirements or structural design inside review.
- Expands the system to complete unapproved machinery.
