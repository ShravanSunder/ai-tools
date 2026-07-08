# Test Antipatterns

Use this when reviewing weak or false-green tests. The examples are deliberately
small; adapt the language to the project and keep the proof claim concrete.

## Mock-Only Proof

Bad:

```ts
it("submits invoice", async () => {
  const billingApi = { post: vi.fn().mockResolvedValue({ ok: true }) };
  await submitInvoice({ billingApi, invoiceId: "inv_123" });
  expect(billingApi.post).toHaveBeenCalledWith("/invoice/inv_123");
});
```

Why weak: proves the implementation called a mock, not that invoice submission
changed observable state or produced the contract a consumer needs.

Repair:

```ts
it("marks the invoice as submitted after billing accepts it", async () => {
  const billingApi = new FakeBillingGateway({ acceptedIds: ["inv_123"] });
  await submitInvoice({ billingApi, invoiceId: "inv_123" });
  await expect(invoiceRepository.get("inv_123")).resolves.toMatchObject({
    status: "submitted",
  });
});
```

Layer: integration when repository/gateway boundary matters; unit only if the
public seam is pure state transition logic.

## Owned Collaborator Mock

Bad:

```ts
it("ranks paid invoices first", () => {
  const scorer = { score: vi.fn().mockReturnValue(10) };
  rankInvoices({ scorer, invoices });
  expect(scorer.score).toHaveBeenCalledTimes(2);
});
```

Why weak: mocks code the project owns and asserts internal collaboration.

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

Layer: unit when `rankInvoices` is the public behavior seam.

## Tautological Oracle

Bad:

```ts
expect(formatTotal(input)).toEqual(formatTotal(input));
```

Why weak: expected and actual use the same implementation.

Repair:

```ts
expect(formatTotal({ cents: 1234, currency: "USD" })).toBe("$12.34");
```

Layer: unit.

## Assert-Nothing Test

Bad:

```ts
it("renders cart", () => {
  render(<CartView cart={cartFixture} />);
});
```

Why weak: it only proves the current fixture did not throw.

Repair:

```ts
it("shows the checkout total", () => {
  render(<CartView cart={cartWithTwoItems} />);
  expect(screen.getByRole("status", { name: /total/i })).toHaveTextContent("$31.00");
});
```

Layer: component integration or UI test depending on project taxonomy.

## Stale Snapshot

Bad:

```ts
expect(render(<Settings legacyMode />)).toMatchSnapshot();
```

Why weak: locks structure without stating the live behavior.

Repair:

```ts
expect(screen.getByRole("checkbox", { name: /email/i })).not.toBeChecked();
```

Layer: UI/component integration.

## Fake Smoke

Bad:

```ts
it("smoke: validates config", () => {
  expect(appConfig.routes.length).toBeGreaterThan(0);
});
```

Why weak: config/schema/unit checks do not prove the owned runnable surface
boots and performs product behavior.

Repair:

```text
command: app starts with test config, opens health or CLI command, performs one
real product operation, exits 0
```

Layer: smoke.

## Fixture Fossil

Bad:

```ts
const preferences = loadPreferences(oldPreferencesV1Fixture);
expect(preferences.channels.email).toBe(true);
```

Why weak: may preserve an obsolete contract without proving current behavior.

Repair route:

```text
1. Identify whether v1 preferences are still accepted input.
2. If yes, assert current migration behavior through the public loader.
3. If no, remove only with dead-contract proof.
```

Layer: unit or integration depending on loader boundary.

## Broad Deletion

Bad:

```text
Delete the flaky snapshots; the new integration test probably covers them.
```

Why weak: "probably" is not redundancy proof.

Repair route:

```text
removed_test:
replacement_or_redundant_test:
covered_claim:
remaining_gap:
```

Layer: same or stronger than the behavior contract being removed.
