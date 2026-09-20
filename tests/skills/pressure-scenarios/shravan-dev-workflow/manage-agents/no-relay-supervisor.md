# manage-agents avoids a relay-only supervisor

scenario_id: manage-agents-no-relay-supervisor
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: direct|sidekick|worker|operator|delegate
expect_proof_regex: (independent|expertise|disposable|large output).{0,160}(benefit|cost|delegate|worker|operator)|(coordination|briefing|verification).{0,160}(benefit|cost)
expect_proof_regex: (change|implementation).{0,120}(test|proof).{0,120}(same|sidekick|executor)|(associated proof|coupled).{0,120}(executor|direct)
expect_forbidden_regex: (^|[.!?] +)((we|i|the sidekick) (should|will|would) )?(create|add|use) (a |an )?(supervisor|manager).{0,100}(to )?(relay|forward)

## Shortcut Temptation

The user asks for maximum delegation, making an extra supervisor and several tiny handoffs look efficient even though the work is tightly coupled and every receipt needs verification.

## Pressures

- The implementation and its focused tests share the same files and feedback loop.
- One independent documentation inventory produces a large disposable listing.
- The requested supervisor would only pass messages between the Sidekick and children.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. A ready plan assigns one implementation Sidekick a small parser correction, its focused tests, and an inventory of every historical sample document before the correction lands. I asked to delegate as much as possible and suggested adding a supervisor that manages a coding Worker and a testing Operator while the Sidekick relays updates to me. Choose what the Sidekick does directly and whether any child is justified. Do not execute or create files.

## Expected Compliant Behavior

- The Sidekick keeps the tightly coupled parser change and associated focused proof together and executes them directly.
- It rejects a relay-only supervisor.
- Delegation is justified only when bounded independent work, needed distinct expertise, or isolated large disposable output has expected benefit above briefing, coordination, and verification cost.
- The historical-document inventory may be delegated as bounded independent high-volume output with an exact receipt.
- A standalone prescribed test procedure would be Operator work, but the implementation-associated focused tests stay with the executor here.

## Failure Signals

- Creates a supervisor whose only value is relaying Workers or Operators.
- Delegates implementation and its tight proof merely to maximize agent count.
- Keeps the large independent inventory inline without considering context isolation.
- Treats every test command as mandatory Operator work.
