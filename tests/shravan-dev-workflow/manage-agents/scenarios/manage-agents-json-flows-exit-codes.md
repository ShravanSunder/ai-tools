---
schema_version: 1
scenario_id: manage-agents-json-flows-exit-codes
owner_plugin: shravan-dev-workflow
owner_skill: manage-agents
skill_type: reference
prompt: |-
  $shravan-dev-workflow:manage-agents

  I need a tiny automation note for ACPX. Use this exact style unless it is
  obviously wrong:

  ```bash
  acpx --format json codex exec 'review changed files' \
    | jq -r 'select(.type=="tool_call") | [.status,.title] | @tsv'
  ```

  Also mention how I run a TypeScript flow and what exit codes I should branch on.
  Keep it inside the manage-agents skill shape.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill routes the topic to `automation-and-flows`.
  - Agent says ACPX JSON is raw ACP JSON-RPC NDJSON, not a synthetic event
    envelope.
  - Agent corrects the parser toward `.method=="session/update"` or equivalent
    ACP fields.
  - Agent mentions exit codes that scripts should branch on, including timeout,
    no-session, permission-denied, and interrupted cases.
  - Agent places TypeScript `flow run` in the automation/flows branch.

  Failure Signals:
  - Repeats `.type=="tool_call"` as the recommended parser.
  - Treats JSON output as a synthetic ACPX event envelope.
  - Omits exit-code handling.
  - Moves flows into generic runtime-control without naming the automation/flows
    branch.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: automation-and-flows|json|exit codes|flows
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: session/update
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: raw acp|json-rpc|ndjson
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: (0|1|2|3|4|5|130).{0,180}(timeout|permission|no session|interrupted|usage)
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: repeatable multi-step|acpx flow run|flow artifacts
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: select\(\.type==[\"']tool_call[\"']\)
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: parse human text output|parse `?text`? output
expected_artifacts: []
---
# manage-agents JSON, flows, and exit-code pressure

## Shortcut Temptation

The user provides an old JSON parsing example and asks for a flow in the same
breath. The agent may repeat stale synthetic event parsing and ignore exit
codes.

## Pressures

- The prompt includes a plausible but stale `jq` command.
- The user asks for "just the snippet", tempting command cargo-culting.
- Flows and ordinary JSON output may be collapsed into runtime control.

## Prompt

$shravan-dev-workflow:manage-agents

I need a tiny automation note for ACPX. Use this exact style unless it is
obviously wrong:

```bash
acpx --format json codex exec 'review changed files' \
  | jq -r 'select(.type=="tool_call") | [.status,.title] | @tsv'
```

Also mention how I run a TypeScript flow and what exit codes I should branch on.
Keep it inside the manage-agents skill shape.

## Expected Compliant Behavior

- Skill routes the topic to `automation-and-flows`.
- Agent says ACPX JSON is raw ACP JSON-RPC NDJSON, not a synthetic event
  envelope.
- Agent corrects the parser toward `.method=="session/update"` or equivalent
  ACP fields.
- Agent mentions exit codes that scripts should branch on, including timeout,
  no-session, permission-denied, and interrupted cases.
- Agent places TypeScript `flow run` in the automation/flows branch.

## Failure Signals

- Repeats `.type=="tool_call"` as the recommended parser.
- Treats JSON output as a synthetic ACPX event envelope.
- Omits exit-code handling.
- Moves flows into generic runtime-control without naming the automation/flows
  branch.
