# Shravan Dev Workflow

Codex-first development workflow plugin for evidence-backed code and plan review, TUI presentation guidance for structured chat output, and Linear work organization.

This plugin intentionally replaces the older broad counsel pattern with a narrower workflow:

- Codex subagents are the primary reviewers.
- One `agy` pass is used as an external counsel input for substantial reviews when available, preferring Gemini Pro/High.
- Claude or extra `agy` adversarial lanes are opt-in when the user explicitly asks for them. Claude uses only the Claude Code CLI harness.
- Oracle is never part of this workflow.
- TUI presentation guidance is bundled here so structured design, comparison, architecture, and multi-section responses share one workflow plugin.
- Linear work guidance is bundled here so project, milestone, issue, and dependency workflows are plugin-native instead of sync-script delivered.

## Skills

### `subagent-review`

Runs a structured review swarm:

1. Build a shared review packet from the requested mode, scope, git range, intent, and constraints.
2. Run spec compliance first for implementation or plan-backed reviews.
3. Dispatch read-only specialist Codex subagent lanes.
4. Add `agy` counsel as an independent input for substantial reviews when available.
5. Optionally add Claude or extra Gemini/agy when explicitly requested.
6. Verify, dedupe, rank findings, and report a verdict with coverage.

The reducer treats all reviewer outputs as evidence, not truth. Findings must include file or symbol evidence, a concrete failure scenario, and a smallest useful fix.

### `tui-presentation`

Presents design, architecture, comparison, flow, and multi-section chat output with Unicode TUI structure while preserving semantic markdown for fenced code blocks, inline technical tokens, file links, URLs, and runnable/copyable snippets.

### `linear-work`

Organizes Linear projects, milestones, issues, and dependencies using the docs-are-truth, tickets-are-tracking paradigm. Use MCP tools for normal Linear operations and the Linear CLI only for gap operations such as surgical relation changes, deletion, or issue start.

## Post-Restart Smoke Test

After installing or refreshing the plugin and restarting Codex, verify the plugin in the live session:

1. Confirm the skills appear in the available skill list as `shravan-dev-workflow:subagent-review`, `shravan-dev-workflow:tui-presentation`, and `shravan-dev-workflow:linear-work`.
2. Ask for a small local review: `Use subagent-review to review the last change.`
3. Confirm Codex builds a shared review packet, runs spec compliance when applicable, and dispatches read-only Codex reviewer lanes.
4. Confirm `agy` availability with `command -v agy`, `agy --version`, and `agy models`.
5. Confirm Claude Code harness availability with `claude --version` and a Haiku smoke.
6. Run one review request that includes external adversarial counsel: `Use subagent-review and include Gemini/agy adversarial review.`
7. Run one review request that includes Claude explicitly: `Use subagent-review and include Claude adversarial review.`
8. Confirm the final report includes a verdict, swarm coverage, skipped inputs if any, candidate counts, and only verified findings.

Behavioral pass criteria:

- Codex treats subagent and `agy` outputs as candidate findings, not final truth.
- Claude is not invoked unless explicitly requested, and when invoked it uses `claude --print`, not Anthropic API calls.
- Oracle is not mentioned or invoked.
- Failed or skipped external counsel is reported without failing the whole review.
