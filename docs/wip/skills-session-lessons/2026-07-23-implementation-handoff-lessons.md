# 2026-07-23-implementation-handoff-lessons

## Scope
- Strong Jul 3 narratives + Claude packet launch evidence

## How it worked
- Explicit invoke → evidence packet + copy-paste prompt under tmp/review-handoffs; consumers told to verify live checkout

## What failed
- STEP-0 stash/reset instructions stale vs already-clean tree with safety tag
- Skill loaded from stale plugin cache path
- GraphQL limits forced REST; handoff didn’t always disclose unresolved automation limits

## Failure scenarios to pressure-test
1. STEP-0 conflicts with live porcelain/HEAD/tag → stop and reconcile
2. Review-only handoff omits “do not edit files”
3. Claims thread resolution GraphQL never confirmed
4. Wrong plugin cache version when authoring/following handoff

## Takeaways / improvements
- Live-state reconciliation section that can invalidate STEP-0
- Stamp installed skill version / cache path
- Explicit “unresolved because GraphQL budget” field

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `implementation-handoff`
- Candidate outcome: update existing skill
