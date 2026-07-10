# Model Selection

Load this after choosing the agent category and assignment. This file owns the
mapping from task risk and lineage needs to model capability. Provider command
grammar belongs in provider and runtime references.

## Selection Order

Choose in this order:

1. Assignment: advice, implementation, review, research, monitoring, merge or
   PR babysitting, scripting, or reporting.
2. Risk: low, normal, high, or release/security/architecture critical.
3. Lineage: same lineage is acceptable, or independent lineage is required to
   reduce correlated blind spots.
4. Capability: model family plus minimum reasoning level.
5. Provider availability: advertised model id, account usage limits, session
   limits, and expected duration.
6. Fallback: a predeclared replacement that preserves required lineage and
   capability, or an explicit blocked/degraded result.

Do not select a model because its name sounds senior. Do not let a provider
silently substitute a cheaper model when independent lineage or a minimum
reasoning level is load-bearing.

Completion: the ledger records assignment, risk, lineage requirement, selected
model, reasoning level, provider, and fallback or blocked condition.

## Cognitive-Load Dispatch

Use low-cost operational agents for bounded mechanical work, then hand their
structured receipts upward when the work becomes interpretive.

- Luna-level agents collect or monitor facts: file and log inventory, simple
  git/status/check reads, command census, structured counts or classification,
  PR babysitting, script execution, and concise reporting.
- Terra, Sol, or an explicitly independent outside lineage handles correlated
  synthesis, architecture, adjudication, cross-module review, or high-risk
  judgment. Increase capability with risk and ambiguity, not merely input size.
- The collector returns source anchors, commands, exit status, observed facts,
  confidence, and unresolved items. It does not turn correlation into accepted
  truth or make the blocked decision.
- The parent consumes reduced receipts and verifies load-bearing anchors. Do
  not make the parent repeat raw file or log scraping when an eligible
  collection lane is available, except to resolve a contested, incomplete, or
  failed receipt.

Completion: the assignment names whether the agent is collecting, synthesizing,
or deciding, and its capability matches that cognitive load.

## Current-Generation Guidance

This is a dated operating snapshot, not a permanent ranking. Runtime-advertised
ids, current access, and observed behavior are authoritative.

| Category / assignment | Current guidance | Minimum level |
| --- | --- | --- |
| Advisor | GPT-5.6 Sol or Claude Fable, normally from a lineage different from the parent. | high or above |
| Sidekick | GPT-5.6 Sol, Terra, Fable, Opus, or Grok 4.5 through Cursor. | medium or above |
| High-risk outside judge | Claude Opus or another explicitly independent frontier reviewer; use a separate lineage from the implementation owner. | high or above |
| Review subagent | Opus, Sol, Terra, or Luna according to scope and risk. Increase capability for cross-module, security, architecture, or release claims. | task-dependent |
| Operational subagent | Luna, Sonnet, or Cursor Composer 2.5 for monitoring, scripts, PR babysitting, merge observation, and reporting. | normal task level |

An outside judge is an assignment, not a fourth agent category. Use an advisor
when continuity and consultation checkpoints matter; use a review subagent when
one bounded independent verdict is enough.

## Availability And Fallback

- Codex and Claude model availability can vary by account and active session
  limits.
- Cursor is a multi-model provider. Its catalog and usage limits may make
  Composer, Grok, or another model unavailable during a run.
- Verify the exact advertised id before dispatch. Friendly names are not proof
  that the provider accepted the intended model.
- If an advisor requires different lineage, a same-lineage fallback is not an
  equivalent success. Report the outside perspective as unavailable or choose
  another independent provider.
- If a high-risk judge is unavailable, do not silently green the work. Record
  the missing judgment and follow the owning workflow's blocked or escalation
  rule.

Completion: fallback behavior is explicit before a quota or session limit is
hit.
