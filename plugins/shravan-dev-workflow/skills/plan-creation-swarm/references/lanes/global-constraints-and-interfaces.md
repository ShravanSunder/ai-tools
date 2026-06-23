# global-constraints-and-interfaces

Status: focused lane for binding constraints and cross-slice contracts.

Mission / stance:
Protect source-level constraints from being diluted during slice planning. This
lane extracts the exact interfaces, dependency directions, invariants, schemas,
platform assumptions, naming rules, and "do not cross" edges that every slice
must inherit.

Trigger examples:
- The accepted source defines layers, protocols, schemas, CLI/API shapes,
  generated artifacts, dependency rules, security boundaries, or non-goals.
- Multiple slices will touch one interface from different sides.
- A plan could accidentally turn a binding rule into a local preference.

Why this lane matters:
Plans can be locally sensible while violating the contract that made the spec
safe. Cross-slice constraints need to be visible before implementation lanes
start optimizing independently.

Default scope:
Accepted source artifact, interface definitions, exact values/formats, schemas,
dependency directions, non-goals, forbidden edges, generated artifacts, shared
types, compatibility constraints, and integration seams.

Parent packet requirements:
- accepted source artifact with constraint/interface anchors;
- candidate slices or draft plan sections;
- repo anchors for existing interfaces when relevant;
- any unresolved source questions already identified by the parent.

Evidence priority:
1. Exact source text for binding constraints.
2. Existing repo interface definitions, schemas, and generated outputs.
3. Plan slice boundaries that consume or modify the constraint.
4. Inferred repo convention only when clearly marked as inference.

Analysis method:
List each binding constraint as source text, owner, consumers, allowed edges,
disallowed edges, and proof implication. Separate source-bound constraints from
repo-inferred conventions. If an inferred rule is necessary for safe execution,
route it back for confirmation instead of presenting it as source truth.

Prioritized smells / failure signals:
- exact interface shape is paraphrased until executor-critical details vanish;
- a slice changes a shared contract without naming consumers or compatibility;
- forbidden edge appears as a convenience import, shortcut, or shared helper;
- source non-goal is treated as optional polish;
- inferred convention is written as if the accepted source required it;
- plan lacks a checkpoint where cross-slice contract changes are reconciled.

Escalation / materiality bar:
- blocker: a slice violates a binding source constraint or changes an interface
  without owner/consumer/proof coverage.
- important: constraint is present but not attached to all affected slices.
- question: constraint seems necessary but is inferred from repo reality rather
  than accepted source.

Overlap boundary:
Use `codebase-boundary` for path ownership, `execution-order` for dependency
DAG, and `validation-proof` for proof rows. This lane owns constraint fidelity
and interface inheritance.

Cannot-verify boundary:
Mark unresolved when source text does not decide whether an interface is
binding or when current repo evidence conflicts with accepted source intent.

Output extras:
Return constraint/interface -> source anchor -> owner -> consumers -> allowed
edges -> disallowed edges -> affected slices -> proof implication.

Advisory boundary:
This lane does not invent missing architecture. It names what planning must
preserve or route back.

Parent handoff notes:
Accepted constraint gaps become global plan constraints or slice notes. Missing
or conflicting source constraints route to spec creation or the human.
