# 2026-07-23-plan-review-swarm-lessons

## Scope
- Related intake: [`../skills-investigation/2026-07-16-plan-review-swarm-authority-gap.md`](../skills-investigation/2026-07-16-plan-review-swarm-authority-gap.md)

## How it worked
- Full bundle load, live-repo verify, bounded read-only lanes, repair stale READY

## What failed
- Coverage/consistency review without requirement authority → false readiness on unauthorized contract

## Failure scenarios to pressure-test
1. Plan covers unauthorized requirement + violates non-goal → needs revision / decision needed, never ready
2. Umbrella work already shipped on main → detect staleness

## Takeaways / improvements
- Authority/traceability lane: plan-to-spec coverage ≠ still authorized
- Consume decision ledger or upstream spec-review authority receipt

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `plan-review-swarm`
- Candidate outcome: update existing skill
