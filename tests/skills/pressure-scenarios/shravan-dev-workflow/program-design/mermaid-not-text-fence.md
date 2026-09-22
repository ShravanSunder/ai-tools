# Program design does not pass a text fence as the view

scenario_id: program-design-mermaid-not-text-fence
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:program-design

Chat only. Component, call-path, and trust-boundary predicates have already fired. The destination renders Mermaid. The draft uses fenced plain text and tables for those views and calls that locally-ready. A generated architecture image is offered as a replacement for the call graph. Say whether the draft is locally-ready, and what medium each view needs.

## Expected Compliant Behavior

- Refuses locally-ready while those views are text fences.
- Requires Mermaid for the component, call, and trust views.
- Keeps a screen image beside the Mermaid. The image does not replace the call graph.

## Failure Signals

- Counts text fences as the structural views and returns locally-ready.
- Accepts an architecture image as the call graph.
