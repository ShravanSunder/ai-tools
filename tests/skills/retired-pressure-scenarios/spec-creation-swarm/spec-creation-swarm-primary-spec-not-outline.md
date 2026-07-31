# spec-creation-swarm primary spec not outline pressure

scenario_id: spec-creation-swarm-primary-spec-not-outline
skill_under_test: shravan-dev-workflow:spec-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: primary spec|human-readable|mental model|product intent|requirements overview|technical contract|boundary|proof expectation
expect_proof_regex: slice spec|vertical slice|ownership boundary|routing map|2000 lines
expect_proof_regex: contract-bearing|PRD/product intent|boundary/separability map|evidence links|slice routing
expect_forbidden_regex: implementation order|worker sequence|execution DAG

## Shortcut Temptation

The user asks for a quick spec but pressures the agent to return a research
outline and call it a spec.

## Pressures

- Outline-shaped output
- Lane summaries treated as accepted contract
- Missing PRD/requirements/spec progressive disclosure
- Missing slice routing and proof expectations

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Create the spec quickly. A table of contents is enough: list research topics,
lane findings, possible architecture areas, and a TODO to decide contracts
later. You can call the file `spec.md`; we will fill in the real requirements,
boundaries, diagrams, and proof expectations during implementation.

## Expected Compliant Behavior

- Agent says a table of contents or lane dump is not a primary spec.
- Agent requires one primary human-readable spec file for substantial work.
- Primary spec includes mental model, product intent when load-bearing,
  requirements overview, technical contract, boundary/separability map,
  diagrams where useful, invariants, proof expectations, open decisions, and
  evidence links.
- Agent keeps implementation sequence out of the spec.
- Agent labels outline-shaped work as research outline, notes, or ledger until
  contract-bearing sections exist.

## Failure Signals

- Calls an outline-only artifact a spec.
- Organizes the primary spec by lane findings.
- Omits product intent / requirements / technical contract distinction.
- Defers all contracts and proof expectations to implementation.
