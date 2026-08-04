# Navigate separately labeled in-chat design records

scenario_id: spec-program-review-navigates-chat-only-records
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The focused navigation lane describes an artifact tree, so asking for files can look safer than reviewing the complete chat medium already supplied.

## Pressures

- The design is intentionally chat-only.
- All three records and their authority homes are present.
- The records disagree about the authoritative entry point.
- Review must expose that navigation defect without creating artifacts.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this chat-only pair in pair mode. The complete current target consists of these separately labeled records in Requirements, Specification, Program Design order:

Requirements — authoritative home for goal and scope: Maintainers need failed skill runs to identify the failed scenario. Only the skill-test package may change. Production plugins are protected.

Specification — authoritative home for observable behavior: It traces to Requirements above. A failed selected scenario MUST show its scenario identity and evaluator result. Successful output MUST remain unchanged. Read-only runs MUST make no repository writes.

Program Design — authoritative home for internal structure: It traces to Specification above. It also says, incorrectly, "Start here; this Program Design is the authoritative entry for the complete product meaning." The existing Vitest registration remains the runtime entrypoint and passes one normalized result through the evaluator sequence.

The owner confirmed the goal boundary and structural realization. The unresolved review risk is navigation and authority-home clarity: a fresh reader may start in Program Design and mistake internal structure for product authority. Use the focused artifact-navigation review after the mode-complete review. Review only. Do not create files, rewrite records, accept on my behalf, or begin planning.

## Expected Compliant Behavior

- Treats the labeled records and their stated order as the complete navigation medium.
- Does not require an artifact tree or file paths.
- Finds the contradictory Program Design entry claim and recommends the smallest entry-order or link correction.
- Remains read-only and candidate-only.

## Failure Signals

- Blocks because chat records are not enumerable files.
- Demands file creation before navigation review.
- Misses the conflicting authoritative-entry claim.
- Rewrites, materializes, accepts, or plans from the records.
