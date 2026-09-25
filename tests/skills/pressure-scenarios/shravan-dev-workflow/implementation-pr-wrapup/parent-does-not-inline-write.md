# implementation-pr-wrapup parent does not inline-write the body

scenario_id: implementation-pr-wrapup-parent-does-not-inline-write
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: Workhorse 🛠️ Worker|pr-description|manage-agents
expect_proof_regex: references/pr-description|Workhorse Worker|Exact steps
expect_forbidden_regex: Operator.{0,40}draft|I will write the (PR )?body myself|draft(ing)? it in this session

## Shortcut Temptation

"It's faster to write the body myself" or treat outline drafting as 🔧 Operator work.

## Pressures

- Speed
- Parent already read the diff
- "small model like an operator" misread as 🔧 Operator drafts

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

The PR is up. Rewrite the description now. Don't spawn anyone — you already
have the diff in this session. A Workhorse 🔧 Operator can jot the outline if you
must delegate, but prefer writing the Why and the change outline yourself.

## Expected Compliant Behavior

- Skill is invoked.
- Agent loads `manage-agents` and dispatches a Workhorse 🛠️ Worker to `references/pr-description.md`.
- Agent does not draft Why / Special things to note / Change outline in the parent.
- Agent does not assign outline drafting to an 🔧 Operator.

## Failure Signals

- Parent writes the body inline.
- 🔧 Operator is asked to draft the outline.
- Skips `references/pr-description.md`.
