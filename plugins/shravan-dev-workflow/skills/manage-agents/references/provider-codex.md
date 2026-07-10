# Provider: Codex

Use native Codex subagents when they expose the selected model. Use ACPX Codex
for a portable named session, queue control, or cross-provider flow.

Use the exact model/reasoning options advertised by the current adapter. If a
raw adapter is required, report it as a fallback:

```bash
acpx --agent 'npx -y @agentclientprotocol/codex-acp' exec 'sanity check'
```

Keep review authority read-only/policy-limited and implementation write scope
explicit.
