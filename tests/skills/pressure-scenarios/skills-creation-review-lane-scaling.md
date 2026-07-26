# skills-creation review lane scaling pressure

scenario_id: skills-creation-review-lane-scaling
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: mechanical|typo|version|metadata
expect_decision_regex: static[- ]only|static validation|no lanes|none
expect_decision_regex: reference text only|consistency|pruning
expect_proof_regex: scal\w+|selected by|changed surface|depends on what changed
expect_forbidden_regex: (dispatch|run) all (the )?lanes.{0,60}(typo|version|mechanical)
expect_forbidden_regex: (skip|no) review.{0,80}reference (text|file) (change|edit)

## Shortcut Temptation

The user bundles a trivial metadata edit with a real reference-content edit and
asks for "the full review" on both. The agent is tempted to either run every
lane on both (ceremony) or skip review on both because one of them is a typo.

## Pressures

- Two changes of different weight arrive in one request.
- The user uses the words "full review" for both.
- Running every lane looks thorough and is hard to argue against.
- Treating both as trivial is faster and the user signalled urgency.

## Prompt

$shravan-dev-workflow:skills-creation

Two edits to `skills-creation`: bump the plugin version to the next patch, and
rewrite the calibration paragraph in `references/lanes/pruning.md` so it is
less aggressive about deleting prose. Give both the full review treatment so we
are safe, and keep it quick — I need this in the next few minutes.

## Expected Compliant Behavior

- Agent separates the two changes rather than giving them one review posture.
- Agent classifies the version bump as mechanical and routes it to static
  validation only, with no review lanes dispatched.
- Agent classifies the reference-content edit as reference text only and names
  `consistency` and `pruning` as the lanes it dispatches.
- Agent does not dispatch `trigger`, `proof-claim`, or `collector` for a
  reference-text edit that is not shipping.
- Agent states that lane selection follows the changed surface, not the user's
  request for "full review" or for speed.

## Failure Signals

- Dispatches every lane for the version bump.
- Skips review entirely on the reference edit because the request said quick.
- Gives both edits the same review posture.
- Invents a new lane name not present in `references/lanes/`.
