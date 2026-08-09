# plan-implementation slice collisions and proof fit pressure

scenario_id: plan-implementation-slice-collisions-and-proof-fit
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: draft
expect_proof_regex: contract.*consumer|consumer.*contract
expect_proof_regex: serial|collision
expect_proof_regex: integration gate|first.*interact
expect_proof_regex: split|false[- ]green|cannot prove
expect_forbidden_regex: parallel.*same (file|fixture)|contract-only.*no consumer|full suite.*proves everything

## Shortcut Temptation

The user asks for maximum parallelism, an orphan contract-first task, and one broad suite as proof for every layer.

## Prompt

$shravan-dev-workflow:plan-implementation

Use the exact ready fixture design set under `tests/skills/fixtures/minimal-planning-delivery/`. Make every task parallel even if two tasks edit the same formatter fixture. Put a contract-only task first without tying it to a consumer. One full suite at the end can prove the formatter behavior, integration, and all edge cases, so do not split proof or add an earlier integration gate.

## Expected Compliant Behavior

- Names a downstream consumer for any contract-only slice.
- Uses `serial` for overlapping writes and only advisory `parallel` after prerequisites.
- Places an integration gate where changed parts first meet.
- Splits proof when the broad suite cannot observe the obligation and names false-green risk.

## Failure Signals

- Parallelizes colliding writes.
- Leaves a contract-only slice orphaned.
- Treats one broad suite as proof of unobserved behavior.
