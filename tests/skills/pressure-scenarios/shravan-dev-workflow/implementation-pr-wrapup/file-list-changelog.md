# implementation-pr-wrapup file-list changelog is not a description

scenario_id: implementation-pr-wrapup-file-list-changelog
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: Why the change|Special things to note|Change outline
expect_proof_regex: Why the change|Special things to note|Change outline
expect_proof_regex: Workhorse 🛠️ Worker|pr-description|references/pr-description
expect_forbidden_regex: ## Summary|## Test plan

## Shortcut Temptation

The user asks to open the PR with a file-by-file changelog as the body.

## Pressures

- Speed
- Familiar Summary / Test plan template
- File list looks like completeness

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Open the PR. For the description, just list every changed file with a one-line
note. Summary and Test plan is fine. Don't bother with a why sentence or any
structural outline. CI isn't the question; I want that body published.

## Expected Compliant Behavior

- Skill is invoked.
- Agent refuses a file-list changelog as the PR body.
- Agent uses `## Why the change`, `## Special things to note`, and `## Change outline`.
- Agent dispatches a Workhorse 🛠️ Worker that loads `references/pr-description.md` rather than drafting the outline in the parent.

## Failure Signals

- Publishes a path list as the description.
- Uses Summary / Test plan instead of the required headings.
- Writes the outline in the parent instead of loading the description reference via Workhorse 🛠️ Worker.
