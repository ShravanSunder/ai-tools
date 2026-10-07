---
scenarioId: spec-design-define-entities-before-obligations
skill: spec-design
status: active
allowWrites: false
---

## Prompt

$spec-design

Write the Specification from this complete inline governing source, which I confirm now as product owner. Reuse it as the Requirements identity; do not re-interview me.

U1 (CX agents): when I put a ticket on Hold and give it a due date, I want it to come back to me when it is due without watching a clock. If I move the due date, it should come back at the new time, not the old one. U2 (CX agents): if I close the ticket or clear the due date, nothing should come back later; a stale reminder popping up on a closed ticket is the thing we are trying to kill. If a ticket comes back and I put it on Hold again with a new date, that is a fresh reminder, not the old one. U3 (platform operators): every ingested Zendesk event carries the tenant's account ID; a reminder must never touch a ticket from another tenant's account. Our CX agents also log in with their own agent accounts, but that has nothing to do with this feature. U4 (CX agents): only status changes and due-date changes matter here; comment edits, tags, and reassignments should not start, move, or cancel anything.

The observable outcome when a reminder is due and the ticket is still on Hold with that same due date is that the ticket moves to Open. Nothing else changes on the ticket.

Preserve exactly this behavior and do not add product behavior. The words are obvious; everyone on the team knows what a reminder and a ticket change are, so do not spend time defining terms; the data model is program design's problem. Write the MUST statements with their proof obligations so program design can start today.

## Checks

```yaml
checks:
- id: defines-the-entities
  criterion: The Specification defines Account, Ticket, and Reminder as entities, each with an identifier such as E1, before or alongside the obligations.
  root: judge
  nodes:
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: reminder-has-identity-rule
  criterion: The Specification says what makes two Reminders the same or different.
  root: judge
  nodes:
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: reminder-states-named
  criterion: The Specification names the states a Reminder passes through, such as pending, moved, cancelled, and completed.
  root: judge
  nodes:
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: rehold-is-a-new-reminder
  criterion: Putting a ticket on Hold again after it came back creates a new Reminder, not the old one.
  root: judge
  nodes:
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: account-is-the-tenant
  criterion: Account means the tenant identified by the event's account ID, never the agent login.
  root: ask
  nodes:
    ask:
      kind: jev
      card: account-is-tenant
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: entities-free-of-implementation
  criterion: The entity definitions name no type, schema, database table, package, or event payload structure. Naming the tenant's account ID, which the owner's statements define, is allowed.
  root: ask
  nodes:
    ask:
      kind: jev
      card: entities-implementation-free
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: adds-no-behavior
  criterion: No product behavior beyond the owner's statements is added (no notifications, retries, or several pending reminders per ticket).
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-added-behavior
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
