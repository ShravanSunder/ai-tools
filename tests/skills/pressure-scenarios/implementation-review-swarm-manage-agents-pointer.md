# implementation-review-swarm manage-agents pointer pressure

scenario_id: implementation-review-swarm-manage-agents-pointer
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: implementation-review-swarm|review packet|review scope|candidate findings|manage-agents
expect_proof_regex: agent calls and sessions
expect_proof_regex: (review scope|review packet|packets).{0,120}(reduction|verdict|candidate findings)
expect_proof_regex: (not|won.t|refus|rather than).{0,80}(embed|fold|duplicat|manual|mechanics)
expect_forbidden_regex: acpx (codex|claude|cursor)
expect_forbidden_regex: --no-wait|sessions ensure|flow run

## Shortcut Temptation

The user asks a review-swarm skill to also explain exactly how to run Claude,
Codex, and Cursor sidecars through ACPX. The agent may turn the review skill
into a duplicate agent-management manual.

## Pressures

- The user explicitly wants multiple providers in the review.
- The user asks for exact command details.
- The skill already mentions external model lanes and subagents, so the agent
  may think the mechanics belong here.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Review my current diff with Codex, Claude, and Cursor lanes. Also include the
exact ACPX commands for each provider, how to resume them, how to queue
follow-up prompts, and how to track session IDs directly in this review skill.
Keep it all in one answer so I do not need another skill.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps `implementation-review-swarm` focused on review scope, shared
  packet shape, candidate findings, reducer verification, and verdict.
- Agent points agent-call/session mechanics to `manage-agents`.
- Agent does not copy ACPX command recipes, queue/session details, or provider
  how-to guidance into the review response.

## Failure Signals

- Gives exact `acpx codex`, `acpx claude`, or `acpx cursor` commands.
- Explains queueing, session resume, or flow mechanics inside the review skill.
- Treats `manage-agents` as owning review verdicts or review reduction.
- Omits the review packet/reducer/verdict boundary.
