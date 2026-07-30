# Artifact and Author Self-Review

This reference owns artifact structure choice, normative-home integrity, navigation, and the digest-bound author self-check.

Expected inputs: authority/problem model, outcomes/non-goals, requirement and contract inventories, cross-cutting obligations, proof coverage, and repo documentation conventions.

Return in workflow order: first the artifact structure decision, artifact identity/digest, and traceability/navigation result; after the caller runs the complete author self-check stage, return the digest-bound author self-check with exact gaps.

## Choose Structure for the Reader

A substantial specification normally needs semantic homes for:

```text
decision / status
problem and current observable reality
consumers and authority
goals, outcomes, success conditions
non-goals and negative space
source and decision basis
normative requirements
observable surface contracts
failure and partial-success expectations
cross-cutting obligations and constraints
proof obligations
resolved alternatives when they change meaning
open decisions, assumptions, and evidence gaps
```

These are not mandatory headings. Organize by journey, capability, protocol, domain, or decision when that better preserves the specification spine.

Use linked slice specifications only when a vertical capability, protocol, domain boundary, or independently governed contract has its own consumers and reason to change. Do not create appendix-style mini-doc sprawl or duplicate normative claims.

Keep process history, advisor names, review-cycle narrative, and research ledgers out of the design artifact. Rationale must stand on technical or product constraints.

## Navigation and Traceability

Add a compact map when relationships are not obvious:

```text
problem P1
  -> outcome O1
      -> requirement R1
          -> contract C1
              -> proof modality V1
```

Diagrams may explain relationships but may not be the only home of normative meaning.

## Author Self-Check

Re-read the complete artifact and record:

- source authority conflicts or stale evidence;
- missing problem/outcome/requirement/contract/proof links;
- vague, compound, or task-shaped requirements;
- missing negative, failure, partial-success, cancellation, or compatibility behavior;
- hidden internal How;
- contradictory goals and non-goals;
- unresolved questions disguised as assumptions;
- duplicated normative homes;
- whether the specification spine is readable without review notes.

Bind the result to the artifact digest. Record exact failures, not “needs more detail.”

Self-check is author evidence only. It never substitutes for fresh independent review.

Complete when: the artifact has one normative home per meaning, the reader can navigate problem to proof, and the digest-bound self-check names every known gap.
