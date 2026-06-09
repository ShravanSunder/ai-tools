# Review Reception

Load this after reviewer lanes return and before editing, replying to review comments, or closing PR threads.

## Default Behavior

- If invoked as part of finishing current implementation work, validate and fix accepted blocker/important findings without waiting for a separate user prompt.
- If invoked for PR/report-only review, external review, or when the user says not to edit, keep the review read-only and return exact fix guidance.
- Reject unsupported, technically wrong, out-of-scope, or YAGNI findings with evidence.

## Fix Loop

1. Understand the finding in your own technical terms.
2. Verify it against current code, diff, tests, and user intent.
3. Decide: accept, reject, defer, or clarify.
4. Fix accepted in-scope findings one at a time or in a tightly related batch.
5. Test each fix with the smallest meaningful proof, then broader relevant checks.
6. Inspect the final diff and ensure no unrelated cleanup slipped in.
7. Re-run focused review or verification when the finding was subtle or high risk.
8. Report accepted, rejected, deferred, and unresolved findings.

## Stop And Ask

Ask before editing when:

- the finding changes product/design scope
- the finding conflicts with prior user decisions
- the required fix touches unrelated infrastructure or validation tooling
- the finding is plausible but cannot be verified from available evidence

## PR Thread Rule

- Do not assume pushed code closes review threads.
- Inspect thread state when PR readiness depends on it.
- Resolve stale or misleading threads only after verifying them against current code/tests.
- Resolve valid threads only after the fix lands and the relevant proof passes.
- Leave unresolved threads open when the finding needs a user decision or cannot be verified.
