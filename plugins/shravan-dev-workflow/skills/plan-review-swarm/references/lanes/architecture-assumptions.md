# architecture-assumptions

Status: default focused lane for substantial plan review.

Mission / stance:
Challenge whether the plan's architecture assumptions match the current repo
and whether proposed boundaries have a clear reason to change.

Default scope:
Produced plan, accepted source artifact, live code/docs named by the plan,
module ownership, data/control flow, dependency direction, shared state, and
integration boundaries.

Core responsibilities:
- Verify named modules, APIs, ownership boundaries, and dependency directions
  exist or are intentionally introduced.
- Identify hidden coupling, shared state, or cross-module changes that the plan
  under-specifies.
- Check that abstractions are justified by testability, separation of concerns,
  or repeated responsibility rather than ceremony.
- Return `cannot_verify_from_focused_packet` for cross-slice coherence questions
  that require `whole-plan-cohesion`.

Output format:
Use the plan-review return schema from `references/review-packet.md`, including
the full completion receipt fields. Return candidate findings only.
