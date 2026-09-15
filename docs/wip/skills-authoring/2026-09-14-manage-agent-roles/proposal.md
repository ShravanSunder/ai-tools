# Manage agent roles — bounded update

Target: shravan-dev-workflow / manage-agents. User-directed behavior change. Scope: implement this named skill plus necessary terminology-only caller/fixture cutover; document the remaining broader workflow changes separately. No devfiles edits, merge, cache refresh, runtime timer, or Router service changes.

Success: agents choose Advisor, Sidekick, Worker, Reviewer or Operator by the job; name subordinate threads visibly; prefer Codex Terra/Luna and Claude Opus medium for execution; use a 26-minute idle maintenance target; keep independent reviews fresh and allow same-review continuation without implementation contamination; create no Advisor without user choice.

## Decisions
- No main-agent name, icon or extra thread.
- Names where supported: 🐒 Sidekick · purpose; 🦉 Advisor · purpose; 🛠️ Worker · purpose; 🔎 Reviewer · purpose; 🔧 Operator · purpose. ASCII task IDs remain legal when host requires them; no new session solely for naming.
- Worker replaces Delegate for bounded interpretive work (implementation/research/drafting). Reviewer is separate, read-only and candidate-only; its own review history may continue for corrections to the same target, but it never inherits author context or edits its review subject. Unrelated target or compromised independence starts fresh.
- Codex Sidekick: Terra medium only. Codex Worker: Terra medium for substantive work; Luna xhigh only for simple bounded tasks. Luna is never a Sidekick or Reviewer. Latest instruction supersedes previous Sol/Grok execution preference on Codex. Claude Code execution prefers Opus medium; Cursor execution prefers Grok medium. Named caller model choice honored when legal for the role and exposed by runtime; unavailable preference returns a gap, not silent expensive substitution. Execution roles do not use Frontier.
- Reviewer uses a different model lineage from the author, as explicitly corrected by the user. Lineage means model family/provider lineage (OpenAI, Claude, Grok), not launcher. Another OpenAI model is not cross-lineage. Supported review candidates: Opus medium, Grok high, Terra medium, Sol medium; explicitly user-selected Astra/Fable medium/high for stronger review. Choose an eligible different lineage first, then native/ACPX runtime per current provider contracts. Never fall back same-lineage silently. If author lineage unknown or no eligible route, report missing evidence/capability. Fresh review context; same-review continuation is allowed. No Advisor launched as a substitute.
- Advisor is user-controlled guidance, never automatic, and never silently replaced by an expensive Sidekick. Model/effort selected with user; no extra Frontier advisor merely because main is Frontier.
- Operator remains mechanical, no judgment/edits; Luna high on Codex, Opus medium if native Claude is the chosen available harness; no automatic cross-provider setup merely to optimize a small command. Existing user-selected runtime override remains supported.
- Keep native first when capabilities suffice; separate Router sessions only for explicit access/lifecycle need. Complete first packet; concise same-assignment follow-ups. Existing narrow role authority preserved.
- 26 minutes is management's Codex idle-maintenance target, not a provider cache guarantee. Useful active model requests reset activity; never ping a busy worker. Use bounded wait/notification; no paid polling loop. For other harnesses do not invent TTL. A cold cache does not destroy a session. No actual wake/schedule creation in this update.
- Update management references to new roles; fix reviewer-pattern Delegate callers to Reviewer and bounded non-review role calls to Worker. Preserve review lane cardinality, review coordination ownership, whole-source requirements, stopping gates, and broad inline implementation default until next planned phase.
- Existing collaboration skill still has 29-minute prose; changing its canonical source is a later named skill run. Management consumes its wake mechanics with an explicit 26-minute interval (compatible with existing under29 rule). Document stale duplicated policy for later consolidation; do not write vendored collaboration directly.

## Surfaces
Trigger: name worker/reviewer and lifecycle/selection situations; retain model-invocable and user-invocable.
Main path: compact role selection, harness-aware economics, five role sections and explicit Reviewer independence/continuity, name guidance, 26-minute management rule, assignment/continuation workflow.
Depth: existing agent-job-packet, session-ledger, native-providers-codex, ACPX provider refs. Native ref maps only currently advertised lifecycle tools rather than claiming universal send_input/resume_agent/close_agent availability. No new scripts/lane/schema; existing packet enum updated to reviewer/worker.
Proof: existing management scenarios updated without weakening intent; add harness selection, role names, user-controlled Advisor, same-review continuation and busy/idle cache scenarios. Review source before tests. Run relevant real pressure suite, validators and type/unit checks; report runtime/provider blockers honestly. No causal RED claim.

## Coordination
Worktree ai-tools.feat-manage-agents-model-effort-matrix at 9308e61; only prior WIP documents untracked. Do not absorb them into source commits. Plugin current 2.13.1; reserve 2.14.0 only if still unused before implementation. Update matching manifests/marketplace versions and dated changelog. No merge or home refresh authorized. User asked to discuss and plan remaining skills after this bounded update.

## Security
Existing native/CLI reference instructions only; no new executable helpers, secrets, permissions, account switching, sandbox bypass or service operations. Host capability documentation must not invent flags. Read-only source/fixture validation and model pressure runs only. Any new sensitive executable requirement routes back before editing.

## Review
Proposal review required: mental-model-fit, trigger-routing, rule-agreement, depth-coverage; fresh read-only candidate lanes, parent reduces. Current draft unreviewed. One bounded proposal remediation permitted. Independent changed-source review and proof follow before completion.

Latest owner correction: Luna only for simple Worker tasks and Operator work; remove it from continuing and review roles. Main-agent naming/icon omitted entirely from runtime instructions. Reviewer cross-lineage is confirmed, not pending.

## Execution table nuance (owner refinement)
Both Sidekick and Worker tables include a concise Use when / guidance needed column. Terra medium: coherent ongoing ownership or substantive bounded implementation requiring interpretation, supplied scope/constraints/source anchors/proof criteria, escalation on unmade decisions. Opus medium on Claude Code: analogous native sustained/substantive execution; do not launch Claude solely to satisfy a table preference on Codex. Luna xhigh: simple bounded execution with full guidance (exact scope, steps, source pointers, expected outcome, validation command and stop condition); return uncertainty instead of inventing architecture. Luna stays Worker-only or Operator-high, never Sidekick/Reviewer. Complete guidance does not turn interpretive work into a scriptable Operator; the actual judgment required decides the role.
