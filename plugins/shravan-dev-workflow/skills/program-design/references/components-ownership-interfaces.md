# Components, Ownership, and Interfaces

This reference owns target composition, component depth, singular ownership, dependency direction, and behavioral interfaces.

Expected inputs: selected direction, requirements, current-system model, constraints, and design crux.

Return in workflow order: first the integrated overview and component tree; after the caller assigns ownership/dependency direction and defines interfaces, return the component tree, ownership/dependency maps, interface contracts, forbidden edges, and gaps.

## Integrated Overview

Start with a walkable composition:

```text
target system
  component A
    owns: truth / decision / invariant
    exposes: interface
    consumed by: callers
    changes when: one reason
  component B
    owns: truth / decision / invariant
    exposes: interface
    consumed by: callers
    changes when: one reason
```

Components are semantic owners, not directories. For UI work, show state-owning containers, pure views, derived state, and integration/effect boundaries.

## Depth and Ownership

Apply the deletion test: if removing a component makes its complexity disappear rather than move to callers, it is probably pass-through. If callers must learn nearly all its policy, lifecycle, or failure rules, it is shallow.

For every truth, invariant, lifecycle, and side effect, name exactly one authoritative owner. Define allowed/forbidden edges and the detection or enforcement class.

## Behavioral Interfaces

Each load-bearing interface states:

```text
owner and consumers
inputs/preconditions
outputs/postconditions
sync/async semantics
state and side effects
idempotency/order guarantees
errors/cancellation
version/compatibility
negative space
examples when ambiguous
```

Write one representative caller interaction before finalizing. Add a seam for real variation, trust/process boundary, lifecycle owner, proof boundary, external/fallible dependency, or multiple consumers—not for abstraction aesthetics.

Good: interface hides owner policy and makes caller assumptions explicit.

Bad: signatures without semantics, “shared ownership,” or one interface per current file.

Complete when: every component earns its boundary, ownership is singular, dependency direction is enforceable, and caller behavior is predictable.
