# Cleanup list (r17): put each fact back in its box

Owner, 2026-09-28: the system already had its layers (any skill → `manage-agents` → model catalog → machine model map); this PR pushed lower-box detail up into other skills, repeated it, and wrote a model name into rules. Fix: cut the PR's own additions back to one home per fact. No new structure, no new prose.

Sources, verified by Main at `7bb745aa`: `dry-audit.md` (independent Opus audit, line numbers at `b72e49ca`; quotes are exact) and `slop-inventory.tsv` (12 Workhorse Workers, one per unit; tree-wide, low precision on OLD rows). Line numbers drift; match by quote.

## Apply
- `dry-audit.md` §3 leading words, §4 R1–R22, §5 D1–D36, §6 (hidden returns at `manage-agents/SKILL.md` Select and Hand off; move the Sidekick-effort sentence into Commission), and §7 cut list, **except the rejects below**.
- From `slop-inventory.tsv`, rows with origin `PR` that the audit also covers, plus: `orchestrator-implementation-goal/SKILL.md` "Standalone prescribed procedures use 🔧 Operators." → cut (manage-agents owns it); `README.md` Plan/Implement/Review paragraphs → one pointer each to their owning skill; `AGENTS.md:69` → "After a PR's plan is ready, one persistent implementation Sidekick owns it (`manage-agents`)."
- Leading words: "escalation" / "escalation reason" replaces "Leaving the Workhorse tier"; "effort band" replaces "Choose by job" as a term; label the delegation sentence **Benefit test.** and use it bare; "review scope", "tier record", "job pins", "executable node", "breakdown" used bare after their home.
- devfiles: `shared/my_agents.md` Model tiers line → "Workhorse, Daily driver, Frontier. A job starts on Workhorse and escalates only with a recorded reason (`manage-agents`)." then the existing unchanged sentences; `model-map.md.tmpl` line 3 drops "Workhorse work never uses Sonnet or Haiku; on a host without native Luna it goes through agent-router."

## Reject (do not apply)
- `dry-audit.md` §2 "Tier map" design and every edit implementing it: catalog table replacement, deleting provider-page Models sections, acpx example edits, the `SKILL.md` "Resolve the exact model id" rewrite, the model-map schema change. That structure predates this PR and was not the problem.
- §6.2 (move the agent-router long-turn route) and §6.3 (move Staffing to the catalog): both homes stay.
- Inventory rows that treat template slots (`Breakdown:`, `Node:`, `Base:`) or a skill's own call-site lines (`plan-improve-repo/SKILL.md` step 7 bullets) as leaks: those are output shape and calls.
- `my_agents.md:51` (Worker and Operator skip discovery) and the Roles fan-out sentence: pre-existing prompt rules, keep.
- Every `OLD` inventory row: pre-existing tree-wide slop is a separate follow-up, not this PR.

## Keep
Everything in `dry-audit.md` §8.

## Guard
Add one contract test in `tests/skills/lib/` that fails when a model or lineage name (Luna, Sol, Astra, Opus, Grok, Fable, Sonnet, Haiku) appears in `plugins/shravan-dev-workflow/skills/**` or `shared-references/**` outside `manage-agents/references/model-catalog.md`, `native-providers-*`, `acpx-*`, and the "Resolve the exact model id" paragraph.

## Proof
Tests, typecheck, plugin validate; the new guard passes; `git diff --shortstat 59eec035..HEAD -- plugins/shravan-dev-workflow/skills plugins/shravan-dev-workflow/shared-references` shows the PR's net added lines at least 35% lower than `+418/−219`; an independent re-audit (fresh subagent, same method as `dry-audit.md`) reports no remaining PR-origin repeated fact or deletion-test failure it can cite.
