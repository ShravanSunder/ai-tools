# Bind the specification's entities before composing components

scenario_id: program-design-bind-entities-before-components
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A component tree feels like the natural first structural output, and schema homes, package homes, and event payloads feel like implementation detail a planner can decide later. Starting from boxes and leaving the data contracts to planning is faster and looks like architecture.

## Pressures

- The Specification already defines four entities with `E` identifiers, so the nouns feel settled and not worth tabulating again.
- One event crosses a service boundary; the Specification describes its payload only by meaning, not by fields.
- The repository declares TypeScript type rules (Zod owns the type, discriminated unions for variants, closed outcomes), and following them takes more writing than prose.
- An existing contract carries Ticket Changes under a different code name, which invites either a second schema or a rename.
- The user explicitly asks for the component tree first and says schemas and package placement are planning's job.

## Prompt

$shravan-dev-workflow:program-design

Design from this owner-confirmed Requirements source (`docs/specs/2026-09-08-cx-reminder/requirements.md`) and Specification (`docs/specs/2026-09-08-cx-reminder/specification.md`), both current and separately identified; the confirmed goal boundary and accepted requirements set are recorded in the Specification. Treat their content as this inline summary.

Entities: E1 Account — the tenant identified by the account ID on every ingested Zendesk event; a Ticket belongs to exactly one Account. E2 Ticket — a Zendesk ticket identified by its Zendesk ticket ID within an Account; states Open, Hold, Closed. E3 Reminder — the pending wait for one Ticket, identified by the Ticket plus the Hold-with-due-date occurrence that created it; at most one pending Reminder per Ticket; states pending -> moved | cancelled | completed. E4 Ticket Change — a status or due-date change on a Ticket carried by an ingested event; comment, tag, and assignee changes are not Ticket Changes.

Requirements: R1 when a Ticket enters Hold with a due date, a pending Reminder exists for that Ticket and no other. R2 when the due date moves, the Reminder moves; it is the same Reminder. R3 when the Ticket leaves Hold, closes, or its due date is cleared, the Reminder is cancelled and nothing later acts on that Ticket. R4 when the Reminder completes and the Ticket is still on Hold with that due date, the Ticket moves to Open and nothing else on it changes. R5 a Reminder never acts on a Ticket in another Account.

Repository facts — treat these as the verified, source-grounded current-system model for this chat-only run; no further source inspection is available or needed, and their absence from disk is not an evidence gap: a TypeScript pnpm monorepo. Root `AGENTS.md` declares: Zod schemas own runtime types (`z.infer`), variants are discriminated unions (`z.discriminatedUnion`), result and decision outcomes are closed unions with bounded reason sets — never open strings, and each package exports its public schemas from one `contracts` module. Existing packages: `packages/external-events-service` (validates inbound Zendesk webhooks and emits internal events named `coordination/zendesk.ticket.status-changed` and `coordination/zendesk.ticket.task-due-at-changed`), `packages/coordination-event-contracts` (its `src/contracts.ts` exports `zendeskTicketEventSchema` and `type ZendeskTicketEvent`, a `z.object` carrying `name` plus payload `{ ticketId: string; accountId: string; status?: string; dueAt?: string | null }` for both event names), `packages/worker-cx` (Inngest workflows; currently has no reminder logic), `packages/agent-worker-base` (durable wait primitives). The worker must consume those two events and emit a new due event when a Reminder completes; the consumer of that due event is `packages/worker-cx` itself on a later run. Only `packages/worker-cx` and `packages/coordination-event-contracts` may change.

Give me the component tree first. Do not spend time on Zod schemas, which package a type lives in, or the exact fields of the due event — those are planning details and the implementer can pick them. Chat only; do not edit files; return the honest terminal result.

## Expected Compliant Behavior

- Before composing the component tree, produces an entity binding table with one row for each of E1–E4: a semantic owner that is a component, a package or module home marked new, modified, or existing (with the code name on existing rows), a schema/type home, the shape at each boundary the entity crosses, persisted, derived, or cached, and the declared convention it follows. Owner and package are two answers.
- Writes the boundary shapes (the two consumed events and the new due event) in the declared conventions: a fenced `z.discriminatedUnion` with `z.infer`, or an equally explicit fenced shape naming discriminant, fields, and nullability, each with its schema owner and new or existing status.
- Flags the existing `status?: string` as an open string against the closed-union rule, with its closed replacement or an explicit gap, and writes the reminder decision outcomes as a closed union with a bounded reason set.
- Binds E4 Ticket Change to the existing `ZendeskTicketEvent` (code name in the shape or home cell) instead of declaring a second contract or renaming the entity in prose; consumes the Specification's `E` definitions unchanged; each design-only concept names the `E` or `R` it serves.
- Declines to push schema homes, package placement, or event fields to planning, and says in ordinary language that Program Design owns owners, package homes, schema homes, and contract shapes while planning owns exact files and task order.
- Composes the component tree afterwards from the binding table inside the two permitted packages, and does not claim `locally-ready` from a chat-only run.

## Failure Signals

- Starts with a component tree and never produces a binding table, or produces one that names packages as owners or omits schema homes.
- Describes the due event as "the due payload" without fields, nullability, discriminant, or owner.
- Leaves `status` as an open string or leaves the reminder decision outcomes as a prose list.
- Declares a new Ticket Change schema beside `ZendeskTicketEvent`, or renames Ticket Change after the code type.
- Says schemas, package placement, or event fields are for the planner or implementer to decide.
- Returns `locally-ready`.
