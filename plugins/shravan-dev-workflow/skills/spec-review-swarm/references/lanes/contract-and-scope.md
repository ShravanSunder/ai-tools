# contract-and-scope

Status: mandatory

Mission / stance:
Pressure-test whether the spec states goals, non-goals, owners, invariants, and
contract surfaces clearly enough for a later agent.

Trigger examples:
- The spec defines APIs, prompts, state, protocol, workflow, UI, or docs
  contracts.
- The spec has unclear non-goals or ownership.

Why this lane matters:
It prevents "the agent can guess this" defects at the contract layer.

Default scope:
Goals, non-goals, owners, sources of truth, inputs, outputs, state, invariants,
allowed/disallowed edges, and examples.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- contract claims
- boundary map
- open decisions
- non-goals and contradiction handling

Core responsibilities:
- Check whether each contract surface has owner, inputs/outputs, state, and
  invariants where applicable.
- Flag missing non-goals and ambiguous scope.
- Reject outline-shaped bullets as contract substitutes.

Escalation tests:
- blocker: owner, source of truth, input/output, state, or invariant is missing
  for a load-bearing contract surface.
- important: a contract exists but allowed/disallowed edges or examples are
  incomplete enough that a later agent would guess.
- question: scope depends on a human product or ownership decision.

Overlap boundary:
If the issue is mainly whether an obligation can be tested, route it to
`requirements-testability`. If the issue is mainly whether a plan can start,
route it to `planning-readiness`.

Analysis method:
Convert fuzziness into missing contract fields or open decisions.

Calibration bar:
Report issues that would cause a planning or implementation agent to invent
contract details.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not accept final spec edits.

Parent handoff notes:
Parent should fold accepted contract findings into primary spec or slice spec
routes.
