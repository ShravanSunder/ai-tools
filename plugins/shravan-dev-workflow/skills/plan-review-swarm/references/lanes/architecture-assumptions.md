# architecture-assumptions

Status: default focused lane for substantial plan review.

Mission / stance:
Challenge whether the plan's architecture assumptions match live repo reality
and whether any proposed boundary change has a clear reason to exist.

Trigger examples:
- The plan names modules, APIs, packages, ownership boundaries, state stores, or
  dependency directions.
- The plan introduces abstractions, shared helpers, migrations, or cross-module
  edits.
- The source artifact depends on a specific boundary or owner.

Why this lane matters:
Implementation agents will follow the plan's architecture map. If that map is
fictional, they create coupling, duplicate ownership, or write through the wrong
interface.

Default scope:
Produced plan, accepted source artifact, live code/docs named by the plan,
module ownership, data/control flow, dependency direction, shared state, and
integration boundaries.

Parent packet requirements:
- accepted source artifact path and relevant boundary anchors
- produced plan path and architecture claims
- live repo anchors named by the plan
- disallowed edges and non-goals
- parent routing summary marked as non-evidence

Evidence priority:
1. Live files, docs, and tests named by the plan.
2. Accepted source artifact boundary claims.
3. Produced plan architecture tasks and write scopes.
4. Sibling lane outputs only as candidate contradictions.

Analysis method:
For each planned architecture claim, verify owner, source of truth, dependency
direction, write surface, and reason to change. Ask whether the plan uses an
existing boundary, creates a new one, or blurs ownership.

Prioritized smells / failure signals:
- architecture noun with no repo anchor;
- plan writes across owner boundaries without an explicit interface;
- dependency direction conflicts with current code or source constraints;
- new abstraction is ceremonial or hides broad write scope;
- shared state/source of truth has two owners;
- plan asks workers to infer "existing patterns" without naming the pattern.

Escalation / materiality bar:
- blocker: plan depends on a nonexistent module, wrong owner, or forbidden edge.
- important: architecture direction may work but leaves implementation agents to
  invent boundaries.
- question: the source artifact does not decide ownership and the plan must not
  decide it silently.

Overlap boundary:
If the issue is source obligation coverage, route it to `spec-compliance`. If
the issue is worker ordering or write-scope ambiguity, route it to
`execution-scope`. If the issue is security authority, route it to
`security-reliability`.

Cannot-verify boundary:
Return `cannot_verify_from_focused_packet` when the claim requires whole-plan
slice composition, full dependency DAG analysis, or implementation diff review.

Output extras:
Include an architecture row: plan claim -> live anchor -> owner/source of truth
-> permitted edge | forbidden edge | unresolved, with smallest plan edit.

Advisory boundary:
This lane does not redesign the architecture. It identifies assumptions that
make the plan unsafe or under-specified.

Parent handoff notes:
Parent-accepted architecture findings usually route to `plan-creation-swarm`.
If the accepted source artifact never defined the boundary, route to
`spec-creation-swarm`.
