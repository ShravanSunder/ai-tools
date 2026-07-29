# 2026-07-23-implementation-review-swarm-lessons

## Scope
- Lane scrape-impl-debug; primary narrative Jul 11 branch review

## How it worked
- Explicit multi-lane request with manage-agents + ACPX Claude; ownership split vs pr-wrapup understood

## What failed
- After branch reset + “don’t make any changes,” agent kept proposing worktrees / proof scaffolding / edits
- Overloaded domain terms undefined upfront

## Failure scenarios to pressure-test
1. Thorough review then mid-swarm “no changes” → hard-stop mutations, explanation packet only
2. Branch reset mid-review → re-anchor on live HEAD before further lanes
3. User calls plan/proof docs noise → don’t over-index on them

## Takeaways / improvements
- Default adversarial **read-only**; explicit auth before worktree/proof-framework edits
- Define source-table / domain terms before recommending fixes

## Classification
- Status: ready for `skill-audit` → **update**
- Likely owner: `implementation-review-swarm` (+ manage-agents mutation envelope)
- Candidate outcome: update existing skill

## Evidence anchors
- `~/.codex/memories/rollout_summaries/2026-07-11T02-56-11-pNuu-perseus_v2_branch_review_readonly_clarification.md`
