# Steering And Wording

Load trigger: current wording does not change behavior, the agent shortcuts
under pressure, or an output shape keeps drifting.

Carry in: baseline failure, target behavior, current wording, output shape,
completion criteria, and pressure results.

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

## Procedure

1. Name the observed failure before editing wording.
2. Choose the guidance form from the table.
3. Prefer leading words or positive contracts over long prohibition lists.
4. Put required slots next to the output that must contain them.
5. Make completion criteria checkable and exhaustive enough for the risk.
6. Retest the specific rationalization after changing wording.

## Return Artifact

```text
observed failure:
chosen guidance form:
leading word or output contract:
completion criterion:
rationalization addressed:
retest requirement:
```

Completion criterion: the wording change maps to the failure form and names how
the next pressure run should catch the old shortcut.

Source material adapted: Obra/Superpowers pressure-rationalization discipline
and Matt's leading words/completion criteria. Rejected: prohibition-heavy text
for shape or omission failures. This branch does not duplicate all-branch
workflow state from `SKILL.md`.
