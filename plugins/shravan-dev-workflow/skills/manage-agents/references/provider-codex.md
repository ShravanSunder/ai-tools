# Provider: Codex

Load this when the subordinate agent is Codex through ACPX and Codex-specific
behavior affects the run.

## When To Use Codex

Use Codex as the default subordinate coding agent when the task fits the local
Codex workflow, needs repo-aware code reasoning, or should stay inside the
Codex-first review/implementation stack.

Completion: Codex selection is deliberate when another provider was requested
or available.

## Command Shapes

```bash
acpx codex exec 'one-shot summary'
acpx codex sessions ensure --name backend
acpx codex -s backend 'continue the backend investigation'
acpx --model gpt-5.4 codex exec 'review changed files'
```

Completion: persistent Codex work records the session name and cwd; one-shot
work records why no resume is needed.

## Model And Config Caveats

Codex model ids must be accepted by the adapter. If the built-in command fails
because local Codex config cannot be parsed or an adapter wrapper is broken,
try a raw ACP adapter only when the user approves or the run already permits
that fallback:

```bash
acpx --agent 'npx -y @agentclientprotocol/codex-acp' exec 'sanity check'
```

Completion: raw-adapter fallback is reported as a fallback, not hidden as the
normal provider path.

## Permissions

For review-only Codex subordinate calls, prefer `--no-terminal` or
`--deny-all`/policy-limited execution. For implementation tasks, keep the write
scope explicit and parent-owned.

Completion: Codex tool authority is no broader than the job requires.
