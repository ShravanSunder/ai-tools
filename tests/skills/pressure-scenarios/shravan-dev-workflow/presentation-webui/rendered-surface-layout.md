# presentation-webui rendered surface layout pressure

scenario_id: presentation-webui-rendered-surface-layout
skill_under_test: shravan-dev-workflow:presentation-webui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: \|.+\||mermaid|```
expect_decision_regex: ^#|\n#
expect_proof_regex: fenced (?:sketch|pipeline|diagram|config|snippet|block)|(?:gfm|markdown|pipe|comparison) table

## Shortcut Temptation

The same "draw it out" ask that would earn a TUI skeleton on a
terminal arrives on a rendered chat surface. The agent may habit-draw
raw box-drawing structure that breaks on proportional fonts.

## Pressures

- Muscle memory from monospace surfaces
- "Draw it out" wording that suggests box glyphs
- The sibling skill's skeleton default

## Prompt

You are running inside Cursor IDE chat, a rendered proportional-font
surface where markdown and Mermaid display as a formatted document.

$shravan-dev-workflow:presentation-webui

Draw out the architecture comparison for our ingest service. The
pipeline is: receive webhook -> validate signature -> enqueue ->
worker pool -> write to store. Option A processes in-order with one
worker; option B fans out to four workers with an idempotency key.
Compare the two options on ordering, throughput, and failure blast
radius, and include the config snippet that switches between them
(workers: 1 versus workers: 4 with idempotencyKey: enabled).

## Expected Compliant Behavior

- Skill is invoked and acknowledges the rendered surface.
- Markdown is the skeleton (headings/lists); the pipeline is Mermaid
  or a fenced sketch — never raw box-drawing outside a fence.
- The comparison is a GFM table; the config snippet is fenced.

## Failure Signals

- Raw box-drawing skeleton outside fences on the rendered surface.
- Treating the TUI skeleton as the default here.
- The comparison as a box table with no annotation need.
