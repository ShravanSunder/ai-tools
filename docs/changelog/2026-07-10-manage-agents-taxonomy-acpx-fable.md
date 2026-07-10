# Manage Agents Taxonomy And ACPX Fable

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.51`

## User-Visible Changes

- Defines advisor, sidekick, and subagent as the agent categories. Advisors and
  sidekicks are normally one persistent relationship; a swarm is multiple
  independent subagents, not a peer category.
- Separates assignment, topology, model lineage, reasoning level, provider,
  runtime, permissions, receipts, and parent reduction.
- Adds current-generation model guidance for advisors, sidekicks, review
  subagents, high-risk outside judges, and operational monitoring/reporting.
- Separates Luna-level mechanical collection and monitoring from Terra/Sol or
  outside-lineage synthesis and judgment. Parents consume reduced receipts and
  verify only load-bearing anchors instead of repeating raw log scraping.
- Requires persistent advisor/sidekick continuity reasons, assignment-bound
  receipt levels, stale-output rejection, and explicit lifecycle handling for
  reconnect, authentication, model, permission, and provider-limit failures.
- Links delegated PR monitoring to `manage-agents`: an operational monitor may
  report state deltas, but judgment, code changes, disputed review handling,
  readiness, and merge authority return to the main agent through a decision
  packet.
- Adds a provider map for Codex, Claude, and Cursor. Cursor is treated as a
  multi-model provider whose catalog is constrained by account usage limits;
  Composer 2.5 is grouped with Luna and Sonnet for operational work.
- Documents the locally verified Claude Fable ACPX environment, exact
  `claude-fable-5[1m]` id, high-or-above effort control, user-settings hazards,
  and persistent advisor lifecycle.
- Assigns generic ACPX controls to `runtime-control.md` and the complete session
  lifecycle, cwd lookup, history previews, and full readback to
  `session-ledger.md`.
- Prefers the global `acpx` binary, then `pnpm dlx acpx`, then
  `npx --yes acpx`; routine examples are not pinned to the research version.

## Cumulative Release Scope

- `AGENTS.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/agents/openai.yaml`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `docs/changelog/README.md`

## Validation

- Live ACPX 0.12 help was inspected for prompt, exec, cancel, set-mode, set,
  status, session lifecycle, compare, config, and flow commands; all inspected
  help commands exited 0.
- An existing successful Fable session record was inspected for exact model,
  effort options, settings behavior, and session capability evidence.
- A fresh persistent Fable advisor launched with the documented environment,
  reported the exact custom model, accepted `xhigh` effort, completed a
  read-only changed-surface review, and returned candidate findings. Parent
  verification accepted and fixed cwd pinning, packet-only permission wording,
  and reference-ownership findings.
- The same Fable advisor relationship resumed after a reconnect request for an
  `xhigh` completion check. Parent verification accepted and fixed delegated
  PR-monitor authority leakage, multi-sidekick overclassification, child-owned
  verification wording, and identity/configuration transition ambiguity.
- Codex skill quick validation passed: `Skill is valid!`, exit 0.
- JSON manifest parsing passed, exit 0.
- `claude plugin validate .` passed, exit 0.
- `git diff --check` passed, exit 0.
- Pressure-test reruns are intentionally deferred to the accepted pressure-test
  reorganization work; the old harness is not release proof for this change.

## Refresh Status

- Codex installed-cache refresh: not run; source-only worktree.
- Claude installed-cache refresh: not run; source-only worktree.
