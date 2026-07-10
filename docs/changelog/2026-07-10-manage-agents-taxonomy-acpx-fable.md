# Manage Agents Taxonomy And ACPX Fable

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.51`

## User-Visible Changes

- Defines Advisor, Sidekick, and Delegate as relationship patterns. Advisor and
  Sidekick are persistent; Delegate is one bounded assignment; native subagent
  is a runtime; swarm is multiple Delegates.
- Adds an Operator assignment route for procedures, monitoring, simple
  `git`/`gh` and PR checks, scripts, scraping, and structured reporting. Operator
  always uses Mini and escalates judgment through a decision packet.
- Defines model categories once: Frontier is GPT-5.6 Sol or Claude Fable;
  Balanced is GPT-5.6 Terra, Claude Opus, or Grok 4.5; Mini is GPT-5.6 Luna or
  Cursor Composer 2.5.
- Requires Advisor to use Frontier at medium reasoning or above, Sidekick to
  use Frontier/Balanced at medium or above, and Delegate to use Balanced/Mini
  at any reasoning effort.
- Parents consume reduced receipts and verify load-bearing anchors instead of
  repeating raw log scraping.
- Requires persistent advisor/sidekick continuity reasons, assignment-bound
  receipt levels, stale-output rejection, and explicit lifecycle handling for
  reconnect, authentication, model, permission, and provider-limit failures.
- Links delegated PR monitoring to `manage-agents`: an operational monitor may
  report state deltas, but judgment, code changes, disputed review handling,
  readiness, and merge authority return to the main agent through a decision
  packet.
- Adds a provider map for Codex, Claude, and Cursor. Cursor is treated as a
  multi-model provider whose catalog is constrained by account usage limits;
  Composer 2.5 is grouped with Luna as Mini.
- Documents the locally verified Claude Fable ACPX environment, exact
  `claude-fable-5[1m]` id, effort control, user-settings hazards,
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
- A fresh GPT-5.6 Terra high-reasoning Delegate reviewed every changed skill,
  provider, runtime, PR-wrapup, and public release surface. Parent verification
  fixed its two taxonomy findings; targeted rereview confirmed both resolved.
- The final skill folder was reduced from 1,353 to 660 lines by deleting the
  duplicate glossary and pruning duplicate packet, provider, runtime, and
  session guidance.
- Codex skill quick validation passed: `Skill is valid!`, exit 0.
- JSON manifest parsing passed, exit 0.
- `claude plugin validate .` passed, exit 0.
- `git diff --check` passed, exit 0.
- Pressure-test reruns are intentionally deferred to the accepted pressure-test
  reorganization work; the old harness is not release proof for this change.

## Refresh Status

- Codex installed-cache refresh: not run; source-only worktree.
- Claude installed-cache refresh: not run; source-only worktree.
