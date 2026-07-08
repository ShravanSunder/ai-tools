# Existing Test Audit

Use this before deleting, repairing, or trusting existing tests.

## Audit Steps

1. Read the behavior or requirement the tests claim to protect.
2. Read the current tests and name their seam, claim, oracle, and proof layer.
3. Check project-local proof-layer definitions.
4. Classify each test as `keep`, `repair`, or `remove-candidate`.
5. For removal, prove replacement, redundancy, or dead contract before deleting.

## Classification

Keep:

- protects a live behavior contract;
- observes a public seam;
- has an independent oracle;
- fails usefully when the behavior breaks;
- has a correct proof-layer label.

Repair:

- right behavior, wrong seam;
- right behavior, weak oracle;
- right behavior, mislabeled proof layer;
- stale fixture shape but live contract;
- snapshot needs a named behavioral assertion.

Remove candidate:

- duplicate of stronger proof with redundancy evidence;
- asserts dead or removed product contract;
- cannot fail for a meaningful behavior;
- only tests private implementation wiring;
- locks an obsolete fixture or snapshot with no live contract.

## Removal Gate

Do not remove a test until one of these is recorded:

```text
replacement_proof:
redundancy_proof:
dead_contract_proof:
remaining_risk:
```

If none applies, repair the test or keep it as a known weak proof risk.

## Stale Snapshot

Bad:

```ts
expect(render(<Settings legacyMode />)).toMatchSnapshot();
```

Why weak: a snapshot locks structure without naming the live behavior it should
protect.

Repair route:

```text
live_contract: <named current behavior>
public_seam: UI/component/API boundary the user or caller observes
oracle: role/text/state/event that proves the behavior
```

## Fixture Fossil

Bad:

```ts
const preferences = loadPreferences(oldPreferencesV1Fixture);
expect(preferences.channels.email).toBe(true);
```

Why weak: an old fixture can preserve an obsolete contract instead of current
behavior.

Decision route:

```text
1. Identify whether v1 preferences are still accepted input.
2. If yes, assert current migration behavior through the public loader.
3. If no, remove only with dead-contract proof.
```

## Broad Deletion

Bad:

```text
Delete the flaky snapshots; the new integration test probably covers them.
```

Why weak: "probably" is not redundancy proof.

Required route:

```text
removed_test:
replacement_or_redundant_test:
covered_claim:
remaining_gap:
```

## Audit Report Shape

```text
test:
classification: keep | repair | remove-candidate
current_seam:
current_oracle:
current_layer:
live_contract:
decision_reason:
required_repair_or_removal_proof:
```
