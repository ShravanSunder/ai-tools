# 2026-09-15 Collaboration: Agents display name

- Marketplace plugin: `agent-router` `0.7.1`
- Affected skill: `agent-collaboration`
- Codex UI title is now `Collaboration: Agents`. Machine id stays `agent-collaboration`.
- Added `plugins/agent-router/skills/agent-collaboration/agents/openai.yaml`.
- Orchestrator titles were already present: `Orchestrator: Design`, `Orchestrator: Implementation Goal`.
- Validation: JSON manifests parse; OpenAI YAML parses; `claude plugin validate .` run in this change.
- Local Codex/Claude caches were not refreshed. A later Router skill sync can drop this yaml unless it is preserved or added upstream.
