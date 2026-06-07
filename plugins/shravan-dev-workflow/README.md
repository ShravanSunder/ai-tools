# Shravan Dev Workflow

Codex-first development workflow plugin for evidence-backed code and plan review.

This plugin intentionally replaces the older broad counsel pattern with a narrower workflow:

- Codex subagents are the primary reviewers.
- One `agy` pass is used as an external counsel input for substantial reviews when available.
- Claude, Gemini, or extra `agy` adversarial lanes are opt-in when the user explicitly asks for them.
- Oracle is never part of this workflow.

## Skills

### `subagent-review`

Runs a structured review swarm:

1. Build a shared review packet from the requested scope.
2. Dispatch read-only specialist Codex subagents.
3. Add `agy` counsel as an independent input.
4. Optionally add Claude or Gemini when explicitly requested.
5. Synthesize, verify, dedupe, and rank findings.

The reducer treats all reviewer outputs as evidence, not truth. Findings must include file or symbol evidence, a concrete failure scenario, and a smallest useful fix.

## Post-Restart Smoke Test

After installing or refreshing the plugin and restarting Codex, verify the plugin in the live session:

1. Confirm the skill appears in the available skill list as `shravan-dev-workflow:subagent-review`.
2. Ask for a small local review: `Use subagent-review to review the last change.`
3. Confirm Codex builds a shared review packet and dispatches read-only Codex reviewer lanes.
4. Confirm `agy` availability with `command -v agy` and `agy --version`.
5. Run one review request that includes external adversarial counsel: `Use subagent-review and include Gemini/agy adversarial review.`
6. Confirm the final report includes swarm coverage, skipped inputs if any, and only verified findings.

Behavioral pass criteria:

- Codex treats subagent and `agy` outputs as candidate findings, not final truth.
- Claude and Gemini are not invoked unless explicitly requested.
- Oracle is not mentioned or invoked.
- Failed or skipped external counsel is reported without failing the whole review.
