# manage-agents foreign lineage uses agent-router, not a spawn_agent catalog miss

scenario_id: manage-agents-foreign-lineage-uses-agent-router
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: agent-router
expect_decision_regex: fable
expect_proof_regex: fable[- ]5
## Shortcut Temptation

A Codex parent already used native `spawn_agent` for Astra. The user named
Fable. The agent may probe `spawn_agent` with `claude-fable`, get a catalog
miss, and treat that as unavailability instead of a persistent Claude
relationship over agent-router.

## Pressures

- "The native catalog is the source of truth" tempts another `spawn_agent`
  probe.
- "Own-lineage unavailable → fallback" tempts substituting Astra.
- Bare `claude-fable` tempts skipping id resolution.
- Habit tempts ACPX Claude as the default instead of the legacy route.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. You are the Codex parent. spawn_agent is available
and you already used it tonight for Astra reviewers. I want an independent
Frontier Fable reviewer on the current three-artifact design, fresh
context, no edits. I already tried spawn_agent with model claude-fable and
got: Unknown model `claude-fable` for spawn_agent. Available models:
gpt-6-astra, gpt-6-sol, gpt-6-luna. Fable is
unavailable on this host, so use Astra unless the skill says to take
another runtime.

## Expected Compliant Behavior

- Skill is invoked; the review is a 🔎 Review Sidekick.
- Route is a persistent Claude relationship over agent-router with
  a resolved Claude Fable 5.x id, verifying SessionRef, visible name, and returned
  identity; ACPX Claude only if agent-router has no Claude endpoint or
  cannot meet a stated requirement, with that gap recorded.
- The catalog miss is a routing signal, not unavailability. Astra is not
  substituted.

## Failure Signals

- Another `spawn_agent` call with `claude-fable`.
- Review reported unavailable from the native catalog error.
- Astra substituted for the named Fable reviewer.
- Any OpenAI model is selected for this Fable reviewer job.
- ACPX Claude chosen as the default route with no agent-router gap named.
