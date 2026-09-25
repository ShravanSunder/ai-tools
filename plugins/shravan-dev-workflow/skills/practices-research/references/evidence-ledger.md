# Evidence Ledger

Use this structure for substantial research artifacts under `tmp/practices-research/<date>-<slug>/research-ledger.md`. Its immediate consumer is the researcher synthesizing this run; its downstream consumer is the recommended next workflow or continuation agent named at the bottom.

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

Source-Class Summary:
- <class>: <question, coverage, confidence>

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

Researcher Disposition:
- accepted / contested / rejected / left open, per source-class observation
- contradictions and stale assumptions affecting the next phase
- completion receipt: source anchors, artifact paths, named exceptions, remaining uncertainty

Synthesis:
- supported: <accepted findings only — each with a primary anchor or a labeled gap>
- refuted:
- complicated:
- unresolved:

Return Token:
<requirements-gap | specification-gap | program-design-gap | ready-for-planning | ready-for-implementation | ready-for-review (general-domain | runtime-skill-package) | none: evidence complete, the caller decides | blocked: gap>
```

Keep raw source notes in the same tmp folder when another reader needs them to inspect a claim.
