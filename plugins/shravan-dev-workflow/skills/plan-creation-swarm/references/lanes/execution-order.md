# execution-order

Status: focused lane for slice DAGs, parallelization, and checkpoints.

Mission / stance:
Separate true dependency from preferred sequencing. This lane finds the order
that the work requires because of state, ownership, proof, generated artifacts,
human checkpoints, or integration risk.

Trigger examples:
- The plan has multiple slices, subagents, migration steps, generated outputs,
  shared files, or staged validation.
- The parent wants parallel implementation lanes.
- A proof gate depends on another slice landing first.

Why this lane matters:
Parallel plans fail when they confuse "can be discussed separately" with "can be
implemented independently." Serial plans fail when they hide cheap independent
work behind vague phases.

Default scope:
Candidate slices, source obligations, repo write surfaces, generated artifacts,
shared interfaces, migration/cutover constraints, proof gates, integration
checkpoints, and human decision points.

Parent packet requirements:
- accepted source artifact path and source anchors;
- candidate slices or draft plan outline;
- known write surfaces from codebase-boundary when available;
- proposed proof gates and parent checkpoints.

Evidence priority:
1. Source constraints that impose order.
2. Shared write surfaces, generated outputs, state migrations, and interface
   dependencies.
3. Proof gates that require earlier work to exist.
4. Human checkpoints or route-backs that must interrupt execution.

Analysis method:
Build a candidate DAG. For each edge, name why it exists: shared write,
interface contract, data/state dependency, generated artifact, proof dependency,
runtime availability, or human decision. If no reason can be named, treat the
edge as preferred sequencing rather than dependency.

Prioritized smells / failure signals:
- tasks are serial because the prose says "phase" rather than because of a
  dependency;
- parallel slices share write surfaces, fixtures, generated outputs, or tests;
- proof appears only after many slices, making failures hard to localize;
- integration checkpoint occurs after the risky interface is already consumed;
- migration/cutover work precedes the observability or rollback proof it needs;
- human decision is hidden inside an implementation task.

Escalation / materiality bar:
- blocker: proposed parallel work has an unresolved collision or a required
  dependency is missing.
- important: sequence works but creates avoidable proof delay or integration
  risk.
- question: multiple valid orderings exist with different latency/risk tradeoffs.

Overlap boundary:
Use `codebase-boundary` for real write-surface discovery, `scope-and-proof-fit`
for slice size, and `validation-proof` for proof ladder quality. This lane owns
ordering edges and checkpoint placement.

Cannot-verify boundary:
Mark unresolved when dependency truth requires implementation details or source
decisions absent from the packet.

Output extras:
Return slice -> prerequisites -> parallel-safe siblings -> integration
checkpoint -> proof dependency -> unresolved edge.

Advisory boundary:
This lane proposes execution topology. The parent agent owns final sequencing
and plan language.

Parent handoff notes:
Accepted DAG issues become plan edits. Missing source decisions route to spec
creation before planning continues.
