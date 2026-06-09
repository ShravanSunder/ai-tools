# Trigger Evals

Use this plugin-level eval sheet when changing review-skill descriptions, routing language, or lifecycle boundaries.

## Review Trio Routing

### spec-review-council should trigger

- "Attack this drafted architecture spec before we plan the implementation."
- "Council-review this design doc for missing assumptions."
- "Pressure test this API contract spec before it turns into tasks."

### spec-review-council should not trigger

- "Review this implementation plan before I execute it." -> `plan-review`
- "Review this PR diff for bugs." -> `implementation-review-swarm`
- "Help me write the plan." -> normal agent planning work

### plan-review should trigger

- "Validate this implementation plan against the repo before coding."
- "Poke holes in this handoff packet before another agent runs it."
- "Read this plan and tell me if execution order or validation is wrong."

### plan-review should not trigger

- "Critique this pre-plan design proposal." -> `spec-review-council`
- "Run reviewers over this PR." -> `implementation-review-swarm`
- "Execute this validated plan." -> `plan-execute`

### implementation-review-swarm should trigger

- "Run a review swarm on my branch diff."
- "Review this PR with subagents before merge."
- "Adversarially review the implementation in these files."

### implementation-review-swarm should not trigger

- "Review this implementation plan before code." -> `plan-review`
- "Attack this spec before planning." -> `spec-review-council`
- "Discuss whether this should be a feature at all." -> `discuss-with-me`

## Boundary Invariants

- Specs/designs are reviewed before plans exist.
- Plans/handoffs are reviewed after a design/spec direction exists and before execution.
- Code/diffs/PRs/commits/files are reviewed by the implementation swarm.
- Plan authoring is normal agent work, not a dedicated skill.
