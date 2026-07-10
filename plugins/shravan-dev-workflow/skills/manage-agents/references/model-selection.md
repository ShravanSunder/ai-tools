# Model Selection

`orchestration-patterns.md` chooses the model category and reasoning floor.
This table resolves the category to current model names.

| Model category | Models |
| --- | --- |
| Frontier | GPT-5.6 Sol, Claude Fable |
| Balanced | GPT-5.6 Terra, Claude Opus, Grok 4.5 through Cursor |
| Mini | GPT-5.6 Luna, Cursor Composer 2.5 |

Use the native runtime when it exposes the chosen model. Use ACPX when the
model requires another provider/lineage or a persistent cross-provider session.

Verify the provider-advertised model id. Use a declared equivalent fallback or
report degraded/blocked when the required category or lineage is unavailable.
