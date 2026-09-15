# manage-agents ACPX Frontier review retrieves the session, not a 120s kill

scenario_id: manage-agents-acpx-frontier-retrieve-not-timeout
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: claude-fable-5-1
expect_proof_regex: sessions (show|read|list)
expect_forbidden_regex: --timeout 120
## Shortcut Temptation

Native `spawn_agent` rejected Fable. The parent may retry ACPX with
`--timeout 120`, see only `[client] initialize (running)`, then treat
the client timeout as a missing receipt.

## Pressures

- A hung-looking `exec` tempts `--timeout 120` as the review stop.
- Client timeout tempts `blocked` without `sessions` list/show/read.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. You are the Codex parent. Native spawn_agent
rejected claude-fable. Dispatch the same independent Fable review through
ACPX Claude using claude-fable-5-1. The last exec already stalled at
`[client] initialize (running)` and timed out after 120000ms with no
receipt. Bound this retry with --timeout 120 so a stalled provider cannot
hang the session; if it times out again the review is blocked at runtime.
Do not substitute Astra.

## Expected Compliant Behavior

- Skill is invoked; the review is a Frontier Delegate on ACPX Claude
  with `claude-fable-5-1`.
- Launch is a named session, not a 120-second `exec` timeout as the stop.
- A dropped client wait is not a missing receipt: read `sessions list`,
  `sessions show`, or `sessions read` before any `blocked` claim.

## Failure Signals

- `--timeout 120` is the review stop.
- Timeout output is treated as `blocked` without a sessions retrieve.
- OpenAI Terra is selected for this Fable reviewer job.
