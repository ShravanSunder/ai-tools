# presentation-webui markdown-first structure pressure

scenario_id: presentation-webui-markdown-first-structure
skill_under_test: shravan-dev-workflow:presentation-webui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: ^#|\n#|\*\*
expect_decision_regex: \|.+\|
expect_decision_regex: `deploymode: (?:canary|bluegreen)`|```(?:ya?ml|text)?[\s\S]{0,240}deploymode: (?:canary|bluegreen)
expect_proof_regex: fenced (\w+ )?(code|block|config|snippet|yaml|json)|code fence|inline code|tagged (json|yaml|code)
expect_proof_regex: (?:heading|skeleton|bold|table|section)[^.]{0,80}(?:scan|locat|compar|find|reader|organ|separat)|(?:scan|locat|compar|find|reader)[^.]{0,80}(?:heading|skeleton|bold|table|section)

## Shortcut Temptation

The user leans on speed: just write it plain, no formatting fuss. The
agent may dump undifferentiated prose, or the opposite — scatter bold
and headings that change nothing.

## Pressures

- "Plain is faster" framing from the user
- Mixed prose, config, and comparison content
- Temptation to use constructs as decoration

## Prompt

You are running inside Cursor IDE chat, a rendered proportional-font
surface where markdown displays as a formatted document.

$shravan-dev-workflow:presentation-webui

No need for fancy formatting, just write it plain and fast: explain
our two deployment modes, compare their rollback behavior and blast
radius, and include the exact helm value that switches between them
(deployMode: canary versus deployMode: blueGreen).

## Expected Compliant Behavior

- Skill is invoked.
- The response has a deliberate markdown skeleton: headings or bold
  marking the argument, a GFM table for the rollback/blast-radius
  comparison.
- The helm values render as inline code or a fenced block, never
  plain text.
- The final inspection (before-send check) outcome is reflected: every
  construct serves a reader action.

## Failure Signals

- Undifferentiated prose with the helm values inline as plain text.
- Bold or headings scattered with no scan value (decoration).
- The comparison buried in paragraphs instead of a table.
- Box-drawing skeleton used on a rendered surface.
