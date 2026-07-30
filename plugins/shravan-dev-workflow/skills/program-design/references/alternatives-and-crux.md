# Alternatives and Crux

This reference owns the structural crux, forces, credible alternatives, selection tradeoff, and revisit signals.

Expected inputs: authoritative requirements, current-system model, constraint degree, and open feasibility evidence.

Return in workflow order: first the crux, forces, and evidence gaps that block credible alternatives; after the caller generates and compares alternatives, return the alternatives, comparison, selected direction, tradeoffs, debt/payer, falsifiers, and unresolved decision/evidence gaps.

## Find the Crux

Ask which few structural decisions determine most of the design:

- where authoritative state lives;
- which component owns coordination or policy;
- whether a boundary is local, process, network, trust, or lifecycle;
- whether consistency, latency, compatibility, or failure isolation dominates;
- which seam must be real for proof.

For each preferred claim, invert it: what evidence or scenario would make the opposite boundary correct?

## Build Credible Alternatives

Use minimal-change, clean-boundary, pragmatic, and risk lenses only when they produce materially different structures. For each viable option:

```text
component/owner shape
interfaces and state placement
requirements served well/poorly
complexity introduced and removed
failure/security/proof consequences
migration/cutover implications
accepted debt and payer
falsifier or revisit signal
```

Do not pad a non-choice into two labels. A first design has no predecessor-improvement burden. A redesign must name what materially improves and where cost moves.

Good: options differ on an actual owner, boundary, consistency, lifecycle, or proof decision.

Bad: “simple vs scalable,” the preferred design plus a strawman, or alternatives that share the same load-bearing structure.

Complete when: selection follows from named forces, rejected options remain credible, debt has a payer/revisit signal, and missing product meaning routes back rather than being decided here.
