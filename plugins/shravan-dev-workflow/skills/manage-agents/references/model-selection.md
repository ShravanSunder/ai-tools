# Model Selection

Load this after choosing the agent category and assignment. This file owns the
mapping from task risk and lineage needs to model capability. Provider command
grammar belongs in provider and runtime references.

## Decision Rule

Choose in this order:

```text
assignment and cognitive load -> risk -> lineage -> capability
                              -> availability -> fallback
```

- Use Luna-level agents for bounded collection and monitoring: file/log
  inventory, simple git/status/check reads, counting, scripts, PR babysitting,
  and structured receipts.
- Use Terra, Sol, or an independent outside lineage for correlated synthesis,
  architecture, adjudication, cross-module review, or high-risk judgment.
- Collectors return facts and anchors; they do not decide. The parent consumes
  reduced receipts and verifies load-bearing anchors instead of repeating raw
  scraping, except when a receipt is contested, incomplete, or failed.

Completion: the ledger records assignment, risk, lineage requirement, selected
model and reasoning level, provider, and fallback or blocked condition.

## Current-Generation Guidance

This is a dated snapshot. Runtime-advertised ids and current access are
authoritative.

| Category / assignment | Current guidance | Minimum level |
| --- | --- | --- |
| Advisor | GPT-5.6 Sol or Claude Fable, normally from a lineage different from the parent. | high or above |
| Sidekick | GPT-5.6 Sol, Terra, Fable, Opus, or Grok 4.5 through Cursor. | medium or above |
| High-risk outside judge | Claude Opus or another explicitly independent frontier reviewer; use a separate lineage from the implementation owner. | high or above |
| Review subagent | Opus, Sol, Terra, or Luna according to scope and risk. Increase capability for cross-module, security, architecture, or release claims. | task-dependent |
| Operational subagent | Luna, Sonnet, or Cursor Composer 2.5 for monitoring, scripts, PR babysitting, merge observation, and reporting. | normal task level |

An outside judge is an assignment, not an agent category.

## Fallback

Verify the exact advertised model id before dispatch. If lineage independence
or a minimum capability is required, a weaker or same-lineage substitute is not
equivalent success. Use a declared equivalent fallback or report the lane
degraded/blocked; never silently green missing high-risk judgment.
