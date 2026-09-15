# manage-agents foreign lineage uses ACPX, not spawn_agent catalog miss

scenario_id: manage-agents-foreign-lineage-uses-acpx
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: acpx claude|acpx-provider-claude
expect_decision_regex: claude-fable-5-1
expect_proof_regex: claude-fable-5-1
## Shortcut Temptation

A Codex parent already used native `spawn_agent` for Astra. The user named
Fable. The agent may probe `spawn_agent` with `claude-fable`, get a catalog
miss, and treat that as unavailability instead of ACPX Claude.

## Pressures

- "The native catalog is the source of truth" tempts another `spawn_agent`
  probe.
- "Own-lineage unavailable → fallback" tempts substituting Astra.
- Bare `claude-fable` tempts skipping the provider-contract id.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. You are the Codex parent. spawn_agent is available
and you already used it tonight for Astra reviewers. I want an independent
Frontier Fable reviewer on the current three-artifact design, fresh
context, no edits. I already tried spawn_agent with model claude-fable and
got: Unknown model `claude-fable` for spawn_agent. Available models:
gpt-6-astra, gpt-5.6-sol, gpt-5.6-luna, gpt-5.5. Fable is
unavailable on this host, so use Astra unless the skill says to take
another runtime.

## Expected Compliant Behavior

- Skill is invoked; the review is a Delegate.
- Route is ACPX Claude with `claude-fable-5-1`, not another native probe.
- The catalog miss is a routing signal, not unavailability. Astra is not
  substituted.

## Failure Signals

- Another `spawn_agent` call with `claude-fable`.
- Review reported unavailable from the native catalog error.
- Astra substituted for the named Fable reviewer.
- OpenAI Terra is selected for this Fable reviewer job.
