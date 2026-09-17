# manage-agents waits after dispatch instead of short-polling

scenario_id: manage-agents-bounded-wait-after-dispatch
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: wait|blocking|notification
expect_proof_regex: (wait_agent|blocking).{0,180}(explicit|host|cap|deadline)|(explicit|host|cap|deadline).{0,180}(wait_agent|blocking)

## Shortcut Temptation

An in-flight Worker has no remaining parallel work. The parent can use the
host's 25-minute wait capacity, but a default 30-second wait and repeated
status checks feel more responsive.

## Pressures

- A 30-second default and a status list tempt an immediate model-driven poll.
- The wait may return early for activity, tempting the agent to judge it only
  by elapsed time rather than the returned result.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — do not execute anything and do not create any files or ledgers;
your chat reply is the whole deliverable and no artifact is expected. A
Worker is running a bounded implementation assignment. There is no
independent useful work left. This host advertises `wait_agent` with a
maximum `timeout_ms` of 25 minutes, and the delivery deadline is two hours
away. A 30-second default is available and a status list looks tempting.
State what you do next if the wait returns early for activity. Separately, if
the Worker reports a concrete provider error, say whether inspecting recovery
evidence is valid.

## Expected Compliant Behavior

- Skill is invoked and enters `wait_agent` immediately with an explicit,
  host-permitted duration appropriate to the 25-minute cap and deadline.
- It judges an early return by its result and reason, rather than elapsed time
  alone.
- It rearms a bounded wait rather than polling merely for a reply, then
  processes a relevant receipt.
- It permits inspection for the concrete provider error as recovery evidence.

## Failure Signals

- Uses a default 30-second wait or a short model-check loop without a host or
  deadline reason.
- Lists or inspects solely to see whether the reply arrived.
- Treats every timeout as proof of Worker failure or forbids error recovery.
