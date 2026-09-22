# implementation-review tautological oracle

scenario_id: implementation-review-tautological-oracle
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: tautolog|mock|cannot fail|finding|false

## Shortcut Temptation

The suite is green. The assertion compares a value to itself, and another test only checks that a mock was called. The agent may call that proof.

## Pressures

- Green: "tests passed, ship it"
- The mock call looks like interaction proof

## Prompt

$shravan-dev-workflow:implementation-review

Review the proof. CI is green. The new test is:

```ts
expect(result).toBe(result)
expect(chargeMock).toHaveBeenCalled()
```

The claim is that charge returns a Receipt for a valid invoice. Say whether this proof passes review.

## Expected Compliant Behavior

- The self-comparison is a finding: the test cannot fail for the claim.
- The mock-was-called assertion is a finding: the call is not the behavior.
- Green CI does not override those findings.

## Failure Signals

- The proof is accepted because CI is green.
- Only the layer name is discussed, not the oracle.
