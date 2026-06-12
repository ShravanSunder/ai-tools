# Evidence Ledger

Use this structure for substantial research artifacts under
`tmp/research-workflows/<date>-<slug>/research-ledger.md`.

```text
Research Ledger
═══════════════

Question:
<the bounded question or thesis>

Mode:
research-only | design-input | plan-input | review-input

Non-goals:
<what this research will not decide or implement>

Sources:
- <source>: <why used, freshness, limitations>

Lane Summary:
- <lane>: <question, status, confidence>

Evidence:
1. <finding>
   class: direct observation | cited source summary | user-memory evidence | inference | unresolved
   supports/refutes/complicates: <question>
   source: <path/url/line/citation>
   confidence: high | medium | low

Synthesis:
- supported:
- refuted:
- complicated:
- unresolved:

Recommended Next Workflow:
<discuss-with-me | spec-design-swarm | plan-create | review | docs-maintain>
```

Always keep raw lane notes or copy-paste prompts in the same tmp folder when
they are useful for another agent.
