# 2026-07-23-authority-chain-cascade.md

## Source

- Session / investigation cluster: Perseus Agent hard-cut lineage (Jul 15–16), plus supporting review/plan sessions
- Related skills: discuss-clarify-mental-models → spec-creation-swarm → spec-review-swarm → plan-creation-swarm → plan-review-swarm → orchestrator-goal → manage-agents / implementation-review-swarm
- Date observed: 2026-07-15 through 2026-07-16 (cascade); supporting lessons through 2026-07-23 mining

## What Went Wrong

- Observed behavior: A single authority-chain break cascaded across workflow skills — questioned proposals became confirmed, recommendations became MUST, reviews blessed coherence without provenance, plans amplified the contract, goals preferred stale artifacts over later user corrections, and multi-agent agreement amplified the same corrupted source.
- Expected behavior: Each phase distinguishes user decisions, code constraints, recommendations, and unresolved branches; later user intent outranks older reviewed artifacts; read-only roles do not mutate; agreement without independent authority sources is not confirmation.
- Cost of the failure: Long wrong-direction implementation before rediscovery; unauthorized commits from nominally read-only agents.

## Evidence To Collect

- Existing per-skill intake notes under this directory (2026-07-16-*)
- Lesson consolidations under `../skills-session-lessons/2026-07-23-*-lessons.md`
- Research lanes under `tmp/research-workflows/2026-07-23-skills-session-lessons/lanes/`

## Failure Scenario To Pressure-Test

End-to-end chain: discuss marks a questioned item confirmed → spec emits MUST → review returns ready on coherence → plan sequences it → goal executes despite later user correction. Any stage must be able to break the chain; no stage may treat upstream coherence as authorization.

## Initial Classification

- Status: investigate (portfolio-level)
- Likely owner: shared authority envelope across discuss/spec/plan/goal/manage-agents (not one skill alone)
- Candidate outcome: update existing skills (coordinated), possibly via skill-audit then skills-creation per owner

## Next Step

- Route through `skill-audit` for update/merge/skip classification across the cascade owners
- Prefer one shared authority vocabulary over seven near-duplicate patches
