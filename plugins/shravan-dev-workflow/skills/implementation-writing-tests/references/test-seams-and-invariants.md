# Test Seams And Invariants

Use this when planning or reviewing what a test should observe.

## Core Terms

- Public seam: a function, class/module boundary, CLI, HTTP route, UI behavior,
  store, process, filesystem boundary, protocol, or other surface a consumer
  can observe.
- Private seam: an implementation detail such as a helper, private method,
  internal collaborator call, or intermediate object shape. Use this only when
  the project already treats it as a public contract.
- Domain boundary: the point where data becomes a domain value or state
  transition, such as a constructor, parser, reducer, command handler, state
  machine, aggregate, schema validator, or persistence mapper.
- Claim: one behavior that must be true for the requirement to be satisfied.
- Invariant/property: a claim that holds across examples, ordering, state
  changes, or related inputs.
- Illegal-state strategy: how invalid domain states are prevented or rejected:
  type/value-object modeling, schema validation, constructor guard,
  precondition, assertion, exhaustive enum/state-machine transition, or
  boundary rejection.
- Oracle: an independently chosen expected value, state, event, or output.

## Choosing A Seam

Prefer the narrowest public seam that can fail for the real behavior:

```text
requirement -> observable behavior -> public seam -> oracle -> proof layer
```

Good seams:

- exported pure logic when the behavior is deterministic transformation;
- store or repository boundary when persistence matters;
- HTTP handler/client pair when protocol behavior matters;
- CLI or app runtime when boot and user-visible behavior matter;
- UI interaction when layout, accessibility, or user flow matters.

## Domain Boundary And Illegal States

For stateful or parsed data, first ask whether illegal states can be made
unrepresentable. Prefer the project's existing type, schema, value-object, or
state-machine patterns. When invalid data can arrive from IO, add the guard at
the boundary where data enters the trusted domain.

Required boundary proof:

- valid construction or transition succeeds through the public seam;
- invalid construction, parse, command, transition, or IO input is rejected at
  the boundary;
- language-native `precondition`, `assert`, guard, schema, or error-return
  behavior follows project conventions;
- tests cover both the domain boundary and at least one IO boundary when
  external input can create the invalid state.

Do not add assertions as decoration. They are useful only when the failure mode
is tied to a named invariant and the test proves the boundary rejects or cannot
represent the invalid state.

Weak seams:

- private method calls;
- owned collaborator mocks;
- implementation-specific object shapes;
- snapshots without behavioral intent;
- asserting a helper was called instead of asserting behavior changed.

## Weak Seam Repairs

Mock-only proof is weak when it proves only that the implementation called a
collaborator, not that the consumer-visible contract changed.

Bad:

```ts
it("submits invoice", async () => {
  const billingApi = { post: vi.fn().mockResolvedValue({ ok: true }) };
  await submitInvoice({ billingApi, invoiceId: "inv_123" });
  expect(billingApi.post).toHaveBeenCalledWith("/invoice/inv_123");
});
```

Repair route:

```text
public_seam: submitInvoice behavior through the app/service boundary
observable_effect: invoice status, emitted event, persisted record, or external
contract visible through a boundary the consumer relies on
oracle: literal expected status/event/record chosen from the requirement
```

Owned-collaborator mocks are weak when the mock replaces code the project owns
and the assertion checks wiring instead of behavior.

Bad:

```ts
it("ranks paid invoices first", () => {
  const scorer = { score: vi.fn().mockReturnValue(10) };
  rankInvoices({ scorer, invoices });
  expect(scorer.score).toHaveBeenCalledTimes(2);
});
```

Repair:

```ts
it("ranks paid invoices above drafts when text score ties", () => {
  const result = rankInvoices([
    { id: "draft", status: "draft", textScore: 10 },
    { id: "paid", status: "paid", textScore: 10 },
  ]);
  expect(result.map((invoice) => invoice.id)).toEqual(["paid", "draft"]);
});
```

Assert-nothing tests are weak when they can pass without proving the intended
claim.

Bad:

```ts
it("renders cart", () => {
  render(<CartView cart={cartFixture} />);
});
```

Repair route:

```text
claim: the UI exposes the checkout total
oracle: visible total text, accessible state, event, or navigation result
proof_layer: component integration or UI test by project taxonomy
```

## Choosing An Oracle

An oracle should be independent from the implementation path under test.

Useful oracles:

- literal expected value derived from the requirement;
- state read through a separate public boundary;
- event or output visible to a consumer;
- precomputed fixture with reviewed intent;
- simpler reference implementation used only in tests and small enough to audit.

Bad oracles:

- `expect(result).toEqual(result)`;
- `expect(format(input)).toEqual(format(input))`;
- recomputing the expected value by calling the same production helper;
- asserting only that a mock was called;
- snapshot approval with no claim named.

Tautological-oracle repair:

```ts
expect(formatTotal({ cents: 1234, currency: "USD" })).toBe("$12.34");
```

The expected value is chosen from the requirement, not recomputed by the
implementation under test.

## Invariant Prompts

Ask these before writing examples:

- What are the strict conditions for this data or state to be valid?
- What must never change after this operation?
- What valid transition should happen, and what invalid transition should fail?
- Can an illegal state be made unrepresentable with existing project types,
  schemas, constructors, or state machines?
- Which IO boundary can introduce invalid data, and how is it guarded?
- What relation should hold when input size, order, or permission changes?
- Can this claim be captured with a small table before adding generators?
- What state or output would convince a skeptical reviewer?
