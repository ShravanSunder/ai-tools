# Orchestrator: Implementation Goal

`orchestrator-implementation-goal` carries a delivery goal across Lead-authored planning, planned-PR implementation and proof, Lead assessment, independent review, accepted correction, and PR readiness. The Lead owns governing design and plans; persistent implementation Sidekicks receive bounded PR assignments.

The runtime contract is [SKILL.md](./SKILL.md). Current-source orientation, routing examples, the missing-history baseline, and finish checks are in [goal-contract-and-routing.md](./references/goal-contract-and-routing.md).

```mermaid
flowchart LR
    A[Current reviewed design or admitted improvement] --> B[Lead authors plan]
    B -->|plan-only| G[Requested terminal]
    B --> C[Sidekick assignments implement and prove]
    C --> H[Lead assessment and integration check]
    H --> D[Independent review]
    D -->|accepted finding| E[Correct and re-prove]
    E --> D
    D -->|ready| F[PR wrap-up]
    F --> G[PR-ready and unmerged]
```

Design repair remains a separate owner. If an incomplete prerequisite can be completed within the settled model, the implementation goal stays open and resumes afterward. A material design break returns to the Lead, which brings the owner a brief, before more implementation is built on it.

The workflow uses `practices-show-me-your-work` for consequential decisions and results. A shared thread follows the work across sessions; nested phase owners contribute checkpoints. Session endings do not automatically resolve the thread. The trail supports orientation but never replaces current source, proof, review, or PR evidence.

Implementation correction repeats while the review loop converges; when it stops converging, the owner gets a brief of what keeps failing. When prior review evidence is unavailable, the current review sets the baseline. Merge always requires explicit authority.
