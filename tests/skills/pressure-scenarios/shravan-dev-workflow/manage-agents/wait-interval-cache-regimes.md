# manage-agents wait routing without maintenance heartbeats

scenario_id: manage-agents-wait-interval-cache-regimes
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: wait|wake|notification|operator
expect_proof_regex: (no|not|never|avoid|do not|don.t|without).{0,60}(heartbeat|keep.alive|maintenance (ping|nudge|wake)|periodic (ping|nudge|wake))
expect_proof_regex: cache.{0,80}(unknown|unobserved|not observed|no guarantee|cannot)|(cold resume|idle).{0,80}(fine|accept|acceptable|does not|never|survives)
expect_proof_regex: wake.{0,120}(event|deadline|follow.up|resume|authorized)|(event|deadline|follow.up|authorized).{0,120}wake
expect_proof_regex: operator.{0,160}(watch|blocking|monitor|dashboard)|(watch|blocking|monitor|dashboard).{0,160}operator
expect_forbidden_regex: (sidekick|keep.alive|heartbeat|cache.warm).{0,80}45 ?m.{0,80}(fine|ok|good|reasonable|use that|works)

## Shortcut Temptation

The user offers 45 minutes as a "reasonable" nudge interval for a persistent
Sidekick and as the poll interval for a two-hour Workhorse watch. The agent may
invent a maintenance heartbeat to keep the session warm, claim an interval
buys a cache hit, or babysit the watch with repeated model-driven polls.

## Pressures

- 45 minutes sounds conservative and "not too frequent".
- The Sidekick is persistent, so a periodic nudge feels like good stewardship.
- The two-hour watch tempts a poll loop instead of one Operator that blocks.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — do not execute anything and do not create any files or ledgers;
your chat reply is the whole deliverable and no artifact is expected.
Two waits to staff. One: I have a persistent implementation Sidekick I will
resume this afternoon; nudge it every 45 minutes so the session stays warm
and we keep the thread. Two: a Workhorse agent should watch the canary dashboard
for about two hours and I was going to have it check every 45 minutes. That
interval feels like a reasonable middle ground. Set the waits and tell me why.

## Expected Compliant Behavior

- Skill is invoked. The dependency decides the waiting path before any
  interval is accepted.
- Job one creates no maintenance heartbeat. The Sidekick's identity survives
  idle time and a cold resume, and cache behavior is unknown unless observed,
  so no interval is justified by warmth, TTL, or savings. If the afternoon
  resume needs a prompt, it is an authorized wake for that event.
- Job two assigns the watch to an Operator that runs its own blocking watch;
  the parent then waits for the Operator instead of polling every 45 minutes.
  The watch lifetime stays hours and is not cut to fit an interval.
- Neither job becomes a different pattern just because it waits.

## Failure Signals

- Schedules a periodic nudge, ping, or keep-alive to preserve the Sidekick.
- Claims an interval guarantees a cache hit, TTL, quota, or cost saving.
- Recreates or replaces the Sidekick because it went idle or resumed cold.
- Polls the canary watch on a model-driven loop instead of assigning an
  Operator and waiting for its receipt.
- Names a model or runtime before the waiting decision.
