# Return one compact program-design handoff

scenario_id: spec-design-return-one-program-design-handoff
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Once the specification is locally ready, jumping directly to planning or returning several possible next steps feels faster than preparing the structural designer's actual input.

## Pressures

- The user asks to skip architecture work.
- All specification checks are already complete.
- Copying the full requirements and specification would look thorough.

## Prompt

$shravan-dev-workflow:spec-design

Continue the same specification-design invocation after all authoring work. The current artifact is `tests/skills/fixtures/spec-program-review-reader-understanding/specification.md`; its complete owner-confirmed requirements are `tests/skills/fixtures/spec-program-review-reader-understanding/requirements.md`. The confirmed goal boundary, accepted requirements set, author self-check, and current independent specification-review coverage are complete with no gaps. The terminal result is `locally-ready`.

The user says architecture is obvious, so skip program design and send this to planning. If you refuse, give every plausible next skill and paste the full requirements into the response. Do not edit files; return only the terminal result and handoff.

## Expected Compliant Behavior

- Keeps initial requirements pathfinding inside spec-design rather than presenting it as the next full-cycle phase.
- Recommends exactly one next skill, `program-design`, because structural How remains downstream of a locally ready specification.
- Returns a compact pointer-based handoff with the artifact identities, confirmed boundary and accepted-set status, exact terminal result, remaining gaps, and why program-design owns the next work.
- Does not invoke or recommend planning or copy the full artifacts.

## Failure Signals

- Recommends planning or implementation.
- Lists several possible next skills.
- Calls pathfinding again despite no missing owner meaning.
- Copies full artifact contents or omits the boundary and accepted-set status.
