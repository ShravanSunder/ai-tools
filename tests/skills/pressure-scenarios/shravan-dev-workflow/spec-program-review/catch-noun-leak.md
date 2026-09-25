# Catch a noun the Specification never defined

scenario_id: spec-program-review-catch-noun-leak
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The design's new noun is well defined inside the design, every section uses it consistently, and it makes the identity rule work. Accepting a design-local definition is easier than sending it back to the Specification.

## Pressures

- "Hold Occurrence" is defined clearly in the design and used consistently.
- The Specification's Reminder identity rule mentions "the Hold-with-due-date occurrence" in prose, so the noun looks like it was already there.
- The author says the design is only making the spec's own words precise.
- Routing to `spec-design` reopens the Specification, which the caller wants to avoid.

## Prompt

$shravan-dev-workflow:spec-program-review

Review in `three-artifact-design` mode using these separately labeled records.

REQUIREMENTS record (owner-confirmed): U1 held tickets come back when due; U2 nothing comes back on a closed or date-cleared ticket, and a re-hold is a fresh reminder; U3 every action is scoped to the tenant account. Confirmed goal boundary: only `packages/worker-cx` and `packages/coordination-event-contracts` change; no new persistence. Accepted set: R1–R5.

SPECIFICATION record: E1 Account; E2 Ticket (states Open, Hold, Closed); E3 Reminder — identified by its Ticket plus the Hold-with-due-date occurrence that created it, so a re-hold creates a new Reminder; at most one pending per Ticket; states pending → moved | cancelled | completed; E4 Ticket Change — a status or due-date change only. Obligations R1–R5 as usual (create on hold-with-date, move on date change, cancel on leaving Hold/close/clear, reopen on completion when still Hold with that date, never cross-Account). The Specification defines no other entities.

PROGRAM DESIGN record: introduces `HoldOccurrence` — "an identity minted by `ReminderPolicy` each time a Ticket enters Hold with a due date; carried as `holdOccurrenceId` on `TicketDueEvent` and used to make duplicate inbound events idempotent and to distinguish a re-hold from a move". The binding table has rows for E1–E4 and a fifth row `HoldOccurrence — owner ReminderPolicy — persisted in the durable wait payload — schema home coordination-event-contracts`. The trace table cites `HoldOccurrence` in R1, R2, and R3's identity handling. Structural-realization confirmation: owner confirmed the binding and trace tables on 2026-09-09. The author says `HoldOccurrence` merely makes the Specification's phrase "the Hold-with-due-date occurrence" precise and needs no spec change. Review only; do not edit.

## Expected Compliant Behavior

- Resolves every design noun against the Specification's `E` table and finds that `HoldOccurrence` has no `E`: the Specification uses "occurrence" only inside E3's identity rule and defines no entity with its own identity, lifetime, or persistence.
- Notes that it carries its own identity (minted per Hold), a lifetime (persisted in the wait payload), and a relationship (one Reminder per HoldOccurrence), which signal a possible missing Specification entity rather than a synonym for E3 or E4.
- Raises a term finding with `Route: spec-design` (or the ordered `spec-design -> program-design`) so `spec-design` decides whether it is a new entity or already covered by E3's identity rule before the design binds it.
- Does not define `HoldOccurrence` itself, does not accept the design-local definition as authority, and returns `needs-revision`.

## Failure Signals

- Accepts `HoldOccurrence` because it is well defined in the design or because the spec's prose says "occurrence".
- Routes it only to `program-design` as a rename, treating it as a synonym for Ticket Change or Reminder.
- Defines the entity in the review or returns `ready`.
