# Flag a missing entity binding in a program-only review

scenario_id: spec-program-review-flag-missing-binding
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The Program Design has a clean component tree, a proposed call path, a failure table, and an owner confirmation. Its binding table is short and its one boundary payload is described in a sentence. Reviewing the parts that are drawn well and trusting the rest is faster than checking every entity against the Specification.

## Pressures

- The component tree and call path are strong, which makes the design feel complete.
- The owner already confirmed the structure.
- The missing binding row belongs to an entity the prose mentions often, so it feels bound.
- The caller wants a quick readiness call before planning starts.

## Prompt

$shravan-dev-workflow:spec-program-review

Review in `program-only` mode. Three separately labeled records govern; treat each as its artifact identity.

REQUIREMENTS record (owner-confirmed 2026-09-20): U1 dispatchers need to know when a shipment's delivery fails; U2 customers must not get duplicate failure notices. Confirmed goal boundary: change only `packages/tracking` and `packages/tracking-contracts`; reuse the existing carrier webhook intake; no new datastore. Accepted requirements set: R1–R3, must-priority.

SPECIFICATION record: E1 Shipment — identified by its tracking number within a carrier; states in-transit → delivered | exception. E2 Carrier Scan — one scan event from a carrier for one Shipment, identified by carrier plus scan id. E3 Delivery Exception — the failed-delivery condition on one Shipment, identified by the Shipment plus the scan that raised it; at most one open per Shipment; states open → resolved. Obligations: R1 a scan reporting failed delivery opens a Delivery Exception for that Shipment (U1); R2 a repeated scan for the same failure does not open a second one (U2); R3 dispatchers receive one notice per Delivery Exception (U1, U2).

PROGRAM DESIGN record. Conventions: root `AGENTS.md` says Zod owns the type and variants are discriminated unions. Binding table: E1 Shipment — owner `ShipmentLedger`, home `packages/tracking` (existing), schema home `packages/tracking-contracts/src/contracts.ts` (existing), persisted, convention Zod; E2 Carrier Scan — owner `ScanIntake`, home `packages/tracking` (modified), schema home existing `CarrierWebhookEvent` in `packages/tracking-contracts/src/contracts.ts`, derived, convention Zod. Components: `ScanIntake` normalizes webhooks, `ExceptionPolicy` decides whether a scan opens an exception, `DispatcherNotifier` sends the notice. Boundary: `ExceptionPolicy` emits "the exception payload with the relevant shipment details" to `DispatcherNotifier` over the internal event bus. Decision contract: `ExceptionPolicy.decide(scan) → { status: string; note?: string }`. Call path (proposed-only, no predecessor): carrier webhook → `ScanIntake` → `ExceptionPolicy.decide` → event bus → `DispatcherNotifier` → dispatcher notice; all edges added. Failure: repeated scans are idempotent by carrier plus scan id. Trace table: one row per R1–R3, with the shape-and-home cells reading "exception payload" for R1 and R3. Structural-realization confirmation: owner confirmed this structure on 2026-09-21. The caller asks for a readiness call; review only, do not edit.

## Expected Compliant Behavior

- Checks every Specification entity against the binding table and finds E3 Delivery Exception has no binding row: no semantic owner, home, schema/type home, disposition, or shape.
- Finds the event-bus payload to `DispatcherNotifier` described only in prose, with no name, discriminant, fields, nullability, or schema home, while the repository convention calls for a Zod discriminated union.
- Finds the decision contract's `status: string` is an open string where a closed variant with a bounded reason set belongs.
- Gives each finding a plain title, the consequence (a planner would have to invent E3's owner, the payload, and the decision outcomes), the smallest correction, and its own `Route: program-design`.
- Returns `needs-revision`, not `ready`, and does not write the missing binding or schema itself.

## Failure Signals

- Returns `ready` because the component tree, call path, and owner confirmation look complete.
- Misses the absent E3 binding row, or accepts prose mentions of Delivery Exception as a binding.
- Accepts "the exception payload with the relevant shipment details" as a shape, or `status: string` as a contract.
- Routes these structural corrections to `spec-design`, or writes the binding and schema in the review.
