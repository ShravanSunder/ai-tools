# Define the domain entities before writing obligations over them

scenario_id: spec-design-define-entities-before-obligations
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The owner's behavior statements read like requirements already, so MUST statements can be written straight from the nouns in them. Pinning down what each noun is — what makes two the same, how they relate, which states one passes through — feels like design work that can wait.

## Pressures

- The owner never defines a noun; every meaning is implied by behavior statements, the way an owner talks. "account", "reminder", and "ticket change" each carry two plausible readings until the statements are read together.
- The source is complete enough to settle every meaning without asking, so pathfinding is not needed; the temptation is to leave the meanings implicit.
- The owner explicitly says the words are obvious and wants MUST statements today.
- The obligations look complete as sentences even when nothing says what a reminder is or which states it has.

## Prompt

$shravan-dev-workflow:spec-design

Write the Specification from this complete inline governing source, which I confirm now as product owner. Reuse it as the Requirements identity; do not re-interview me.

U1 (CX agents): when I put a ticket on Hold and give it a due date, I want it to come back to me when it is due without watching a clock. If I move the due date, it should come back at the new time, not the old one. U2 (CX agents): if I close the ticket or clear the due date, nothing should come back later; a stale reminder popping up on a closed ticket is the thing we are trying to kill. If a ticket comes back and I put it on Hold again with a new date, that is a fresh reminder, not the old one. U3 (platform operators): every ingested Zendesk event carries the tenant's account ID; a reminder must never touch a ticket from another tenant's account. Our CX agents also log in with their own agent accounts, but that has nothing to do with this feature. U4 (CX agents): only status changes and due-date changes matter here; comment edits, tags, and reassignments should not start, move, or cancel anything.

The observable outcome when a reminder is due and the ticket is still on Hold with that same due date is that the ticket moves to Open. Nothing else changes on the ticket.

Preserve exactly this behavior and do not add product behavior. The words are obvious — everyone on the team knows what a reminder and a ticket change are — so do not spend time defining terms; the data model is program design's problem. Write the MUST statements with their proof obligations so program design can start today.

## Expected Compliant Behavior

- Before or alongside the obligations, defines the entities they depend on with stable identifiers — at least Account, Ticket, and Reminder — and bounds what counts as a ticket change (status or due-date change only) either as its own entity or as an explicitly scoped transition of Ticket. Where the source settles identity it states the rule (a Reminder is identified by its Ticket plus the Hold-with-due-date occurrence that created it, so a re-hold is a new Reminder; an Account is the tenant identified by the account ID on events); where it does not, it records the exact gap rather than inventing or asking. States relationships with cardinality (a Reminder belongs to one Ticket; a Ticket belongs to one Account; at most one pending Reminder per Ticket) and the invariants the source implies (a Reminder never acts across Accounts; it is pending only while its Ticket is on Hold with a due date; only status and due-date changes create, move, or cancel it).
- Enumerates the observable states a Reminder passes through by name, covering pending, the due-date-moved transition, cancelled, and completed under the author's own names, and ties each to the owner statement that implies it.
- Writes every normative statement over those defined entities and resolves each overloaded noun the way the source settles it: account is the tenant, not the agent login; a reminder is the pending wait tied to one Hold occurrence, not a notification; a ticket change is a status or due-date change only.
- Keeps the entity definitions implementation-free — no types, schemas, tables, packages, or event payload fields — and names binding entities to those homes as program-design's work.
- Explains in ordinary language why the Specification carries the entity definitions even though the owner called the words obvious, without re-asking any settled meaning or routing to pathfinding.
- Traces each obligation to its U row and gives it a proof obligation.

## Failure Signals

- Writes MUST statements over "account", "reminder", or "ticket change" without an entity section, or with one-line descriptions that never say what makes two instances the same (or record that gap) or which states a Reminder passes through.
- Treats the re-hold case as the same reminder, or leaves the identity of a Reminder undefined so that case cannot be decided from the Specification.
- Returns `decision-needed` asking the owner to define the entities when the behavior statements already settle them.
- Uses more than one meaning of a noun across obligations, or lets "account" drift toward the agent login.
- Puts the entity definitions in program-design terms: Zod schemas, TypeScript types, database tables, package names, or event payload fields.
- Treats the settled meanings as unmade and re-interviews the owner or routes to pathfinding.
- Adds behavior the owner did not state, such as notifications, retries, or multiple pending reminders per ticket.
