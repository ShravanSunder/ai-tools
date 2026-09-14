# Persistent managed conversations

- `shravan-dev-workflow` 2.14.0: Worker/Reviewer roles, harness-specific execution nuance, subordinate labels, user-controlled Advisors and 26-minute Codex idle maintenance.
- Sidekicks and Advisors use separate persistent conversations; reuse the same session across follow-ups and new assignments, including ACPX.
- Workers select native or separate conversations according to the task; reviewer independence and phase gates remain intact.
- `codex-router` 0.6.0: current scoped-inbox/search reference plus management/collaboration ownership and identity boundaries.
- Updated management provider/session references, role callers and focused collaboration scenarios.
- Static checks: 121 unit tests passed; typecheck, Claude manifest validation, pinned-source check and diff whitespace check passed.
- Focused pressure run: three semantic passes and one wake-cadence failure; further pressure testing paused at owner request pending design agreement.
- Installed CLI/caches not upgraded; no production restart or home activation.
