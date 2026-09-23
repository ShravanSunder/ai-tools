# Model routing re-tier (PR A)

Revision 4 (single bounded remediation of the Revision 3 proposal review). Main-authored multi-run skill-change spec, written as the delta from `origin/main` at `356158af` (after #89 GPT-6 dispatch and #90 Grok review / top Frontier rows). Owner plugins: `shravan-dev-workflow` and `agent-router`. Devfiles companion changes are listed separately.

Related work split out by the owner (2026-09-23):

- **PR B — reviews become workflows, not swarms.** `implementation-review`, `spec-program-review`, both `skills-creation` review stages, and the discuss reader-test reviewer stop fanning out lane Workers; one Review Sidekick walks the checks as ordered steps and may hand proof commands to an Operator. Separate proposal. The lane-Worker rows and "Frontier Reviewer" escalation wording belong there, not here.
- **PR C — research-swarm de-swarm.** Separate PR later, only after its own planning, spec, and prior-work discovery; start by inspecting `origin/research-swarm-source-lanes-spec`.

## Problem and evidence

- Owner instructions in chat (2026-09-23) set the matrix below. Current `manage-agents/SKILL.md` (at `356158af`) differs: Sol low is a Balanced category row (62) and a Worker and Sidekick row (184-209 tables), and "Choose a model" (144) still says Sol low remains eligible and existing Sol-low relationships continue (ordered by `docs/wip/skills-authoring/2026-09-20-main-conversation-default/spec.md:33`); Opus medium is Frontier (69); Opus high is `User must authorize` (72); Fable medium exists (73); Operator is Luna medium only; Worker lacks Luna medium, Sol medium/high and Opus medium; Sidekick lacks Luna max and Sol high; Review lists Sol/Opus/Fable/Grok medium and marks nothing as owner-authorized; Advisor lists Opus medium and Sol high/xhigh; Lineage Families still lists Terra (94).
- Main is described as "Frontier or Balanced" (`manage-agents/SKILL.md` Main flow; `orchestrator-design/SKILL.md:76`; devfiles `shared/my_agents.md:331,361`). Owner: the main model is the owner's choice, normally a daily driver; agents never escalate it.
- Stop-review still runs Luna at `low` (`agent-scripts/stop-review/config.sh:19`, `reviewer-config.toml:7`), below the Operator floor.
- Cursor ACP catalog examples list `grok-4.6[effort=high,fast=false]` (`acpx-provider-cursor.md`), but the live catalog on 2026-09-23 advertised only `grok-4.6[effort=high,fast=true]` and `grok-4.5[effort=high,fast=true]`, and no `gpt-6-*` ids.
- Emoji titles: pattern headings carry emoji since #90, but ACPX examples still create `--name sidekick` (`acpx-provider-codex.md:26`, `acpx-provider-cursor.md:49`) or an untitled `--name <relationship-name>` placeholder (`acpx.md:43`), `agent-collaboration` never mentions titles, and commissioning sites in the orchestrators do not mention the title. Live evidence: ACPX accepted `--name "🔎 Review Sidekick · model-retier proposal"` on 2026-09-23.
- Callers still pin models: `program-design/SKILL.md:298` ("exact Sol model/reasoning"), `implementation-pr-wrapup/SKILL.md:36` ("Luna xhigh when native").

## Success definition

An agent loading `manage-agents` chooses model and effort only from the matrix below, treats the main model as the owner's choice, never selects Sol low or any GPT-5.x id, never picks a `User must authorize` row without explicit owner authorization, and titles every non-main thread `<emoji> <role> · <purpose>` using a verified route or a reported gap.

## Target matrix

`User must authorize` is the existing mechanism from #90 for owner-requested rows.

| Role | Default rows | `User must authorize` rows |
| --- | --- | --- |
| Main | owner's choice; normally Sol medium/high or Opus low/medium | — (never self-escalated) |
| Advisor | Opus high, Astra high, Sol xhigh | Opus xhigh, Astra xhigh, Fable high |
| Review Sidekick | Opus medium, Opus high, Sol high, Astra high, Grok 4.6 high, Grok 4.5 high | Opus xhigh, Astra xhigh, Sol xhigh, Fable high |
| Implementation / research Sidekick | Sol medium, Sol high, Opus low, Opus medium, Luna high, Luna xhigh, Luna max | — |
| Worker | Sol medium, Sol high, Opus low, Opus medium, Luna medium, Luna high, Luna xhigh | — |
| Operator | Luna medium, Luna high | — |

Model Categories table: Mini = Luna medium/high/xhigh/max; Balanced = Sol medium/high, Opus low/medium, Grok medium/high; Frontier = Opus high, Astra high, Sol xhigh (unmarked; role tables decide), plus the `User must authorize` rows. Claude-native only (only in `native-providers-claude.md`): Haiku for Operators, Sonnet for Workers.

Grok versions: `SKILL.md` keeps unversioned `xAI Grok | high` rows (per #89's no-version-numbers rule); the 4.6 / 4.5 high ids live only in the Cursor catalog examples.

Task signals: the Worker and Sidekick tables keep their Task-signals column; every added row maps to an existing sibling, no new scheme. Worker: Luna medium/high/xhigh -> "Exact steps; Local/Cross-domain."; Sol medium and Opus low -> "Complete direction; Local/Cross-domain."; Sol high and Opus medium -> "Partial direction; Cross-domain/Cross-system." Sidekick: Luna high/xhigh/max -> "Exact steps; Local/Cross-domain." (owner post-review correction 2026-09-23: same span as Worker); Sol medium and Opus low -> "Complete direction; Local/Cross-domain."; Sol high and Opus medium -> "Partial direction; Cross-domain/Cross-system." The Operator table has no signal column and gains Luna high.

Retired: Sol low, Fable medium, Astra medium/low, Terra, all GPT-5.x.

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Main model is the owner's choice; skills never escalate it | Owner: "it's up to me"; daily drivers are far ahead and pleasant to talk to. |
| Frontier defaults exist only for Advisor and Review | Owner: "only the frontier for advisors"; reviewers named explicitly. |
| Opus medium moves Frontier -> Balanced; Opus high moves `User must authorize` -> default for Advisor/Review | Owner reversed #90's rows in this conversation. |
| Sol xhigh is `User must authorize` for Review and a default Advisor row; the category row carries no mark so role tables decide | Owner: "sol xhigh is on request" (Review); later "no authorization required" (Advisor). |
| Drop Sol low, Fable medium, Review Sol/Grok medium, Advisor Opus medium and Sol high | Not in the owner's lists. |
| Review keeps Opus medium as a default row | Owner post-review correction (2026-09-23). |
| Advisor adds Sol xhigh as a default row | Owner post-review correction (2026-09-23): no authorization required for Advisor. |
| Grok review rows are 4.6 high and 4.5 high | Owner reviewer list; Balanced Grok rows unchanged. |
| Reuse `User must authorize` instead of a new on-request label | Existing mechanism; no new vocabulary. |
| "Sol is the executor, so Sol writes the spec" becomes model-neutral | Sol medium is now a normal Main choice; the rule is about the executor role. |
| Review-lead spelling normalized to "Review Sidekick" outside the PR B skills | Same role, several spellings. |

## Runs in sequence

Paths beneath `plugins/shravan-dev-workflow/skills/` unless stated. Trigger descriptions unchanged in every run.

| # | Skill | Class | Main path | Depth | Proof |
| --- | --- | --- | --- | --- | --- |
| 1 | `manage-agents` | behavior-changing | category table and role tables per target matrix with the Task-signal mapping above; Main flow "Frontier or Balanced" -> owner's choice; "Choose a model" (144): delete the Sol-low eligibility and existing-Sol-low continuity sentence, superseding `2026-09-20-main-conversation-default/spec.md:33`; Terra out of Lineage Families; rationalization row at 124 ("Sol is the executor...") becomes model-neutral | titled ACPX session examples only: `acpx.md:43` placeholder, `acpx-provider-codex.md:26`, `acpx-provider-cursor.md:49` use `--name "🐒 Sidekick · <purpose>"`; Cursor catalog examples list only live ids (`grok-4.6[effort=high,fast=true]`, `grok-4.5[effort=high,fast=true]`, `claude-opus-5-5`, `claude-fable-5-1`; no `gpt-6` via Cursor, OpenAI routes through Codex); `native-providers-codex.md` example moves from retired Astra medium to an allowed row (`gpt-6-astra` high) and carries no title teaching (native `task_name` is not a visible title); `native-providers-claude.md` adds Haiku Operator / Sonnet Worker and carves line 15 ("role table still apply") to except those two rows | rewrite expected behavior in `model-thinking-selection.md` (category mapping per new table; Sol high is Balanced, not Frontier) and `delegate-frontier-reviewer-only.md` (Sol low becomes illegal; Sol medium/high and Opus low/medium become legal implementation rows); adjust `operator-for-mechanical.md` for Luna medium/high; leave `sidekick-luna-xhigh.md` and `capability-economics.md` unchanged; add one scenario where the agent must not pick a `User must authorize` row unprompted |
| 2 | `agent-collaboration` (`plugins/agent-router/skills/`) | behavior-changing (adds a call to the `manage-agents` title format) | one sentence at session creation/commission: apply the `manage-agents` title format through the supported rename/display route and verify it, or report the gap | none | static |
| 3 | `orchestrator-implementation-goal` | behavior-changing | commissioning sites (12, 29) add the title clause; "review Sidekick" (8, 32, 33, 47) and "implementation-review Sidekick" (29) both become "Review Sidekick" | `goal-contract-and-routing.md`: "review Sidekick" -> "Review Sidekick" (5, 22, 78, 96) | static |
| 4 | `orchestrator-design` | behavior-changing | line 76 -> owner's-choice Main wording; line 38 model-neutral; title clause at 78; "design-review Sidekick" / "design-review-Sidekick" (30, 58, 60, 70) become "Review Sidekick" | none | static; `capability-economics.md:60` "Frontier or Balanced" is a pricing failure signal and stays |
| 5 | `program-design` | scoped | line 298 drop "exact Sol model/reasoning" | none | static |
| 6 | `implementation-pr-wrapup` | scoped | line 36 drop "Luna xhigh when native" | none | static |
| 7 | `implement-plan` | mechanical | rename at line 30 | — | static |
| 8 | `track-show-me-your-work` | mechanical | rename at line 22 | — | static |

Companion (not skill runs, same PR):

- Stop-review (`agent-scripts/stop-review/config.sh:19`, `reviewer-config.toml:7`): effort `low` -> `medium`. Security gate: existing hook runtime, value-only change; record `allowed` at implementation.
- Eval harness: rename `terra-judge-harness.ts` / `createAcpxTerraJudgeHarness` to judge-neutral names now that the judge is Luna (hard cutover of all three call sites in `semantic-criteria-evaluator.test.ts` and `tests/skills/evals/skill-pressure.eval.ts`).
- Repo docs: `AGENTS.md` role wording; remove the stale "Sync rule ... Codex role TOML" sentence; mark `docs/wip/skills-authoring/2026-09-20-main-conversation-default/spec.md` Sol-low decision superseded.

## Authoring basis and proof plan

Basis: user-directed intent. Structural proof: current-source searches (`Sol.*low`, `gpt-5`, `Terra` outside negative fixtures and history, `--name sidekick`, `review Sidekick` in runs 3-8) return nothing unexpected; `pnpm --dir tests/skills run test` (unit/harness and fixture parsing, not behavior proof), typecheck, `claude plugin validate .`, manifest/version checks. Behavior proof (`test:evals`): live pressure evals are not authorized; the gap is named and needs owner acceptance before ship.

## Coordination

- Base: `main` at `356158af` (fast-forwarded 2026-09-23). Branch `feat/model-routing-retier`.
- Versions: `shravan-dev-workflow` 2.56.0 -> 2.57.0 and `agent-router` 0.13.0 -> 0.14.0 in all manifests; one dated changelog entry plus README index.
- Run 1 lands first; runs 2-8 cite it. One PR.

## Devfiles companion (separate private change, owner-reviewed before commit)

| File | Change |
| --- | --- |
| `AGENTS.md:252` | "gpt-5.6-sol" -> `gpt-6-sol` medium, review `gpt-6-astra` |
| `shared/my_agents.md:331,361` | "Frontier or Balanced" main -> owner's choice, normally a daily driver; verify emoji table |
| `dot_config/worktrunk/config.toml:4` | `gpt-5.4-mini` effort none -> `gpt-6-luna` medium |
| `dot_config/zed/private_settings.json:14` | `gpt-5.4-mini` -> Luna medium if Zed supports it; otherwise report the gap |
| `dot_codex/private_config.toml.tmpl:28` | drop `"gpt-5.5" = 4` |
| `dot_claude/settings.json.tmpl` | `opus[1m]` high -> `claude-opus-5-5` medium |
| `dot_cursor/cli-config.json` | re-add live Opus 5.5 selection |
| live `~/.cursor/acp-config.json` | `claude-fable-5` -> `claude-fable-5-1` high |
| live `~/.codex/agents/*.toml` | remove (GPT-5.5 / 5.3-codex-spark); owner authorized |
| live `~/.cursor/cli-config.json` | drop saved `gpt-5.5*` / `gpt-5.4*` parameters; owner authorized |

## Non-goals

Review lane mechanics and "Frontier Reviewer" wording (PR B), research-swarm (PR C), role/seat topology, waiting policy, Router source changes, orchestrator Main-flow deduplication, cache refresh, merge.

## Spec-review record

Revision 3 reviewed by Grok 4.6 high via ACPX Cursor (workflow mode, four checklists complete): `targeted-revision`, `revise-first`, 12 accepted findings (1 blocker: Choose-a-model Sol-low cutover), 6 rejected. Revision 4 applies all 12 as the single permitted remediation; the same lead verified all 12 anchors and closed with `accepted-to-implement` (2026-09-23). Owner direction: one Review Sidekick walks the four proposal questions (mental-model fit, trigger routing, rule agreement, depth coverage) itself in order, without lane Workers. Lead: Grok 4.6 high via ACPX Cursor.
