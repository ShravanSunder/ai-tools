# Manage Agents Pattern Tables And Terra

## Release

- Plugin: `shravan-dev-workflow` `1.6.61`
- Skill: `manage-agents`

## Change

- Splits preferred models into per-pattern tables under Advisor, Sidekick, Delegate, and Operator.
- Advisor: OpenAI Sol (high/xhigh/max) and Claude Fable (medium/high/xhigh).
- Sidekick: OpenAI Sol Frontier (high/xhigh) and Balanced (low/medium).
- Delegate: OpenAI Sol, Claude Opus, Cursor Grok 4.5 at Balanced.
- Operator: OpenAI Luna, OpenAI Terra (low/medium), Cursor Composer 2.5 at Mini.
- Adds model versions and provider tables; shortens Native/ACPX runtime blurbs.
- Provider refs use model-id-only tables; Cursor lists Fable/Opus/GPT as user-request-only; Claude adds `claude-opus-4-8`.

## Validation

- Static skill/docs wording review.
- Monospace table padding verified across pattern and provider tables.
- Version consistency: Codex and Claude plugin manifests both `1.6.61`.

## Refresh / reinstall

- Codex and Claude caches refreshed after merge so live agents pick up `1.6.61`.
