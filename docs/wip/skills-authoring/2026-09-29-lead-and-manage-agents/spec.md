# Lead and progressive manage-agents

Owner plugin: `shravan-dev-workflow` (ai-tools), plus the devfiles prompt and model map.

## Problem and evidence

- `manage-agents` was rewritten in PR #106: Classify, Roles, and Models (one table per role) in one `SKILL.md`, and one job-packet reference. The owner settled the design in conversation on 2026-09-29.
- The owner renamed the user-facing agent: "rename main to lead". `Main` as a role appears in 18 plugin files (about 40 capitalized and 55 lowercase role uses), in 2 contract tests, and in 6 lines of `shared/my_agents.md`. `presentation-tui` "main pane" and `changelog-runbooks.md` "main entry" are not the role.
- The devfiles model map (`dot_config/agent-context/model-map.md.tmpl` on `main`) still lists rows #106 removed: Worker Luna medium and high, Worker Sol medium, Worker Opus low, Operator Luna high.

## Success definition

Every agent and skill calls the user-facing agent the 🦁 Lead, with one meaning everywhere; `manage-agents` examples teach the three selectors from real sessions; the machine map lists ids only for rows the Models tables contain.

## Decisions (the owner may strike any row)

| # | Decision | Rationale |
|---|---|---|
| D1 | 🦁 is the Lead's emoji, used like the other role emoji: first mention per paragraph; the Lead's own thread title stays untouched. | A lion reads as leader and does not collide with 🐒 🦉 🔎 🔧 🛠️. |
| D2 | Hard cutover `Main` → `Lead` (and "the main" as a role → "the Lead"); no alias. | Two names for one role is a duplicate owner. |
| D3 | The rename is `mechanical` under `skills-creation`: same referent, no rule changes; static proof only. | A pure vocabulary swap alters no trigger, rule, or completion. A sentence that needs rewording beyond the swap is out of the run and comes back to the Lead. |
| D4 | "orchestrator" stays where it names the board seat or the `orchestrator-*` skills. | It is a different concept from the role name. |
| D5 | Contract tests that assert the old word get the same swap; no new tests. | Owner: no testing work; the suite must still pass. |
| D6 | `manage-agents` examples become five real scenarios, each written as the job then the six steps (direction, span, horizon, plan cut, role, Models row). | Owner direction 2026-09-29: "Scenario, then teach the way to think", "use real scenarios from my session". |

## Runs (one target each)

| Run | Target | Surfaces | Proof |
|---|---|---|---|
| 1 | `manage-agents` (PR #106) | main path: Examples replaced by the D6 scenarios; the 🦁 Lead in the opening | existing tests, `claude plugin validate`; each scenario quoted from the session digests |
| 2 | Plugin-wide `Main` → `Lead` rename (stacked on #106) | main path wording in the 18 files listed by `git grep -w Main`; 2 contract tests | the `git grep` cutover returns only non-role hits; tests and validate pass |
| 3 | devfiles `shared/my_agents.md` (separate PR) | Roles, Role emoji (add 🦁 Lead), Practices, Owner Attention, Act mode: `Main` → `Lead` | `chezmoi diff` of the prompt symlink targets |
| 4 | devfiles model map (same PR as run 3) | rows per host follow the #106 Models tables: Operator Luna medium; Worker Luna xhigh; Sol high; Opus high; Sol medium, Opus xhigh, Fable, and Astra xhigh as `User must authorize` | `OP_ACCOUNT=my.1password.ca chezmoi diff ~/.config/agent-context/model-map.md`, then a targeted apply after merge |

## Coordination

- Base: #106 at `chore/manage-agents-progressive`. Run 2 stacks on it with `gh stack`. Runs 3 and 4 share one devfiles branch from `main`.
- Version: #106 carries 2.66.0; run 2 bumps to 2.67.0 with one changelog entry.
- Pending: the scenario scrape (three Luna Workers over the session digests) feeds run 1.

## Non-goals

No new tests or pressure runs. No change to what any role owns. No rename of `orchestrator-*` skills.

## Spec-review record

Owner review first (in progress). Then one independent 🔎 Review Sidekick (GPT-6 Astra high, session `01a0ecc1-1353-7411-a8ac-913307b24ea6`, paused) reviews this spec and the #106 files.
