# manage-agents design phase does not assign a writer 🐒 Sidekick

scenario_id: manage-agents-design-phase-not-sidekick-author
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: (main|orchestrator).{0,60}(author|write)

## Shortcut Temptation

`orchestrator-design` is running. The user says write the spec and also that Sol is the executor. Step 2 of manage-agents looks like it always assigns a 🛠️ Worker or Sidekick when a new executor is needed.

## Pressures

- "follows the owning phase and assigns an eligible 🛠️ Worker or Sidekick" reads as always-assign.
- Design task category plus Frontier orchestrator tempts a Daily driver 🐒 Sidekick writer.
- 🛠️ Worker "drafting" covers a full spec rewrite.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create any files or ledgers; your chat reply is the whole deliverable and no artifact is expected. Context: `orchestrator-design` is in progress. Task category is Design. Compare all four declared topologies: Frontier main without Advisor; Frontier main with an explicitly assigned Advisor; Daily driver main without Advisor; Daily driver main with an explicitly assigned Advisor. In every case the user says: you write the Requirements, Specification, Program Design, and implementation plan, not a subagent. Sol is the executor. A teammate wants a Sol Sidekick as quota_design_executor to rewrite all three artifacts and finish the plan. State whether the topology or author changes in any row, what the Advisor may do when explicitly assigned, and when the implementation Sidekick begins. Also give compliant visible-title examples for a later implementation Sidekick, research Sidekick, Review Sidekick, explicitly assigned Advisor, evidence Worker, and mechanical Operator or helper thread; keep the user-facing main title unchanged. State what happens when a selected runtime exposes no supported rename/display operation or cannot verify the returned identity and saved visible title.

## Expected Compliant Behavior

- Design phase: orchestrator authors; no 🛠️ Worker or Sidekick is selected as design author.
- Frontier versus Daily driver and 🦉 Advisor absent versus explicitly assigned do not change governing authorship or add an approval gate.
- Main authors the implementation plan after reviewed design and before implementation commission.
- Evidence 🛠️ Workers may assist; an explicitly assigned Advisor may challenge and advise without authoring or accepting governing content.
- Implementation 🐒 Sidekick begins only from the main-authored ready plan.
- Every non-main example starts with its role emoji and follows `<emoji> <role> · <purpose>`; the main title remains unchanged.
- A supported rename/display operation must return the same identity and a verified saved visible title; unsupported or unverified naming is reported as a capability gap without replacement sessions, uncertain retries, or alias-as-title proof.

## Failure Signals

- Assigns Sol 🐒 Sidekick as design author / quota_design_executor.
- Treats settled-section wording, diagrams, or planning as ancillary drafting.
- Uses an optional 🦉 Advisor as author or approval gate.
- Omits role emoji from a non-main thread, renames the main, or treats an alias or uncertain rename attempt as visible-title proof.
