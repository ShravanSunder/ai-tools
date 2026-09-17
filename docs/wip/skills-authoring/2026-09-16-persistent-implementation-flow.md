# Persistent implementation flow — authorized skill draft

Status: historical drafting commission, superseded for review ownership/order and research assignment by [Persistent collaboration and review workflow](2026-09-16-persistent-review-workflow-spec.md). Runtime source edits are paused for that specification's review. This commission covered the direct owner request on 2026-09-16 to align skills with one Astra/Fable contact, research Sidekicks, a persistent top-level implementation Sidekick orchestrating Workers/Operators, visible emoji names, and easy Codex listening. Fable owns Router DX design; Sol owns Router product implementation. Their board messages are design inputs, not independent owner authority.

## Success and boundaries

The user-facing agent retains design with the user. Implementation orchestration is delegated to a separate persistent Sidekick without transferring the user's design conversation. The Sidekick may implement and prove directly or assign bounded Workers and standalone procedures to Operators. Research is assigned to a Sidekick; bounded collection lanes can use disposable Workers. Design gaps return to the design owner; local implementation choices remain autonomous. Independent review remains distinct from contextual design feedback and follows the current different-implementation-author-lineage rule.

Top-level Sidekicks retain exact session identity across assignments and cold resumes. Disposable subagents are retained through an assignment's corrections, then finished; they are not substitutes for Sidekicks. The 26-minute figure is a cost consideration, not a replacement window or an automatic heartbeat. Names and status help the user observe implementation but never replace identity or proof.

Management owns roles, selection, continuity and routing. Collaboration owns verified runtime creation, naming, messaging and listening mechanics and never calls management. Phase skills preserve responsibility at phase transitions. Shared prompts point to those owners without copying CLI details or model matrices.

## Sequenced named skill runs

| Run | Single skill target | Surface allocation and scope |
| --- | --- | --- |
| 1 | manage-agents | Keep trigger; clarify main flow, scoped orchestration, Sidekick authority, visible names and continuity; update session-ledger reference for lifetime/cost; preserve role/model tables. |
| 2 | orchestrator-design | Main path loads management; keep user-facing design ownership and delegate research; change continuation ownership only. Preserve artifact and review gates. |
| 3 | orchestrator-implementation-goal | Main path and goal-contract reference place delivery loop with implementation Sidekick; design gaps return to design owner. Preserve delivery/proof/remediation gates. |
| 4 | implement-plan | Execution responsibility and route-back wording; preserve ready-plan admission and proof. |
| 5 | research-swarm | Clarify research Sidekick ownership and independent collection Workers; preserve evidence standards and no-design-by-momentum. |
| 6 | track-show-me-your-work | Carry user-facing/design owner and implementation owner in existing thread context; single orchestrator holder per board thread, meaningful updates only. No registry/schema project. |
| 7 | agent-collaboration | Canonical Router source: creation/continuation, visible names/scoped discovery and Codex notification delivery from supported CLI contracts; reference hierarchy and wait guidance. No role/model policy or workflow dependency. |

Companion shared/my_agents.md changes make the same flow discoverable and clarify progress acknowledgement versus dependency waiting. Phase targets may be edited serially by one Worker; they remain separate bounded runs against this common owner-confirmed contract.

## Coordination and evidence

ai-tools source worktree: feat/manage-agents-wait-discipline, historical base f029f5b8c5607f576f13ac7ea8aa7fd9bf1826fe. Preserve its existing wait drafts and all unrelated work. Canonical collaboration draft is in codex-router.listening/agent-skills/agent-collaboration; further edits wait for Sol's worktree/branch reservation on the board. Router product code and specs remain their owners' files. Shared discussion root: 01a0a99a-5203-73b3-bab0-76a102b89c61, board 01a09d62-1b4c-7c71-95a3-864caa3e50b4.

Installed0.1.27 currently supports process listen/wait, verified with actual batches. Its help does not expose model/effort creation, rename or session-delivery options. Draft future mechanics only against agreed contracts with an explicit capability requirement; do not present them as installed or proven. Source model-choice spec still carries stale 26-minute restart wording; reported to Fable at activity127. No CLI shape from an unconfirmed draft becomes an execution command by inference.

## Proof and publication

Authoring basis: user-directed intent. The owner's no-pressure-tests/no-additional-reviewers instruction persists; proposal and implementation reviewer runs are skipped for these source drafts. Parent self-checks whole affected sections, changed references and contradictory consumers; run static whitespace/reference checks. Live CLI observations establish capabilities only, not behavior-change efficacy. Do not claim rollout readiness from static checks.

Leave drafts uncommitted for owner review. Version/changelog, canonical commit, pinned vendoring, PRs and installed refresh belong to publication after accepted source; do not bypass maintained sync with a manually diverging vendored copy. No Router product implementation, infrastructure changes, new reviewer-lineage rule, or per-patch approval ceremony.
