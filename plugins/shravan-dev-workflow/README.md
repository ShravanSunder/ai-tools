# Shravan Dev Workflow

Codex-first development workflow plugin for goal orchestration, spec design swarms, spec handoffs, plan creation, discuss-with-me lifecycle alignment, docs maintenance, adversarial spec review swarms, operations security review routing, evidence-backed code and plan review, copy-pasteable plan and implementation handoffs, validated plan execution, diagnosis-first debugging, skill audits, TUI presentation guidance for structured chat output, and operations Linear tracking.

This plugin intentionally replaces the older broad counsel pattern with a narrower workflow:

- Codex subagents are the default and majority reviewer backend because most sessions run in Codex.
- Reviewer lanes are backend-aware: Claude, `agy`/Gemini, or another available harness can back a bounded lane when explicitly requested or required by the skill.
- Claude, Gemini/`agy`, or another outside adversarial lane is opt-in when the user explicitly asks for external counsel. Claude uses only the Claude Code CLI harness.
- Oracle is never part of this workflow.
- Plans, specs, debug investigations, and handoffs are first-class workflow skills: read the full artifact when a source file exists, prove coverage, write the lane artifact unless chat-only/no-files was requested, verify against live repo state, and keep subagents bounded.
- Handoff means portability, not completion: `spec-handoff` packages spec/design context, `plan-handoff` packages an existing implementation plan, and `implementation-handoff` packages real implementation state.
- Spec/design formation is subagent-aware: explorer, architecture, security, and adversarial lanes provide evidence while the parent owns synthesis.
- Discuss-with-me is available as an explicit trigger for lifecycle alignment across design, spec, plan, implementation-direction, and docs decisions.
- Orchestrator-goal is a thin long-horizon controller: clear goals become verifiable Codex/Claude `/goal` contracts; unclear goals route to `discuss-with-me`.
- Docs maintenance is a first-class workflow: keep `AGENTS.md` compact, README human-facing, changelog/runbook references durable, and classify existing specs/plans/debug artifacts for cleanup, archival, or promotion after the phase skill creates them.
- Explicit security scans are routed to the official Codex Security workflows instead of reimplemented in normal review skills.
- Debugging is diagnosis-first: prove the root cause before fixing, and use subagents only for bounded read-only investigation slices.
- Skill creation is evidence-backed: audit current skills, sessions, and upstream inspirations before adding new workflow surface.
- TUI presentation guidance is bundled here so structured design, comparison, architecture, and multi-section responses share one workflow plugin.
- Linear work guidance is bundled here so project, milestone, issue, and dependency workflows are plugin-native instead of sync-script delivered.

## Skills

### `implementation-review-swarm`

Runs a structured review swarm with review reception:

1. Build a shared review packet from the requested mode, scope, git range, intent, and constraints.
2. Run spec compliance first for implementation or plan-backed reviews.
3. Dispatch read-only specialist reviewer lanes, normally backed by Codex subagents.
4. Optionally add Claude, Gemini/agy, or another external adversarial lane when explicitly requested.
5. Verify, dedupe, and rank candidate findings.
6. For current-session implementation work, fix accepted blocker/important findings unless the user asked for report-only review.
7. Report a verdict with coverage, fix follow-through, PR thread state when applicable, and remaining blockers.

The reducer treats all reviewer outputs as evidence, not truth. Findings must include file or symbol evidence, a concrete failure scenario, and a smallest useful fix. Accepted findings are validated before any edit.

### `spec-design-swarm`

Shapes a new spec, design, or architecture before an implementation plan exists. It uses bounded codebase explorer, prior-art, architecture-pressure, security, and adversarial lanes, then synthesizes a recommended direction, tradeoffs, non-goals, and open decisions. For clear substantial work, it writes a lane artifact unless the user asked for chat-only/no-files output.

### `discuss-with-me`

Manual-only thinking clarification for design, spec, plan, implementation-direction, and docs decisions. It teaches back the current model, uses lightweight handles such as `reflect-back`, `grill-me`, `steelman`, `stress-test`, `assumption-check`, and `boundary-check`, asks one material question at a time with the agent's recommended answer, and hands off when discussion becomes review, debugging, security, docs editing, broad research, or execution.

### `orchestrator-goal`

Compiles clear long-horizon work into a verifiable Codex or Claude `/goal` contract, then routes the first phase to the right workflow skill. If objective, scope, proof gates, or stop conditions are unclear, it routes to `discuss-with-me` instead of setting a fuzzy goal.

### `docs-maintain`

Maintains docs as durable memory for humans and agents. It inventories doc roles, reconciles code/docs/artifact drift, proposes cleanup before destructive edits, classifies existing specs/plans/debug artifacts as current, historical, disposable, or promotion candidates, keeps `AGENTS.md` short, and stores meta-workflow history in `docs/changelog`.

### `spec-review-swarm`

Runs a post-draft, pre-plan review swarm over a spec, design, or architecture proposal. It loads the full artifact, dispatches adversarial lanes, and reduces outputs into accepted, contested, open, and rejected issues with parent-owned verification.

### `spec-handoff`

Packages spec, design, architecture, or product-decision context before an implementation plan exists. It preserves decisions, non-goals, contracts, tradeoffs, source evidence, security context, and open questions without creating an implementation plan or calling the spec complete.

### `plan-create`

Turns spec/design context into a written implementation plan without editing code. It owns task sequence, likely write surfaces, dependencies, validation gates, rollback/recovery notes, risks, security assumptions, and open questions.

### `ops-security-review`

Routes explicit security scans to the official Codex Security workflows: `security-diff-scan`, `security-scan`, `deep-security-scan`, `fix-finding`, or `threat-model`. Normal review skills keep lightweight security lanes; this skill handles audit-grade routing and handoff.

### `implementation-handoff`

Packages actual implementation state when branch, diff, changed files, commits, validation evidence, failed commands, blocker evidence, or implementation risk exists. It writes `implementation-handoff.md` and `copy-paste-prompt.md`, prints the prompt in the response, and is suitable for manual Claude/Gemini/Codex reviewer or continuation handoffs.

### `plan-handoff`

Packages an existing implementation plan for another agent, CLI, machine, or future session. It writes repo-local temp artifacts such as `plan-handoff.md` and `copy-paste-prompt.md`, and also prints the copy-paste prompt in the response so the user can pass it directly to another agent.

### `plan-review-swarm`

Runs an adversarial plan review swarm before implementation. It requires whole-artifact coverage for plan files, dispatches bounded reviewer lanes for substantial plans, writes a temp review report unless chat-only/no-files was requested, optionally includes user-requested Claude/Gemini/`agy` external model lanes, checks major claims against live code/docs/package state, validates candidate findings, and revises writable current-session plans for accepted blocker/important findings without implementing code.

### `implementation-execute-plan`

Executes written implementation plans only after validating them against the current repo. It can use subagents for bounded parallel slices, but the parent agent owns task packets, integration, diff review, verification, and final completion claims.

### `debug-investigation`

Investigates bugs, failing tests, flaky behavior, crashes, regressions, build failures, and unexpected behavior before fixes. It builds a bug packet, writes a debug investigation artifact unless chat-only/no-files was requested, traces code and evidence, optionally dispatches bounded read-only subagent lanes, and returns a ranked diagnosis plus fastest proof path.

### `skill-audit`

Audits current plugin skills, session evidence, and admired upstream skill sources before recommending create, update, merge, or skip decisions. It prefers tightening existing skills over creating duplicates.

### `tui-presentation`

Presents design, architecture, comparison, flow, and multi-section chat output with Unicode TUI structure while preserving semantic markdown for fenced code blocks, inline technical tokens, file links, URLs, and runnable/copyable snippets.

### `ops-linear-tracking`

Organizes Linear projects, milestones, issues, and dependencies using the docs-are-truth, tickets-are-tracking paradigm. Use MCP tools for normal Linear operations and the Linear CLI only for gap operations such as surgical relation changes, deletion, or issue start.

## Source Inspirations

This plugin keeps concise provenance in [`references/source-inspirations.md`](references/source-inspirations.md). Use that file as a best-practice map, not as copied upstream text.

## Release Notes

Public release notes live in [`../../docs/changelog/`](../../docs/changelog/). Use [`../../docs/changelog/references/plugin-release-checklist.md`](../../docs/changelog/references/plugin-release-checklist.md) for version, marketplace, cache refresh, and smoke validation rules.

## Post-Restart Smoke Test

After installing or refreshing the plugin and restarting Codex, verify the plugin in the live session:

1. Confirm the skills appear in the available skill list as `shravan-dev-workflow:implementation-review-swarm`, `shravan-dev-workflow:plan-handoff`, `shravan-dev-workflow:implementation-handoff`, `shravan-dev-workflow:spec-design-swarm`, `shravan-dev-workflow:discuss-with-me`, `shravan-dev-workflow:orchestrator-goal`, `shravan-dev-workflow:docs-maintain`, `shravan-dev-workflow:spec-review-swarm`, `shravan-dev-workflow:spec-handoff`, `shravan-dev-workflow:plan-create`, `shravan-dev-workflow:ops-security-review`, `shravan-dev-workflow:plan-review-swarm`, `shravan-dev-workflow:implementation-execute-plan`, `shravan-dev-workflow:debug-investigation`, `shravan-dev-workflow:skill-audit`, `shravan-dev-workflow:tui-presentation`, and `shravan-dev-workflow:ops-linear-tracking`.
2. Ask for a small local review: `Use implementation-review-swarm to review the last change.`
3. Confirm Codex builds a shared review packet, runs spec compliance when applicable, and dispatches read-only reviewer lanes, normally backed by Codex subagents.
4. Ask for a plan review: `Use plan-review-swarm on this plan and include Gemini/agy adversarial counsel.`
5. Confirm substantial plan reviews run bounded plan-review-swarm lanes and record skipped or completed external model lanes.
6. Ask for a design pass: `Use spec-design-swarm to shape this feature before writing a plan.`
7. Ask for lifecycle alignment: `Use discuss-with-me to talk through this design decision before editing files.`
8. Ask for a goal contract: `Use orchestrator-goal to turn the already-discussed plugin release into a verifiable /goal.`
9. Ask for a fuzzy goal: `Use orchestrator-goal to make my workflow better.`
10. Confirm the clear case compiles a goal contract and the fuzzy case routes to `discuss-with-me`.
11. Ask for docs maintenance: `Use docs-maintain to reconcile this README and AGENTS.md with current plugin state.`
12. Ask for a spec review swarm pass: `Use spec-review-swarm to attack this spec before planning.`
13. Ask for a spec handoff: `Use spec-handoff to package this design for another agent without creating the implementation plan.`
14. Ask for plan creation: `Use plan-create to turn this spec into an implementation plan without editing code.`
15. Ask for scan routing: `Use ops-security-review for this authorized PR security scan.`
16. Ask for a read-only debug pass: `Use debug-investigation to investigate this failing test without editing files.`
17. Ask for an audit pass: `Use skill-audit to inspect shravan-dev-workflow and recommend only high-confidence skill updates.`
18. Confirm `agy` availability with `command -v agy`, `agy --version`, and `agy models` only before a user-requested Gemini/agy lane.
19. Confirm Claude Code harness availability with `claude --version` and a Haiku smoke only before a user-requested Claude lane.
20. Run one review request that includes an external adversarial model lane: `Use implementation-review-swarm and include Gemini/agy adversarial review.`
21. Run one review request that includes Claude explicitly: `Use implementation-review-swarm and include Claude adversarial review.`
22. Confirm the final report includes a verdict, swarm coverage, skipped inputs if any, candidate counts, artifact paths where expected, and only verified findings.

Behavioral pass criteria:

- Codex treats subagent, `agy`, Claude, and other reviewer-lane outputs as candidate findings, not final truth.
- Accepted reviewer findings are validated against repo reality before editing.
- Current-session implementation reviews fix accepted blocker/important findings unless explicitly report-only.
- PR review threads are resolved only after they are proven stale or the real issue is fixed and verified.
- Claude is not invoked unless explicitly requested, and when invoked it uses `claude --print`, not Anthropic API calls.
- Gemini/agy is not invoked unless explicitly requested.
- Oracle is not mentioned or invoked.
- Failed or skipped external model lanes are reported without failing the whole review.
- Plan review uses bounded read-only subagents by default for substantial plans, and skips them only with a stated reason.
- Plan review writes a temp report for substantial reviews unless chat-only/no-files was requested.
- Plan review updates writable current-session plans for accepted blocker/important findings, but does not implement code.
- Spec-design-swarm does not implement code, writes an artifact for clear substantial design/spec work unless chat-only/no-files was requested, and records security context when sensitive surfaces are touched.
- Spec-handoff packages spec/design context only, keeps open questions visible, and does not create an implementation plan or call the spec complete.
- Plan-create writes an implementation plan only, stays read-only, and routes review/execution to `plan-review-swarm` or `implementation-execute-plan`.
- Plan-handoff packages existing implementation plans only; spec/design context routes to `spec-handoff` or `plan-create`.
- Implementation-handoff requires implementation state and does not package no-diff planned work.
- Discuss-with-me triggers only when explicitly requested, stays scoped to design/spec/plan/implementation/docs decisions, and asks one question at a time when evidence cannot answer.
- Orchestrator-goal uses only two paths: clear goals become contracts; unclear goals route to discuss-with-me.
- docs-maintain identifies source-of-truth drift before editing, owns cleanup/promotion of existing workflow artifacts, and keeps detailed history in docs, not `AGENTS.md`.
- spec-review-swarm preserves accepted, contested, and open findings instead of forcing fake consensus.
- ops-security-review routes explicit scans to official Codex Security workflows and does not claim audit coverage from a normal review lane.
- Debug investigation does not implement fixes until the diagnosis is proven or uncertainty is explicitly accepted.
- Debug investigation writes a debug artifact for real debugging unless chat-only/no-files was requested.
- Skill audit recommends updates before new skills and cites evidence or upstream inspiration for every recommendation.
