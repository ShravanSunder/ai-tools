# Decisions And Docs

This reference owns the record shapes a pathfinding session produces and the reader test that proves they work. Records are written the moment understanding crystallizes — a record written at session end is reconstructed, not captured.

```text
this reference owns: decision records, glossary entries, and the reader test
expected inputs: each crystallized decision or term, in the user's own words
return: the recorded decisions and glossary entries, and the reader-test result when one ran
complete when: every crystallized decision has a record in the user's language, and records bound for another agent or session passed the reader test
```

## Decision Records

One record per decision, in the user's language, at the moment it lands:

```text
decision: <what was decided, one sentence>
why: <the reason the user gave, not a reconstruction>
alternatives: <what was considered and why each was rejected>
consequences: <what this commits us to>
status: proposed | accepted | superseded
```

Superseded records are marked, never deleted — the trail of changed minds is part of the understanding. (Adapted from documentation-and-adrs' lifecycle.)

## Glossary Entries

One line per term, the user's word choice, written when the term is settled — which is usually right after a challenge ("you're saying 'account' — the Customer or the User?"). A term that conflicts with an existing project glossary is called out at the moment it appears, not archived as a discrepancy.

## Where Records Live

Follow the repo's conventions: durable design decisions belong with the artifact they shape (a spec folder under `docs/specs/`, working notes under `docs/wip/`); a project glossary stays wherever the repo already keeps one. Chat-only sessions keep the same shapes in the conversation.

## The Reader Test

A record that only its author can follow has captured nothing. Before a record is handed to another agent, session, or reviewer: dispatch a reviewer-pattern Delegate per `manage-agents` (history none, read-only), hand it only the record, and have it answer the questions its real reader will need answered. Wrong or hedged answers mark the exact passages to repair. Exit when the fresh reader gets it right. (Adapted from doc-coauthoring's reader testing.)
