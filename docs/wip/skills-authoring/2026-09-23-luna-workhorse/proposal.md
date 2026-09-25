# Luna as the Workhorse tier

Revision 4. Revision 2 was `accepted-to-implement`; Revision 3 added the owner's emoji-by-example requirement (2026-09-23), a semantic expansion the owner authorized for one fresh proposal review. Main-authored multi-run skill-change spec. Owner plugin: `shravan-dev-workflow`. Stacks on PR A ([#91](https://github.com/ShravanSunder/ai-tools/pull/91)); implement after #91 merges or as a stacked branch on it.

Owner correction (2026-09-25, remediation pass 2): The third signal is **Interactive or background**, with `Interactive` and `Background` values. Sol xhigh is `Daily driver` with an empty category Use cell and a default 🔎 Review Sidekick row. The 🦉 Advisor table remains owner-chosen. These decisions supersede the earlier Revision 4 wording and matrix rows.

Owner correction (2026-09-25, remediation pass 3): Opus high is `Daily driver` with an empty category Use cell; its Review and 🦉 Advisor rows remain. Mark only the first agent-role mention in each paragraph, bullet, or table cell with its emoji. Later mentions stay plain. Headings may carry one emoji, and titles still use `<emoji> <role> · <purpose>`. This supersedes the earlier every-mention rule.

Owner addendum (2026-09-25, remediation pass 3): Sol xhigh remains a Daily driver category row and a default 🔎 Review Sidekick row. It is absent from the Advisor table.

Owner correction (2026-09-25, remediation pass 4): Guidance and Architectural span are the only task signals. 🔧 Operator models remain Workhorse-only. This supersedes the pass 2 third-signal decision.

## Problem and evidence

- `manage-agents/SKILL.md` named Luna's category "Mini" ("Procedures, repeatable work, guided execution", line 51).
- The original task signals were Guidance and Architectural span (`SKILL.md:23-45`). Luna rows appeared in the 🔧 Operator, Worker, and Sidekick tables (`SKILL.md:173-209`) with only "Exact steps" as the signal.
- "Mini" also appears in `implementation-pr-wrapup` (Mini Worker for the PR description, Mini Operator for the monitor: `SKILL.md:8,10,36,46,54,63,90`, `references/monitor-loop.md:16`, `references/pr-description.md:8`) and in eight pressure fixtures.
- Stop-review falls back to Luna medium when JEV fails (`agent-scripts/stop-review/config.sh`), on the path where a session is trying to stop. Its latency at medium has not been measured.

## Success definition

An agent loading `manage-agents` calls Luna's tier **Workhorse** and uses the model tables for eligible roles and effort. It never self-selects Workhorse as Main. A Workhorse 🐒 Sidekick answers brief status checks and routes substantive owner decisions to Main. Every in-scope skill, packet, and chat message marks the first role mention in each prose unit with its emoji.

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Rename category `Mini` -> `Workhorse` everywhere (hard cutover, no alias) | Owner choice 2026-09-23. |
| Keep Guidance and Architectural span as the task signals | The role model tables decide eligibility and effort. |
| Workhorse rows exist for 🔧 Operators, Workers, and implementation Sidekicks | Each role table gives its allowed model and effort choices. |
| Agents never self-select Workhorse as Main | The owner chooses the Main model. Other roles follow their model tables. |
| Workhorse 🛠️ Worker and Sidekick cells read `Exact steps or well-understood Complete direction; Local/Cross-domain` | The tables own eligible model and effort choices. |
| Category definitions stay cost/capability groupings, separate from role authority | 🛠️ Worker and Sidekick Daily-driver rows remain available. |
| Agents never select Luna as Main; a Main model the owner names stays the owner's choice | Keeps owner authority over Main while blocking agent self-selection. |
| **Emoji by example:** whenever a skill, packet, or chat message names an agent role, write it with its role emoji: 🔧 Operator, 🛠️ Worker, 🐒 Sidekick, 🔎 Review Sidekick, 🦉 Advisor. The Agent Roles table stays the single owner of the emoji; every other skill shows the rule by example | Owner requirement 2026-09-23 ("show by example ... anytime you mention the Sidekick"); agents copy the vocabulary they read, so examples teach titles better than a rule alone. |
| Prose pattern: the emoji sits immediately before the role word, and any qualifier goes before the emoji (`Workhorse 🛠️ Worker`, `implementation 🐒 Sidekick`); thread titles keep `<emoji> <role> · <purpose>`; the always-loaded `manage-agents` description (`SKILL.md:3`) stays plain because it is the trigger surface | Failure form: wrong output shape; one pattern prevents `🛠️ Workhorse Worker` / `Workhorse 🛠️ Worker` drift. |
| Emoji applies only to agent roles, never to human operators, system workers, board seat values (`implementer`, `reviewer`), code identifiers, Linear ids, or diagram node labels | Prevents false edits and keeps seat and schema values stable. |
| Skills the reviews-and-research-as-workflows PR rewrites (`implementation-review`, `spec-program-review`, `skills-creation` review stages, `research-swarm`, `discuss-pathfinding`, `discuss-clarify-mental-models`) get their emoji in that PR, not here | Avoids editing text that PR replaces. |
| Rename category `Balanced` -> `Daily driver` everywhere (hard cutover) | Owner decision 2026-09-23; names the tier by its job (interactive main and everyday execution). |
| A Luna implementation Sidekick accepts only short owner status checks; substantive conversation routes through Main | Owner decision 2026-09-23; keeps many-turn latency out of the owner's conversation. |

## Runs in sequence

| # | Skill | Class | Main path | Depth | Proof |
| --- | --- | --- | --- | --- | --- |
| 1 | `manage-agents` | behavior-changing | Rename `Mini` to `Workhorse` and `Balanced` to `Daily driver`; keep Guidance and Architectural span as task signals. Model tables decide eligible roles and effort. Preserve the never-Main and brief 🐒 Sidekick status-check rules. Mark the first role mention in each prose unit with its emoji. | none expected; check `session-ledger.md` and provider refs for `Mini` | Update the model-selection fixtures and the three Luna scenarios plus `sidekick-luna-xhigh`; check table use, Main authority, and status checks. |
| 2 | `implementation-pr-wrapup` | behavior-changing | "Mini Worker" / "Mini Operator" -> "Workhorse 🛠️ Worker" / "Workhorse 🔧 Operator" (`SKILL.md:8,10,26,36,46,48,54,63,90`); other agent-role mentions gain their emoji | `references/monitor-loop.md:16`, `references/pr-description.md:8` | update `file-list-changelog` and `parent-does-not-inline-write` regexes |
| 3 | `orchestrator-implementation-goal` | behavior-changing (two homes) | emoji on agent-role mentions in `SKILL.md` | `references/goal-contract-and-routing.md:5,22,42,44` | static |
| 4 | `orchestrator-design` | scoped (`SKILL.md` only) | emoji on agent-role mentions | none | static |
| 5 | `implement-plan` | behavior-changing (two homes) | emoji at `SKILL.md:12` and other role mentions | `references/execution-and-proof.md:34,36,61` | static |
| 6 | `track-show-me-your-work` | scoped (`SKILL.md` only) | emoji on agent-role mentions (seat values `implementer`/`reviewer` stay plain) | none | static |
| 7 | `program-design` | scoped (`SKILL.md` only) | emoji on the 🦉 Advisor mention and any other agent-role mention | none | static |
| 8 | `plan-implementation` | scoped | emoji on its agent-role mentions | none | static |
| 9 | `spec-handoff` | scoped | emoji on its agent-role mention | none | static |
| 10 | `plan-handoff` | scoped | emoji on its agent-role mention | none | static |

Dropped as having no agent-role mention to edit: `agent-collaboration` (only the title template, already correct), `spec-design` (its hit is "Advisory", a different word), `plan-improve-repo` ("senior advisor" metaphor). `agent-router` stays at 0.14.0.

Companion (not a skill run):

- Stop-review: measure Luna medium fallback latency on a few real stops; if it blocks stopping noticeably, propose an alternative to the owner before changing anything.
- Same-changeset cutover (not skill runs): `AGENTS.md:120` "Frontier/Balanced/Mini" (CLAUDE.md is the same file) and `tests/skills/pressure-scenarios/README.md:99,117`. Devfiles `shared/my_agents.md` is a private companion kept in sync: Workhorse / Daily driver wording, the Luna status-check rule, and the emoji-by-example rule next to its existing title table. Changelogs, `docs/wip`, and retired trees stay as history.

## Authoring basis and proof plan

Basis: user-directed intent, informed by owner-shared early reports (labeled hypothesis). Structural proof: `rg '\bMini\b|\bBalanced\b'` over `plugins/` (excluding retired trees), `tests/skills/pressure-scenarios/` (excluding retired), `tests/skills/README.md`, and `AGENTS.md` returns nothing; changelogs and `docs/wip` are exempt as history; a role-mention search (`rg -i '\b(Review Sidekick|Sidekick|Worker|Operator|Advisor)s?\b'`) over runs 1-10 shows every agent-role mention carries its emoji, with each remaining plain hit explained (human role, system term, seat value, identifier); `pnpm --dir tests/skills run test`, typecheck, `claude plugin validate .`. Behavior proof: owner authorized live `test:evals` (2026-09-23) for the three new scenarios plus the rewritten `sidekick-luna-xhigh`; report pass/fail with transcripts inspected, and never relabel static checks as behavior proof.

## Coordination

- Base: `feat/model-routing-retier` (PR A) until it merges, then `main`. Branch `feat/luna-workhorse` in worktree `~/dev/ai-tools.feat-luna-workhorse` (created 2026-09-23 without switching the main checkout).
- Versions: next minor of `shravan-dev-workflow` after PR A; changelog entry.

## Non-goals

The reviews-and-research-as-workflows PR (combined PR B + C per owner, 2026-09-23), model matrix changes, Router changes.

## Spec-review record

Revision 1 reviewed by Grok 4.6 high via ACPX Cursor (workflow mode, four checklists complete): `targeted-revision`, `revise-first`, 6 accepted findings (1 blocker: incomplete hard-cutover consumer list), 9 rejected. Revision 2 applied all 6 as the single permitted remediation (the prefer-rule collision resolved by widening the Workhorse cells); the same lead verified all six and closed `accepted-to-implement`. Revision 3 added emoji by example (owner-authorized expansion); its fresh review returned `targeted-revision` / `revise-first` with 5 accepted findings (1 blocker: run 10 named four skills). Revision 4 applies all 5: one skill per run, two-home runs reclassified, empty runs dropped, prose pattern set, emoji in the success definition. The same lead verified all 5 and closed `accepted-to-implement` (2026-09-23).
