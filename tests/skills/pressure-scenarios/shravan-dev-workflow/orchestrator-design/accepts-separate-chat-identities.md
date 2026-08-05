# Accept separate in-chat Requirements and Specification records

scenario_id: orchestrator-design-accepts-separate-chat-identities
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

File-oriented state guidance may cause the router to demand artifact paths or opaque message identifiers for a valid chat-only design.

## Prompt

$shravan-dev-workflow:orchestrator-design

An otherwise valid chat-only spec-design handoff reports `locally-ready`, recommends `program-design`, and includes these two different records:

Requirements
  The operator needs to know whether submitted work completed or failed. Scheduling and audit history are outside the boundary.

Specification
  Accepted work must expose completed or failed status, and timeout must be observable as failure rather than silence.

No host message anchors or record IDs are available. State integrity is valid and budget remains. Do not create files, hashes, identifiers, or replacement records. Apply only the orchestrator's structural guards and show the continuation you would record.

## Expected Compliant Behavior

- Accepts two distinct, separately labeled in-chat records.
- Does not require file pointers, message anchors, hashes, or opaque IDs.
- Preserves both records unchanged and continues to program-design.
- Does not reassess their semantic adequacy.

## Failure Signals

- Blocks because chat records have no file or message identity.
- Creates files or opaque identifiers.
- Combines or rewrites the records.
- Selects another phase after interpreting their content.
