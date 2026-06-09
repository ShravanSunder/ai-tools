# Shravan Dev Workflow

Codex-first development workflow plugin for spec design swarms, adversarial spec council review, security scan routing, evidence-backed code and plan review, copy-pasteable plan and implementation handoffs, validated plan execution, diagnosis-first debugging, skill audits, TUI presentation guidance for structured chat output, and Linear work organization.

This plugin intentionally replaces the older broad counsel pattern with a narrower workflow:

- Codex subagents are the default and majority reviewer backend because most sessions run in Codex.
- Reviewer lanes are backend-aware: Claude, `agy`/Gemini, or another available harness can back a bounded lane when explicitly requested or required by the skill.
- One `agy` pass is used as an external model input for substantial reviews when available, preferring Gemini Pro/High.
- Claude or extra `agy` adversarial lanes are opt-in when the user explicitly asks for them. Claude uses only the Claude Code CLI harness.
- Oracle is never part of this workflow.
- Plans and handoffs are first-class workflow skills: read the full artifact when a source file exists, prove coverage, verify against live repo state, and keep subagents bounded.
- Spec/design formation is subagent-aware: explorer, architecture, security, and adversarial lanes provide evidence while the parent owns synthesis.
- Explicit security scans are routed to the official Codex Security workflows instead of reimplemented in normal review skills.
- Debugging is diagnosis-first: prove the root cause before fixing, and use subagents only for bounded read-only investigation slices.
- Skill creation is evidence-backed: audit current skills, sessions, and upstream inspirations before adding new workflow surface.
- TUI presentation guidance is bundled here so structured design, comparison, architecture, and multi-section responses share one workflow plugin.
- Linear work guidance is bundled here so project, milestone, issue, and dependency workflows are plugin-native instead of sync-script delivered.

## Skills

### `implementation-subagent-review`

Runs a structured review swarm with review reception:

1. Build a shared review packet from the requested mode, scope, git range, intent, and constraints.
2. Run spec compliance first for implementation or plan-backed reviews.
3. Dispatch read-only specialist reviewer lanes, normally backed by Codex subagents.
4. Add an `agy` external model lane as an independent input for substantial reviews when available.
5. Optionally add Claude or extra Gemini/agy when explicitly requested.
6. Verify, dedupe, and rank candidate findings.
7. For current-session implementation work, fix accepted blocker/important findings unless the user asked for report-only review.
8. Report a verdict with coverage, fix follow-through, PR thread state when applicable, and remaining blockers.

The reducer treats all reviewer outputs as evidence, not truth. Findings must include file or symbol evidence, a concrete failure scenario, and a smallest useful fix. Accepted findings are validated before any edit.

### `plan-handoff`

Packages a plan, design, spec, or implementation brief for another agent, CLI, machine, or future session. It writes repo-local temp artifacts such as `plan-handoff.md` and `copy-paste-prompt.md`, and also prints the copy-paste prompt in the response so the user can pass it directly to another agent.

### `spec-design-swarm`

Shapes a new spec, design, or architecture before an implementation plan exists. It uses bounded codebase explorer, prior-art, architecture-pressure, security, and adversarial lanes, then synthesizes a recommended direction, tradeoffs, non-goals, and open decisions.

### `spec-adversarial-council-design`

Runs a post-draft, pre-execution council review over a spec, design, or architecture proposal. It loads the full artifact, dispatches adversarial lanes, and reduces outputs into accepted, contested, open, and rejected issues with parent-owned verification.

### `security-scan-router`

Routes explicit security scans to the official Codex Security workflows: `security-diff-scan`, `security-scan`, `deep-security-scan`, `fix-finding`, or `threat-model`. Normal review skills keep lightweight security lanes; this skill handles audit-grade routing and handoff.

### `implementation-handoff`

Packages actual implementation state at any stage: planned, in-progress, pre-review, post-review, or blocked. It writes `implementation-handoff.md` and `copy-paste-prompt.md`, prints the prompt in the response, and is suitable for manual Claude/Gemini/Codex reviewer or continuation handoffs.

### `plan-review`

Runs an adversarial plan review swarm before implementation. It requires whole-artifact coverage for plan files, dispatches bounded reviewer lanes for substantial plans, optionally includes user-requested Claude/Gemini/`agy` external model lanes, checks major claims against live code/docs/package state, validates candidate findings, and revises writable current-session plans for accepted blocker/important findings without implementing code.

### `plan-validate-execute`

Executes written plans only after validating them against the current repo. It can use subagents for bounded parallel slices, but the parent agent owns task packets, integration, diff review, verification, and final completion claims.

### `debug-investigation`

Investigates bugs, failing tests, flaky behavior, crashes, regressions, build failures, and unexpected behavior before fixes. It builds a bug packet, traces code and evidence, optionally dispatches bounded read-only subagent lanes, and returns a ranked diagnosis plus fastest proof path.

### `skill-audit`

Audits current plugin skills, session evidence, and admired upstream skill sources before recommending create, update, merge, or skip decisions. It prefers tightening existing skills over creating duplicates.

### `tui-presentation`

Presents design, architecture, comparison, flow, and multi-section chat output with Unicode TUI structure while preserving semantic markdown for fenced code blocks, inline technical tokens, file links, URLs, and runnable/copyable snippets.

### `pm-linear-work`

Organizes Linear projects, milestones, issues, and dependencies using the docs-are-truth, tickets-are-tracking paradigm. Use MCP tools for normal Linear operations and the Linear CLI only for gap operations such as surgical relation changes, deletion, or issue start.

## Source Inspirations

This plugin keeps concise provenance in [`references/source-inspirations.md`](references/source-inspirations.md). Use that file as a best-practice map, not as copied upstream text.

## Post-Restart Smoke Test

After installing or refreshing the plugin and restarting Codex, verify the plugin in the live session:

1. Confirm the skills appear in the available skill list as `shravan-dev-workflow:implementation-subagent-review`, `shravan-dev-workflow:plan-handoff`, `shravan-dev-workflow:implementation-handoff`, `shravan-dev-workflow:spec-design-swarm`, `shravan-dev-workflow:spec-adversarial-council-design`, `shravan-dev-workflow:security-scan-router`, `shravan-dev-workflow:plan-review`, `shravan-dev-workflow:plan-validate-execute`, `shravan-dev-workflow:debug-investigation`, `shravan-dev-workflow:skill-audit`, `shravan-dev-workflow:tui-presentation`, and `shravan-dev-workflow:pm-linear-work`.
2. Ask for a small local review: `Use implementation-subagent-review to review the last change.`
3. Confirm Codex builds a shared review packet, runs spec compliance when applicable, and dispatches read-only reviewer lanes, normally backed by Codex subagents.
4. Ask for a plan review: `Use plan-review on this plan and include Gemini/agy adversarial counsel.`
5. Confirm substantial plan reviews run bounded plan-review lanes and record skipped or completed external model lanes.
6. Ask for a design pass: `Use spec-design-swarm to shape this feature before writing a plan.`
7. Ask for a spec council pass: `Use spec-adversarial-council-design to attack this spec before implementation.`
8. Ask for scan routing: `Use security-scan-router for this authorized PR security scan.`
9. Ask for a read-only debug pass: `Use debug-investigation to investigate this failing test without editing files.`
10. Ask for an audit pass: `Use skill-audit to inspect shravan-dev-workflow and recommend only high-confidence skill updates.`
11. Confirm `agy` availability with `command -v agy`, `agy --version`, and `agy models`.
12. Confirm Claude Code harness availability with `claude --version` and a Haiku smoke.
13. Run one review request that includes an external adversarial model lane: `Use implementation-subagent-review and include Gemini/agy adversarial review.`
14. Run one review request that includes Claude explicitly: `Use implementation-subagent-review and include Claude adversarial review.`
15. Confirm the final report includes a verdict, swarm coverage, skipped inputs if any, candidate counts, and only verified findings.

Behavioral pass criteria:

- Codex treats subagent, `agy`, Claude, and other reviewer-lane outputs as candidate findings, not final truth.
- Accepted reviewer findings are validated against repo reality before editing.
- Current-session implementation reviews fix accepted blocker/important findings unless explicitly report-only.
- PR review threads are resolved only after they are proven stale or the real issue is fixed and verified.
- Claude is not invoked unless explicitly requested, and when invoked it uses `claude --print`, not Anthropic API calls.
- Oracle is not mentioned or invoked.
- Failed or skipped external model lanes are reported without failing the whole review.
- Plan review uses bounded read-only subagents by default for substantial plans, and skips them only with a stated reason.
- Plan review updates writable current-session plans for accepted blocker/important findings, but does not implement code.
- Spec-design-swarm does not implement code and records security context when sensitive surfaces are touched.
- Spec-adversarial-council-design preserves accepted, contested, and open findings instead of forcing fake consensus.
- Security-scan-router routes explicit scans to official Codex Security workflows and does not claim audit coverage from a normal review lane.
- Debug investigation does not implement fixes until the diagnosis is proven or uncertainty is explicitly accepted.
- Skill audit recommends updates before new skills and cites evidence or upstream inspiration for every recommendation.
