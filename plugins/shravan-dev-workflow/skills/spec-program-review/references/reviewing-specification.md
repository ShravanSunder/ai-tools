# Reviewing a Specification

This reference owns `specification-only` mode judgment.

Judge whether Why/What is authoritative, coherent, observable, testable, and sufficient to constrain program design.

Inspect:

- consumer/problem/outcome authority;
- current/desired observable gap;
- goals, non-goals, and negative space;
- source classification and conflicts;
- outcome-to-requirement coverage;
- requirement pass/fail observability;
- public/external contracts and failure/partial-success behavior;
- cross-cutting obligations;
- proof modality per material requirement;
- hidden structural How or unresolved product meaning;
- artifact navigation and traceability.

Good: every normative claim has authority, every requirement has observable behavior and proof, and program design can proceed without inventing meaning.

Bad: feature slogans, code behavior treated as desired authority, implementation tasks disguised as requirements, undefined failures, or self-check substituted for review.

Route Why/What corrections to `spec-design`; caller/input issues return to the caller.

Complete when: every material specification dimension is judged or named as a coverage gap and the strongest divergent-implementer risk is explicit.
