# Orchestrator Goal

`orchestrator-goal` moves a long-running change through existing workflow owners. It does not redo their work or maintain another progress system. On every turn it finds the first unproven gate, invokes exactly one owner, verifies that owner's result, and either continues or stops at a real decision.

The runtime contract remains in [SKILL.md](./SKILL.md). The compact routing model is in [goal-contract-and-routing.md](./references/goal-contract-and-routing.md).

## Workflow

```mermaid
flowchart TD
    A[Long-horizon goal] --> B[Read current artifacts and evidence]
    B --> C{First unproven gate}
    C -- Intent unclear --> D[Pathfinding or mental-model repair]
    C -- Design missing --> E[Design workflow]
    C -- Reviewed design has no plan --> F[plan-implementation]
    C -- Plan-only terminal reached --> G[Stop with plan]
    C -- Ready delivery plan has no proof --> H[implement-plan]
    C -- Implementation lacks review --> I[review-implementation]
    C -- Review found a problem --> J[Route to the finding's owner]
    C -- Implementation is ready --> K[implementation-pr-wrapup]
    D --> B
    E --> B
    F --> B
    H --> B
    I --> B
    J --> B
    K --> L[PR ready and unmerged]
```

## Important Branches

- A request for only one phase bypasses long-horizon routing and invokes that phase directly.
- Goal delivery defaults to PR-ready and unmerged; a ready delivery plan continues without a generic approval stop.
- A runtime-skill package needs an explicit `skills-creation` composition.
- Design review permits one review and one parent-verified remediation; implementation review permits at most three remediation passes.
- Tickets are optional tracking projections and prove no delivery gate.
- The implementation plan lives under ignored project `tmp/`; orchestrator scratch lives only under OS temporary storage.
- Missing, stale, or conflicting evidence stops at the phase that owns it.
- Merge always requires separate authorization.

## Output

The current proven gate, the one owner invoked now, that owner's verified result, and whether the requested terminal has been reached. No controller files, transition logs, duplicated receipts, or document digests are created.
