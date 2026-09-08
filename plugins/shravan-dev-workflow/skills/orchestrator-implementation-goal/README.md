# Orchestrator: Implementation Goal

`orchestrator-implementation-goal` carries a delivery goal across the owners of planning, implementation and proof, independent review, accepted correction, and PR readiness. It keeps responsibility for the whole loop while leaving each phase's judgment with that phase.

The runtime contract is [SKILL.md](./SKILL.md). Current-source orientation, routing examples, recovery, and finish checks are in [goal-contract-and-routing.md](./references/goal-contract-and-routing.md).

```mermaid
flowchart LR
    A[Current reviewed design or admitted improvement] --> B[Plan]
    B -->|plan-only| G[Requested terminal]
    B --> C[Implement and prove]
    C --> D[Independent review]
    D -->|accepted finding| E[Correct and re-prove]
    E --> D
    D -->|ready| F[PR wrap-up]
    F --> G[PR-ready and unmerged]
```

Design repair remains a separate owner. If an incomplete prerequisite can be completed within the settled model, the implementation goal stays open and resumes afterward. A material design break returns to the user before more implementation is built on it.

The workflow uses `track-show-me-your-work` for consequential decisions and results. The outermost workflow finishes the trail; nested phase owners reuse it. The trail supports orientation but never replaces current source, proof, review, or PR evidence.

Normal implementation correction is capped at three remediation passes. One bounded recovery review is possible when prior evidence is unavailable and current source has been inspected, but recovery cannot reset known history or be repeated. Merge always requires explicit authority.
