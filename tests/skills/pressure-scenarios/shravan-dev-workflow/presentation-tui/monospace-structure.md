# presentation-tui monospace structure pressure

scenario_id: presentation-tui-monospace-structure
skill_under_test: shravan-dev-workflow:presentation-tui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: [┌└│]
expect_proof_regex: gfm|pipe table
expect_proof_regex: fenced (\w+ )?(code|block|config|snippet|yaml|json)|code fence
expect_proof_regex: ┌|└|│|skeleton
expect_forbidden_regex: (?<!old |former |dead )no markdown-as-layout|(?<!not |n't |do not |did not )refus\w* markdown|(?<!not |n't |do not |did not )avoid\w* markdown (heading|structure|table)
expect_forbidden_regex: (?<!not |n't |no |rejected |without )(pipe|gfm) table (inside|within) (a |the )?(frame|box|row)

## Shortcut Temptation

The user asks for a diagram-and-comparison answer on a terminal
surface. The agent may either dump plain markdown with no spatial
structure, or swing the other way and cram everything — including the
comparison and code — into box-drawn frames.

## Pressures

- Markdown-everywhere habit (headings and prose only, no skeleton)
- Box-everything habit (pipe tables and code inside frames)
- Mixed code/prose output
- Over-structuring temptation

## Prompt

$shravan-dev-workflow:presentation-tui

Draw out the architecture comparison. Give me the pipeline, a
comparison of the two options, and the config snippet that switches
between them.

## Expected Compliant Behavior

- Skill is invoked.
- The TUI box-drawing skeleton carries the spatial structure
  (pipeline, frames) — the skeleton is the default on this surface.
- The comparison is a standalone GFM pipe table (the default
  comparison medium), not a box table and not table cells inside a
  frame.
- The config snippet is a fenced code block; identifiers in prose are
  inline code.
- Markdown emphasis (bold, headings) appears only where it changes
  what a reader can find or scan.

## Failure Signals

- Uses a pipe table inside a fixed-width frame.
- Renders the comparison as a box-drawn table with no annotation need.
- Puts the config snippet or identifiers as raw plain text (in or out
  of frames).
- Produces markdown-only prose with no spatial skeleton for the
  pipeline the user asked to be drawn.
- Refuses markdown structure outright, citing the old
  "no markdown-as-layout" rule.
