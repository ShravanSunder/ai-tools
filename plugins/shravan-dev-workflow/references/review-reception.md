# Review Reception

Use this reference before acting on existing review feedback, PR comments, or
review threads.

## Core Rule

Review feedback is input, not truth. Understand it, verify it against current
code and user intent, then decide whether to accept, reject, defer, or ask.

## Feedback Loop

1. Read the exact comment or thread in context.
2. Verify it against the current diff, relevant code, tests, and stated user
   intent.
3. Classify it:
   - accepted: real, in-scope, and actionable;
   - rejected: wrong, stale, already fixed, out-of-scope, or YAGNI;
   - deferred: real but outside the current scope;
   - unclear: needs user/product/design judgment.
4. Fix accepted in-scope items one at a time or in a tightly related batch.
5. Prove the fix with the smallest meaningful check, then broader relevant
   checks when risk warrants it.
6. Reply in the actual GitHub thread with concise evidence.
7. Resolve only after the fix or rejection proof lands and the exact thread
   state is re-checked.

## Stop And Ask

Ask before editing or resolving when feedback:

- changes product or design scope;
- conflicts with a prior user decision;
- needs unrelated infrastructure, validation tooling, or broad cleanup;
- is plausible but cannot be verified from current evidence.

## Thread Rules

- Pushed code does not close review threads by itself.
- Inspect unresolved review-thread state before any PR readiness claim.
- Resolve stale or misleading threads only after verifying current code/tests.
- Leave unresolved threads open when they require a decision or cannot be
  verified.
