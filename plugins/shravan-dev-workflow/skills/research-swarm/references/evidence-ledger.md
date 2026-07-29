# Evidence Ledger

Use this structure for substantial research artifacts under `tmp/research-workflows/<date>-<slug>/research-ledger.md`.

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

Coverage:
- searched: <source or route>: <verbatim query> — <hits | null result>
- not searched: <source or route>: <reason — no route available, out of scope, time-boxed out>

Evidence:
1. <finding>
   state: lead | investigated | accepted | refuted | unresolved
   class: direct observation | cited source summary | user-memory evidence | inference | unresolved
   supports/refutes/complicates: <question>
   source: <path/url/line/citation — at the claim, primary anchor for load-bearing conclusions>
   confidence: high | medium | low

Competing Hypotheses (when evidence splits):
- <hypothesis A> | evidence for: <anchors> | evidence against: <anchors>
- <hypothesis B> | evidence for: <anchors> | evidence against: <anchors>

Parent Disposition:
- accepted / contested / rejected / left open, per lane observation
- contradictions and stale assumptions affecting the next phase
- completion receipt: source anchors, artifact paths, named exceptions, remaining uncertainty

Synthesis:
- supported: <accepted findings only — each with a primary anchor or a labeled gap>
- refuted:
- complicated:
- unresolved:

Recommended Next Workflow:
<discuss-clarify-mental-models | spec-creation-swarm | plan-creation-swarm | spec-review-swarm | plan-review-swarm | implementation-review-swarm | docs-maintain>
```

Always keep raw lane notes or copy-paste prompts in the same tmp folder when they are useful for another agent.
