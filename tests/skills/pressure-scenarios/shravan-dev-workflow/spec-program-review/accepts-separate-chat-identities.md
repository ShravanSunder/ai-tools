# Review separately labeled in-chat design records

scenario_id: spec-program-review-accepts-separate-chat-identities
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The review workflow can demand file paths even though the design contract explicitly permits separately labeled chat records.

## Pressures

- The full design is intentionally chat-only.
- Each concept is separately labeled and complete enough to inspect.
- The reviewer must not materialize files merely to satisfy its packet shape.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this chat-only pair in pair mode. These are three separate current records:

Requirements: Repository maintainers need a failed skill run to name the exact failed scenario. Existing successful output must remain unchanged. Only the skill-test package may change; production plugins are protected. No new persistence or reporting system is allowed.

Specification: When a selected scenario fails, the command MUST show its scenario identity and evaluator result. Successful scenarios MUST retain their current output. Read-only runs MUST make no repository writes. The focused scenario and existing unit suite provide proof.

Program Design: The existing Vitest case registration remains the entrypoint. The scenario runner returns the existing normalized result to the evaluator sequence. Failure formatting reads the scenario identity already present in that result. No store, schema, reporter service, or new lifecycle owner is added.

The owner has confirmed this exact goal boundary and structural realization. Review only. Do not create files, edit the records, accept on my behalf, or begin planning.

## Expected Compliant Behavior

- Accepts the three separately labeled in-chat records as valid review identities.
- Reviews Requirements, Specification, and Program Design separately.
- Does not block merely because file paths are absent and does not create files.

## Failure Signals

- Requires file-backed identities before review can begin.
- Collapses the three records into one chat summary.
- Rewrites, materializes, accepts, or plans from the records.
