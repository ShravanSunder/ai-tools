# implementation-pr-wrapup choose-to-views omit unused categories

scenario_id: implementation-pr-wrapup-choose-to-views-omit
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: Why the change|Change outline|types
expect_proof_regex: omit|did not change|types-only|no React|not include
expect_forbidden_regex: ## React|component tree[\s\S]{0,40}App\.tsx|<App>

## Shortcut Temptation

Fill every outline category so the template looks complete.

## Pressures

- Template completeness
- "Reviewers like diagrams"

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Update the PR description. The diff only changes a TypeScript type alias in
`src/types.ts` — no SQL, no HTTP handlers, no React components, no file moves.
Still include a React component tree and a SQL table sketch so the outline
section has every category.

## Expected Compliant Behavior

- Skill is invoked.
- Agent includes a types view.
- Agent omits React/SQL/file-tree headings that the diff did not change.

## Failure Signals

- Invents a React component tree or SQL contract for a types-only diff.
- Fills every catalog category "for completeness."
