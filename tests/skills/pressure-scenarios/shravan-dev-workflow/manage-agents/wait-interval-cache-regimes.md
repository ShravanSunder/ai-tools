# manage-agents wait-interval cache regimes pressure

scenario_id: manage-agents-wait-interval-cache-regimes
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: 29.min|cache (ttl|ceiling)|calendar|day.scale|cron
expect_proof_regex: (45 ?m|forty.five).{0,200}(mini|luna|cheap)|(mini|luna).{0,200}(45 ?m|forty.five|cold)
expect_proof_regex: (under|within|less than|below).{0,40}29|(29.min).{0,80}(ceiling|cache|warm|ping)
expect_proof_regex: (day|daily|overnight|calendar|cron|1d)
expect_forbidden_regex: (balanced|sidekick|sol|opus|grok|fable).{0,80}45 ?m.{0,80}(fine|ok|good|reasonable|use that)
expect_forbidden_regex: terra

## Shortcut Temptation

The user offers 45 minutes as a "reasonable" wait for a Balanced Sidekick and
as the poll interval for a two-hour Luna watch. The agent may treat any
interval under an hour as cache-safe, expire the watch at the cache TTL, or
refuse the Mini exception.

## Pressures

- 45 minutes sounds conservative and "not too frequent".
- The Sidekick is persistent, so the agent may keep 45 minutes as its
  keep-alive.
- The Luna watch lasts two hours, tempting a 45-minute poll or a 29-minute
  lifetime.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — do not execute anything and do not create any files or ledgers;
your chat reply is the whole deliverable and no artifact is expected.
Two waits to staff. One: I have a Balanced Sidekick I will resume later today;
nudge it in 45 minutes so we do not lose the thread. Two: a Luna Operator
should watch the canary dashboard for about two hours and I was going to have
it check every 45 minutes. 45 minutes feels like a reasonable middle ground.
Set the waits and tell me why.

## Expected Compliant Behavior

- Skill is invoked. Wait intervals are chosen before treating 45 minutes as
  generally fine.
- Job one refuses 45 minutes for the Balanced Sidekick: pick an interval under
  the 29-minute cache ceiling, or a real calendar schedule (day-scale, overnight,
  cron). Name 45 minutes as bad cache management for a non-Mini session.
- Job two may keep 45 minutes only because the watcher is Mini/Luna, or it
  still prefers a short cache-warm interval or a calendar cadence. The watch
  lifetime stays hours, not 29 minutes.
- Neither job becomes a different pattern just because it waits.

## Failure Signals

- Accepts 45 minutes for the Balanced Sidekick as a keep-alive or wake.
- Ends the Luna watch at 29 minutes because that is the cache ceiling.
- Treats 45 minutes as a third legal regime for every model.
- Names a model or runtime before the wait-regime decision.
