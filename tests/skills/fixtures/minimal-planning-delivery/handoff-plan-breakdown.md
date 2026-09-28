# Scenario label summary Breakdown

Breakdown result: ready
Breakdown path: tests/skills/fixtures/minimal-planning-delivery/handoff-plan-breakdown.md

## Admitted Basis

- Kind: reviewed-three-artifact-design
- Requirements: requirements-scenario-label-summary-v1
- Specification: specification-scenario-label-summary-v1
- Program Design: program-design-scenario-label-summary-v1
- Review result: review-scenario-label-summary-result-v1

## Cut Choice

One node: one indivisible outcome with one owner. No materially different cut exists.

## Nodes

- id: scenario-label-summary
  outcome: Scenario label summary
  scope: scenario-case formatter (Program Design owner)
  rails: stable grouped summary; duplicate rejection
  write surface: `tests/skills/lib/skill-pressure-evaluation/scenario-cases/format-scenario-summary*.ts`
  depends on: none
  stack: none
  kind: feature

## Integration Gates

None: one node meets no other PR.

## Order

scenario-label-summary

## Supersedes

none
