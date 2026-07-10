# Automation And Flows

Load this when ACPX output is consumed by a script, when exit codes decide
control flow, when JSON must be parsed, or when a multi-step TypeScript flow is
the right shape.

## Output Modes

Pick the format by consumer:

```text
human terminal     -> text
full transcript    -> --format json
strict pipeline    -> --format json --json-strict
final answer only  -> --format quiet
large read logs    -> add --suppress-reads
```

Completion: the chosen format matches the consumer, and scripts never parse
human `text` output.

Troubleshooting source: https://acpx.sh/output-formats.html

## JSON Is Raw ACP

`--format json` emits raw ACP JSON-RPC NDJSON for adapter traffic. Do not assume
an ACPX-specific event envelope or synthetic `type`, `stream`, or
`eventVersion` keys.

Good starting point:

```bash
acpx --format json codex exec 'review changed files' \
  | jq -r 'select(.method=="session/update")'
```

Use `--json-strict` when stdout and stderr must remain machine-safe.

Completion: JSON parsers filter ACP JSON-RPC fields such as `method` and
`params`, not invented event-envelope fields.

## Quiet Mode

Use `--format quiet` when a wrapper needs only the final assistant text on
stdout. Failed quiet prompts emit one structured diagnostic line to stderr and
exit non-zero.

Completion: scripts keep stdout reserved for assistant text and branch on the
process exit code.

## Exit Codes

Use ACPX exit codes for wrapper branching:

```text
0    success
1    agent / protocol / runtime error
2    CLI usage error
3    timeout
4    no session found
5    permission denied
130  interrupted
```

Important meanings:

- `4` usually means the persistent scope was not found; inspect exact command
  and cwd, then ensure or intentionally resume.
- `5` means permission requests happened and all were denied or cancelled.
- `130` follows cooperative cancellation for interrupt/termination.

Completion: automation handles at least timeout, no-session, permission-denied,
and interrupted outcomes explicitly when those outcomes change the next step.

Troubleshooting source: https://acpx.sh/exit-codes.html

## Compare

Use `compare` for the same one-shot prompt across providers when serial
comparison is enough and persistent continuity is not required:

```bash
acpx compare codex claude cursor --file tmp/comparison-packet.md
acpx --format json compare codex claude --file tmp/review-packet.md
```

`compare` does not create saved sessions or a swarm with independent lane
packets. It runs the same prompt serially and returns per-agent status. Use a
real Delegate swarm when lanes need different scopes, source anchors, or
adversarial assignments.

Completion: compare results remain candidate outputs and provider agreement is
not treated as parent-verified truth.

## Flows

Use flows when the work is a repeatable graph of agent and deterministic steps,
not just one prompt with a follow-up.

```bash
acpx flow run examples/flows/branch.flow.ts \
  --input-json '{"task":"add a regression test for the reconnect bug"}'
```

Flow runs are for declared orchestration:

- `acp` nodes call agents.
- `action` nodes run supervised deterministic operations.
- `compute` nodes transform local data.
- decision nodes route to branches.
- run artifacts persist under the ACPX flow run directory.

Flows may declare permission requirements. If required grants are missing, ACPX
fails before the flow starts.

Completion: flow use is justified by repeatable multi-step routing, not by a
single ordinary agent call.

Troubleshooting source: https://acpx.sh/flows.html

## CLI Fallback

Use the full CLI reference only when exact global-option placement, flow
subcommand grammar, or format option syntax is unclear.

Troubleshooting source: https://acpx.sh/CLI.html
