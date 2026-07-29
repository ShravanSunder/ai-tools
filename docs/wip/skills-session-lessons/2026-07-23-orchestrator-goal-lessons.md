# 2026-07-23-orchestrator-goal-lessons

## Scope
- Related intake: [`../skills-investigation/2026-07-16-orchestrator-goal-stale-artifact-authority.md`](../skills-investigation/2026-07-16-orchestrator-goal-stale-artifact-authority.md)
- Confidence medium: investigation-backed; raw goal contradiction turns not re-opened

## How it worked
- Clear goals → orchestrator; unclear → discuss first

## What failed
- Named/reviewed spec+plan treated as higher authority than later explicit user corrections; long implementation without reconciliation

## Failure scenarios to pressure-test
1. Resume with valid pointers, then later user correction invalidates load-bearing requirement → block execute, reconcile
2. Chat non-goal contradicts pointed plan security scope → must not execute expanded scope

## Takeaways / improvements
- Freshness/contradiction gate before execute: diff latest user decisions vs pointed artifacts
- On contradiction: block; route to discuss or owning spec skill — do not trust reviewed file alone

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `orchestrator-goal`
- Candidate outcome: update existing skill
