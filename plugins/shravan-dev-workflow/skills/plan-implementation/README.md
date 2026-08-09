# Plan Implementation

`plan-implementation` turns reviewed design into one practical Markdown implementation plan. It reads the Requirements, Specification, and Program Design, checks them against the current repository, and organizes the work into small slices with matching proof.

The runtime contract remains in [SKILL.md](./SKILL.md). Detailed slicing guidance lives in [slice-and-proof-design.md](./references/slice-and-proof-design.md).

## Workflow

```mermaid
flowchart TD
    A[Reviewed Requirements, Specification, and Program Design] --> B{Current, separate, and ready?}
    B -- No --> C[Stop and route the gap to its design owner]
    B -- Yes --> D[Inspect the current repository]
    D --> E[Map each obligation to a small change and fitting proof]
    E --> F[Order only real dependencies and collisions]
    F --> G[Write one Markdown implementation plan]
    G --> H[Return draft, needs revision, or blocked]
    H --> I[Stop before approval or implementation]
```

## Important Branches

- A runtime-skill package returns to `skills-creation` unless an accepted composition explicitly selected this planner.
- Missing or stale design returns to the design owner; planning does not repair design.
- A complete plan is still only a draft. A human owner approves it separately afterward.
- Optional tickets may point to the plan, but they never become another plan.

## Output

One proportional Markdown plan that names the work, order, proof, integration points, and stop conditions. It contains no progress tracking, approval state, document digest, or PR state.
