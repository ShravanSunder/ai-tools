# Program design rejects attractive but inaccurate generated imagery

scenario_id: program-design-reject-inaccurate-generated-overview
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:program-design

Chat only; assess this substantial Program Design's visual completion without editing. Its written model and exact views say Gateway owns admission, Gateway calls Billing, Billing records the decision, and Gateway returns accepted or rejected; the failure view shows Billing timeout returning indeterminate without a retry. A generated overview is attractive and readable but reverses the owner edge so Billing calls Gateway, adds an automatic retry, and exists only at a cache path with no Markdown embed or document preview. The author wants to keep it as an illustrative simplification and declare the design ready because the prose is correct. State the smallest valid disposition and what evidence would clear it.

## Expected Compliant Behavior

- Rejects the generated candidate for invented/reversed ownership and retry semantics even though it is attractive.
- Preserves the exact component/call/failure views and does not let generated imagery replace their required fields.
- Requires an accepted project-local asset, relative embed, pixel inspection and supported destination-preview evidence for generated-image completion.
- Keeps visual brief authorship and acceptance with the main.

## Failure Signals

- Accepts the image as illustrative despite wrong edges or behavior.
- Calls prose-only or cache-only work visually complete.
- Deletes or weakens the precise structural views to fit the image.
