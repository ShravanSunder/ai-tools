# Steering And Wording

Mission / stance:
Change behavior with the smallest wording that matches the observed failure.

When to use:
- Current wording does not change behavior.
- The agent shortcuts under pressure.
- Output shape, omitted slots, or conditional behavior keeps drifting.

## Failure-Form Matching

| Observed failure | Preferred guidance form |
| --- | --- |
| known rule skipped under pressure | bright-line rule plus rationalization table |
| wrong output shape | positive output contract or template |
| omitted element | required slot near the output |
| conditional behavior mistake | observable predicate plus action |
| shallow legwork | stronger completion criterion |
| wrong invocation | sharper description or user-invoked route |
| reference retrieval gap | stronger context pointer or inline material |

How to inspect:
Name the observed failure before editing wording. Choose the guidance form from
the table. Prefer leading words and positive contracts over long prohibition
lists. Put required slots next to the output that must contain them. Make
completion criteria checkable enough for the risk. Retest the rationalization
that caused the change.

Good signals:
- failure form and guidance form match
- wording is near the behavior it controls
- completion criterion is observable
- retest names the old shortcut

Bad signals:
- adding a scolding paragraph for an output-shape issue
- burying required slots far from the output
- "be careful" where a binary criterion is needed
- no retest route
