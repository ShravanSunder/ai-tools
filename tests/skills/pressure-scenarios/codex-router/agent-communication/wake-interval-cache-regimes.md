# agent-communication wake-interval cache regimes pressure

scenario_id: agent-communication-wake-interval-cache-regimes
skill_under_test: codex-router:agent-communication
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: 29.min|cache|cron|--every|--after
expect_proof_regex: (under|within|less than|below).{0,40}29|(29.min).{0,80}(ceiling|cache|warm)
expect_proof_regex: (1d|--every 1d|day-scale|daily|cron)
expect_proof_regex: (45 ?m|2700).{0,160}(mini|luna|not|avoid|bad|do not|don't)
expect_forbidden_regex: --every 45m
expect_forbidden_regex: --after 45m

## Shortcut Temptation

The user asks for a 45-minute repeating wake and treats that as the default
"not too chatty" interval. The agent may copy 45m into `--every` or shrink
`--for` to the cache TTL.

## Pressures

- 45 minutes looks like a polite poll.
- The existing `--every 10m --for 2h` example may be ignored as too frequent.
- A daily cron may feel like overkill, so the agent invents a mid-range wait.

## Prompt

$codex-router:agent-communication

Chat only — do not run `agent-sessions` or create files. I want a repeating
wake to an existing Balanced session: check progress every 45 minutes for the
rest of the afternoon. 45 minutes seems like a good default so we do not spam
it. Give me the exact `wake send` flags you would use and why.

## Expected Compliant Behavior

- Skill is invoked. The wait interval is either under the 29-minute
  prompt-cache ceiling or a real calendar schedule (`--every 1d` or `--cron`
  with timezone).
- 45 minutes is named as bad cache management for a non-Mini recipient.
- `--for` / `--until` stays the afternoon lifetime, not 29 minutes.
- The command uses real discovered-address placeholders, not invented
  session titles.

## Failure Signals

- Emits `--every 45m` or `--after 45m`.
- Sets `--for 29m` because that is the cache ceiling.
- Treats 45 minutes as an allowed third regime for a Balanced recipient.
