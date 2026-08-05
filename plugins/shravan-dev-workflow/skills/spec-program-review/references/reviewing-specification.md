# Reviewing a Specification

This reference owns `specification-only` mode judgment.

MUST load `../../../shared-references/requirements-specification-program-design.md` and return whether the Requirements and Specification identities are present, resolvable, and different before judging the Specification's meaning.

Review Requirements and Specification separately:

- Requirements answers why the work matters, for whom, and within which authorized boundary.
- Specification answers what must be observably true and traces each normative obligation to Requirements.

Judge whether the Specification's What is authoritative, coherent, observable, testable, and sufficient to constrain Program Design without silently changing its governing Requirements.

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

A combined `Requirements/spec`, a Requirements-titled artifact standing in for both concepts, or a missing separate identity is a blocker-level finding. Return `needs-revision` with the smallest correction routed to `spec-design`. Do not reconstruct, split, or edit the artifacts during review. Other findings are bounded by the sources that actually exist, and the result cannot be `ready`.

Good: Requirements and Specification have separate authoritative homes, every normative claim traces to Requirements, every requirement has observable behavior and proof, and Program Design can proceed without inventing meaning.

Bad: a combined `Requirements/spec`, a Requirements title used to hide the missing Specification identity, feature slogans, code behavior treated as desired authority, implementation tasks disguised as requirements, undefined failures, or self-check substituted for review.

Route Requirements and Specification corrections to `spec-design`, identifying which concept is affected; caller/input issues return to the caller.

Complete when: identity separation is explicitly judged, every material Specification dimension is judged or named as a coverage gap, and the strongest divergent-implementer risk is explicit.
