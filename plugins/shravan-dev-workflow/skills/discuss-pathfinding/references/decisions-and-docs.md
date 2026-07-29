# Decisions And Docs

Records are written the moment understanding crystallizes — a record written at session end is reconstructed, not captured. Each item gets one record in one home; chat-only sessions keep the same shapes in the conversation.

```text
this reference owns: decision records, process records, glossary entries, and the reader test
expected inputs: each crystallized decision, process, or settled term, in the user's own words
return: the records, and the reader-test receipt when one was required
complete when: every crystallized decision, process, and settled term has its corresponding record in the user's language, and every required reader test returned complete
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

Superseded records are marked, never deleted — the trail of changed minds is part of the understanding.

## Process Records

Extracted process knowledge is process-shaped, not a pile of decisions. One record per process:

```text
process: <name and purpose, one sentence>
trigger: <what starts it>
owner: <who runs it; what changes at each handoff>
steps: <ordered; each branch condition named>
signals and thresholds: <what tells the runner it is going well or badly; what changes the action>
stop condition: <how the runner knows it is done>
exceptions: <what breaks the normal order, and what happens instead>
source conflicts: <where the stated process and the artifacts disagreed, and which governs>
unresolved: <questions the walk left open>
status: proposed | accepted | superseded
```

## Glossary Entries

One line per term, the user's word choice, written when the term is settled — which is usually right after a challenge ("you're saying 'account' — the Customer or the User?"). A term that conflicts with an existing project glossary is called out at the moment it appears, not archived as a discrepancy.

## Where Records Live

Follow the repo's conventions: durable design decisions belong with the artifact they shape (a spec folder under `docs/specs/`, working notes under `docs/wip/`); a project glossary stays wherever the repo already keeps one.

## The Reader Test

IF a record is a durable handoff artifact whose ambiguity could change implementation ownership, behavior, or proof, MUST dispatch the reader test to a subagent using a packet of only the record and the questions its real reader must answer. The subagent is a reviewer-pattern Delegate per `manage-agents` — history none, read-only — and loads nothing beyond the packet. Parallel-safe after the record exists. Return `complete | partial | blocked` with its answers; the parent verifies the answers against the record, repairs the passages that wrong or hedged answers mark, and re-dispatches until the receipt is `complete`. A quick session's in-chat ledger does not trigger this — the predicate is the artifact's downstream weight, not the session's length.
