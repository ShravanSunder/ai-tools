# Plan Implementation

`plan-implementation` lets the user-facing main turn reviewed design into a breakdown of PR nodes and one practical Markdown implementation plan per PR. The main reads the Requirements, Specification, and Program Design, checks them against the current repository, cuts the delivery into independently buildable and reviewable PRs, and authors each PR's small slices and matching proof when that PR can start. Helpers may gather bounded evidence; implementation Sidekicks receive a finished PR plan rather than write it.

The runtime contract remains in [SKILL.md](./SKILL.md). Detailed slicing guidance lives in [slice-and-proof-design.md](./references/slice-and-proof-design.md).

## Workflow

```mermaid
flowchart TD
    A[Reviewed Requirements, Specification, and Program Design] --> B{Current, separate, and ready?}
    B -- No --> C[Stop and route the gap to its design owner]
    B -- Yes --> D[Inspect the current repository]
    D --> BD[Write the breakdown: PR nodes, stacks, contract PRs, gates]
    BD --> E[Map each node's obligations to small changes and fitting proof]
    E --> F[Order only real dependencies and collisions]
    F --> G[Write one Markdown plan per executable PR node]
    G --> H[Return ready, revision requested, or blocked]
    H --> I{Delivery terminal}
    I -- plan-only --> J[Stop at the ready plan]
    I -- pr-ready-unmerged --> K[Continue to implementation]
```

## Important Branches

- A runtime-skill package returns to `skills-creation` unless an accepted composition explicitly selected this planner.
- Missing or stale design returns to the design owner; planning does not repair design.
- Direct planning establishes `plan-only` versus `pr-ready-unmerged` at entry when intent is ambiguous. Goal orchestration supplies `pr-ready-unmerged` by default.
- A ready delivery plan continues to implementation without a generic post-plan approval stop; a `plan-only` plan stops at planning.
- Optional tickets may point to the plan, but they never become another plan.

## Output

One breakdown per delivery, and one proportional Markdown plan per PR node that names the work, order, proof, integration points, and stop conditions. Neither contains progress tracking, approval state, document digest, or PR state.
