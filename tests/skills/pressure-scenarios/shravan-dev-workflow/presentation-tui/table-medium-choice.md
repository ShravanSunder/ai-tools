# presentation-tui table medium choice pressure

scenario_id: presentation-tui-table-medium-choice
skill_under_test: shravan-dev-workflow:presentation-tui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: [┌└│]|column[- ]ruled|aligned columns
expect_decision_regex: \|.+\|
expect_proof_regex: (table 1|first table|comparison|retry|polic)[^.]{0,80}(gfm|pipe table)|(gfm|pipe table)[^.]{0,80}(comparison|retry|polic)
expect_proof_regex: (table 2|second table|drift|config)[^.]{0,80}(box|column-ruled)|(box|column-ruled)[^.]{0,80}(drift|config|second table|table 2)
expect_proof_regex: threshold|exceeds? what gfm|gfm (cannot|can't|can not) carry|gfm (reflow|would (lose|destroy))|beyond what gfm|(callout|arrow|annotation)[^.]{0,80}(destroy|reflow|cannot|lose|need|threshold)|sub-row annotation|because [^.]{0,60}(annotation|callout|attached)
expect_forbidden_regex: (?<!not |n't |no |did not |do not )both tables? (are |is |as |in )?(box|gfm)|(?<!not |n't |no |did not |do not )(gfm|box(-drawn)?) for both

## Shortcut Temptation

Two tables are requested: a plain comparison, and a drift table whose
cells need embedded callout arrows. The agent may render both as box
tables out of habit, or both as GFM and lose the callouts.

## Pressures

- One table genuinely below the annotation threshold
- One table genuinely above it (a sub-row annotation inside the table)
- Habitual single-medium answers

## Prompt

$shravan-dev-workflow:presentation-tui

Two tables please. (1) Compare our three retry policies: immediate
retry (low latency, low complexity, thundering-herd risk), fixed
backoff (medium latency, low complexity, slow recovery), and jittered
exponential backoff (variable latency, higher complexity, smooth
recovery). (2) Show the config drift: max-retries current 3 target 5,
timeout current 30s target 10s, backoff-mode current fixed target
jittered, health-probe current disabled target enabled. The timeout
change is what caused the outage — directly beneath the timeout row,
attach a two-line annotation explaining the failure window (10s is
shorter than the p99 downstream response of 12s, so healthy calls get
cut off), keeping it visually inside the table right under that row.

## Expected Compliant Behavior

- Skill is invoked.
- Table 1 is a GFM pipe table — the default comparison medium.
- Table 2 is a box-drawn table (or column-ruled layout) because the
  sub-row annotation attached beneath one row exceeds what GFM
  carries; the agent names that threshold as the reason.
- Field names in both tables follow the technical-content rule
  (inline code in GFM; relocation or short labels in the box table).

## Failure Signals

- Both tables box-drawn with no annotation justification.
- Both tables GFM with the outage callout dropped or demoted to prose
  the user must cross-reference.
- No stated reason for the medium chosen for table 2.
