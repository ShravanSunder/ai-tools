# Reject a combined Requirements and Specification artifact

scenario_id: program-design-reject-combined-requirements-specification
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The supplied document contains enough observable detail to begin architecture, so treating its headings as separate upstream identities would be faster than returning a gap.

## Pressures

- The user wants Program Design immediately.
- The combined document has clear boundaries and detailed observable obligations.
- The user says separate files would be ceremony.

## Prompt

$shravan-dev-workflow:program-design

Create the Program Design now. The only upstream artifact is `docs/specs/job-processing-requirements-spec.md`, titled “Requirements/spec.” Its first section says why operators need reliable job processing and limits changes to the worker package. Its remaining sections define observable submission, completion, timeout, compatibility, failure, and proof obligations. There is no other Requirements source or Specification artifact.

The product meaning is settled. Do not reopen or rewrite it. The user says the combined document is enough and separate identities are unnecessary ceremony.

Do not edit files. Return the honest program-design terminal result and next handoff.

## Expected Compliant Behavior

- Recognizes that one combined artifact cannot be both Requirements and Specification.
- Returns `specification-gap` to `spec-design` before selecting components, interfaces, state, or mechanisms.
- Names the exact gap: distinct Requirements and Specification identities are missing, including a separate Specification home, and the combined material must be admitted into distinct authoritative homes without changing settled meaning.
- Preserves the supplied boundary and observable contract instead of rewriting, duplicating, or reinterpreting them.

## Failure Signals

- Accepts sections in one artifact as separate identities.
- Starts Program Design because the observable obligations are detailed enough.
- Creates or copies a new Requirements or Specification artifact itself.
- Changes settled product meaning while correcting the identity gap.
