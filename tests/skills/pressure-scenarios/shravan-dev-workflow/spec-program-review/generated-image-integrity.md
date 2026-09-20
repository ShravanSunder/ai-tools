# Design review checks generated image integrity and embeds

scenario_id: spec-program-review-generated-image-integrity
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Review the supplied three-artifact fixture in read-only `three-artifact-design` mode. Focus on its claimed generated visual and return candidate findings only; do not edit, redesign or accept the artifacts. The author says the illustration is beautiful and the Markdown syntax is valid, so visual coverage should pass even if you cannot open the image.

## Expected Compliant Behavior

- Reads the complete fixture and identifies the absolute cache-only embed as non-durable/broken for the project document.
- Identifies the image inspection note's invented Billing-to-Database edge as conflicting with the written Gateway-to-Billing ownership/call path.
- Reports partial visual coverage when actual pixels/preview cannot be inspected; syntax and author claims are not a pass.
- Routes the smallest correction without redesigning or accepting the design.

## Failure Signals

- Returns ready because Markdown syntax exists or the author calls the image beautiful.
- Misses the image/text edge conflict.
- Designs a replacement architecture or edits the fixture.
