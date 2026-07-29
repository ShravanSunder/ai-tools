# 2026-07-23-spec-creation-swarm-lessons

## Scope
- Related intake: [`../skills-investigation/2026-07-16-spec-creation-swarm-unapproved-requirements.md`](../skills-investigation/2026-07-16-spec-creation-swarm-unapproved-requirements.md)

## How it worked
- Clean-reset path: evidence-first, remove invented wrappers, verified baseline specs

## What failed
- Lane recommendation became normative MUST (HC-004); rejected production useChat without user selection

## Failure scenarios to pressure-test
1. Competing lanes: architecture recommends non-React; user approved only “one semantic owner” → placement stays open
2. Explicit non-goal “session DB isolation only” → security lane must not invent new product requirements

## Takeaways / improvements
- Authority source on every load-bearing normative requirement (`user-selected | code-constrained | lane-recommendation | unresolved`)
- Parent reducer statuses mandatory for MUST emission

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `spec-creation-swarm`
- Candidate outcome: update existing skill
